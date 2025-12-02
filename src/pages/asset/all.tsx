import MyTable, { Column } from "@/components/MyTable";
import useToastError from "@/hooks/toasts/ToastError";
import { useAssetsAll, useAssetsAllByFilter } from "@/hooks/useAssets";
import { statuses } from "@/utils/classes";
import { formatDate } from "@/utils/helpers";
import { SortDescriptor } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AllAssetsPage() {
  const [total, setTotal] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const router = useRouter();

  let assets;
  let isLoading;
  let isError;

  if (searchValue) {
    ({ assets, isLoading, isError } = useAssetsAllByFilter({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      filter: searchValue,
    }));
  } else {
    ({ assets, isLoading, isError } = useAssetsAll({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
    }));
  }

  const viewOne = (id: string) => {
    router.push(`/asset/one?id=${id}`);
  };

  const editOne = (id: string) => {
    router.push(`/asset/edit?id=${id}`);
  };

  useEffect(() => {
    if (!filterValue) {
      setSearchValue("");
    }
  }, [filterValue]);

  useEffect(() => {
    setTotal(assets ? assets?.length : 0);
  }, [assets]);

  const rows = React.useMemo(() => {
    if (!assets) return [];
    return (assets || []).map((row: any) => ({
      ...row,
      key: row.id || row._id || row.name,
      purchase_date: formatDate(row.purchase_date, false),
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
  }, [assets]);

  const columns = React.useMemo<Column[]>(
    () => [
      {
        key: "name",
        label: "Name",
        allowsSorting: true,
      },
      {
        key: "description",
        label: "Description",
        allowsSorting: true,
      },
      {
        key: "serial_number",
        label: "Serial Number",
        allowsSorting: true,
      },
      {
        key: "category",
        label: "Category",
        allowsSorting: true,
      },
      {
        key: "department",
        label: "Department",
        allowsSorting: true,
      },
      {
        key: "purchase_date",
        label: "Purchase Date",
        allowsSorting: true,
      },
      {
        key: "cost",
        label: "Cost",
        allowsSorting: true,
      },
      {
        key: "user",
        label: "User",
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
    router.push("/asset/edit");
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
