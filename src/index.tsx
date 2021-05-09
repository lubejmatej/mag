import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBundary/ErrorBundary';
import FilesContextProvider from './providers/FilesProvider';

var mountNode = document.getElementById('app');
ReactDOM.render(
  <ErrorBoundary>
    <FilesContextProvider>
      <App />
    </FilesContextProvider>
  </ErrorBoundary>,
  mountNode
);
