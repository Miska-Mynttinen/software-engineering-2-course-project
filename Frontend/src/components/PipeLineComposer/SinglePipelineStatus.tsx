import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';

interface Step {
  executionTime: string;
  executionerPeer: string;
  stepId: string;
  stepState: string;
  stepType: string;
}

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
  const getStepStatus = (step: Step) => step.stepState === 'Completed';

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" align="center" gutterBottom>
        {pipeline.pipelineName || 'Pipeline Name not found'}
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Ticket ID: {pipeline.ticketId}
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Current Status: {pipeline.status}
      </Typography>

      <Stepper
        activeStep={pipeline.steps.findIndex((step) => step.stepState !== 'Completed')}
        alternativeLabel
        sx={{ mt: 3, width: '100%' }}
      >
        {pipeline.steps.map((step) => (
          <Step key={step.stepId} completed={getStepStatus(step)}>
            <StepLabel>{step.stepType}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default SinglePipelineStatus;
