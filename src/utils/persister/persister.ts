import { encryptTransform } from 'redux-persist-transform-encrypt';

export const encryptor = encryptTransform({
  secretKey: import.meta.env.VITE_APP_PERSISTER_KEY,
  onError: function (error: Error) {
    console.error("Encryption error : ",error);
  },
});