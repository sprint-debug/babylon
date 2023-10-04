import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import './font.scss';


const GlobalStyles = createGlobalStyle`
${reset};
body {
  margin: 0px;
}

`;

export default GlobalStyles;
