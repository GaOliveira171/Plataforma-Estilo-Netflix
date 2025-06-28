import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routes from './routes';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <Routes />
    </AuthProvider>
  );
}

export default App;

