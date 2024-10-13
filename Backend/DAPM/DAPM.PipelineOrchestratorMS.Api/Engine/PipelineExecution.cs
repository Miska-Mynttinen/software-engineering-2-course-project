using DAPM.PipelineOrchestratorMS.Api.Engine.Interfaces;
using DAPM.PipelineOrchestratorMS.Api.Models;
using RabbitMQLibrary.Models;
using System.Diagnostics;
using ActionResult = DAPM.PipelineOrchestratorMS.Api.Models.ActionResult;

namespace DAPM.PipelineOrchestratorMS.Api.Engine
{

    public enum PipelineExecutionState
    {
        NotStarted,
        Running,
        Completed,
        Faulted
    }


    public class PipelineExecution : IPipelineExecution
    {
        private Guid _id;
        private ILogger<PipelineExecution> _logger;
        private IServiceProvider _serviceProvider;
        private Pipeline _pipeline;
        private Dictionary<Guid, EngineNode> _nodes;
        private Dictionary<Guid, List<Guid>> _successorDictionary;
        private Dictionary<Guid, List<Guid>> _predecessorDictionary;

        private List<Guid> _dataSinkNodes;

        private List<Step> _steps;
        private Dictionary<Guid, Step> _stepsDictionary;

        private PipelineExecutionState _state;



        //Status metrics
        private Stopwatch _stopwatch;
        private List<Guid> _currentSteps;

        public PipelineExecution(Guid id, Pipeline pipelineDto, IServiceProvider serviceProvider) 
        {
            _id = id;
            _nodes = new Dictionary<Guid, EngineNode>();
            _successorDictionary = new Dictionary<Guid, List<Guid>>();
            _predecessorDictionary = new Dictionary<Guid, List<Guid>>();
            _dataSinkNodes = new List<Guid>();
            _stepsDictionary = new Dictionary<Guid, Step>();
            _steps = new List<Step>();
            _currentSteps = new List<Guid>();
            _serviceProvider = serviceProvider;
            _logger = _serviceProvider.GetService<ILogger<PipelineExecution>>();

            _pipeline = pipelineDto;
            _state = PipelineExecutionState.NotStarted;

            InitGraph();

        }

        #region Pipeline Execution Public Methods

        public void StartExecution()
        {
            _state = PipelineExecutionState.Running;
            _stopwatch = Stopwatch.StartNew();
            ExecuteAvailableSteps();
        }

        public PipelineExecutionStatus GetStatus()
        {
            var currentStepsStatus = new List<StepStatus>();
            foreach (var stepId in _currentSteps)
            {
                var step = _stepsDictionary[stepId];
                currentStepsStatus.Add(step.GetStatus());
            }


            return new PipelineExecutionStatus()
            {
                ExecutionTime = _stopwatch.Elapsed,
                CurrentSteps = currentStepsStatus,
                State = _state
            };
        }

        public void ProcessActionResult(ActionResultDTO actionResult)
        {
            var result = actionResult.ActionResult;

            if(result == ActionResult.Completed)
            {
                _stepsDictionary[actionResult.StepId].Status = StepState.Completed;
                // _currentSteps.Remove(actionResult.StepId);
                ExecuteAvailableSteps();
            }
            else
            {
                _logger.LogInformation($"There was an error in step {actionResult.StepId}");
            }
        }

        #endregion

        #region Pipeline Execution Private Methods

        private void ExecuteAvailableSteps()
        {
            var availableSteps = GetAvailableSteps();

            if(availableSteps.Count() == 0 && AreAllStepsCompleted())
            {
                _state = PipelineExecutionState.Completed;
                _stopwatch.Stop();
                return;
            }

            foreach (var step in availableSteps)
            {
                _stepsDictionary[step].Execute();
                _currentSteps.Add(step);
            }
        }

        private bool AreAllStepsCompleted()
        {
            foreach (var step in _stepsDictionary.Values)
            {
                if (step.Status != StepState.Completed)
                    return false;
            }
            return true;
        }

        private List<Guid> GetAvailableSteps()
        {
            var result = new List<Guid>();

            foreach (var step in _stepsDictionary.Values)
            {
                if (step.Status == StepState.Completed)
                    continue;

                var available = true;
                var prerequisites = step.PrerequisiteSteps;
                foreach (var prerequisite in prerequisites)
                {
                    var prerequisiteStep = _stepsDictionary[prerequisite];
                    if (prerequisiteStep.Status != StepState.Completed)
                    {
                        available = false;
                        break;
                    }
                }

                if(available)
                    result.Add(step.Id);
            }

            return result;
        }
        #endregion

        #region Graph Generation


        private void InitGraph()
        {
            GenerateEngineNodes();
            GenerateEngineEdges();
            _steps = GenerateSteps();
            var x = 0;
        }

        private void GenerateEngineNodes()
        {
            var nodes = _pipeline.Nodes;
            foreach (var node in nodes)
            {
                var engineNode = new EngineNode(node);
                _nodes[engineNode.Id] = engineNode;

                if(node.Type == "dataSink")
                {
                    _dataSinkNodes.Add(engineNode.Id);
                }

            }
        }

        private void GenerateEngineEdges()
        {
            var edges = _pipeline.Edges;

            foreach(var edge in edges)
            {
                var sourceHandle = edge.SourceHandle;
                var targetHandle = edge.TargetHandle;

                var sourceNode = GetNodeFromHandle(sourceHandle);
                var targetNode = GetNodeFromHandle(targetHandle);

                if (!_successorDictionary.ContainsKey(sourceNode.Id))
                {
                    _successorDictionary[sourceNode.Id] = new List<Guid>();
                }

                if (!_predecessorDictionary.ContainsKey(targetNode.Id))
                {
                    _predecessorDictionary[targetNode.Id] = new List<Guid>();
                }

                _successorDictionary[sourceNode.Id].Add(targetNode.Id);
                _predecessorDictionary[targetNode.Id].Add(sourceNode.Id);
            }
        }

        private EngineNode GetNodeFromHandle(string handleId)
        {
            foreach (var node in _nodes.Values)
            {
                foreach(var handle in node.SourceHandles)
                {
                    if (handle == handleId)
                        return node;
                }


                foreach (var handle in node.TargetHandles)
                {
                    if (handle == handleId)
                        return node;
                }
            }

            return null;
        }

        private List<Step> CreateStepListRecursive(EngineNode currentNode, List<Guid> visitedNodes)
        {
            var result = new List<Step>();

            // Check if the current node has already been visited or is a data source
            if (visitedNodes.Contains(currentNode.Id) || currentNode.NodeType == "dataSource")
            {
                return result;
            }

            // Only create an ExecuteOperatorStep if the current node is an operator
            ExecuteOperatorStep executeOperatorStep = null;

            // Ensure the predecessor dictionary exists and contains the current node ID
            if (!_predecessorDictionary.TryGetValue(currentNode.Id, out var predecessorNodesIds))
            {
                // Log a warning about the missing predecessor IDs
                Console.WriteLine($"Warning: No predecessors found for node ID: {currentNode.Id}");
                return result;
            }

            foreach (var predecessorId in predecessorNodesIds)
            {
                // Ensure the predecessor node exists in _nodes
                if (!_nodes.TryGetValue(predecessorId, out var predecessorNode))
                {
                    // Log a warning about the missing predecessor node
                    Console.WriteLine($"Warning: Predecessor node ID {predecessorId} not found in _nodes.");
                    continue; // Skip this iteration
                }

                // Recursive call
                result.AddRange(CreateStepListRecursive(predecessorNode, visitedNodes));

                var transferDataStep = GenerateTransferDataStep(predecessorId, currentNode.Id);
                var predecessorLastAssociatedStepId = predecessorNode.GetLastAssociatedStep();

                // Check if the last associated step ID is valid and retrieve the last step
                if (predecessorLastAssociatedStepId != Guid.Empty)
                {
                    if (_stepsDictionary.TryGetValue(predecessorLastAssociatedStepId, out var lastStep) && lastStep is TransferDataStep transferStep)
                    {
                        transferDataStep.PrerequisiteSteps.Add(predecessorLastAssociatedStepId);
                    }
                }

                result.Add(transferDataStep);
                AssociateNodeWithStep(currentNode.Id, transferDataStep.Id);
                _stepsDictionary[transferDataStep.Id] = transferDataStep;

                // Only create an ExecuteOperatorStep if the current node is an operator
                if (currentNode.NodeType == "operator")
                {
                    // Create and configure the ExecuteOperatorStep only for operator nodes
                    if (executeOperatorStep == null) // Only create it once per node
                    {
                        executeOperatorStep = new ExecuteOperatorStep(_id, _serviceProvider);
                    }
                    executeOperatorStep.PrerequisiteSteps.Add(transferDataStep.Id);
                    executeOperatorStep.InputResources.Add(transferDataStep.GetResourceToTransfer());
                }
            }

            // Handle operator node specific logic
            if (currentNode.NodeType == "operator")
            {
                // Check if ResourceId has a value before using it
                if (currentNode.ResourceId.HasValue)
                {
                    var operatorResource = new EngineResource()
                    {
                        OrganizationId = currentNode.OrganizationId,
                        RepositoryId = currentNode.RepositoryId,
                        ResourceId = currentNode.ResourceId.Value, // Use Value since we checked HasValue
                    };

                    executeOperatorStep.OperatorResource = operatorResource;

                    result.Add(executeOperatorStep);
                    AssociateNodeWithStep(currentNode.Id, executeOperatorStep.Id);
                    _stepsDictionary[executeOperatorStep.Id] = executeOperatorStep;
                }
                else
                {
                    // Log a warning about the missing ResourceId
                    Console.WriteLine($"Warning: ResourceId for node ID {currentNode.Id} is null.");
                }
            }

            visitedNodes.Add(currentNode.Id);
            return result;
        }




        private List<Step> GenerateSteps()
        {
            var visitedNodes = new List<Guid>();
            var result = new List<Step>();  

            foreach (Guid nodeId in _dataSinkNodes)
            {
                var node = _nodes[nodeId];
                result.AddRange(CreateStepListRecursive(node, visitedNodes));
                visitedNodes.Add(node.Id);
            }

            return result;
        }

        private TransferDataStep GenerateTransferDataStep(Guid sourceNodeId, Guid targetNodeId)
        {
            var sourceNode = _nodes[sourceNodeId];
            var targetNode = _nodes[targetNodeId];

            var resourceToTransfer = new EngineResource();

            // Ensure you get the last associated step and check its type
            Guid lastAssociatedStepId = sourceNode.GetLastAssociatedStep();
            if (lastAssociatedStepId != Guid.Empty && _stepsDictionary.TryGetValue(lastAssociatedStepId, out var lastStep))
            {
                if (lastStep is ExecuteOperatorStep operatorStep)
                {
                    resourceToTransfer.OrganizationId = operatorStep.OperatorResource.OrganizationId;
                    resourceToTransfer.ResourceId = operatorStep.OutputResourceId;
                }
                else
                {
                    // Handle the case where the last step is not an ExecuteOperatorStep
                    Console.WriteLine($"Warning: Last associated step is not an ExecuteOperatorStep for node ID {sourceNodeId}.");
                }
            }
            else
            {
                // Handle the case where there is no last associated step
                Console.WriteLine($"Warning: No last associated step found for node ID {sourceNodeId}.");
                resourceToTransfer.OrganizationId = sourceNode.OrganizationId;
                resourceToTransfer.RepositoryId = sourceNode.RepositoryId;
                resourceToTransfer.ResourceId = (Guid)sourceNode.ResourceId;
            }

            Guid? destinationRepository = null;
            string? destinationName = null;

            if (targetNode.NodeType == "dataSink")
            {
                destinationRepository = targetNode.RepositoryId;
                destinationName = targetNode.ResourceName;
            }

            var sourceStorageMode = GetStorageModeFromNode(sourceNode);
            var targetStorageMode = GetStorageModeFromNode(targetNode);

            var step = new TransferDataStep(resourceToTransfer, targetNode.OrganizationId, destinationRepository, 
                sourceStorageMode, targetStorageMode, destinationName, _id, _serviceProvider);

            return step;
        }


        private StorageMode GetStorageModeFromNode(EngineNode node)
        {
            if (node.NodeType == "operator")
                return StorageMode.Temporary;
            if (node.NodeType == "dataSource")
                return StorageMode.Permanent;

            return StorageMode.Permanent;
        }


        private void AssociateNodeWithStep(Guid nodeId, Guid stepId)
        {
            _nodes[nodeId].AddAssociatedStep(stepId);
        }

        #endregion

    }
}
