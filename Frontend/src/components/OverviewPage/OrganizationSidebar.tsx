import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, List, Typography, Divider, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';
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
import { downloadResource } from '../../services/backendAPI';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const organizations: Organization[] = useAppSelector(getOrganizations);
  const repositories: Repository[] = useAppSelector(getRepositories);
  const resources = useSelector(getResources);

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
    try {
      const fileInfo = await downloadResource(resource.organizationId, resource.repositoryId, resource.id);
      if (fileInfo && fileInfo.url) {
        await downloadReadableStream(fileInfo.url, resource.name);
      } else {
        console.error('Invalid file information received');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error handling file download:', error.message);
      } else {
        console.error('Unknown error handling file download:', error);
      }
    }
  };

  async function downloadReadableStream(url: string, fileName: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download file from URL. Status: ${response.status}`);
        }

        const text = await response.text(); // Read the response as plain text

        // Create a Blob from the text data
        const blob = new Blob([text], { type: 'text/plain' });

        // Create a URL for the Blob
        const downloadUrl = URL.createObjectURL(blob);

        // Create an anchor element and trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`; // Ensure the file has a .txt extension
        document.body.appendChild(a);
        a.click();

        // Clean up
        URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during file download:', error.message);
        } else {
            console.error('Unknown error during file download:', error);
        }
    }
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
            <div style={{ display: 'flex', alignItems: 'center', paddingInline: '0.5rem' }}></div>
            {repositories.map((repository) =>
              repository.organizationId === organization.id ? (
                <>
                  <ListItem key={repository.id} sx={{ paddingInline: '5px' }}>
                    <p style={{ padding: '0', fontSize: '25px', marginBlock: '10px' }}>{repository.name}</p>
                  </ListItem>

                  <div style={{ display: 'flex', alignItems: 'center', paddingInline: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem' }}>Resources</p>
                    <Box sx={{ marginLeft: 'auto' }}>
                      <ResourceUploadButton orgId={repository.organizationId} repId={repository.id} onResourceCreated={refreshResources} />
                    </Box>
                  </div>
                  {resources.map((resource) =>
                    resource.repositoryId === repository.id && resource.type !== 'operator' ? (
                      <ListItem key={resource.id} disablePadding>
                        <ListItemButton sx={{ paddingBlock: 0 }} onClick={() => handleDownload(resource)}>
                          <ListItemText secondary={resource.name} secondaryTypographyProps={{ fontSize: '0.8rem' }} />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      ''
                    )
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', paddingInline: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem' }}>Operators</p>
                    <Box sx={{ marginLeft: 'auto' }}>
                      <OperatorUploadButton orgId={repository.organizationId} repId={repository.id} onOperatorCreated={refreshResources} />
                    </Box>
                  </div>
                  {resources.map((resource) =>
                    resource.repositoryId === repository.id && resource.type === 'operator' ? (
                      <ListItem key={resource.id} disablePadding>
                        <ListItemButton sx={{ paddingBlock: 0 }}>
                          <ListItemText secondary={resource.name} secondaryTypographyProps={{ fontSize: '0.8rem' }} />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      ''
                    )
                  )}
                </>
              ) : (
                ''
              )
            )}
            <ListItem sx={{ justifyContent: 'center' }}>
              <Box sx={{ width: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CreateRepositoryButton orgId={organization.id} onRepositoryCreated={refreshRepositories} />
              </Box>
            </ListItem>
          </>
        ))}
      </List>
    </Drawer>
  );
}