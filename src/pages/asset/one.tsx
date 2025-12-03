import { useAssetById, useSaveAsset } from "@/hooks/useAssets";
import {
  Accordion,
  AccordionItem,
  Button,
  Link,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import {
  Package,
  PencilSimpleLineIcon,
  TagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  XIcon,
} from "@phosphor-icons/react";
import React from "react";
import useToastError from "@/hooks/toasts/ToastError";
import { useRouter } from "next/router";

export default function OneAssetPage({
  incrementLoading,
  decrementLoading,
  resetLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
  resetLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const { asset, isLoading, isError, errorMessage, statusCode } = useAssetById(
    id!
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { saveAsset } = useSaveAsset();
  const router = useRouter();
  const loadingRef = React.useRef(false);

  const deleteAsset = async () => {
    await saveAsset(
      { ...asset, deleted: true },
      incrementLoading,
      resetLoading,
      () => router.push("/asset/all"),
      (error, statusCode) => {
        useToastError({ error, statusCode });
      }
    );
  };

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
          color="danger"
          endContent={<XIcon weight="thin" size={34} />}
          onPress={onOpen}
        >
          Delete
        </Button>
        <Button
          as={Link}
          color="primary"
          endContent={<PencilSimpleLineIcon weight="thin" size={34} />}
          href={`/asset/edit?id=${asset?.id}`}
        >
          Edit
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="bg-background text-foreground">
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this asset?</p>
            <p className="text-sm text-gray-500">{asset?.name}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={() => onOpenChange()}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => {
                deleteAsset();
                onOpenChange();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Accordion isCompact={true} defaultExpandedKeys={["1"]}>
        <AccordionItem
          key="1"
          aria-label="Asset Details"
          title="Asset Details"
          subtitle="Asset information and specifications."
          startContent={<Package weight="thin" size={34} />}
        >
          <div className="w-full px-4 flex flex-col">
            <div className="info-row">
              <div className="info-row-title">Asset Name:</div>
              <div className="info-row-content">{asset?.name}</div>
            </div>
            <Spacer x={4} y={4} />
            <div className="info-row">
              <div className="info-row-title">Description:</div>
              <div className="info-row-content">{asset?.description}</div>
            </div>
            <Spacer x={4} y={4} />
            <div className="info-row">
              <div className="info-row-title">Serial Number:</div>
              <div className="info-row-content">{asset?.serial_number}</div>
            </div>
            <Spacer x={4} y={4} />
            <div className="info-row">
              <div className="info-row-title">System ID:</div>
              <div className="info-row-content">{asset?.id}</div>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Classification"
          title="Classification"
          subtitle="Category and department information."
          startContent={<TagIcon weight="thin" size={34} />}
        >
          <div className="info-row">
            <div className="info-row-title">Category:</div>
            <div className="info-row-content">{asset?.category}</div>
          </div>
          <Spacer x={4} y={4} />
          <div className="info-row">
            <div className="info-row-title">Department:</div>
            <div className="info-row-content">{asset?.department}</div>
          </div>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Financial Details"
          title="Financial Details"
          subtitle="Cost and purchase information."
          startContent={<CurrencyDollarIcon weight="thin" size={34} />}
        >
          <div className="info-row">
            <div className="info-row-title">Cost:</div>
            <div className="info-row-content">{asset?.cost}</div>
          </div>
          <Spacer x={4} y={4} />
          <div className="info-row">
            <div className="info-row-title">Purchase Date:</div>
            <div className="info-row-content">
              {asset?.purchase_date
                ? new Date(asset.purchase_date).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </AccordionItem>
        <AccordionItem
          key="4"
          aria-label="Ownership"
          title="Ownership"
          subtitle="Asset owner information."
          startContent={<CalendarIcon weight="thin" size={34} />}
        >
          <div className="info-row">
            <div className="info-row-title">Owner:</div>
            <div className="info-row-content">{asset?.user}</div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
