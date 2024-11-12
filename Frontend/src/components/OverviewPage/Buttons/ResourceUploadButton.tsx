import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React from 'react';
import { putResource } from '../../../services/backendAPI';

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
    const ownerTypes = ["user", "userGroup"];

    const [open, setOpen] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Disable the submit button to prevent multiple submissions
        setDisabled(true);

        const formData = new FormData(event.currentTarget);
        const formEntries = Object.fromEntries(formData.entries());

        console.log('Form Data:', formEntries);

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
                                    fullWidth
                                />

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
