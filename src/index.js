import React from 'react';
import { render } from 'react-dom';
import { injectGlobal, ThemeProvider } from 'styled-components';

import App from './App';
import theme from './theme';

import './styles/index.scss';
// import vs injectGlobal?
// injectGlobal(require('./styles/_normalize.scss'));

render(
	<ThemeProvider theme={theme}>
		<App/>
	</ThemeProvider>,
	document.getElementById('dragEl')
);