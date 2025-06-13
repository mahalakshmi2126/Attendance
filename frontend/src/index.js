  // import React from 'react';
  // import ReactDOM from 'react-dom/client';
  // import './index.css';
  // import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
  // import { BrowserRouter } from 'react-router-dom';
  // import Routers from './Folder/Routes';

  // const queryClient = new QueryClient()

  // const root = ReactDOM.createRoot(document.getElementById('root'));
  // root.render(
  //   <React.StrictMode>

  //     <QueryClientProvider client={queryClient}>
  //       <BrowserRouter>
  //         <Routers />
  //       </BrowserRouter>
  //     </QueryClientProvider>
  //   </React.StrictMode>
  // );


 // index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Routers from './pages/Routes';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
        <BrowserRouter>
          <Routers />
          <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  </React.StrictMode>
);
