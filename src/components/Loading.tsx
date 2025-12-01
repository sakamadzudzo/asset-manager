import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Spinner,
} from "@heroui/react";

export default function Loading({ isOpen }: { isOpen: boolean }) {
    const { onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Modal isOpen={isOpen}
                className={`h-2/3 aspect-square `}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
                backdrop="blur"
                hideCloseButton={true}
                radius="md"
                shadow="md"
            >
                <ModalContent className="flex justify-center items-center">
                    <Spinner variant="dots" color="primary" />
                </ModalContent>
            </Modal>
        </>
    )
}