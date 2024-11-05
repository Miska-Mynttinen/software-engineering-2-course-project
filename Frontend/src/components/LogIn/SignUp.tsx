import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
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
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

export default function SignUp({ toggleForm }: SignUpProps) {
  const [usernameError, setusernameError] = React.useState(false);
  const [usernameErrorMessage, setusernameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [organizationError, setOrganizationError] = React.useState(false);
  const [organizationErrorMessage, setOrganizationErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("ResourceType", "User");
    formData.append("UserStatus", "Active");
    formData.append("UserGroups", JSON.stringify([])); // This should be an empty array

    const jsonObject = {
        Username: formData.get('username') as string, // Make sure to get the value directly
        Password: formData.get('password') as string,
        Email: formData.get('email') as string,
        UserStatus: formData.get('UserStatus') as string,
        ResourceType: formData.get('ResourceType') as string,
        UserGroups: [],
        UserType: 'user'
    };

    console.log('Request Payload:', jsonObject);
    const organizationName = formData.get('organization') as string;

    try {
        // Match organization to the organizationName
        const resultGetOrganizations = await fetchOrganisations();
        const organizations = resultGetOrganizations?.result?.organizations || [];
        const organization = organizations.find((org: { name: string; }) => org.name === organizationName);

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
    const email = document.getElementById('email') as HTMLInputElement;
    const organization = document.getElementById('organization') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

    // Validate Full username
    if (!username.value || username.value.trim() === '') {
      setusernameError(true);
      setusernameErrorMessage('Full username is required.');
      isValid = false;
    } else {
      setusernameError(false);
      setusernameErrorMessage('');
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

    // Validate Organization
    if (!organization.value || organization.value.trim() === '') {
      setOrganizationError(true);
      setOrganizationErrorMessage('Organization is required.');
      isValid = false;
    } else {
      setOrganizationError(false);
      setOrganizationErrorMessage('');
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
            />
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
            />
            <TextField
              error={organizationError}
              helperText={organizationErrorMessage}
              id="organization"
              name="organization"
              label="Organization"
              placeholder="Your Organization"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={organizationError ? 'error' : 'primary'}
            />
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
            />
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
            />
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
            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
              Already have an account?{' '}
              <Link
                onClick={toggleForm} // Call toggleForm to switch to Sign In
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
