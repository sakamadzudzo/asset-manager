import React from "react";
import { Form, Input, Button, addToast } from "@heroui/react";
import InlineError from "@/components/InlineError";
import EditFormWrapper from "@/components/EditFormWrapper";
import InlineSuccess from "./InlineSuccess";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const ChangePassword = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [statusCode, setStatusCode] = React.useState(0);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatusCode(0);
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      setStatusCode(400);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setStatusCode(400);
      return;
    }

    try {
      const passwordDto = {
        currentPassword,
        newPassword,
      };
      const res = await fetch("/api/user?action=change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordDto),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Password change failed");
        setStatusCode(res.status || 500);
        addToast({
          closeIcon: true,
          title: res.status || 500,
          description: data.error || "Password change failed",
          timeout: 2500,
          variant: "flat",
          color: "danger",
        });
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully!");
      setStatusCode(res.status || 200);
      addToast({
        closeIcon: true,
        title: "Success",
        description: message,
        timeout: 2500,
        variant: "flat",
        color: "success",
      });
    } catch (err: any) {
      setError("Network error");
      setStatusCode(err.status || 500);
    }
  };

  const msg = (
    <div className="w-full">
      <div className="font-bold text-lg w-full flex justify-center">
        Change Password
      </div>
      <div className="flex justify-center">Update your account password</div>
    </div>
  );

  return (
    <EditFormWrapper editMsg={msg} newMsg={msg} isNew={false}>
      <Form
        onSubmit={onSubmit}
        className="h-full w-full md:w-1/2 pb-2 flex flex-col"
      >
        {error && <InlineError statusCode={statusCode} title={error} />}
        {success && <InlineSuccess statusCode={statusCode} title={message!} />}
        <div className="space-y-4 h-full w-full py-2 overflow-y-auto grow">
          <Input
            isRequired
            label="Current Password"
            name="currentPassword"
            placeholder="Enter current password"
            type="password"
            value={currentPassword}
            onValueChange={setCurrentPassword}
            size="sm"
            variant="bordered"
            autoFocus={true}
          />
          <Input
            isRequired
            label="New Password"
            name="newPassword"
            placeholder="Enter new password"
            type="password"
            value={newPassword}
            onValueChange={setNewPassword}
            size="sm"
            variant="bordered"
          />
          <Input
            isRequired
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm new password"
            type="password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            size="sm"
            variant="bordered"
          />
        </div>
        <Button type="submit" color="primary" className="w-full px-5 py-4">
          Change Password
        </Button>
      </Form>
    </EditFormWrapper>
  );
};
