'use client';

import * as React from 'react';
import {
  CaretSortIcon,
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
import {
  FaRegFilePdf,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileCsv,
  FaPrint,
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

type TableAction = {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  print?:boolean;
};
type TableData = { [key: string]: string | number };

type Column = {
  accessorKey: string;
  header: string;
};

interface printableGridProps {
  title?: string;
  data: any[] | undefined;
  columns: Column[];
  height?: string;
  actions: TableAction[];
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
  onView: (data: any) => void;
  onPrint:(data:any) =>void;
  changePageSize?: (value: string) => void;
  dataForNextPage?: [
    number,
    number,
    React.Dispatch<React.SetStateAction<string>>,
  ];
  dataForPrevPage?: [number, React.Dispatch<React.SetStateAction<string>>];
}

// Button components for each action
const ViewButton: React.FC<{
  data: TableData;
  onView: (data: TableData) => void;
}> = ({ data, onView }) => {
  const handleView = () => {
    onView(data);
  };

  return (
    <button className="mx-1" onClick={handleView}>
      <FaEye className="text-custom-blue cursor-pointer" />
    </button>
  );
};

const EditButton: React.FC<{
  data: TableData;
  onEdit: (data: TableData) => void;
}> = ({ data, onEdit }) => {
  const handleEdit = () => {
    onEdit(data);
  };

  return (
    <button className="mx-1" onClick={handleEdit}>
      <FaEdit className="text-custom-blue cursor-pointer" />
    </button>
  );
};

const DeleteButton: React.FC<{
  data: TableData;
  onDelete: (data: TableData) => void;
}> = ({ data, onDelete }) => {
  const handleDelete = () => {
    onDelete(data);
  };

  return (
    <button className="mx-1" onClick={handleDelete}>
      <FaTrash className="cursor-pointer text-red-700" />
    </button>
  );
};

const PrintButton: React.FC<{
    data: TableData;
    onPrint:(data:any)=>void
  }> = ({ data ,onPrint}) => {
    const handlePrint = () => {
      // const printWindow = window.open('', '', 'height=600,width=800');
      // if (printWindow) {
      //   printWindow.document.write('<html><head><title>Print</title></head><body>');
      //   printWindow.document.write('<h1>Print Data</h1>');
      //   printWindow.document.write('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
      //   printWindow.document.write('</body></html>');
      //   printWindow.document.close();
      //   printWindow.focus();
      //   printWindow.print();
      // }
      onPrint(data);
    };
  
    return (
      <button className="mx-1" onClick={handlePrint}>
        <FaPrint className="text-custom-blue cursor-pointer" />
      </button>
    );
  };
  

function PrintableGrid({
  title,
  data = [],
  columns,
  height = "auto",
  actions,
  onEdit,
  onDelete,
  onView,
  onPrint,
  changePageSize,
  dataForNextPage,
  dataForPrevPage, 
}: printableGridProps) {
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
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border" style={{ height }}>
        <Table>
          <TableHeader className="sticky top-0 z-10">
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
                {/*<TableHead*/}
                {/*    className="global-bg-gradient-1  sticky top-0 z-10 text-center font-bold">*/}
                {/*    SL*/}
                {/*</TableHead>*/}

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

                {/*Action Column ##########################################################################*/}
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
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </div>
                  </TableCell>
                  {/*<TableCell className="text-center">*/}
                  {/*    <b>{index + 1}</b>*/}
                  {/*</TableCell>*/}

                  {/*Actual rows ######################################*/}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={'small-font'}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {/*Actions row##################################################*/}
                  {hasActions && (
                    <TableCell className="p-0">
                      <div className="flex h-full items-stretch justify-center">
                        {actions.map((action, i) => (
                          <React.Fragment key={i}>
                            {action.view && (
                              <ViewButton data={row.original} onView={onView} />
                            )}
                            {action.edit && (
                              <EditButton data={row.original} onEdit={onEdit} />
                            )}
                            {action.delete && (
                              <DeleteButton
                                data={row.original}
                                onDelete={onDelete}
                              />
                            )}
                            {action.print && (
                              <PrintButton data={row.original} onPrint={onPrint}/>
                            )}
                          </React.Fragment>
                        ))}
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
    </div>
  );
}

export default PrintableGrid;