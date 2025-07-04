import { configureStore } from '@reduxjs/toolkit';

import userReducer from '../slices/authSlice';
import adminReducer from '../slices/adminSlice';
import chatReducer from '@/redux/slices/chatSlice'
import storage from 'redux-persist/lib/storage';
import {persistReducer} from 'redux-persist';
import { combineReducers } from 'redux';
import { encryptor } from '@/utils/persister/persister';
import { injectStore } from '@/service/socket/socketService';

const persistConfig:any = ({
    key:'root',
    version:1,
    whitelist:['user','admin'],
    storage,
    transforms: [encryptor]
})

const reducers = combineReducers({
    user: userReducer,
    admin: adminReducer,
    chat: chatReducer
});

const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
        }
    }),
});

injectStore(store);

export type RootState = ReturnType <typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;