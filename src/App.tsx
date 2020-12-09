import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Metrics from './Features/Metrics/Metrics';

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#242D3D',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Wrapper>
        <Header />
        <div style={{paddingTop:"10px", margin:"20px"}}>
        <Metrics/>
        </div>
      </Wrapper>
    </Provider>
  </MuiThemeProvider>
);

export default App;
