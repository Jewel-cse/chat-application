import { EmployeeDto } from '../../types/Employee';
import createGenericApiSlice from '../genericApiSlice';

const employeeApiSlice = createGenericApiSlice<EmployeeDto, EmployeeDto>({
  reducerPath: 'employeeApi',
  baseUrl: 'employees',
  tagType: 'Employee',
});

export const {
  useGetAllQuery: useGetAllEmployeesQuery,
  useGetByIdQuery: useGetEmployeeQuery,
  useCreateMutation: useCreateEmployeeMutation,
  useUpdateMutation: useUpdateEmployeeMutation,
  useDeleteMutation: useDeleteEmployeeMutation,
} = employeeApiSlice;

export default employeeApiSlice;
