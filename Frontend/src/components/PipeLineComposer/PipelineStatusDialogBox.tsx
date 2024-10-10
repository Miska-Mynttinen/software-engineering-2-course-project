import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getPipelines } from '../../redux/selectors';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Define the type for each status item
interface PipelineStatus {
  ticketId: string;
  pipelineId: string;
  pipelineName: string; // Ensure this is included
  status: 'Not Started' | 'Running' | 'Finished';
}

// Define the props type for the dialog component
interface PipelineStatusDialogBoxProps {
  statuses: PipelineStatus[];
}

export default function PipelineStatusDialogBox({ statuses }: PipelineStatusDialogBoxProps) {
  const pipelines = useSelector(getPipelines);
console.log("All Pipeline:",pipelines)
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PipelineStatus | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleItemClick = (status: PipelineStatus) => {
    setSelectedItem(status);
    setPopupOpen(true); // Open the popup dialog
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  // Create arrays for each status
  const notStartedPipelines = statuses.filter(status => status.status === 'Not Started');
  const runningPipelines = statuses.filter(status => status.status === 'Running');
  const finishedPipelines = statuses.filter(status => status.status === 'Finished');
  console.log("NS:",notStartedPipelines);
  console.log("RP:",runningPipelines);
  console.log("FP:",finishedPipelines);

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <Typography variant="body1" sx={{ color: "white" }}>Pipeline Status</Typography>
      </Button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Pipeline Status
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Content area */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Column 1 - Not Started */}
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Not Started</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  {notStartedPipelines.map(status => (
                    <ListItemButton key={status.ticketId} onClick={() => handleItemClick(status)}>
                      <ListItemText primary={status.pipelineName || "No Name Available"} secondary="Click for details" /> {/* Use pipelineName here */}
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Column 2 - Running */}
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Running</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  {runningPipelines.map(status => (
                    <ListItemButton key={status.ticketId} onClick={() => handleItemClick(status)}>
                      <ListItemText primary={status.ticketId} secondary={status.pipelineName} /> {/* Use pipelineName here */}
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Column 3 - Finished */}
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Finished</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  {finishedPipelines.map(status => (
                    <ListItemButton key={status.ticketId} onClick={() => handleItemClick(status)}>
                      <ListItemText primary={status.pipelineName || "No Name Available"} secondary="Click for details" /> {/* Use pipelineName here */}
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      {/* Popup Dialog for Pipeline Details */}
      <Dialog
        open={popupOpen}
        onClose={handlePopupClose}
        aria-labelledby="popup-dialog-title"
        aria-describedby="popup-dialog-description"
        maxWidth="md" // Adjust maxWidth as needed
        fullWidth
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {selectedItem?.pipelineName} {/* Display the pipeline name */}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handlePopupClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 4, height: '400px', overflow: 'auto' }}>
          <Typography id="popup-dialog-description" variant="body1">
            Ticket ID: {selectedItem?.ticketId} {/* Show ticket ID in the details */}
          </Typography>
          {/* Add more details about the pipeline here if needed */}
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
