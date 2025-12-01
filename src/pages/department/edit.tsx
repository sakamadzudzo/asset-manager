import EditFormWrapper from "@/components/EditFormWrapper";
import InlineError from "@/components/InlineError";
import { useSaveDepartment, useDepartmentById } from "@/hooks/useDepartments";
import { RootState } from "@/store/store";
import { Errors, Role, Salutation, Department } from "@/utils/types";
import { Form, Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { roles, salutations } from "@/utils/classes";
import useToastError from "@/hooks/toasts/ToastError";

export default function DepartmentEdit({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const principal = useSelector((state: any) => state.auth.department);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Errors<Department, string>>(
    {} as Errors<Department, string>
  );
  const [statusCode, setStatusCode] = React.useState(0);
  const [department, setDepartment] = React.useState<Department>({} as Department);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const { department: oldDepartment, isLoading, isError } = useDepartmentById(id!);
  const [updatePassword, setUpdatePassword] = React.useState(false);
  const [updateDepartmentname, setUpdateDepartmentname] = React.useState(false);
  const { saveDepartment } = useSaveDepartment();

  const editMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Editing department:
      </div>
      <div className="flex justify-center">Edit information about the department</div>
    </div>
  );

  const newMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Creating department:
      </div>
      <div className="flex justify-center">
        Enter information about the department
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

    await saveDepartment(
      department,
      incrementLoading,
      decrementLoading,
      () => router.push("/department/all"), // onSuccess callback
      (error, statusCode) => {
        useToastError({ error, statusCode });
      } // onError callback
    );
  };

  useEffect(() => {
    if (!!oldDepartment) {
      setDepartment(oldDepartment as Department);
    }
  }, [oldDepartment]);

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
            value={department?.name || ""}
            onValueChange={(e) => setDepartment({ ...department, name: e })}
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
