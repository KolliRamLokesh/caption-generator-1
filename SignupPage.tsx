import React from 'react';

const SignupStyles = () => (
  <style>{`
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(to right, #FFDEE9, #B5FFFC) !important;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .signup-container {
      background-color: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      width: 300px;
      text-align: center;
    }

    .signup-container h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .signup-container input[type="text"], 
    .signup-container input[type="password"], 
    .signup-container input[type="email"] {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-sizing: border-box;
    }

    .signup-container button {
      width: 100%;
      padding: 10px;
      background-color: #FF4B2B;
      border: none;
      color: white;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .signup-container button:hover {
      background-color: #FF416C;
    }

    .signup-container .link {
      margin-top: 15px;
      font-size: 14px;
    }

    .signup-container .link a {
      color: #007BFF;
      text-decoration: none;
      cursor: pointer;
    }

    .signup-container .link a:hover {
      text-decoration: underline;
    }
  `}</style>
);

interface SignupPageProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would create a user account here.
    // For this demo, we'll just proceed to the main app.
    onSignup();
  };

  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    onSwitchToLogin();
  };

  return (
    <>
      <SignupStyles />
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Sign Up</button>
        </form>
        <div className="link">
          <p>Already have an account? <a href="#" onClick={handleSwitch}>Login</a></p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
