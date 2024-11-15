'use client';

import * as React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BranchType } from '@/store/bankBranch/bankBranchTypeDefinition';
import { number } from 'yup';
import { useState } from 'react';
import DropDownInputSmall_unlabelled from '../form/dropDownInputSmall_unlabelled';
import { Button } from '../ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Input } from '../ui/input';

type TableData = { [key: string]: string | number };

type Column = {
  accessorKey: string;
  header: string;
};

interface SelectableGridProps {
  title?: string;
  data: any[] | undefined;
  columns: Column[];
  height: string;
  selectedRow?: any;
  setSelectedRow?: (data: any) => void;
  setSelectedEntity?: (value: any) => void;
  changePageSize?: (value: string) => void;
  dataForNextPage?: [
    number,
    number,
    React.Dispatch<React.SetStateAction<string>>,
  ];
  dataForPrevPage?: [number, React.Dispatch<React.SetStateAction<string>>];
  showPagination?: boolean;
  className?: string;
}

function SelectableGrid({
  title,
  data = [],
  columns,
  height,
  selectedRow,
  setSelectedRow,
  setSelectedEntity,
  changePageSize,
  dataForNextPage,
  dataForPrevPage,
  showPagination = true, // Default to true if not provided
  className = '', // Default to empty string
}: SelectableGridProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pageSize, setPageSize] = useState<string>('20'); // Default page size
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      globalFilter,
    },
  });
  const [gridSelectedRow, setGridSelectedRow] = useState<any>(null);
  const handleRowSelection = (row: BranchType) => {
    console.log(row);
    if (setSelectedEntity) {
      setSelectedEntity(row);
    }
    setGridSelectedRow(row);
    if (setSelectedRow) {
      setSelectedRow(selectedRow?.id === row.id ? null : row);
    }
  };


  const handlePageSizeChange = (name: string, value: string) => {
    setPageSize(value);
    console.log('page size', value);
    if (changePageSize) {
      changePageSize(value);
    } // Call the changePageSize function
  };

  const changeNextPage = ([currentPage, totalPages, setGridPageNumber]: [
    number,
    number,
    React.Dispatch<React.SetStateAction<string>>,
  ]) => {
    console.log('currentPage', currentPage);
    console.log('totalPages', totalPages);
    if (currentPage != null && totalPages != null) {
      console.log('entered first if');
      if (currentPage < totalPages - 1) {
        console.log('entered second if');
        currentPage++;
        setIsNextDisabled(false);
        setIsPrevDisabled(false);
        if (currentPage == totalPages - 1) {
          setIsNextDisabled(true);
        }
        setGridPageNumber(currentPage.toString());
      } else if (currentPage == totalPages - 1) {
        setIsNextDisabled(true);
      }
    } else {
      setIsNextDisabled(true);
    }
  };

  const changePrevPage = ([currentPage, setGridPageNumber]: [
    number,
    React.Dispatch<React.SetStateAction<string>>,
  ]) => {
    if (currentPage != null) {
      if (currentPage > 0) {
        currentPage--;
        setIsPrevDisabled(false);
        setIsNextDisabled(false);
        if (currentPage == 0) {
          setIsPrevDisabled(true);
        }
        setGridPageNumber(currentPage.toString());
      } else {
        setIsPrevDisabled(true);
      }
    } else if (currentPage == 0) {
      setIsPrevDisabled(true);
    }
  };


  return (
    <div>
      {/* <div className="flex items-center mt-4">
        <Input
          placeholder="Find Branch..."
          className="custom-blue-border mr-2 h-[25px] max-w-sm rounded-md shadow-sm focus:border-blue-400 focus:outline-none "
          value={globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div> */}

      <div className={`mt-6 rounded-md border ${className}`}>
        <Table>
          <ScrollArea style={{ height: height }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {/*Actual Dynamic Columns######################################################################*/}
                  {headerGroup.headers.map(
                    (header) =>
                      !header.isPlaceholder && (
                        <TableHead
                          key={header.id}
                          className="global-bg-gradient-1  sticky top-0 z-10 font-bold  "
                        >
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer items-center"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {{
                                asc: <ChevronUpIcon className="ml-2 h-4 w-4" />,
                                desc: (
                                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                                ),
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </TableHead>
                      ),
                  )}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getSortedRowModel().rows?.length ? (
                table.getSortedRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'
                      } ${selectedRow?.id === row.original.id ||
                        gridSelectedRow?.id === row.original.id
                        ? 'zoom-in-60  text-md rounded-lg bg-sky-200 font-bold shadow-lg'
                        : 'text-xs'
                      }`}
                    onClick={() => handleRowSelection(row.original)}
                  >
                    {/*Actual rows ######################################*/}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 2}
                    className="h-24 text-center"
                  >
                    <span>No Data Exists</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      {/* div for pagination */}
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <div>
            <DropDownInputSmall_unlabelled
              name={'page_size'}
              options={[
                { value: '2', label: '2' },
                { value: '5', label: '5' },
                { value: '20', label: '20' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
              value={pageSize}
              onChange={handlePageSizeChange}
            />
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePrevPage(dataForPrevPage!)}
              disabled={isPrevDisabled}
              className={' h-[25px]  w-[30px] border-gray-400 p-0'}
            >
              <ChevronLeftIcon className="h-4 w-4 " />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeNextPage(dataForNextPage!)}
              disabled={isNextDisabled}
              className={' h-[25px] w-[30px] border-gray-400 p-0'}
            >
              <ChevronRightIcon className="h-4 w-4 " />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectableGrid;

