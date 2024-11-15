import {configureStore} from '@reduxjs/toolkit';
import employeeApiSlice from './ApiSlices/EmployeeApiSlices';
import authApiSlice from './ApiSlices/authApiSlice';
import authReducer from './reducers/authReducer';


export const store = configureStore({
    reducer: {
        [employeeApiSlice.reducerPath]: employeeApiSlice.reducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,

        auth: authReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            employeeApiSlice.middleware,
            authApiSlice.middleware,
        ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

