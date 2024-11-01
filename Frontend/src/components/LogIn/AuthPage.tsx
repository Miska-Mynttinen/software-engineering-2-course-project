
import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function AuthPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  const toggleForm = () => setShowSignIn(!showSignIn);

  return showSignIn ? <SignIn toggleForm={toggleForm} /> : <SignUp toggleForm={toggleForm} />;
}
