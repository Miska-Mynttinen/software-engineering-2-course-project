import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

// Define the toggleForm prop type
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

  const [usernameError, setusernameError] = React.useState(false);
  const [usernameErrorMessage, setusernameErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (usernameError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    
    const username = data.get('username');
    const password = data.get('password');

    if (username === 'admin' && password === 'admin1!') {
      navigate('/admin');
    } else if (username === 'user' && password === 'user1!') {
      navigate('/user');
    } else {
      alert('Invalid username or password');
    }
  };

  const validateInputs = () => {
    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

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
      setPasswordErrorMessage('Password must be 6 characters long, including a number and special character');
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

          <Typography
            component="h1"
            variant="h6"
            sx={{ width: '100%', fontSize: '1.25rem', textAlign: 'left'  }}
          >
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 1.5,
            }}
          >
            <TextField
              error={usernameError}
              helperText={usernameErrorMessage}
              id="username"
              type="username"
              name="username"
              label="username"
              placeholder="Username"
              autoComplete="username"
              autoFocus
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
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              size="small"
              color={passwordError ? 'error' : 'primary'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
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
                onClick={toggleForm} // Call toggleForm to switch to Sign Up
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  color: '#1a73e8',
                  fontSize: '0.75rem',
                }}
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

