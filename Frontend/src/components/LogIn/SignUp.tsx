import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { fetchOrganisations, putUser } from '../../services/backendAPI';

// Define the SignUpProps interface to include toggleForm
interface SignUpProps {
  toggleForm: () => void;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(1.5),
  gap: theme.spacing(1),
  margin: 'auto',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '350px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  backgroundImage: 'url(/lg.jpg)', // Reference image from the public folder
  backgroundSize: 'cover', // Ensures the image covers the container
  backgroundPosition: 'center', // Centers the image
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

// Autofill styling to prevent blue background after autofill
const autofillStyles = {
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0px 1000px #1e1e1e inset', // Matches dark background
    WebkitTextFillColor: '#fff', // Ensure text remains white
    transition: 'background-color 5000s ease-in-out 0s', // Remove blue color transition
  },
};

export default function SignUp({ toggleForm }: SignUpProps) {
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [organizationError, setOrganizationError] = useState(false);
  const [organizationErrorMessage, setOrganizationErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const result = await fetchOrganisations();
        const orgList = result?.result?.organizations || [];
        setOrganizations(orgList);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
    loadOrganizations();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const jsonObject = {
      Username: formData.get('username') as string,
      Password: formData.get('password') as string,
      Email: formData.get('email') as string,
      UserStatus: 'Active',
      ResourceType: 'User',
      UserGroups: [],
      UserType: 'user',
    };

    try {
      const organization = organizations.find((org) => org.name === selectedOrganization);
      if (!organization) throw new Error('Selected organization not found.');

      const resultPostUser = await putUser(organization.id, jsonObject);
      console.log('User successfully uploaded:', resultPostUser);
      alert('User successfully uploaded');
      toggleForm();
    } catch (error) {
      console.error('Error uploading user:', error);
      alert(`Error uploading user: ${error}`);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;


    if (!selectedOrganization) {
      setOrganizationError(true);
      setOrganizationErrorMessage('Organization is required.');
      isValid = false;
    } else {
      setOrganizationError(false);
      setOrganizationErrorMessage('');
    }

  
    if (!username.value || username.value.trim() === '') {
      setUsernameError(true);
      setUsernameErrorMessage('Please enter a valid username.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

     // Validate Email
     if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Validate Password
    if (!password.value || password.value.length < 6 || !/\d/.test(password.value) || !/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be 6 characters long, including a number and special character');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // Validate Confirm Password
    if (confirmPassword.value !== password.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('Passwords do not match.');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography
            variant="h6"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              marginBottom: 1,
              color: '#FFFFFF',
            }}
          >
            DAPM
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            sx={{ width: '100%', fontSize: '1.25rem', textAlign: 'left' }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            {/* Username Field */}
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              name="username"
              label="Full username"
              placeholder="Jon Snow"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={usernameError ? 'error' : 'primary'}
              sx={autofillStyles} // Apply autofill styling here
            />

            {/* Email Field */}
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              label="Email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={emailError ? 'error' : 'primary'}
              sx={autofillStyles} // Apply autofill styling here
            />

            {/* Organization Dropdown */}
            <FormControl fullWidth size="small" error={organizationError}>
              <InputLabel id="organization-label">Organization</InputLabel>
              <Select
                labelId="organization-label"
                id="organization"
                name="organization"
                value={selectedOrganization}
                onChange={(e) => {
                  setSelectedOrganization(e.target.value);
                  setOrganizationError(false);
                  setOrganizationErrorMessage('');
                }}
                required
              >
                {organizations.map((org) => (
                  <MenuItem key={org.id} value={org.name}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
              {organizationError && (
                <Typography variant="caption" color="error">
                  {organizationErrorMessage}
                </Typography>
              )}
            </FormControl>

            {/* Password Field */}
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="••••••"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={passwordError ? 'error' : 'primary'}
              sx={autofillStyles} // Apply autofill styling here
            />

            {/* Confirm Password Field */}
            <TextField
              error={confirmPasswordError}
              helperText={confirmPasswordErrorMessage}
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={confirmPasswordError ? 'error' : 'primary'}
              sx={autofillStyles} // Apply autofill styling here
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#1a73e8',
                color: 'white',
                fontWeight: 'bold',
                padding: theme.spacing(0.75),
                fontSize: '0.875rem',
              }}
            >
              SIGN UP
            </Button>

            {/* Toggle to Sign In */}
            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
              Already have an account?{' '}
              <Link
                onClick={toggleForm}
                variant="body2"
                sx={{ cursor: 'pointer', color: '#1a73e8', fontSize: '0.75rem' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </ThemeProvider>
  );
}
