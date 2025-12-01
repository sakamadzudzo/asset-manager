import MyTable, { Column } from "@/components/MyTable";
import useToastError from "@/hooks/toasts/ToastError";
import { useUsersAll, useUsersAllByFilter } from "@/hooks/useUsers";
import { statuses } from "@/utils/classes";
import { SortDescriptor } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AllUsersPage() {
  const [total, setTotal] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastname",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const router = useRouter();

  let users;
  let isLoading;
  let isError;

  if (searchValue) {
    ({ users, isLoading, isError } = useUsersAllByFilter({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      filter: searchValue,
    }));
  } else {
    ({ users, isLoading, isError } = useUsersAll({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    }));
  }

  const viewOne = (id: string) => {
    router.push(`/user/one?id=${id}`);
  };

  const editOne = (id: string) => {
    router.push(`/user/edit?id=${id}`);
  };

  useEffect(() => {
    if (!filterValue) {
      setSearchValue("");
    }
  }, [filterValue]);

  useEffect(() => {
    setTotal(users ? users?.length : 0);
  }, [users]);

  const rows = React.useMemo(() => {
    if (!users) return [];
    return (users || []).map((row: any) => ({
      ...row,
      key: row.id || row._id || row.name,
      roles: row.roles.join(", "),
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
  }, [users]);

  const columns = React.useMemo<Column[]>(
    () => [
      {
        key: "salutation",
        label: "Salutation",
        allowsSorting: true,
      },
      {
        key: "firstname",
        label: "First Name",
        allowsSorting: true,
      },
      {
        key: "othernames",
        label: "Other Names",
        allowsSorting: true,
      },
      {
        key: "lastname",
        label: "Last Name",
        allowsSorting: true,
      },
      {
        key: "username",
        label: "Username",
        allowsSorting: true,
      },
      {
        key: "roles",
        label: "Roles",
        allowsSorting: true,
      },
      {
        key: "email",
        label: "Email",
        allowsSorting: true,
      },
      {
        key: "phone",
        label: "Phone",
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
    router.push("/user/edit");
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
