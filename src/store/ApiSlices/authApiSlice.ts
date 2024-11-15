import { METHODS } from "http";
import baseQueryWithReauth, { baseUrl } from "../baseQueryWithReAuth";
import { createApi } from '@reduxjs/toolkit/query/react';

interface signInpayload {
    username: string;
    password: string;
}


const authApiSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['auth'],
    endpoints: (builder) => ({
        login: builder.mutation<any, signInpayload>({
            query: (body) => ({
                url: `${baseUrl}/user/login`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
} = authApiSlice;

export default authApiSlice;
