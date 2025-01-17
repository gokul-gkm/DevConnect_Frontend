
import { Toaster } from 'react-hot-toast';

const CustomToaster = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#000', 
          color: '#fff', 
          border: '1px solid #444', 
        },
        success: {
          iconTheme: {
            primary: '#4caf50', 
            secondary: '#000',
          },
        },
        error: {
          iconTheme: {
            primary: '#f44336', 
            secondary: '#000',
          },
        },
      }}
      position="top-right" 
    />
  );
};

export default CustomToaster;
