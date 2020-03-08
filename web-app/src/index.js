import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CookiesProvider } from 'react-cookie'; 
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const appTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#E58F65',
        },
        secondary: {
            main: '#F9E784',
        },
    },
})

function Root() {
    return (
        <CookiesProvider>
            <ThemeProvider theme={appTheme}>
                <App/>
            </ThemeProvider>
        </CookiesProvider>
    )
}
ReactDOM.render(<Root/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
