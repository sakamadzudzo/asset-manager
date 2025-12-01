import type {
  NumberInputVariantProps,
  Selection,
  SortDescriptor,
} from "@heroui/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import React from "react";
import MyChip from "./MyChip";
import {
  SearchIcon,
  ChevronDownIcon,
  PlusIcon,
  VerticalDotsIcon,
} from "@/components/icons/hero-icons";
import { capitalize } from "@/utils/helpers";

type SelectionColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type SelectionMode = "single" | "multiple";

type SelectionBehavior = "replace" | "toggle";

export type Column = {
  key: string;
  label: string;
  allowsSorting?: boolean;
};

type MyTableProps = {
  isHeaderSticky?: boolean;
  isLoading?: boolean;
  selectionColor?: SelectionColor;
  selectionMode?: SelectionMode;
  selectionBehavior?: SelectionBehavior;
  selectedKeys?: Selection;
  setSelectedKeys?: React.Dispatch<React.SetStateAction<Selection>>;
  onRowAction?: (key: any) => void;
  page?: number;
  pages?: number;
  total?: number;
  size?: number;
  offset?: number;
  first?: boolean;
  last?: boolean;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  nextPage?: React.Dispatch<React.SetStateAction<number>>;
  prevPage?: React.Dispatch<React.SetStateAction<number>>;
  setSize?: React.Dispatch<React.SetStateAction<number>>;
  statusOptions?: string[];
  columns: Column[];
  rows?: any[];
  sortDescriptor?: SortDescriptor;
  setSortDescriptor?: React.Dispatch<React.SetStateAction<SortDescriptor>>;
  fetchButtonLabel?: string;
  fetchButton?: boolean;
  search?: () => void;
  filterValue?: string;
  setFilterValue?: React.Dispatch<React.SetStateAction<string>>;
  searchBox?: boolean;
  addFunction?: () => void;
};

export default function MyTable(props: MyTableProps) {
  const {
    selectionColor = "primary",
    selectionMode = "single",
    selectionBehavior = "replace",
    selectedKeys,
    setSelectedKeys,
    onRowAction,
    isHeaderSticky = true,
    isLoading = false,
    statusOptions,
    columns,
    rows,
    sortDescriptor,
    setSortDescriptor,
    fetchButtonLabel = "Fetch",
    fetchButton = true,
    search,
    filterValue,
    setFilterValue,
    searchBox = true,
    addFunction = () => {},
  } = props;

  const isStripped = true;
  const [internalSelectedKeys, setInternalSelectedKeys] =
    React.useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set()
  );

  // Update visibleColumns and headerColumns when columns change
  React.useEffect(() => {
    // If columns is not empty, set visibleColumns to all column keys
    if (props.columns && props.columns.length > 0) {
      setVisibleColumns(new Set(props.columns.map((col) => col.key)));
      // setHeaderColumns(props.columns);
    }
  }, [props.columns]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [visibleColumns, columns]);

  const actualSelectedKeys = selectedKeys ?? internalSelectedKeys;
  const actualSetSelectedKeys = setSelectedKeys ?? setInternalSelectedKeys;
  const hasSearchFilter = Boolean(filterValue);

  const renderCell = React.useCallback((row: any, columnKey: React.Key) => {
    const cellValue = row[columnKey as keyof any];

    switch (columnKey) {
      case "status":
        return (
          <MyChip
            className="capitalize"
            data={cellValue}
            size="sm"
            variant="flat"
          />
        );
      // Add case for actions column, ellipsis with dropdown of actions (text only)
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                radius="full"
                size="sm"
                className="aspect-square"
              >
                <VerticalDotsIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {row.actions.map((action: any) => (
                <DropdownItem key={action.key} onClick={action.function}>
                  {action.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue!("");
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue!(value);
    } else {
      setFilterValue!("");
    }
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!rows || rows.length === 0) return [];
    let filtered = rows;

    if (hasSearchFilter && filterValue) {
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(filterValue.toLowerCase())
          );
        })
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions?.length
    ) {
      filtered = filtered.filter((row) => {
        if (!("status" in row)) return true;
        return Array.from(statusFilter).includes(row.status);
      });
    }

    return filtered;
  }, [
    rows,
    filterValue,
    hasSearchFilter,
    statusFilter,
    columns,
    statusOptions,
  ]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {searchBox && (
            <div className="flex gap-1 w-full sm:max-w-[44%]">
              <Input
                isClearable
                className=""
                placeholder="Search by name..."
                startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
                variant="bordered"
              />
              {fetchButton && (
                <Button onPress={search}>{fetchButtonLabel}</Button>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Statuses"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions! &&
                  statusOptions.map((status) => (
                    <DropdownItem key={status} className="capitalize">
                      {capitalize(status)}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key}>
                    {capitalize(column.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onPress={addFunction}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} rows
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    filteredItems.length,
    hasSearchFilter,
  ]);

  return (
    <Table
      isHeaderSticky={isHeaderSticky}
      aria-label="Example table with dynamic content"
      isStriped={isStripped}
      color={selectionColor}
      selectionMode={selectionMode}
      selectionBehavior={selectionBehavior}
      selectedKeys={actualSelectedKeys}
      onSelectionChange={actualSetSelectedKeys}
      onRowAction={onRowAction!}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      bottomContentPlacement="outside"
      topContent={topContent}
      topContentPlacement="outside"
      className="h-full w-full flex flex-col mb-4 overflow-hidden"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.key} allowsSorting={column.allowsSorting}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={
          <Spinner label="Loading..." variant="dots" color="primary" />
        }
        items={filteredItems}
        emptyContent={"No rows to display."}
        className="grow overflow-auto"
      >
        {(item) => (
          <TableRow key={item.key}>
            {headerColumns.map((column) => (
              <TableCell key={column.key}>
                {renderCell(item, column.key)}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
