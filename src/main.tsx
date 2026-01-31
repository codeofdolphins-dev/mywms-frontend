import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import store from './store/store';


import 'react-perfect-scrollbar/dist/css/styles.css';
import './tailwind.css';
import 'sweetalert2/dist/sweetalert2.min.css';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={ store }>
      <QueryClientProvider client={queryClient} >
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
