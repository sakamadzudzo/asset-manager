import InlineSuccess from "@/components/InlineSuccess";
import { addToast } from "@heroui/react";

export default function useToastSuccess({
  title,
  description,
  statusCode,
}: {
  title?: string;
  description: string;
  statusCode?: number;
}) {
  addToast({
    color: "success",
    timeout: 4000,
    description: (
      <InlineSuccess
        title={description || title || "Success"}
        statusCode={statusCode}
      />
    ),
    variant: "bordered",
    radius: "sm",
    size: "sm",
  });
}
