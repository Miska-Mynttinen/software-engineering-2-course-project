import { Box, Button, FormControl, FormLabel, Modal, TextField, Typography } from '@mui/material';
import React from 'react';
import { putRepository } from '../../../services/backendAPI';


export interface CreateRepositoryButtonProps {
    orgId: string,
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

const CreateRepositoryButton = ({ orgId }: CreateRepositoryButtonProps) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const repositoryName = formData.get("Name") as string

        if (repositoryName) {
            try {
                const result = await putRepository(orgId, repositoryName);
                console.log('repository successfully created:', result);
            } catch (error) {
                console.error('Error creating repository:', error);
            }
        } else {
            console.error('No repository name given.');
        }

        alert("Form Submitted");
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

                            <Button type="submit" sx={{ backgroundColor: "gray", padding: "1px", color: "black" }}>Submit</Button>
                        </form>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default CreateRepositoryButton;
