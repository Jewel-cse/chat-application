import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor
} from "@nextui-org/react";
// import { PlusIcon } from "./PlusIcon";
// import { VerticalDotsIcon } from "./VerticalDotsIcon";
// import { ChevronDownIcon } from "./ChevronDownIcon";
// import { SearchIcon } from "./SearchIcon";
// import { capitalize } from "./utils";

// Reusable Table Component
type StatusColorMap = Record<string, ChipProps["color"]>;

interface ReusableTableProps<T> {
  data: T[];  // Accept data as generic
  columns: { name: string; uid: keyof T; sortable?: boolean }[];
  actions?: (item: T) => React.ReactNode; // Actions for each row
  statusColorMap?: StatusColorMap; // Optional, if needed
}

function ReusableTable<T extends { id: string }>({
  data,
  columns,
  actions,
  statusColorMap,
}: ReusableTableProps<T>) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age", // Set default sortable column
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        String(item.name).toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredData;
  }, [data, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T] as number;
      const second = b[sortDescriptor.column as keyof T] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = (item: T, columnKey: keyof T) => {
    const cellValue = item[columnKey];

    // Customize rendering for each column, or just return the raw value
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: item.avatar }}
            name={cellValue as string}
          />
        );
      case "status":
        if (statusColorMap) {
          return (
            <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
        }
        return cellValue;
      case "actions":
        return actions ? actions(item) : null; // If actions are provided, render them
      default:
        return cellValue;
    }
  };

  return (
    <Table
      aria-label="Reusable table with custom cells"
      isHeaderSticky
      bottomContent={<Pagination className="flex items-center justify-center" page={page} total={pages} onChange={setPage} />}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={String(column.uid)}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No items found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={String(column.uid)}>
                {renderCell(item, column.uid)}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ReusableTable;
