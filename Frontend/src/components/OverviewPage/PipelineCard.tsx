 
 
 
 
 
 
 
 
 
import * as React from 'react';
import { Card, CardActions, CardContent, CardMedia, Typography, CardActionArea, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActivePipeline, removePipeline } from '../../redux/slices/pipelineSlice'; // Import removePipeline action
import { Delete } from '@mui/icons-material';
import { deletePipeline } from '../../services/backendAPI'; // Assuming you have a deletePipeline service
 
export interface PipelineCardProps {
  id: string;
  name: string;
  imgData: string;
  orgId: string;
  repId: string;
}
 
export default function PipelineCard({ id, name, imgData, orgId, repId }: PipelineCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
 
  // Navigate to the pipeline page
  const navigateToPipeline = () => {
    dispatch(setActivePipeline(id));
    navigate('/pipeline');
  };
 
  // Open the delete confirmation dialog
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };
 
  // Handle deleting the pipeline after confirmation
  const handleDeleteConfirm = async () => {
    try {
      dispatch(removePipeline(id)); // Remove the pipeline from Redux state
      await deletePipeline(orgId, repId, id); // Assuming deletePipeline is a function that calls your API
      console.log('Pipeline deleted successfully');
     
    } catch (error) {
      console.error('Error deleting pipeline:', error);
    } finally {
      // Close the dialog after deletion (whether it was successful or not)
      setOpenDeleteDialog(false);
    }
  };
 
  // Close the delete confirmation dialog
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };
 
  return (
    <Card sx={{ maxWidth: 345, position: 'relative' }}>
      <CardActionArea onClick={navigateToPipeline}>
        <CardMedia
          sx={{ height: 140 }}
          title={name}
          image={imgData}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click this to modify the pipeline
          </Typography>
        </CardContent>
      </CardActionArea>
 
      {/* Delete Button */}
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        color="secondary"
        onClick={handleDeleteClick}
      >
        <Delete />
      </IconButton>
 
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this pipeline?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
 
 