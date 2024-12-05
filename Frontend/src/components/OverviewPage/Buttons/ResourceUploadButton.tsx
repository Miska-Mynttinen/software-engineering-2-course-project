import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { putResource } from '../../../services/backendAPI';
import { getOrganizations, getUserGroups, getUsers } from '../../../redux/selectors/apiSelector';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Organization } from '../../../redux/states/apiState';
import { organizationThunk, userGroupThunk, userThunk } from '../../../redux/slices/apiSlice';

export interface UploadButtonProps {
    orgId: string,
    repId: string,
    onResourceCreated: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ResourceUploadButton = ({ orgId, repId, onResourceCreated }: UploadButtonProps) => {

    const dataTypes = ["eventLog", "bpmnModel", "petriNet"];
    const [ownerError, setOwnerError] = React.useState<string | null>(null);
    const [groupError, setGroupError] = React.useState<string | null>(null);
    const [ownerTypeError, setownerTypeError] = React.useState<string | null>(null);

    const users = useAppSelector(getUsers); // List of users
    const userGroups = useAppSelector(getUserGroups); // List of user groups
    

    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);

    const dispatch = useAppDispatch()
    const organizations: Organization[] = useAppSelector(getOrganizations)

    useEffect(() => {
      dispatch(organizationThunk())
      dispatch(userThunk(organizations));
      dispatch(userGroupThunk(organizations));
    }, [dispatch]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setOwnerError(null);
        setGroupError(null);
        setownerTypeError(null); // Reset error on modal close
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Disable the submit button to prevent multiple submissions
        setDisabled(true);

        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData.entries());

        console.log('Form Data:', formEntries);

        const userGroup = formData.get("userGroup") as string;
        const ownerType = formData.get("ownerType") as string;
        const owner = formData.get("owner") as string;

        const validUserGroups = userGroups
            .filter(group => group.organizationId === orgId)
            .map(group => group.name);

        const validUsers = users
            .filter(user => user.organizationId === orgId)
            .map(user => user.userId);

        // Validate owner: check if it exists in validUsers (userId) or validUserGroups (name)
        const isOwnerValid = validUsers.includes(owner) || validUserGroups.includes(owner);

        // Validate userGroup: check if it exists in validUserGroups
        const isUserGroupValid = !userGroup || validUserGroups.includes(userGroup); // userGroup is optional

        if (!isOwnerValid) {
            setOwnerError('The entered owner does not exist in the organization.');
        } else {
            setOwnerError(null);
        }

        if (!isUserGroupValid) {
            setGroupError('The entered user group does not exist in the organization.');
        } else {
            setGroupError(null);
        }

        // Stop submission if any error exists
        if (!isOwnerValid || !isUserGroupValid) {
            setDisabled(false);
            return;
        }

        if (formData.get('ResourceFile')) {
            try {
                const result = await putResource(orgId, repId, formData);
                console.log('Resource successfully uploaded:', result);
                onResourceCreated();

                handleClose();
            } catch (error) {
                console.error('Error uploading resource:', error);
            }
        } else {
            console.error('No file selected.');
        }

        alert("Form Submitted");

        // Re-enable the submit button after submission is done
        setDisabled(false);
    };

    return (
        <div>
            <Button sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} onClick={handleOpen}>+</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-repository"
                aria-describedby="modal-create-repository"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Upload Resource
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>Resource name</FormLabel>
                                <TextField name="Name" />

                                <FormLabel>Resource type</FormLabel>
                                <Select
                                    name="ResourceType"
                                    labelId="resourceType-select-lable"
                                    id="resourceType-select"
                                    sx={{ width: '100%' }}>
                                    {dataTypes.map((resource) => <MenuItem value={resource}>{resource}</MenuItem>)}
                                </Select>

                               
                                <FormControl fullWidth margin="normal">
                                <FormLabel>Owner name</FormLabel>
                                <TextField
                                    name="owner"
                                    placeholder="Enter User.Id or UserGroup.Id"
                                    fullWidth
                                    required
                                />
                                {ownerError && (
                                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                        {ownerError}
                                    </Typography>
                                )}
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <FormLabel>Owner Type</FormLabel>
                                <TextField
                                    name="ownerType"
                                    placeholder="Enter User.Id or UserGroup.Id"
                                    fullWidth
                                    required
                                />
                                {ownerTypeError && (
                                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                        {ownerTypeError}
                                    </Typography>
                                )}
                            </FormControl>

                                <FormControl fullWidth margin="normal">
                                <FormLabel>User Group name</FormLabel>
                                <TextField
                                    name="userGroup"
                                    placeholder="Enter UserGroup.Id"
                                    fullWidth
                                />
                                {groupError && (
                                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                        {groupError}
                                    </Typography>
                                )}
                                 </FormControl>

                                <FormLabel>Upload File</FormLabel>
                                <input type="file" name="ResourceFile" />
                            </FormControl>

                            <Button 
                                disabled={disabled}
                                type="submit" 
                                sx={{ backgroundColor: "gray", padding: "1px", color: disabled ? "lightgray" : "black" }}
                            >
                                {disabled ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default ResourceUploadButton;
