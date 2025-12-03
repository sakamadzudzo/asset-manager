import EditFormWrapper from "@/components/EditFormWrapper";
import InlineError from "@/components/InlineError";
import { useSaveUser, useUserById } from "@/hooks/useUsers";
import { RootState } from "@/store/store";
import { Errors, IUser, Role, Salutation, User } from "@/utils/types";
import { Form, Button, Input, Select, SelectItem, Switch } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { roles, salutations } from "@/utils/classes";
import useToastError from "@/hooks/toasts/ToastError";
import { useDepartmentsAll } from "@/hooks/useDepartments";
import {
  emailRegex,
  emailError,
  phoneNumberRegex,
  phoneNumberError,
} from "@/utils/helpers";

export default function UserEdit({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const [fetchStarted, setFetchStarted] = React.useState(false);
  const principal = useSelector((state: any) => state.auth.user);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Errors<IUser, string>>(
    {} as Errors<IUser, string>
  );
  const [statusCode, setStatusCode] = React.useState(0);
  const [user, setUser] = React.useState<IUser>({} as IUser);
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const { user: oldUser, isLoading, isError } = useUserById(id!);
  const [updatePassword, setUpdatePassword] = React.useState(false);
  const [updateUsername, setUpdateUsername] = React.useState(false);
  const { saveUser } = useSaveUser();
  const {
    departments,
    isLoading: dLoading,
    isError: dError,
  } = useDepartmentsAll({});

  const validate = () => {
    setErrors({} as Errors<IUser, string>);
    let tempErrors: Errors<IUser, string> = {} as Errors<IUser, string>;

    if (!user.lastname || user.lastname.trim() === "") {
      tempErrors = { ...tempErrors, lastname: "Lastname is required" };
    }
    if (!user.email || user.email.trim() === "") {
      tempErrors = { ...tempErrors, email: "Email is required" };
    } else {
      if (!emailRegex.test(user?.email)) {
        tempErrors = {
          ...tempErrors,
          ...tempErrors,
          email: emailError,
        };
      }
    }
    if (!user.username || user.username.trim() === "") {
      tempErrors = { ...tempErrors, username: "Username is required" };
    }
    if (!user.roles || !user.roles) {
      tempErrors = {
        ...tempErrors,
        roles: { ...tempErrors.roles, general: "Roles are required" },
      };
    }
    if (!user.department_id || user.department_id === 0) {
      tempErrors = { ...tempErrors, department_id: "Department is required" };
    }
    if (!!user.phone && !phoneNumberRegex.test(user.phone!)) {
      tempErrors = { ...tempErrors, phone: phoneNumberError };
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const editMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Editing user:
      </div>
      <div className="flex justify-center">Edit information about the user</div>
    </div>
  );

  const newMsg: React.ReactNode = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Creating user:
      </div>
      <div className="flex justify-center">
        Enter information about the user
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

    if (!validate) {
      return;
    }

    user.rolesString = `{${user.roles.join(",")}}`;

    await saveUser(
      user,
      incrementLoading,
      decrementLoading,
      () => router.push("/user/all"), // onSuccess callback
      (error, statusCode) => {
        useToastError({ error, statusCode });
      } // onError callback
    );
  };

  useEffect(() => {
    if (!!oldUser) {
      setUser(oldUser as IUser);
    }
  }, [oldUser]);

  useEffect(() => {
    // If we have an id and are loading, mark fetch as started
    if (id && (isLoading || dLoading) && !fetchStarted) {
      setFetchStarted(true);
      incrementLoading();
    }
    // If fetch was started and isLoading is now false, decrement
    if (fetchStarted && !isLoading && !dLoading) {
      decrementLoading();
      setFetchStarted(false); // Reset for next fetch
    }
    // eslint-disable-next-line
  }, [id, isLoading, dLoading]);

  useEffect(() => {
    validate();
  }, [user]);

  return (
    <EditFormWrapper editMsg={editMsg} newMsg={newMsg} isNew={!id}>
      <Form
        onSubmit={onSubmit}
        className="h-full w-full md:w-1/2 pb-2 flex flex-col"
      >
        {error && <InlineError statusCode={statusCode} title={error} />}
        <div className="space-y-4 h-full w-full py-2 overflow-y-auto grow">
          {(!id || isAdmin) && (
            <>
              {!updateUsername ? (
                <div className="w-full">
                  <Switch
                    aria-label="update-username"
                    color="primary"
                    size="sm"
                    isSelected={updateUsername || false}
                    onValueChange={(e) => setUpdateUsername(e.valueOf())}
                    autoFocus={true}
                  >
                    Update username?
                  </Switch>
                </div>
              ) : (
                <Input
                  isRequired
                  label="Username"
                  name="username"
                  placeholder="Enter username"
                  type="text"
                  value={user.username || ""}
                  onValueChange={(e) => {
                    setUser({ ...user, username: e });
                  }}
                  size="sm"
                  variant="bordered"
                  autoFocus={true}
                  errorMessage={errors?.username}
                  isInvalid={!!errors?.username}
                />
              )}
            </>
          )}
          {(!id || isAdmin) && (
            <>
              {!updatePassword ? (
                <div className="w-full">
                  <Switch
                    aria-label="update-password"
                    color="primary"
                    size="sm"
                    isSelected={updatePassword || false}
                    onValueChange={(e) => setUpdatePassword(e.valueOf())}
                  >
                    Update password?
                  </Switch>
                </div>
              ) : (
                <Input
                  label="Password"
                  name="password"
                  placeholder="Enter password (leave blank to keep unchanged)"
                  type="password"
                  value={user.password || ""}
                  onValueChange={(e) => {
                    setUser({ ...user, password: e });
                  }}
                  size="sm"
                  variant="bordered"
                  errorMessage={errors?.password}
                  isInvalid={!!errors?.password}
                />
              )}
            </>
          )}
          <Select
            label="Salutation"
            name="salutation"
            selectedKeys={[user?.salutation!]}
            variant="bordered"
            selectionMode="single"
            errorMessage={errors?.salutation}
            isInvalid={!!errors?.salutation}
            onSelectionChange={(key) => {
              setUser({
                ...user,
                salutation: key.currentKey! as Salutation,
              });
            }}
          >
            {salutations?.map((salutation) => (
              <SelectItem key={salutation}>
                {Salutation[salutation as keyof typeof Salutation]}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="First Name"
            name="firstname"
            placeholder="Enter first name"
            type="text"
            value={user?.firstname || ""}
            onValueChange={(e) => {
              setUser({ ...user, firstname: e });
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.firstname}
            isInvalid={!!errors?.firstname}
          />
          <Input
            label="Other Names"
            name="othernames"
            placeholder="Enter other names"
            type="text"
            value={user?.othernames || ""}
            onValueChange={(e) => {
              setUser({ ...user, othernames: e });
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.othernames}
            isInvalid={!!errors?.othernames}
          />
          <Input
            isRequired
            label="Last Name"
            name="lastname"
            placeholder="Enter last name"
            type="text"
            value={user?.lastname || ""}
            onValueChange={(e) => {
              setUser({ ...user, lastname: e });
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.lastname}
            isInvalid={!!errors?.lastname}
          />
          <Input
            isRequired
            label="Email"
            name="email"
            placeholder="Enter email"
            type="email"
            value={user?.email || ""}
            onValueChange={(e) => {
              setUser({ ...user, email: e });
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.email}
            isInvalid={!!errors?.email}
          />
          <Input
            label="Phone Number"
            name="phone"
            placeholder="Enter mobile number"
            type="text"
            value={user?.phone || ""}
            onValueChange={(e) => {
              setUser({ ...user, phone: e });
            }}
            size="sm"
            variant="bordered"
            errorMessage={errors?.phone}
            isInvalid={!!errors?.phone}
          />
          <Select
            isRequired
            label="Roles"
            name="roles"
            selectedKeys={user?.roles || []}
            variant="bordered"
            selectionMode="multiple"
            errorMessage={errors?.roles?.general}
            isInvalid={!!errors?.roles?.general}
            onSelectionChange={(keys) => {
              setUser({
                ...user,
                roles: Array.from(keys) as Role[],
              });
            }}
          >
            {roles?.map((type) => (
              <SelectItem key={type}>
                {Role[type as keyof typeof Role]}
              </SelectItem>
            ))}
          </Select>
          <Select
            isRequired
            label="Department"
            name="department"
            selectedKeys={[String(user?.department_id)]}
            variant="bordered"
            selectionMode="single"
            errorMessage={errors?.department_id}
            isInvalid={!!errors?.department_id}
            onSelectionChange={(key) => {
              setUser({
                ...user,
                department_id: Number(key.currentKey!),
              });
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
