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
import { getPipelines, getCurrentSessionTickets } from '../../redux/selectors';
import SinglePipelineStatus from './SinglePipelineStatus'; // Import SinglePipelineStatus component

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PipelineStatus {
  ticketId: string;
  pipelineId: string;
  pipelineName: string | undefined;
  status: 'Not Started' | 'Running' | 'Completed'; // Change 'Completed' to 'Finished'
}

interface PipelineStatusDialogBoxProps {
  statuses: PipelineStatus[];
}

export default function PipelineStatusDialogBox({ statuses }: PipelineStatusDialogBoxProps) {
  const pipelines = useSelector(getPipelines);
  //console.log("All Pipeline:", pipelines);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PipelineStatus | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const tickets = useSelector(getCurrentSessionTickets);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleItemClick = (status: PipelineStatus) => {
    setSelectedItem(status);
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const notStartedPipelines = statuses.filter(status => status.status === 'Not Started');
  const runningPipelines = statuses.filter(status => status.status === 'Running');
  const finishedPipelines = statuses.filter(status => status.status === 'Completed'); // Change 'Completed' to 'Finished'

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

        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Not Started</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  {notStartedPipelines.map(status => (
                    <ListItemButton key={status.ticketId} onClick={() => handleItemClick(status)}>
                      <ListItemText primary={status.pipelineName || "No Name Available"} secondary={status.ticketId} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Running</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  {runningPipelines.map(status => (
                    <ListItemButton key={status.ticketId} onClick={() => handleItemClick(status)}>
                      <ListItemText primary={status.pipelineName || "No Name Available"} secondary={status.ticketId} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Completed</Typography> {/* Change 'Completed' to 'Finished' */}
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  {finishedPipelines.map(status => (
                    <ListItemButton key={status.ticketId} onClick={() => handleItemClick(status)}>
                      <ListItemText primary={status.pipelineName || "No Name Available"} secondary={status.ticketId} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      <Dialog
        open={popupOpen}
        onClose={handlePopupClose}
        aria-labelledby="popup-dialog-title"
        aria-describedby="popup-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {selectedItem?.pipelineName || "Unnamed Pipeline"} {/* Display the pipeline name */}
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

        {/* Check if selectedItem is not null before rendering SinglePipelineStatus */}
        {selectedItem && (
          <SinglePipelineStatus pipeline={{ ...selectedItem, pipelineName: selectedItem.pipelineName || "Unnamed Pipeline" }} />
        )}
      </Dialog>
    </React.Fragment>
  );
}
