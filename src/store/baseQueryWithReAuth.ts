// store/baseQueryWithReauth.ts
import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

export const baseUrl = 'http://localhost:8080/api/v1';
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token || localStorage.getItem("token"); 
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  //await mutex.waitForUnlock();
  const result = await baseQuery(args, api, extraOptions);

  // if (result.error && result.error.status === 401) {
  //   if (!mutex.isLocked()) {
  //     const release = await mutex.acquire();

  //     try {
  //       const refreshResult = await baseQuery(
  //         {
  //           url: '/auth/refresh-token', // Endpoint to refresh the token
  //           method: 'POST',
  //           body: { token: (api.getState() as any).auth.refreshToken }, // Adjust this based on your auth state
  //         },
  //         api,
  //         extraOptions
  //       );

  //       if (refreshResult.data) {
  //         const newToken = (refreshResult.data as any).token; // Adjust to match your refresh token response
  //         api.dispatch({ type: 'auth/tokenReceived', payload: newToken }); // Adjust based on your auth slice

  //         // Retry the original query with the new token
  //         result = await baseQuery(args, api, extraOptions);
  //       } else {
  //         api.dispatch({ type: 'auth/logout' }); // Handle failed token refresh
  //       }
  //     } finally {
  //       release();
  //     }
  //   } else {
  //     await mutex.waitForUnlock();
  //     result = await baseQuery(args, api, extraOptions);
  //   }
  // }

  return result;
};

export default baseQueryWithReauth;
