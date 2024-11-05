import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { updateUser } from '../../../services/backendAPI';

export interface UploadButtonProps {
    orgId: string,
    onUserUpdated: () => void;
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

const UserUpdateButton = ({ orgId, onUserUpdated }: UploadButtonProps) => {
    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        setDisabled(true);
    
        const formData = new FormData(event.currentTarget);
        const userId = formData.get('UserId') as string;
        const userGroupsString = formData.get('UserGroups') as string;
        const userGroups = userGroupsString
            .split(',')             // Split the string by commas
            .map(group => group.trim())  // Trim each group
            .filter(group => group.length > 0); // Filter out any empty strings
    
    
        try {
            const result = await updateUser(orgId, userId, userGroups);
            console.log('User successfully updated:', result);
            onUserUpdated();
    
            handleClose();
        } catch (error) {
            console.error('Error uploading user:', error);
        }
    
        // Re-enable the submit button after submission is done
        setDisabled(false);
    };
    

    return (
        <div>
            <Button sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} onClick={handleOpen}>Update Users User Groups</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-repository"
                aria-describedby="modal-create-repository"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Update Users User Groups
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>User id</FormLabel>
                                <input type="string" name="UserId" />

                                <FormLabel>User Groups (separate with comma(,))</FormLabel>
                                <input type="string" name="UserGroups" />
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

export default UserUpdateButton;
