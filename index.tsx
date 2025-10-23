import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoginPage from './loginpage';
import SignupPage from './SignupPage';

type AuthView = 'login' | 'signup';

const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleSignup = () => {
    // For this demo, successfully signing up also logs the user in.
    setIsLoggedIn(true);
  };

  const switchToSignup = () => {
    setAuthView('signup');
  };

  const switchToLogin = () => {
    setAuthView('login');
  };

  if (isLoggedIn) {
    return <App />;
  }

  if (authView === 'signup') {
    return <SignupPage onSignup={handleSignup} onSwitchToLogin={switchToLogin} />;
  }
  
  return <LoginPage onLogin={handleLogin} onSwitchToSignup={switchToSignup} />;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
