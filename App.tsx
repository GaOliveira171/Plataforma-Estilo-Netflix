import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Routes from './routes';
import GlobalStyles from './styles/GlobalStyles';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <PageTransition>
        <Routes />
      </PageTransition>
    </AuthProvider>
  );
}

export default App;

