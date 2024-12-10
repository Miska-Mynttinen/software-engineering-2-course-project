import { Box, Button, FormControl, FormLabel, Modal, Select, MenuItem, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { putUserGroup } from '../../../services/backendAPI';

export interface UploadButtonProps {
    orgId: string,
    onUserGroupCreated: () => void;
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

const UserGroupUploadButton = ({ orgId, onUserGroupCreated }: UploadButtonProps) => {

    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [userGroup, setUserGroup] = useState(""); // User Group input value

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Disable the submit button to prevent multiple submissions
        setDisabled(true);

        try {
            const result = await putUserGroup(orgId, userGroup); // Pass the user group directly
            console.log('User Group successfully uploaded:', result);
            onUserGroupCreated();
            handleClose();
        } catch (error) {
            console.error('Error uploading userGroup:', error);
        }

        // Re-enable the submit button after submission is done
        setDisabled(false);
    };

    return (
        <div>
            <Button sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} onClick={handleOpen}>
                Add User Group
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-user-group"
                aria-describedby="modal-create-user-group"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Create New User Group
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="dense">
                                <FormLabel>User Group</FormLabel>
                                <TextField
                                    required
                                    name="UserGroup"
                                    value={userGroup}
                                    onChange={(e) => setUserGroup(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                />
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

export default UserGroupUploadButton;
