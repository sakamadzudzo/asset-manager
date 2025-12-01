import { addToast } from "@heroui/react";
import InlineError from "@/components/InlineError";

export default function useToastError({
  title,
  error,
  statusCode,
}: {
  title?: string;
  error: string;
  statusCode?: number;
}) {
  addToast({
    color: "danger",
    timeout: 4000,
    description: (
      <InlineError
        title={error || title || "Error occurred"}
        statusCode={statusCode}
      />
    ),
    variant: "bordered",
    radius: "sm",
    size: "sm",
  });
}
