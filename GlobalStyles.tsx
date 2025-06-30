import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #E50914;
    --secondary: #B81D24;
    --black: #000000;
    --dark-gray: #141414;
    --medium-gray: #333333;
    --light-gray: #8C8C8C;
    --white: #FFFFFF;
    --error: #E87C03;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    background-color: var(--black);
    color: var(--white);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  button, input {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  button {
    cursor: pointer;
  }
  
  a {
    color: var(--white);
    text-decoration: none;
  }
  
  /* Estilizar scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--black);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--medium-gray);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--light-gray);
  }
  
  /* Animações globais */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  /* Classes de utilidade para animações */
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .slide-up {
    animation: slideUp 0.5s ease forwards;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
`;

export default GlobalStyles;
export {};

