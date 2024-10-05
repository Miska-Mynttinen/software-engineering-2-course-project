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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PipelineStatusDialog() {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [popupOpen, setPopupOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setPopupOpen(true); // Open the popup dialog
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

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
            {/* Column 1 */}
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Not Started</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  <ListItemButton onClick={() => handleItemClick('Source 1')}>
                    <ListItemText primary="Source 1" secondary="Details of source 1" />
                  </ListItemButton>
                  <ListItemButton onClick={() => handleItemClick('Source 2')}>
                    <ListItemText primary="Source 2" secondary="Details of source 2" />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>

            {/* Column 2 */}
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Running</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  <ListItemButton onClick={() => handleItemClick('Operator 1')}>
                    <ListItemText primary="Operator 1" secondary="Details of operator 1" />
                  </ListItemButton>
                  <ListItemButton onClick={() => handleItemClick('Operator 2')}>
                    <ListItemText primary="Operator 2" secondary="Details of operator 2" />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>

            {/* Column 3 */}
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>Finished</Typography>
              <Paper elevation={1} sx={{ borderRadius: 2 }}>
                <List>
                  <ListItemButton onClick={() => handleItemClick('Sink 1')}>
                    <ListItemText primary="Sink 1" secondary="Details of sink 1" />
                  </ListItemButton>
                  <ListItemButton onClick={() => handleItemClick('Sink 2')}>
                    <ListItemText primary="Sink 2" secondary="Details of sink 2" />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Dialog>

      {/* Popup Dialog */}
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
              {selectedItem}
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
        <Box sx={{ p: 4, height: '400px', overflow: 'auto' }}> {/* Increased height and overflow handling */}
          <Typography id="popup-dialog-description" variant="body1">
            More details about {selectedItem} will be shown here.
          </Typography>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
