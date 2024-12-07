import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { ListItemText } from '@mui/material';
import {
  Drawer,
  List,
  Typography,
  Divider,
  ListItem,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrganizations, getRepositories, getResources } from '../../redux/selectors/apiSelector';
import { organizationThunk, repositoryThunk, resourceThunk } from '../../redux/slices/apiSlice';
import { Organization, Repository, Resource } from '../../redux/states/apiState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import ResourceUploadButton from './Buttons/ResourceUploadButton';
import CreateRepositoryButton from './Buttons/CreateRepositoryButton';
import AddOrganizationButton from './Buttons/AddOrganizationButton';
import OperatorUploadButton from './Buttons/OperatorUploadButton';
import { downloadResource, editRepository, deleteRepository, editResource, deleteResource } from '../../services/backendAPI';
 
const drawerWidth = 240;
 
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
 
function EditDialog({ open, onClose, onSave, initialData, type }: any) {
  const [formData, setFormData] = useState({ name: initialData?.name || '' });
 
  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name || '' });
    }
  }, [initialData]);
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
 
  const handleSave = () => {
    if (initialData) {
      onSave({ ...initialData, ...formData });
    }
  };
 
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {type}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modify the details for the selected {type.toLowerCase()} below:
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label={`${type} Name`}
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default function PersistentDrawerLeft() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
 
  const organizations: Organization[] = useAppSelector(getOrganizations);
  const repositories: Repository[] = useAppSelector(getRepositories);
  const resources = useSelector(getResources);
 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<string>('');
 
  const refreshRepositories = () => {
    dispatch(repositoryThunk(organizations));
  };
 
  const refreshResources = () => {
    dispatch(resourceThunk({ organizations, repositories }));
  };
 
  useEffect(() => {
    dispatch(organizationThunk());
    dispatch(repositoryThunk(organizations));
    dispatch(resourceThunk({ organizations, repositories }));
  }, [dispatch]);
 
  const handleDownload = async (resource: Resource) => {
    const response = await downloadResource(resource.organizationId, resource.repositoryId, resource.id);
    await downloadReadableStream(response.url, resource.name);
  };
 
  const handleEdit = (type: string, item: any) => {
    if (item) {
      setEditType(type);
      setCurrentEditItem(item);
      setDialogOpen(true);
    }
  };
 
  const handleSaveEdit = async (updatedData: any) => {
    if (!updatedData) return; // Prevent save if no valid data is available
 
    try {
      if (editType === 'Repository') {
        await editRepository(updatedData.organizationId, updatedData.id, updatedData);
        refreshRepositories();
      } else if (editType === 'Resource') {
        await editResource(updatedData.organizationId, updatedData.repositoryId, updatedData.id, updatedData);
        refreshResources();
      }
      console.log(`${editType} edited successfully.`);
      setDialogOpen(false);
    } catch (error) {
      console.error(`Error editing ${editType}:`, error);
    }
  };
 
  const handleDeleteClick = (type: string, item: any) => {
    setDeleteType(type);
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };
 
  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === 'Repository') {
        await deleteRepository(itemToDelete.organizationId, itemToDelete.id);
        refreshRepositories();
      } else if (deleteType === 'Resource') {
        await deleteResource(itemToDelete.organizationId, itemToDelete.repositoryId, itemToDelete.id);
        refreshResources();
      }
      console.log(`${deleteType} deleted successfully.`);
      setOpenDeleteDialog(false); // Close the dialog after successful deletion
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
    }
  };
 
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };
 
  async function downloadReadableStream(url: string, fileName: string) {
    window.open(url, '_blank');
  }
 
  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: '#292929',
          overflow: 'hidden',
        },
      }}
      sx={{
        width: drawerWidth,
        position: 'static',
        flexGrow: 1,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <DrawerHeader>
        <Typography sx={{ width: '100%', textAlign: 'center' }} variant="h6" noWrap component="div">
          Organisations
        </Typography>
        <AddOrganizationButton />
      </DrawerHeader>
      <List>
        {organizations.map((organization) => (
          <>
            <ListItem sx={{ justifyContent: 'center' }} key={organization.id} disablePadding>
              <p style={{ marginBlock: '0rem', fontSize: '25px' }}>{organization.name}</p>
            </ListItem>
            {repositories.map((repository) =>
              repository.organizationId === organization.id ? (
                <>
                  <ListItem key={repository.id} sx={{ paddingInline: '5px' }}>
                    <Box display="flex" alignItems="center" width="100%">
                      <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>{repository.name}</p>
                      <Box marginLeft="auto">
                        <IconButton onClick={() => handleEdit('Repository', repository)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick('Repository', repository)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                  <div style={{ display: 'flex', alignItems: 'center', paddingInline: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem' }}>Resources</p>
                    <Box sx={{ marginLeft: 'auto' }}>
                      <ResourceUploadButton orgId={repository.organizationId} repId={repository.id} onResourceCreated={refreshResources} />
                    </Box>
                  </div>
                  {resources
                    .filter((resource) => resource.repositoryId === repository.id && resource.type !== 'operator') // Exclude operators from the resources list
                    .map((resource) => (
                      <ListItem key={resource.id} disablePadding>
                        <ListItemText secondary={resource.name} secondaryTypographyProps={{ fontSize: '0.8rem' }} />
                        <Box marginLeft="auto">
                          <IconButton onClick={() => handleEdit('Resource', resource)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick('Resource', resource)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  <div style={{ display: 'flex', alignItems: 'center', paddingInline: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem' }}>Operators</p>
                    <Box sx={{ marginLeft: 'auto' }}>
                      <OperatorUploadButton orgId={repository.organizationId} repId={repository.id} onOperatorCreated={refreshResources} />
                    </Box>
                  </div>
                  {resources
                    .filter((resource) => resource.repositoryId === repository.id && resource.type === 'operator') // Only operators
                    .map((resource) => (
                      <ListItem key={resource.id} disablePadding>
                        <ListItemText secondary={resource.name} secondaryTypographyProps={{ fontSize: '0.8rem' }} />
                        <Box marginLeft="auto">
                          <IconButton onClick={() => handleEdit('Resource', resource)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick('Resource', resource)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                </>
              ) : null
            )}
            <ListItem sx={{ justifyContent: 'center' }}>
              <Box sx={{ width: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CreateRepositoryButton orgId={organization.id} onRepositoryCreated={refreshRepositories} />
              </Box>
            </ListItem>
          </>
        ))}
      </List>
 
      <EditDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSaveEdit} initialData={currentEditItem} type={editType} />
 
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this? This action cannot be undone!!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
 
 