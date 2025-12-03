import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Form,
  Select,
  SelectItem,
} from "@heroui/react";
import { SignInIcon, XIcon } from "@phosphor-icons/react";
import { Salutation, Role } from "@/utils/types";

const salutations = Object.values(Salutation);

export default function RegisterModal({
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
  const [form, setForm] = useState({
    username: "",
    password: "",
    salutation: Salutation.MR,
    firstname: "",
    othernames: "",
    lastname: "",
    email: "",
    phone: "",
    department_id: 0,
  });
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    incrementLoading();

    try {
      const payload = {
        username: form.username,
        password: form.password,
        salutation: form.salutation,
        firstname: form.firstname,
        othernames: form.othernames,
        lastname: form.lastname,
        email: form.email,
        phone: form.phone,
        department_id: form.department_id || null,
        rolesString: Role.USER,
      };

      const response = await fetch("/api/user?action=save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      decrementLoading();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={false}
      backdrop="blur"
      radius="md"
      shadow="md"
      classNames={{
        wrapper: "py-2 overflow-hidden",
      }}
    >
      <ModalContent className="overflow-y-auto max-h-full">
        <ModalHeader className="text-xl font-bold text-foreground">
          Register
        </ModalHeader>
        <ModalBody>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Form onSubmit={onSubmit} className="space-y-3">
            <Input
              isRequired
              label="Username"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onValueChange={(v) => handleChange("username", v)}
              size="sm"
              variant="bordered"
            />
            <Input
              isRequired
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onValueChange={(v) => handleChange("password", v)}
              size="sm"
              variant="bordered"
            />
            <Select
              className="text-foreground"
              label="Salutation"
              selectedKeys={[form.salutation]}
              variant="bordered"
              onSelectionChange={(keys) =>
                handleChange("salutation", Array.from(keys)[0] as string)
              }
            >
              {salutations.map((s) => (
                <SelectItem key={s}>{s}</SelectItem>
              ))}
            </Select>
            <Input
              isRequired
              label="First Name"
              name="firstname"
              placeholder="Enter first name"
              value={form.firstname}
              onValueChange={(v) => handleChange("firstname", v)}
              size="sm"
              variant="bordered"
            />
            <Input
              label="Other Names"
              name="othernames"
              placeholder="Enter other names"
              value={form.othernames}
              onValueChange={(v) => handleChange("othernames", v)}
              size="sm"
              variant="bordered"
            />
            <Input
              isRequired
              label="Last Name"
              name="lastname"
              placeholder="Enter last name"
              value={form.lastname}
              onValueChange={(v) => handleChange("lastname", v)}
              size="sm"
              variant="bordered"
            />
            <Input
              isRequired
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onValueChange={(v) => handleChange("email", v)}
              size="sm"
              variant="bordered"
            />
            <Input
              label="Phone"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onValueChange={(v) => handleChange("phone", v)}
              size="sm"
              variant="bordered"
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              endContent={<SignInIcon weight="thin" size={25} />}
            >
              Register
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
