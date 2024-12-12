import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PipelineCard from './PipelineCard';
import { Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPipeline, setImageData } from '../../redux/slices/pipelineSlice';
import { getPipelines } from '../../redux/selectors';
import FlowDiagram from './ImageGeneration/FlowDiagram';
import ReactDOM from 'react-dom';
import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AutoGrid() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pipelines = useSelector(getPipelines);

  const [username, setUsername] = useState(''); // State for username

  useEffect(() => {
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem('username') || 'User';
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    // Clear any necessary data, e.g., session tokens
    localStorage.removeItem('username'); // Example: Clear username
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate('/'); // Redirect to the login page
  };

  const createNewPipeline = () => {
    dispatch(addNewPipeline({ id: `pipeline-${uuidv4()}`, flowData: { nodes: [], edges: [] } }));
    { navigate("/pipeline") }
  };

  pipelines.map(({ pipeline: flowData, id, name }) => {
    const nodes = flowData.nodes;
    const edges = flowData.edges;
    console.log(name, nodes, edges);
    const pipelineId = id;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-10000px';
    container.id = pipelineId;
    document.body.appendChild(container);

    ReactDOM.render(
      <FlowDiagram nodes={nodes} edges={edges} />,
      container,
      () => {
        const width = 800;
        const height = 600;

        const nodesBounds = getNodesBounds(nodes!);
        const { x, y, zoom } = getViewportForBounds(nodesBounds, width, height, 0.5, 2, 1);

        toPng(document.querySelector(`#${pipelineId} .react-flow__viewport`) as HTMLElement, {
          backgroundColor: '#333',
          width: width,
          height: height,
          style: {
            width: `${width}`,
            height: `${height}`,
            transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          },
        }).then((dataUrl) => {
          dispatch(setImageData({ id: pipelineId, imgData: dataUrl }));
          document.body.removeChild(container);
        });
      }
    );
  });

  return (
    <Box sx={{ flexGrow: 1, flexBasis: "100%", position: 'relative' }}>
      {/* Navbar */}
      <Box sx={{
        position: 'fixed', top: 0, left: 0, width: '100%', backgroundColor: '#292929', zIndex: 1, padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'
      }}>
        <Typography variant="h6" sx={{ marginLeft: '20px' }}>Pipeline Dashboard</Typography>

        {/* Create New Button on the Navbar */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => createNewPipeline()}
          sx={{
            backgroundColor: "#bbb", "&:hover": { backgroundColor: "#eee" }, marginRight: '20px'
          }}
        >
          Create New
        </Button>

        {/* Username Display and Logout Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '20px' }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Username: {username}
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#bbb', "&:hover": { backgroundColor: '#eee' } }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Grid Display of Pipelines */}
      <Grid container spacing={{ xs: 1, md: 1 }} sx={{ padding: "10px", marginTop: '80px' }}>
        {pipelines.map(({ id, name, imgData }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={id}>
            <PipelineCard id={id} name={name} imgData={imgData}></PipelineCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
