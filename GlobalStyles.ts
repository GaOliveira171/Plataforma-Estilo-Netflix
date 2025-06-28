import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary: #E50914;
    --secondary: #DB0000;
    --black: #000000;
    --dark-gray: #141414;
    --medium-gray: #333333;
    --light-gray: #808080;
    --white: #FFFFFF;
    --overlay: rgba(0, 0, 0, 0.7);
    --error: #FF5555;
    --success: #2ECC71;
  }

  body {
    background-color: var(--black);
    color: var(--white);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  body, html, #root {
    height: 100%;
  }

  button {
    cursor: pointer;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
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
`;

