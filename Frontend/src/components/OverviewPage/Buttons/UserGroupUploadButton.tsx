import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { ChangeEvent } from 'react';
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

    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        // Disable the submit button to prevent multiple submissions
        setDisabled(true);
    
        const formData = new FormData(event.currentTarget);
        const userGroup = formData.get('UserGroup') as string;
    
        try {
            const result = await putUserGroup(orgId, userGroup);
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
            <Button sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} onClick={handleOpen}>Add User Group</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-repository"
                aria-describedby="modal-create-repository"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                            Upload User Group
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>User Group</FormLabel>
                                <input type="string" name="UserGroup" />
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
