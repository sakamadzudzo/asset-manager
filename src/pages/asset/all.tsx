import MyTable, { Column } from "@/components/MyTable";
import useToastError from "@/hooks/toasts/ToastError";
import {
  useAssetsAll,
  useAssetsAllByFilter,
  useSaveAsset,
} from "@/hooks/useAssets";
import { statuses } from "@/utils/classes";
import { formatDate, getUserFullname } from "@/utils/helpers";
import {
  SortDescriptor,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
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
  const [selectedAsset, setSelectedAsset] = React.useState<any>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { saveAsset } = useSaveAsset();
  const router = useRouter();

  let assets;
  let isLoading;
  let isError;
  let mutate;

  if (searchValue) {
    ({ assets, isLoading, isError, mutate } = useAssetsAllByFilter({
      sort: sortDescriptor.column.toString(),
      direction: sortDescriptor.direction === "ascending" ? "ASC" : "DESC",
      filter: searchValue,
    }));
  } else {
    ({ assets, isLoading, isError, mutate } = useAssetsAll({
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

  const deleteOne = (asset: any) => {
    setSelectedAsset(asset);
    onOpen();
  };

  const confirmDelete = async () => {
    if (!selectedAsset) return;
    try {
      await saveAsset(
        { ...selectedAsset, deleted: true },
        () => {},
        () => {},
        () => {
          onOpenChange();
          setSelectedAsset(null);
          mutate();
        },
        (error, statusCode) => {
          useToastError({ error, statusCode });
        }
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
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
      department: row.department?.name || "",
      user: getUserFullname(row.user) || "",
      category: row.category?.name || "",
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
        {
          label: "Delete",
          function: () => deleteOne(row),
          key: `delete-${row.id}`,
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
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-background text-foreground">
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this asset?</p>
            <p className="text-sm text-gray-500">{selectedAsset?.name}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => onOpenChange()}>
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </>
  );
}
