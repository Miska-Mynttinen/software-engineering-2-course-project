import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Select, Typography, Checkbox, ListItemText } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { updateUser } from '../../../services/backendAPI';
import { UserGroup } from '../../../redux/states/apiState';
import { SelectChangeEvent } from '@mui/material';

export interface UploadButtonProps {
    orgId: string,
    userId: string,
    userGroups: UserGroup[]
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

const UserUpdateButton = ({ orgId, userId, userGroups, onUserUpdated }: UploadButtonProps) => {
    const [open, setOpen] = React.useState(false);
    const [selectedUserGroups, setSelectedUserGroups] = React.useState<string[]>([]);
    const [disabled, setDisabled] = React.useState(false);

    const availableUserGroups = userGroups.filter(userGroup => userGroup.organizationId === orgId).map(userGroup => userGroup.name);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelect = (event: SelectChangeEvent<string[]>) => {
        setSelectedUserGroups(event.target.value as string[]);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setDisabled(true);

        try {
            const result = await updateUser(orgId, userId, selectedUserGroups);
            console.log('User successfully updated:', result);
            onUserUpdated();

            handleClose();
        } catch (error) {
            console.error('Error uploading user:', error);
        }

        setDisabled(false);
    };

    return (
        <div>
            <Button sx={{ backgroundColor: "gray", padding: "1px", color: "black" }} onClick={handleOpen}>
                Update User Groups
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-create-repository"
                aria-describedby="modal-create-repository"
            >
                <Box sx={style}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'black' }}>
                            Update User Groups
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>User Groups</FormLabel>
                                <Select
                                    multiple
                                    value={selectedUserGroups}
                                    onChange={handleSelect}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {availableUserGroups.map((group) => (
                                        <MenuItem key={group} value={group}>
                                            <Checkbox checked={selectedUserGroups.includes(group)} />
                                            <ListItemText primary={group} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                disabled={disabled}
                                type="submit"
                                sx={{
                                    backgroundColor: "gray",
                                    padding: "1px",
                                    color: disabled ? "lightgray" : "black",
                                    width: '100%',
                                }}
                            >
                                {disabled ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default UserUpdateButton;
