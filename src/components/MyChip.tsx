import { Chip, ChipProps } from "@heroui/react";

type MyChipProps = {
  data: string;
  size?: "sm" | "md" | "lg" | undefined;
  variant?:
    | "flat"
    | "solid"
    | "light"
    | "bordered"
    | "faded"
    | "shadow"
    | "dot"
    | undefined;
  className?: string;
};

export default function MyChip({
  data,
  size = "sm",
  variant = "flat",
  className = "",
}: MyChipProps) {
  const statusColorMap: Record<string, ChipProps["color"]> = {
    ACTIVE: "success",
    INACTIVE: "secondary",
    SUSPENDED: "warning",
    DELETED: "danger",
    PENDING: "secondary",
    APPROVED: "success",
    REJECTED: "warning",
    BLOCKED: "warning",
    UNBLOCKED: "success",
    ENABLED: "primary",
    DISABLED: "danger",
  };

  return (
    <Chip
      className={`capitalize ${className}`}
      color={statusColorMap[data]}
      size={size}
      variant={variant}
    >
      {data}
    </Chip>
  );
}
