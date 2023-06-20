import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import './font.scss';

const GlobalStyles = createGlobalStyle`
${reset};

button{
  border:none;
  background: none;
}

`;

export default GlobalStyles;
