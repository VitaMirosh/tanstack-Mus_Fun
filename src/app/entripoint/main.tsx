import {createRoot} from 'react-dom/client'
import '../styles/index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import {createRouter, RouterProvider} from '@tanstack/react-router';
import { routeTree } from '../routeTree.gen.ts'

const router = createRouter({routeTree})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      retry:0,
      staleTime:5*1000,
      retryOnMount:false,
      refetchOnMount:false,
      refetchOnWindowFocus:false,
      refetchOnReconnect:false,
      gcTime:5*1000
    }
  }
})

createRoot(document.getElementById('root')!).render(
 <QueryClientProvider client={queryClient}>
   <RouterProvider router={router} />
   <ReactQueryDevtools initialIsOpen={false} />
 </QueryClientProvider>


)
