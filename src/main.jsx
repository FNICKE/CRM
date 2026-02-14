import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // 1. Added PersistGate
import { store, persistor } from './store';                 // 2. Added persistor
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Wrap the App in Provider first */}
    <Provider store={store}>
      {/* 4. Wrap with PersistGate to delay rendering until local data is loaded */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);