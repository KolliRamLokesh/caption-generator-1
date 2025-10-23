import React from 'react';

const LoginStyles = () => (
  <style>{`
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(to right, #74ebd5, #ACB6E5) !important;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .login-container {
      background-color: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      width: 300px;
      text-align: center;
    }

    .login-container h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .login-container input[type="text"], 
    .login-container input[type="password"] {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
    }

    .login-container button {
      width: 100%;
      padding: 10px;
      background-color: #4CAF50;
      border: none;
      color: white;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .login-container button:hover {
      background-color: #45a049;
    }

    .login-container .link {
      margin-top: 15px;
      font-size: 14px;
    }

    .login-container .link a {
      color: #007BFF;
      text-decoration: none;
      cursor: pointer;
    }

    .login-container .link a:hover {
      text-decoration: underline;
    }
  `}</style>
);

interface LoginPageProps {
    onLogin: () => void;
    onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would perform authentication here.
    // For this demo, we'll just proceed to the main app.
    onLogin();
  };
  
  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    onSwitchToSignup();
  };

  return (
    <>
      <LoginStyles />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <div className="link">
          <p>Don't have an account? <a href="#" onClick={handleSwitch}>Sign up</a></p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
