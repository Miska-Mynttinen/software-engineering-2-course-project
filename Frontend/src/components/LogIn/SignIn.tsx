import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { loginUser, fetchOrganisations } from '../../services/backendAPI';
import { LoginRequest } from '../../redux/states/apiState';

interface SignInProps {
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
  padding: theme.spacing(2),
  gap: theme.spacing(1.5),
  margin: 'auto',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '380px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2),
  },
  backgroundColor: theme.palette.background.default,
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function SignIn({ toggleForm }: SignInProps) {
  const navigate = useNavigate();
  const [usernameError, setusernameError] = useState(false);
  const [usernameErrorMessage, setusernameErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [organizationError, setOrganizationError] = useState(false);
  const [organizationErrorMessage, setOrganizationErrorMessage] = useState('');
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const result = await fetchOrganisations();
        setOrganizations(result?.result?.organizations || []);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
    loadOrganizations();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!validateInputs()) return;
  
    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
  
    try {
      const selectedOrg = organizations.find((org) => org.name === selectedOrganization);
  
      if (!selectedOrg) {
        setOrganizationError(true);
        setOrganizationErrorMessage('Please select a valid organization.');
        return;
      }
  
      const loginRequest: LoginRequest = {
        username,
        password,
        organizationId: selectedOrg.id,
      };
  
      const response = await loginUser(loginRequest); // Pass the entire loginRequest
  
      if (response && response.token) {
        // Navigate based on the role or other conditions
        localStorage.setItem('token', response.token);
        response.userType ="user";
        if(response.userType==="user"){
          navigate('/user');
        }
        if(response.userType==="admin"){
          navigate('/admin');
        }     
        
        return;
      }
    } catch (error) {
      alert('Login failed. Please check your credentials and try again.');
    }
  };
  

  const validateInputs = () => {
    let isValid = true;

    if (!selectedOrganization) {
      setOrganizationError(true);
      setOrganizationErrorMessage('Organization is required.');
      isValid = false;
    } else {
      setOrganizationError(false);
      setOrganizationErrorMessage('');
    }

    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    if (!username.value) {
      setusernameError(true);
      setusernameErrorMessage('Please enter a valid username.');
      isValid = false;
    } else {
      setusernameError(false);
      setusernameErrorMessage('');
    }

    if (!password.value || password.value.length < 6 || !/\d/.test(password.value) || !/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be 6 characters long, including a number and special character.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography
            variant="h5"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.75rem',
              marginBottom: 1,
              color: '#FFFFFF',
            }}
          >
            DAPM
          </Typography>

          <Typography component="h1" variant="h6" sx={{ width: '100%', fontSize: '1.25rem', textAlign: 'left' }}>
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.5 }}
          >
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              name="username"
              label="Username"
              placeholder="Username"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={usernameError ? 'error' : 'primary'}
            />
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              label="Password"
              placeholder="••••••"
              type="password"
              id="password"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={passwordError ? 'error' : 'primary'}
            />
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#1a73e8',
                color: 'white',
                padding: theme.spacing(0.75),
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              SIGN IN
            </Button>
            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem' }}>
              Don&apos;t have an account?{' '}
              <Link
                onClick={toggleForm}
                variant="body2"
                sx={{ cursor: 'pointer', color: '#1a73e8', fontSize: '0.75rem' }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </ThemeProvider>
  );
}
