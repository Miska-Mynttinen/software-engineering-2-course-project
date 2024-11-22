import { AppBar, Box, Button, TextField, Toolbar, Typography,Dialog,DialogActions,DialogContent,DialogTitle,MenuItem } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getActiveFlowData, getActivePipeline, getCurrentSessionTickets } from "../../redux/selectors";
import { useState, useEffect } from "react";
import { updatePipelineName } from "../../redux/slices/pipelineSlice";
import { addNewNotStartedTicket, addNewStartedTicket, addNewFinishedTicket, deleteTicket } from "../../redux/slices/currentSessionTicketSlice";
import EditIcon from '@mui/icons-material/Edit';
import { Node } from "reactflow";
import { DataSinkNodeData, DataSourceNodeData, OperatorNodeData } from "../../redux/states/pipelineState";
import { putCommandStart, putExecution, putPipeline, fetchPipelineExecutionStatus, fetchStatus } from "../../services/backendAPI";
import { getOrganizations, getRepositories } from "../../redux/selectors/apiSelector";
import { getHandleId, getNodeId } from "./Flow";
import PipelineStatusDialogBox from "./PipelineStatusDialogBox";

interface Step {
  executionTime: string;
  executionerPeer: string;
  stepId: string;
  stepState: string;
  stepType: string;
}

interface PipelineStatus {
  ticketId: string;
  pipelineId: string;
  pipelineName: string | undefined;
  status: 'Not Started' | 'Running' | 'Completed';
  steps: Step[];
}

export default function PipelineAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [statuses, setStatuses] = useState<PipelineStatus[]>([]); // State for pipeline statuses
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    owner: "",
    ownerType: "",
    userGroup: "",
  });
  // Get current session tickets at the top level of the component
  const tickets = useSelector(getCurrentSessionTickets);
  
  useEffect(() => {
    if (tickets) {
      const initialStatuses: PipelineStatus[] = [];
  
      const ticketTypes = Object.values(tickets); // Get all ticket types
      const statusesByType: ('Not Started' | 'Running' | 'Completed')[] = ['Not Started', 'Running', 'Completed']; // Define statuses for each ticket type with correct type
  
      // Loop over different ticket types and assign appropriate status
      ticketTypes.forEach((ticketType, index) => {
        const status = statusesByType[index] || 'Not Started'; // Use 'Not Started' as fallback if there are more ticket types than statuses
  
        ticketType.forEach((ticket: any) => {
          initialStatuses.push({
            ticketId: ticket.ticketId,
            pipelineId: ticket.pipeId,
            pipelineName: ticket.pipeName,
            status: status, // Set status with correct type
            steps: [] // Initial placeholder for steps
          });
        });
      });
  
      setStatuses(initialStatuses); // Set initial statuses only once on mount
    }
  }, []); // Only run once

  // Function to fetch ticket statuses
  const fetchTicketStatuses = async () => {
    if (tickets.startedTickets.length === 0) return; // Prevent API call if there are no running tickets

    const fetchedStatuses: PipelineStatus[] = []; // Initialize an array to hold the fetched statuses

    for (const ticket of tickets.startedTickets) {
      try {
        const response = await fetchPipelineExecutionStatus(ticket.orgId, ticket.repId, ticket.pipeId, ticket.exeId);
      
        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
          const maxRetries = 10;
          const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

          for (let retries = 0; retries < maxRetries; retries++) {
              try {
                  const data = await fetchStatus(ticketId);
                  if (data.status) {
                      return data;
                  }
                  await delay(1000); // Wait for 1 second before retrying
              } catch (error) {
                  if (retries === maxRetries - 1) {
                      throw new Error('Max retries reached');
                  }
              }
          }
          throw new Error('Failed to command start');
        };

        // Call getData function with the ticketId obtained from putExecution
        const pipelineStatus = await getData(response.ticketId);

        console.log(`Pipeline status for pipeline: ${ticket.pipeId}`, pipelineStatus.result.status.state, pipelineStatus);

        const status = pipelineStatus.result.status.state as 'Not Started' | 'Running' | 'Completed'; // Cast the status

        if (status === 'Completed') {
          dispatch(deleteTicket({ ticketId: ticket.ticketId, orgId: ticket.orgId, repId: ticket.repId, pipeId: ticket.pipeId, pipeName: ticket.pipeName, exeId: ticket.exeId}));
          dispatch(addNewFinishedTicket({ ticketId: ticket.ticketId, orgId: ticket.orgId, repId: ticket.repId, pipeId: ticket.pipeId, pipeName: ticket.pipeName, exeId: ticket.exeId }));

          fetchedStatuses.filter((pipelineStatus) => pipelineStatus.pipelineId !== ticket.pipeId);
          fetchedStatuses.push({
            ticketId: ticket.ticketId,
            pipelineId: ticket.pipeId,
            pipelineName: ticket.pipeName,
            status,
            steps: pipelineStatus.result.status.currentSteps
          });
        } else {
          const pipelineExists = fetchedStatuses.some(pipelineStatus => pipelineStatus.pipelineId === ticket.pipeId);
          if (!pipelineExists) {
            // If not found, add it to fetchedStatuses
            fetchedStatuses.push({
              ticketId: ticket.ticketId,
              pipelineId: ticket.pipeId,
              pipelineName: ticket.pipeName,
              status,
              steps: pipelineStatus.result.status.currentSteps
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching status for ticket ${ticket.ticketId}:`, error);
      }
    }

    setStatuses(fetchedStatuses); // Update the statuses state with the fetched statuses
  };

  // Set up the interval for polling the API
  useEffect(() => {
    fetchTicketStatuses(); // Call immediately to get current statuses

    const interval = setInterval(fetchTicketStatuses, 10000); // Poll every 10 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [tickets]); // Add tickets as a dependency to re-fetch if they change

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const organizations = useSelector(getOrganizations);
  const repositories = useSelector(getRepositories);
  const pipelineName = useSelector(getActivePipeline)?.name;

  const setPipelineName = (name: string) => {
    dispatch(updatePipelineName(name));
  };

  const flowData = useSelector(getActiveFlowData);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleFormChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.owner || !formData.ownerType) {
      alert("Please fill in the required fields.");
      return;
    }
    setDialogOpen(false);
    await generateJson();
  };

  const generateJson = async () => {
    var edges = flowData!.edges.map(edge => {
      return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle };
    });

    const dataSinks = flowData?.edges.map((edge) => {
      if (edge.data?.filename) {
        const newTarget = getHandleId();
        const egeToModify = edges.find(e => e.sourceHandle === edge.sourceHandle && e.targetHandle === edge.targetHandle);
        egeToModify!.targetHandle = newTarget;

        const originalDataSink = flowData!.nodes.find(node => node.id === edge.target) as Node<DataSinkNodeData>;
        return {
          type: originalDataSink?.type,
          data: {
            ...originalDataSink?.data,
            templateData: { sourceHandles: [], targetHandles: [{ id: newTarget }] },
            instantiationData: {
              resource: {
                organizationId: originalDataSink?.data?.instantiationData.repository?.organizationId,
                repositoryId: originalDataSink?.data?.instantiationData.repository?.id,
                name: edge?.data?.filename,
              }
            }
          },
          position: { x: 100, y: 100 },
          id: getNodeId(),
          width: 100,
          height: 100,
        };
      }
    }).filter(node => node !== undefined) as any;

    console.log(JSON.stringify(dataSinks));

    const requestData = {
      name: pipelineName,
      owner: formData.owner,
      ownerType: formData.ownerType,
      userGroup: formData.userGroup,
      pipeline: {
        nodes: flowData?.nodes?.filter(node => node.type === 'dataSource').map(node => node as Node<DataSourceNodeData>).map(node => {
          return {
            type: node.type,
            data: {
              ...node.data,
              instantiationData: {
                resource: {
                  organizationId: node?.data?.instantiationData.resource?.organizationId,
                  repositoryId: node?.data?.instantiationData.resource?.repositoryId,
                  resourceId: node?.data?.instantiationData.resource?.id,
                },
              }
            },
            width: 100, height: 100, position: { x: 100, y: 100 }, id: node.id, label: "",
          } as any;
        }).concat(
          flowData?.nodes?.filter(node => node.type === 'operator').map(node => node as Node<OperatorNodeData>).map(node => {
            return {
              type: node.type,
              data: {
                ...node.data,
                instantiationData: {
                  resource: {
                    organizationId: node?.data?.instantiationData.algorithm?.organizationId,
                    repositoryId: node?.data?.instantiationData.algorithm?.repositoryId,
                    resourceId: node?.data?.instantiationData.algorithm?.id,
                  }
                }
              },
              width: 100, height: 100, position: { x: 100, y: 100 }, id: node.id, label: "",
            } as any;
          })
        ).concat(dataSinks),
        edges: edges.map(edge => {
          return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle };
        })
      }
    };

    console.log(JSON.stringify(requestData));

    const selectedOrg = organizations[0];
    const selectedRepo = repositories.filter(repo => repo.organizationId === selectedOrg.id)[0];

    const pipelineId = await putPipeline(selectedOrg.id, selectedRepo.id, requestData);
    const executionId = await putExecution(selectedOrg.id, selectedRepo.id, pipelineId);
    dispatch(addNewNotStartedTicket({ ticketId: executionId.ticketId, orgId: executionId.itemIds.organizationId, repId: executionId.itemIds.executionId, pipeId: executionId.itemIds.executionId, pipeName: pipelineName, exeId: executionId.itemIds.executionId }));
  
    const newStatuses = statuses;
    // If you want to add another status entry, it should be done here explicitly
    newStatuses.push({
      ticketId: executionId.ticketId,
      pipelineId: executionId.itemIds.executionId,
      pipelineName: pipelineName,
      status: 'Not Started',
      steps: []
    });

    setStatuses(newStatuses);


    const startId = await putCommandStart(selectedOrg.id, selectedRepo.id, pipelineId, executionId.itemIds.executionId);
    dispatch(deleteTicket({ ticketId: executionId.ticketId, orgId: executionId.itemIds.organizationId, repId: executionId.itemIds.executionId, pipeId: executionId.itemIds.executionId, pipeName: pipelineName, exeId: executionId.itemIds.executionId }));
    dispatch(addNewStartedTicket({ ticketId: startId.ticketId, orgId: executionId.itemIds.organizationId, repId: executionId.itemIds.executionId, pipeId: executionId.itemIds.executionId, pipeName: pipelineName, exeId: executionId.itemIds.executionId }));
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ flexGrow: 1 }}>
          <Button onClick={() => navigate("/")}>
            <ArrowBackIosNewIcon sx={{ color: "white" }} />
          </Button>
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {isEditing ? (
              <TextField
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                autoFocus
                onBlur={handleFinishEditing}
                inputProps={{ style: { textAlign: "center", width: "auto" } }}
              />
            ) : (
              <Box
                onClick={handleStartEditing}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Typography>{pipelineName}</Typography>
                <EditIcon sx={{ paddingLeft: "10px" }} />
              </Box>
            )}
          </Box>
          <PipelineStatusDialogBox statuses={statuses} />
          <Button onClick={handleDialogOpen}>
            <Typography variant="body1" sx={{ color: "white" }}>
              Deploy pipeline
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Deploy Pipeline</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleFormChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Owner Type"
            name="ownerType"
            value={formData.ownerType}
            onChange={handleFormChange}
            required
          >
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="User Group"
            name="userGroup"
            value={formData.userGroup}
            onChange={handleFormChange}
            helperText="Leave empty if not applicable"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

}
