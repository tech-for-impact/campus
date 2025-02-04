import { createRoot } from 'react-dom/client';
//import AppExample from './examples/AppExample.jsx';
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider 추가
import AppLayout from './components/Layout/AppLayout.jsx';
import { UserProvider } from './utils/UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <ChakraProvider>
      <AppLayout />
    </ChakraProvider>
  </UserProvider>
);
