import { Button, Box, Modal, Typography, FormControl, FormLabel, TextField, Select, MenuItem } from '@mui/material';
import React from 'react';
import { putRepository } from '../../../services/backendAPI';


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

    const ownerTypes = ["user", "userGroup"];

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Disable the submit button to prevent multiple submissions
        setDisabled(true);

        const formData = new FormData(event.currentTarget);
        const repositoryName = formData.get("Name") as string;

        if (repositoryName) {
            try {
                const result = await putRepository(orgId, repositoryName);
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

                            <FormLabel>Owner </FormLabel>
                                <TextField
                                    name="owner"
                                    placeholder="Enter User.Id or UserGroup.Id"
                                    fullWidth
                                />

                               
                                <FormLabel>Owner Type</FormLabel>
                                <Select
                                    name="ownerType"
                                    labelId="ownerType-select-label"
                                    id="ownerType-select"
                                    sx={{ width: '100%' }}
                                >
                                    {ownerTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>

                               
                                <FormLabel>User Group</FormLabel>
                                <TextField
                                    name="userGroup"
                                    placeholder="Enter UserGroup.Id "
                                    sx={{ padding: "1px",  }}
                                    fullWidth
                                />

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
