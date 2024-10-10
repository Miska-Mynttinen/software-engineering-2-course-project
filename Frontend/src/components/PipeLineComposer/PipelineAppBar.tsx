import { AppBar, Box, Button, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getActiveFlowData, getActivePipeline, getCurrentSessionTickets } from "../../redux/selectors";
import { useState, useEffect } from "react";
import { updatePipelineName } from "../../redux/slices/pipelineSlice";
import { addNewNotStartedTicket, addNewStartedTicket, addNewFinishedTicket, deleteTicket} from "../../redux/slices/currentSessionTicketSlice";
import EditIcon from '@mui/icons-material/Edit';
import { Node } from "reactflow";
import { DataSinkNodeData, DataSourceNodeData, OperatorNodeData } from "../../redux/states/pipelineState";
import { putCommandStart, putExecution, putPipeline, fetchPipelineExecutionStatus, fetchStatus } from "../../services/backendAPI";
import { getOrganizations, getRepositories } from "../../redux/selectors/apiSelector";
import { getHandleId, getNodeId } from "./Flow";

export default function PipelineAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  // Get current session tickets at the top level of the component
  const tickets = useSelector(getCurrentSessionTickets); 

  // Function to fetch ticket statuses
  const fetchTicketStatuses = async () => {
    if (tickets.startedTickets.length === 0) return; // Prevent API call if there are no running tickets

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
        console.log(`Pipeline status for pipeline: ${ticket.pipeId}`, pipelineStatus);

      // If pipeline status is fully finished then delete from started tickets and move to finished tickets
      } catch (error) {
        // ticket not finished or something
      }
    }
  };

  // Set up the interval for polling the API
  useEffect(() => {
    fetchTicketStatuses(); // Call immediately to get current statuses

    const interval = setInterval(fetchTicketStatuses, 30000); // Poll every 30 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [tickets]); // Add tickets as a dependency to re-fetch if they change

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleFinishEditing = () => {
    setIsEditing(false);
  };

  const organizations = useSelector(getOrganizations)
  const repositories = useSelector(getRepositories)

  const pipelineName = useSelector(getActivePipeline)?.name

  const setPipelineName = (name: string) => {
    dispatch(updatePipelineName(name))
  }

  const flowData = useSelector(getActiveFlowData)

  const generateJson = async () => {

    var edges = flowData!.edges.map(edge => {
      return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle }
    })

    const dataSinks = flowData?.edges.map((edge) => {
      if (edge.data?.filename) {
        const newTarget = getHandleId()
        const egeToModify = edges.find(e => e.sourceHandle == edge.sourceHandle && e.targetHandle == edge.targetHandle)
        egeToModify!.targetHandle = newTarget

        const originalDataSink = flowData!.nodes.find(node => node.id === edge.target) as Node<DataSinkNodeData>
        return {
          type: originalDataSink?.type,
          data: {
            ...originalDataSink?.data,
            templateData: { sourceHandles: [], targetHandles: [{ id: newTarget }] },
            instantiationData: {
              resource: {
                //...originalDataSink?.data?.instantiationData.repository, 
                organizationId: originalDataSink?.data?.instantiationData.repository?.organizationId,
                repositoryId: originalDataSink?.data?.instantiationData.repository?.id,
                name: edge?.data?.filename
              }
            }
          },
          position: { x: 100, y: 100 },
          id: getNodeId(),
          width: 100,
          height: 100,
        }
      }
    }).filter(node => node !== undefined) as any

    console.log(JSON.stringify(dataSinks))

    const requestData = {
      name: pipelineName,
      pipeline: {
        nodes: flowData?.nodes?.filter(node => node.type === 'dataSource').map(node => node as Node<DataSourceNodeData>).map(node => {
          return {
            type: node.type,
            data: {
              ...node.data,
              instantiationData: {
                resource: {
                  //...node?.data?.instantiationData.resource,
                  organizationId: node?.data?.instantiationData.resource?.organizationId,
                  repositoryId: node?.data?.instantiationData.resource?.repositoryId,
                  resourceId: node?.data?.instantiationData.resource?.id,
                },
              }
            },
            width: 100, height: 100, position: { x: 100, y: 100 }, id: node.id, label: "",
          } as any
        }).concat(
          flowData?.nodes?.filter(node => node.type === 'operator').map(node => node as Node<OperatorNodeData>).map(node => {
            return {
              type: node.type, data: {
                ...node.data,
                instantiationData: {
                  resource: {
                    //...node?.data?.instantiationData.algorithm,
                    organizationId: node?.data?.instantiationData.algorithm?.organizationId,
                    repositoryId: node?.data?.instantiationData.algorithm?.repositoryId,
                    resourceId: node?.data?.instantiationData.algorithm?.id,
                  }
                }
              },
              width: 100, height: 100, position: { x: 100, y: 100 }, id: node.id, label: "",
            } as any
          })
        ).concat(dataSinks),
        edges: edges.map(edge => {
          return { sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle }
        })
      }
    }

    console.log(JSON.stringify(requestData))

    const selectedOrg = organizations[0]
    const selectedRepo = repositories.filter(repo => repo.organizationId === selectedOrg.id)[0]

    const pipelineId = await putPipeline(selectedOrg.id, selectedRepo.id, requestData)
    const executionId = await putExecution(selectedOrg.id, selectedRepo.id, pipelineId)
    dispatch(addNewNotStartedTicket({ticketId: executionId.ticketId, orgId: executionId.itemIds.organizationId, repId: executionId.itemIds.executionId, pipeId: executionId.itemIds.executionId, exeId: executionId.itemIds.executionId}))

    const startId = await putCommandStart(selectedOrg.id, selectedRepo.id, pipelineId, executionId.itemIds.executionId)
    dispatch(deleteTicket({ticketId: executionId.ticketId, orgId: executionId.itemIds.organizationId, repId: executionId.itemIds.executionId, pipeId: executionId.itemIds.executionId, exeId: executionId.itemIds.executionId}))
    dispatch(addNewStartedTicket({ticketId: startId.ticketId, orgId: executionId.itemIds.organizationId, repId: executionId.itemIds.executionId, pipeId: executionId.itemIds.executionId, exeId: executionId.itemIds.executionId}))
  }

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ flexGrow: 1 }}>
        <Button onClick={() => navigate('/')}>
          <ArrowBackIosNewIcon sx={{ color: "white" }} />
        </Button>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          {isEditing ? (
            <TextField
              value={pipelineName}
              onChange={(event) => setPipelineName(event?.target.value as string)}
              autoFocus
              onBlur={handleFinishEditing}
              inputProps={{ style: { textAlign: 'center', width: 'auto' } }}
            />
          ) : (
            <Box onClick={handleStartEditing} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <Typography>{pipelineName}</Typography>
              <EditIcon sx={{ paddingLeft: '10px' }} />
            </Box>
          )}
        </Box>
        <Button onClick={() => generateJson()}>
          <Typography variant="body1" sx={{ color: "white" }}>Deploy pipeline</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  )
}

