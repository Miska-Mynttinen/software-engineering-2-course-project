import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface Step {
  executionTime: string;
  executionerPeer: string;
  stepId: string;
  stepState: string;
  stepType: string;
}

// Define the type for the pipeline prop
interface SinglePipelineStatusProps {
  pipeline: {
    ticketId: string;
    pipelineId: string;
    pipelineName: string;
    steps: Step[];
    status: 'Not Started' | 'Running' | 'Completed';
  };
}

const SinglePipelineStatus: React.FC<SinglePipelineStatusProps> = ({ pipeline }) => {
  // Define a function to determine if a step is completed based on the status
  const isCompleted = (step: Step) => {
    return step.stepState === 'Completed';
  };

  // Define a function to get the status of each step (active or inactive)
  const getStatusColor = (step: Step) => {
    return isCompleted(step) ? 'green' : 'grey';
  };

  // Function to determine if the connector line should be green or grey
  const isConnectorActive = (index: number) => {
    return pipeline.steps[index].stepState === 'Completed';
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" align="center">{pipeline.pipelineName || "Pipeline Name not found"}</Typography>
      <Typography variant="body1" align="center">Ticket ID: {pipeline.ticketId}</Typography>
      <Typography variant="body1" align="center">Current Status: {pipeline.ticketId}</Typography>

      {/* Display status steps horizontally with ticks */}
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {pipeline.steps.map((step, index) => (
          <Box key={`${pipeline.pipelineId}-${index}`} sx={{ display: 'flex', alignItems: 'center' }}>
            {isCompleted(step) ? (
              <CheckCircleIcon sx={{ color: 'green', mr: index < 2 ? 0.5 : 0 }} /> // Green tick for completed steps
            ) : (
              <RadioButtonUncheckedIcon sx={{ color: 'grey', mr: index < 2 ? 0.5 : 0 }} /> // Grey empty circle for pending steps
            )}
            <Typography variant="h6" sx={{ color: getStatusColor(step), mx: 1 }}>
              {step.stepType}
            </Typography>
            {/* Add connector between steps */}
            {index < 2 && (
              <Box sx={{
                width: 40,
                height: 2,
                bgcolor: isConnectorActive(index) ? 'green' : 'grey', // Change the connector color based on the status
                ml: -0.5
              }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SinglePipelineStatus;
