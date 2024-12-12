import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { putUser } from '../../../services/backendAPI';

export interface UploadButtonProps {
    orgId: string,
    onUserCreated: () => void;
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

const UserUploadButton = ({ orgId, onUserCreated }: UploadButtonProps) => {

    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [userType, setUserType] = React.useState('user'); // Default value is 'user'

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Fix: Updated the type of event to SelectChangeEvent<string>
    const handleUserTypeChange = (event: SelectChangeEvent<string>) => {
        setUserType(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Disable the submit button to prevent multiple submissions
        setDisabled(true);

        const formData = new FormData(event.currentTarget);
        formData.append("ResourceType", "User");
        formData.append("UserStatus", "Active");
        formData.append("UserGroups", JSON.stringify([])); // This should be an empty array

        // Build the JSON object
        const jsonObject = {
            Username: formData.get('Username') as string,
            Password: formData.get('Password') as string,
            Email: formData.get('Email') as string,
            UserStatus: formData.get('UserStatus') as string,
            ResourceType: formData.get('ResourceType') as string,
            UserGroups: [],
            UserType: userType // Ensure this field is set correctly from the dropdown
        };

        console.log('Request Payload:', JSON.stringify(jsonObject)); // Log the payload

        try {
            const result = await putUser(orgId, jsonObject); // Adjust putUser to accept jsonObject
            console.log('User successfully uploaded:', result);
            onUserCreated();

            handleClose();
        } catch (error) {
            console.error('Error uploading user:', error);
        }

        // Re-enable the submit button after submission is done
        setDisabled(false);
    };

    return (
        <div>
            <Button sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} onClick={handleOpen}>Add user</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-repository"
                aria-describedby="modal-create-repository"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Create New User/Admin
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>Username</FormLabel>
                                <TextField
                                    required
                                    name="Username"
                                    type="string"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense" // Use "dense" instead of "normal"
                                />

                                <FormLabel>Password</FormLabel>
                                <TextField
                                    required
                                    name="Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense" // Use "dense" instead of "normal"
                                />

                                <FormLabel>Email</FormLabel>
                                <TextField
                                    required
                                    name="Email"
                                    type="email"
                                    variant="outlined"
                                    fullWidth
                                    margin="none" // Use "dense" instead of "normal"
                                />

                                <FormLabel>User type</FormLabel>
                                <Select
                                    name="UserType"
                                    value={userType}
                                    onChange={handleUserTypeChange}
                                    fullWidth
                                    variant="outlined"
                                    margin="none" // This margin is fine here for Select
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
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

export default UserUploadButton;
