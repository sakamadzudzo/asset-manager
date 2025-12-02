import EditFormWrapper from "@/components/EditFormWrapper";
import InlineError from "@/components/InlineError";
import { useSaveAsset, useAssetById } from "@/hooks/useAssets";
import { RootState } from "@/store/store";
import { Errors, Asset } from "@/utils/types";
import {
  Form,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  user,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useToastError from "@/hooks/toasts/ToastError";
import { useCategorysAll } from "@/hooks/useCategorys";
import { useDepartmentsAll } from "@/hooks/useDepartments";

export default function AssetEdit({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const principal = useSelector((state: any) => state.auth.user);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Errors<Asset, string>>(
    {} as Errors<Asset, string>
  );
  const [statusCode, setStatusCode] = React.useState(0);
  const [fetchStarted, setFetchStarted] = React.useState(false);
  const [asset, setAsset] = React.useState<Asset>({} as Asset);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const { asset: oldAsset, isLoading, isError } = useAssetById(id!);
  const {
    departments,
    isLoading: dLoading,
    isError: dError,
  } = useDepartmentsAll({});
  const {
    categorys,
    isLoading: cLoading,
    isError: cError,
  } = useCategorysAll({});
  const { saveAsset } = useSaveAsset();

  const editMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Editing asset:
      </div>
      <div className="flex justify-center">
        Edit information about the asset
      </div>
    </div>
  );

  const newMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Creating asset:
      </div>
      <div className="flex justify-center">
        Enter information about the asset
      </div>
    </div>
  );

  const validate = () => {
    setErrors({} as Errors<Asset, string>);
    let tempErrors: Errors<Asset, string> = {} as Errors<Asset, string>;

    if (!asset.name || asset.name.trim() === "") {
      tempErrors = { ...tempErrors, name: "Name is required" };
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    if (principal) {
      setIsAdmin(principal.roles.includes("ADMIN"));
    }
  }, [principal]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatusCode(0);
    incrementLoading();

    if (!validate()) return;

    asset.user_id = principal.id;

    await saveAsset(
      asset,
      incrementLoading,
      decrementLoading,
      () => router.push("/asset/all"), // onSuccess callback
      (error, statusCode) => {
        useToastError({ error, statusCode });
      } // onError callback
    );
  };

  useEffect(() => {
    if (!!oldAsset) {
      setAsset(oldAsset as Asset);
    }
  }, [oldAsset]);

  useEffect(() => {
    // If we have an id and are loading, mark fetch as started
    if (id && (isLoading || dLoading || cLoading) && !fetchStarted) {
      setFetchStarted(true);
      incrementLoading();
    }
    // If fetch was started and isLoading is now false, decrement
    if (fetchStarted && !isLoading && !dLoading && !cLoading) {
      decrementLoading();
      setFetchStarted(false); // Reset for next fetch
    }
    // eslint-disable-next-line
  }, [id, isLoading, dLoading, cLoading]);

  return (
    <EditFormWrapper editMsg={editMsg} newMsg={newMsg} isNew={!id}>
      <Form
        onSubmit={onSubmit}
        className="h-full w-full md:w-1/2 pb-2 flex flex-col"
      >
        {error && <InlineError statusCode={statusCode} title={error} />}
        <div className="space-y-4 h-full w-full py-2 overflow-y-auto grow">
          <Input
            isRequired
            label="Name"
            name="name"
            placeholder="Enter name"
            type="text"
            value={asset?.name || ""}
            onValueChange={(e) => {
              setAsset({ ...asset, name: e });
              validate();
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.name}
            isInvalid={!!errors?.name}
          />
          <Textarea
            isRequired
            label="Description"
            name="description"
            placeholder="Enter description"
            type="text"
            value={asset?.description || ""}
            onValueChange={(e) => {
              setAsset({ ...asset, description: e });
              validate();
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.description}
            isInvalid={!!errors?.description}
          />
          <Input
            isRequired
            label="Serial Number"
            name="serial_number"
            placeholder="Enter serial number"
            type="text"
            value={asset?.serial_number || ""}
            onValueChange={(e) => {
              setAsset({ ...asset, serial_number: e });
              validate();
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.serial_number}
            isInvalid={!!errors?.serial_number}
          />
          <Autocomplete
            isRequired
            label="Category"
            name="category"
            selectedKey={String(asset.category_id)}
            placeholder="Select category"
            errorMessage={errors?.category_id}
            isInvalid={!!errors?.category_id}
            variant="bordered"
            isVirtualized={true}
            onSelectionChange={(key) => {
              setAsset({
                ...asset,
                category_id: Number(key!),
              });
              validate();
            }}
          >
            {categorys?.map((category) => (
              <AutocompleteItem key={category.id}>
                {category.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <Input
            label="Purchase date"
            name="purchase_date"
            placeholder="Enter purchase date"
            type="date"
            value={
              asset.purchase_date
                ? typeof asset.purchase_date === "string"
                  ? asset.purchase_date
                  : new Date(asset.purchase_date).toISOString().substring(0, 10)
                : ""
            }
            errorMessage={errors?.purchase_date?.general}
            isInvalid={!!errors?.purchase_date}
            onValueChange={(e) => {
              setAsset({ ...asset, purchase_date: new Date(e) });
              validate();
            }}
            size="sm"
            variant="bordered"
          />
          <Input
            isRequired
            label="Cost"
            name="cost"
            placeholder="Enter cost"
            type="number"
            value={asset?.cost?.toString() || ""}
            onValueChange={(e) => {
              setAsset({ ...asset, cost: Number(e) });
              validate();
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.cost}
            isInvalid={!!errors?.cost}
          />
          <Select
            isRequired
            label="Department"
            name="department"
            selectedKeys={[asset?.department_id]}
            variant="bordered"
            selectionMode="single"
            errorMessage={errors?.department_id}
            isInvalid={!!errors?.department_id}
            onSelectionChange={(key) => {
              setAsset({
                ...asset,
                department_id: Number(key.currentKey!),
              });
              validate();
            }}
          >
            {departments?.map((dept) => (
              <SelectItem key={dept.id}>{dept.name}</SelectItem>
            ))}
          </Select>
        </div>
        <Button
          type="submit"
          onPress={validate}
          color="primary"
          className="w-full px-5"
        >
          Save
        </Button>
      </Form>
    </EditFormWrapper>
  );
}
