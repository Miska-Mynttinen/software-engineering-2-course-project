import { Button, Box, Modal, Typography, FormControl, FormLabel, TextField, Select, MenuItem } from '@mui/material';
import React from 'react';
import { putRepository } from '../../../services/backendAPI';
import { useAppSelector } from '../../../hooks';
import { getUserGroups, getUsers } from '../../../redux/selectors/apiSelector';



export interface CreateRepositoryButtonProps {
    orgId: string,
    onRepositoryCreated: () => void;
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

const CreateRepositoryButton = ({ orgId , onRepositoryCreated }: CreateRepositoryButtonProps) => {
    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [ownerError, setOwnerError] = React.useState<string | null>(null);
    const [groupError, setGroupError] = React.useState<string | null>(null);
    const [ownerTypeError, setownerTypeError] = React.useState<string | null>(null);

    const users = useAppSelector(getUsers); // List of users
    const userGroups = useAppSelector(getUserGroups); // List of user groups
    
    const ownerTypes = ["user", "userGroup"];

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
        const repositoryName = formData.get("Name") as string;
        const formEntries = Object.fromEntries(formData.entries());
        const owner = formData.get("owner") as string;
        const userGroup = formData.get("userGroup") as string;
        const ownerType = formData.get("ownerType") as string;

        console.log('Form Data:', formEntries);

        const validUserGroups = userGroups
            .filter(group => group.organizationId === orgId)
            .map(group => group.name);

        const validUsers = users
            .filter(user => user.organizationId === orgId)
            .map(user => user.userId);

            // Validate owner: check if it exists in validUsers (userId) or validUserGroups (name)
        const isOwnerTypeValid = validUsers.includes(ownerType) || validUserGroups.includes(ownerType);
    
        // Validate owner: check if it exists in validUsers (userId) or validUserGroups (name)
        const isOwnerValid = validUsers.includes(owner) || validUserGroups.includes(owner);

        // Validate userGroup: check if it exists in validUserGroups
        const isUserGroupValid = !userGroup || validUserGroups.includes(userGroup); // userGroup is optional

        

        if (!isOwnerTypeValid) {
            setOwnerError('The entered owner type does not exist in the organization.');
        } else {
            setownerTypeError(null);
        }

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
        if (!isOwnerValid || !isUserGroupValid || !isOwnerTypeValid) {
            setDisabled(false);
            return;
        }

        if (repositoryName) {
            try {
                const result = await putRepository(orgId, repositoryName, formData);
                console.log('Repository successfully created:', result);
                 // Call the callback function to refresh the page
                onRepositoryCreated();

                 // Close modal after submission
                 handleClose();
            } catch (error) {
                console.error('Error creating repository:', error);
            }
        } else {
            console.error('No repository name given.');
        }

        //alert("Form Submitted");

        // Re-enable the submit button after submission is done
        setDisabled(false);
    };

    return (
        <div>
            <Button onClick={handleOpen}>Add Repository</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-repository"
                aria-describedby="modal-create-repository"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Create repository
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>Repository name</FormLabel>
                                <TextField name="Name" />
                            </FormControl>

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

                            <Button 
                                disabled={disabled} 
                                type="submit" 
                                sx={{ backgroundColor: "gray", padding: "1px", color: disabled ? "lightgray" : "black",mt: 2 }}
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

export default CreateRepositoryButton;
