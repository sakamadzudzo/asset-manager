import MyTable, { Column } from "@/components/MyTable";
import useToastError from "@/hooks/toasts/ToastError";
import { useDepartmentsAll, useDepartmentsAllByFilter } from "@/hooks/useDepartments";
import { statuses } from "@/utils/classes";
import { SortDescriptor } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AllDepartmentsPage() {
  const [total, setTotal] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const router = useRouter();

  let departments;
  let isLoading;
  let isError;

  if (searchValue) {
    ({ departments, isLoading, isError } = useDepartmentsAllByFilter({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      filter: searchValue,
    }));
  } else {
    ({ departments, isLoading, isError } = useDepartmentsAll({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    }));
  }

  const viewOne = (id: string) => {
    router.push(`/department/one?id=${id}`);
  };

  const editOne = (id: string) => {
    router.push(`/department/edit?id=${id}`);
  };

  useEffect(() => {
    if (!filterValue) {
      setSearchValue("");
    }
  }, [filterValue]);

  useEffect(() => {
    setTotal(departments ? departments?.length : 0);
  }, [departments]);

  const rows = React.useMemo(() => {
    if (!departments) return [];
    return (departments || []).map((row: any) => ({
      ...row,
      key: row.id || row._id || row.name,
      actions: [
        {
          label: "View",
          function: () => viewOne(row.id),
          key: `view-${row.id}`,
        },
        {
          label: "Edit",
          function: () => editOne(row.id),
          key: `edit-${row.id}`,
        },
      ],
    }));
  }, [departments]);

  const columns = React.useMemo<Column[]>(
    () => [
      {
        key: "name",
        label: "Name",
        allowsSorting: true,
      },
      {
        key: "id",
        label: "ID",
        allowsSorting: true,
      },
      {
        key: "actions",
        label: "Actions",
        allowsSorting: false,
      },
    ],
    []
  );

  const statusOptions = statuses;

  const search = () => {
    setSearchValue(filterValue);
  };

  const addNew = () => {
    router.push("/department/edit");
  };

  useEffect(() => {
    if (isError) {
      useToastError({
        error: isError?.message || "",
        statusCode: isError?.statusCode || 500,
      });
    }
  }, [isError]);

  return (
    <MyTable
      columns={columns}
      rows={rows}
      statusOptions={statusOptions}
      sortDescriptor={sortDescriptor}
      setSortDescriptor={setSortDescriptor}
      filterValue={filterValue}
      setFilterValue={setFilterValue}
      searchBox={true}
      search={search}
      isLoading={isLoading}
      total={total}
      onRowAction={viewOne}
      addFunction={addNew}
    />
  );
}
