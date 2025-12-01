import { useCategoryById } from "@/hooks/useCategorys";
import { Button, Link, Spacer } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { PencilSimpleLineIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import React from "react";
import useToastError from "@/hooks/toasts/ToastError";

export default function OneCategoryPage({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const profile: string | null = searchParams.get("profile");
  const { category, isLoading, isError, errorMessage, statusCode } =
    useCategoryById(id!);
  const loadingRef = React.useRef(false);

  React.useEffect(() => {
    if (isLoading && !loadingRef.current) {
      incrementLoading();
      loadingRef.current = true;
    }
    if (!isLoading && loadingRef.current) {
      decrementLoading();
      loadingRef.current = false;
    }
  }, [isLoading, incrementLoading, decrementLoading]);

  const XMark: React.ReactNode = <XIcon weight="thin" size={25} color="red" />;
  const CheckMark: React.ReactNode = (
    <CheckIcon weight="thin" size={25} color="green" />
  );

  React.useEffect(() => {
    if (isError) {
      useToastError({
        error: errorMessage || "",
        statusCode: statusCode || 500,
      });
    }
  }, [isError]);

  return (
    <div className="grow overflow-auto">
      <div aria-label="Page buttons" className="w-full flex justify-end gap-4">
        <Button
          as={Link}
          color="primary"
          endContent={<PencilSimpleLineIcon weight="thin" size={34} />}
          href={`/category/edit?id=${category?.id}`}
        >
          Edit
        </Button>
      </div>
      <div className="mx-8">
        <div className="info-row">
          <div className="info-row-title">Name:</div>
          <div className="info-row-content whitespace-pre-wrap">
            {category?.name}
          </div>
        </div>
        <Spacer x={4} y={4} />
      </div>
    </div>
  );
}
