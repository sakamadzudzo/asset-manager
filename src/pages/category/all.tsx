import MyTable, { Column } from "@/components/MyTable";
import useToastError from "@/hooks/toasts/ToastError";
import { useCategorysAll, useCategorysAllByFilter } from "@/hooks/useCategorys";
import { statuses } from "@/utils/classes";
import { SortDescriptor } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AllCategorysPage() {
  const [total, setTotal] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const router = useRouter();

  let categorys;
  let isLoading;
  let isError;

  if (searchValue) {
    ({ categorys, isLoading, isError } = useCategorysAllByFilter({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      filter: searchValue,
    }));
  } else {
    ({ categorys, isLoading, isError } = useCategorysAll({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    }));
  }

  const viewOne = (id: string) => {
    router.push(`/category/one?id=${id}`);
  };

  const editOne = (id: string) => {
    router.push(`/category/edit?id=${id}`);
  };

  useEffect(() => {
    if (!filterValue) {
      setSearchValue("");
    }
  }, [filterValue]);

  useEffect(() => {
    setTotal(categorys ? categorys?.length : 0);
  }, [categorys]);

  const rows = React.useMemo(() => {
    if (!categorys) return [];
    return (categorys || []).map((row: any) => ({
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
  }, [categorys]);

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
    router.push("/category/edit");
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
