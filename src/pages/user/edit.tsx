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

export default function UserEdit({
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
                  onValueChange={(e) => setUser({ ...user, username: e })}
                  size="sm"
                  variant="bordered"
                  autoFocus={true}
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
                  onValueChange={(e) => setUser({ ...user, password: e })}
                  size="sm"
                  variant="bordered"
                />
              )}
            </>
          )}
          <Select
            isRequired
            label="Salutation"
            name="salutation"
            selectedKeys={[user?.salutation?.valueOf()]}
            variant="bordered"
            selectionMode="single"
            errorMessage={errors?.salutation}
            isInvalid={!!errors?.salutation}
            onSelectionChange={(key) =>
              setUser({
                ...user,
                salutation: key.currentKey! as Salutation,
              })
            }
          >
            {salutations?.map((type) => (
              <SelectItem key={type}>
                {Salutation[type as keyof typeof Salutation]}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="First Name"
            name="firstname"
            placeholder="Enter first name"
            type="text"
            value={user?.firstname || ""}
            onValueChange={(e) => setUser({ ...user, firstname: e })}
            size="sm"
            variant="bordered"
          />
          <Input
            label="Other Names"
            name="othernames"
            placeholder="Enter other names"
            type="text"
            value={user?.othernames || ""}
            onValueChange={(e) => setUser({ ...user, othernames: e })}
            size="sm"
            variant="bordered"
          />
          <Input
            label="Last Name"
            name="lastname"
            placeholder="Enter last name"
            type="text"
            value={user?.lastname || ""}
            onValueChange={(e) => setUser({ ...user, lastname: e })}
            size="sm"
            variant="bordered"
          />
          <Input
            label="Email"
            name="email"
            placeholder="Enter email"
            type="email"
            value={user?.email || ""}
            onValueChange={(e) => setUser({ ...user, email: e })}
            size="sm"
            variant="bordered"
          />
          <Input
            label="Phone Number"
            name="phone"
            placeholder="Enter mobile number"
            type="text"
            value={user?.phone || ""}
            onValueChange={(e) => setUser({ ...user, phone: e })}
            size="sm"
            variant="bordered"
          />
          <Select
            isRequired
            label="Roles"
            name="roles"
            selectedKeys={user?.roles || []}
            variant="bordered"
            selectionMode="single"
            errorMessage={errors?.roles?.general}
            isInvalid={!!errors?.roles?.general}
            onSelectionChange={(keys) =>
              setUser({
                ...user,
                roles: Array.from(keys) as Role[],
              })
            }
          >
            {roles?.map((type) => (
              <SelectItem key={type}>
                {Role[type as keyof typeof Role]}
              </SelectItem>
            ))}
          </Select>
        </div>
        <Button type="submit" color="primary" className="w-full px-5">
          Save
        </Button>
      </Form>
    </EditFormWrapper>
  );
}
