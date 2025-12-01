import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Form,
} from "@heroui/react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useRouter } from "next/navigation";
import InlineError from "./InlineError";
import { SignInIcon, XIcon } from "@phosphor-icons/react";

export default function LoginModal({
  isOpen,
  onOpenChange,
  incrementLoading,
  decrementLoading,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatusCode(0);
    incrementLoading();

    try {
      const res = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password,
          rememberMe: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setStatusCode(res.status || 500);
        decrementLoading();
        return;
      }

      const data = await res.json();
      const token = data.token;
      const user = data.user;
      dispatch(setCredentials({ token, user }));

      decrementLoading();
      onOpenChange(false);
      // router.push("/");
    } catch (err: any) {
      setError("Network error");
      setStatusCode(err.status || 500);
      decrementLoading();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError(null);
      setStatusCode(0);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={false}
      backdrop="blur"
      radius="md"
      shadow="md"
    >
      <ModalContent>
        <ModalHeader className="text-xl font-bold">Login</ModalHeader>
        <ModalBody>
          <Form onSubmit={onSubmit} className="space-y-4">
            {error && <InlineError statusCode={statusCode} title={error} />}
            <Input
              isRequired
              label="Username"
              name="username"
              placeholder="Enter your username"
              type="text"
              value={username}
              onValueChange={setUsername}
              size="sm"
              variant="bordered"
              autoFocus={true}
            />
            <Input
              isRequired
              label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onValueChange={setPassword}
              size="sm"
              variant="bordered"
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              endContent={<SignInIcon weight="thin" size={25} />}
            >
              Login
            </Button>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            className="w-full"
            onPress={() => onOpenChange(false)}
            endContent={<XIcon weight="thin" size={25} />}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
