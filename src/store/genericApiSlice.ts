import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReAuth';




// Generic API Slice Creator Function
function createGenericApiSlice<RES, REQ, QUERY = string | void>(config: {
  reducerPath: string;
  baseUrl: string;
  tagType: string;
  baseQuery?: BaseQueryFn;
}) {

  //make in type 
  interface ALL_RES{
    response:{
      body:RES[],
      length:number,
      totalPage:number,
      totalElements:number,
      currentPage:number,
    }
  }

  const {
    reducerPath,
    baseUrl,
    tagType,
    baseQuery = baseQueryWithReauth,
  } = config;

  return createApi({
    reducerPath,
    baseQuery,
    tagTypes: [tagType],
    endpoints: (builder) => ({
      getAll: builder.query<ALL_RES, QUERY>({
        query: (query) => (query ? `/${baseUrl}?${query}` : `/${baseUrl}`),
        providesTags: [tagType],
      }),
      getById: builder.query<RES, number>({
        query: (id) => `/${baseUrl}/${id}`,
        providesTags: [tagType],
      }),
      create: builder.mutation<RES, REQ>({
        query: (body) => ({
          url: `/${baseUrl}`,
          method: 'POST',
          body,
        }),
        invalidatesTags: [tagType],
      }),
      update: builder.mutation<RES, { id: number; body: REQ }>({
        query: ({ id, body }) => ({
          url: `/${baseUrl}/${id}`,
          method: 'PUT',
          body,
        }),
        invalidatesTags: [tagType],
      }),
      delete: builder.mutation<void, number>({
        query: (id) => ({
          url: `/${baseUrl}/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [tagType],
      }),
    }),
  });
}

export default createGenericApiSlice;
