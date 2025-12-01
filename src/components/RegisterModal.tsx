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

const salutations = ["MR", "MRS", "MS", "DR", "PROF"];
const roles = ["ADMIN", "TEACHER", "PARENT", "STUDENT"];

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
    salutation: "MR",
    firstname: "",
    othernames: "",
    lastname: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    role: "ADMIN",
  });
  const [submitted, setSubmitted] = useState<any>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    incrementLoading();

    // Build the JSON object as per your API
    const payload = {
      datestamp: new Date().toISOString(),
      status: "ACTIVE",
      id: 0,
      username: form.username,
      password: form.password,
      verified: false,
      enabled: true,
      changePassword: true,
      person: {
        datestamp: new Date().toISOString(),
        status: "ACTIVE",
        id: 0,
        salutation: form.salutation,
        firstname: form.firstname,
        othernames: form.othernames,
        lastname: form.lastname,
        email: form.email,
        mobileNumber: form.mobileNumber,
        mobileNumber2: "",
        telNumber: "",
        whatsapp: "",
        facebook: "",
        linkedin: "",
        dateOfBirth: form.dateOfBirth,
      },
      roles: [form.role],
    };

    setTimeout(() => {
      decrementLoading();
      setSubmitted(payload);
      onOpenChange(false);
    }, 2000);

    // Here you would POST `payload` to your register endpoint
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
              label="Mobile Number"
              name="mobileNumber"
              placeholder="Enter mobile number"
              value={form.mobileNumber}
              onValueChange={(v) => handleChange("mobileNumber", v)}
              size="sm"
              variant="bordered"
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onValueChange={(v) => handleChange("dateOfBirth", v)}
              size="sm"
              variant="bordered"
            />
            <Select
              label="Role"
              selectedKeys={[form.role]}
              variant="bordered"
              onSelectionChange={(keys) =>
                handleChange("role", Array.from(keys)[0] as string)
              }
            >
              {roles.map((r) => (
                <SelectItem key={r}>{r}</SelectItem>
              ))}
            </Select>
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
