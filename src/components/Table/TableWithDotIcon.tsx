'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import {
  FaRegFilePdf,
  FaFileCsv,
} from 'react-icons/fa';
import { SiMicrosoftexcel } from 'react-icons/si';
import { Button } from '../ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { generateExcel } from '@/lib/xlGenerators';
import { generatePDF } from '@/lib/pdfGenerator';
import DropDownInputSmall_unlabelled from '@/components/form/dropDownInputSmall_unlabelled';
import { useState } from 'react';
import { generateCSV } from '@/lib/csvGenerator';
import { toast } from 'react-toastify';
import DropdownActionsMenu from './DropdownActionMenu';

export type TableAction = {
  view?: boolean;
  duplicate?: boolean;
  edit?: boolean;
  delete?: boolean;
};
type TableData = { [key: string]: string | number };

type Column = {
  accessorKey: string;
  header: string;
};

interface TableActionProps {
  title?: string;
  data: any[] | undefined;
  columns: Column[];
  height: string;
  actions: TableAction[];
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
  onView: (data: any) => void;
  onDuplicate?: (data: any) => void;
  changePageSize?: (value: string) => void;
  dataForNextPage?: [
    number,
    number,
    React.Dispatch<React.SetStateAction<string>>,
  ];
  dataForPrevPage?: [number, React.Dispatch<React.SetStateAction<string>>];
}

export function TableAction({
  title,
  data = [],
  columns,
  height,
  actions,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  changePageSize,
  dataForNextPage,
  dataForPrevPage, 
}: TableActionProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Check if any actions are enabled
  const hasActions = actions.some((action) =>
    Object.values(action).some(Boolean),
  );
  const [pageSize, setPageSize] = useState<string>('20'); // Default page size

  function exportXl() {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (selectedData.length == 0) {
      toast.error('Please select one or more data');
    } else {
      generateExcel(`${title}`, columns, selectedData);
    }
  }
  function exportCSV() {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    if (selectedData.length == 0) {
      toast.error('Please select one or more data');
    } else {
      generateCSV(`${title}`, columns, selectedData);
    }
  }

  function exportPdf() {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    console.log('selected data: ', selectedData);
    if (selectedData.length == 0) {
      toast.error('Please select one or more data');
    } else {
      generatePDF(`${title}`, columns, selectedData);
    }
  }

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
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div>
          <Input
            placeholder="Filter..."
            className="custom-blue-border mr-2 h-[25px] max-w-sm rounded-md shadow-sm focus:border-blue-400 focus:outline-none "
            value={globalFilter ?? ''}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="ml-auto h-[25px] bg-excelColor text-white"
            onClick={exportXl}
          >
            <SiMicrosoftexcel className="mr-1 h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="outline"
            className="ml-auto h-[25px] bg-excelColor text-white"
            onClick={exportCSV}
          >
            <FaFileCsv className="mr-1 h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            className="ml-auto h-[25px] bg-pdfColor text-white"
            onClick={exportPdf}
          >
            <FaRegFilePdf className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-2 h-[25px] border-gray-400"
              >
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      // label={column.columnDef.header}
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                      {/*{column!.columnDef!.header!}*/}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <ScrollArea style={{ minHeight: 200, height: height }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {/*Multi Select and SL Columns ###############################################*/}
                  <TableHead className="global-bg-gradient-1  sticky top-0 z-10 text-center font-bold">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        className={'bg-white'}
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) =>
                          table.toggleAllPageRowsSelected(!!value)
                        }
                      />
                    </div>
                  </TableHead>

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

                  {/* action column */}
                  {hasActions && (
                    <TableHead className="global-bg-gradient-1  sticky top-0 z-10  text-center font-bold">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getSortedRowModel().rows?.length ? (
                table.getSortedRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}
                  >
                    {/*SL and select row #########################################*/}
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Checkbox
                          className="h-3 w-3"
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                          }
                        />
                      </div>
                    </TableCell>

                    {/*Actual rows ######################################*/}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={'small-font'}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                    {/*Actions row */}
                    {hasActions && (
                      <TableCell className="p-0">
                        <div className="flex h-full items-stretch justify-center">
                          <DropdownActionsMenu
                            data={row.original}
                            onView={onView}
                            onEdit={onEdit}
                            onDuplicate={onDuplicate!}
                            onDelete={onDelete}
                            actions={actions}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 2}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
          
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="ml-3 flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div>
          <DropDownInputSmall_unlabelled
            name={'page_size'}
            options={[
              { value: '10', label: '10' },
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
    </div>
  );
}
