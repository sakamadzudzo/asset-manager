import EditFormWrapper from "@/components/EditFormWrapper";
import InlineError from "@/components/InlineError";
import { useSaveCategory, useCategoryById } from "@/hooks/useCategorys";
import { RootState } from "@/store/store";
import { Errors, Role, Salutation, Category } from "@/utils/types";
import { Form, Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useToastError from "@/hooks/toasts/ToastError";

export default function CategoryEdit({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const principal = useSelector((state: any) => state.auth.category);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Errors<Category, string>>(
    {} as Errors<Category, string>
  );
  const [statusCode, setStatusCode] = React.useState(0);
  const [category, setCategory] = React.useState<Category>({} as Category);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const { category: oldCategory, isLoading, isError } = useCategoryById(id!);
  const [updatePassword, setUpdatePassword] = React.useState(false);
  const [updateCategoryname, setUpdateCategoryname] = React.useState(false);
  const { saveCategory } = useSaveCategory();

  const editMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Editing category:
      </div>
      <div className="flex justify-center">Edit information about the category</div>
    </div>
  );

  const newMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Creating category:
      </div>
      <div className="flex justify-center">
        Enter information about the category
      </div>
    </div>
  );

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

    await saveCategory(
      category,
      incrementLoading,
      decrementLoading,
      () => router.push("/category/all"), // onSuccess callback
      (error, statusCode) => {
        useToastError({ error, statusCode });
      } // onError callback
    );
  };

  useEffect(() => {
    if (!!oldCategory) {
      setCategory(oldCategory as Category);
    }
  }, [oldCategory]);

  return (
    <EditFormWrapper editMsg={editMsg} newMsg={newMsg} isNew={!id}>
      <Form
        onSubmit={onSubmit}
        className="h-full w-full md:w-1/2 pb-2 flex flex-col"
      >
        {error && <InlineError statusCode={statusCode} title={error} />}
        <div className="space-y-4 h-full w-full py-2 overflow-y-auto grow">
          <Input
            label="Name"
            name="name"
            placeholder="Enter name"
            type="text"
            value={category?.name || ""}
            onValueChange={(e) => setCategory({ ...category, name: e })}
            size="sm"
            variant="bordered"
          />
          
        </div>
        <Button type="submit" color="primary" className="w-full px-5">
          Save
        </Button>
      </Form>
    </EditFormWrapper>
  );
}
