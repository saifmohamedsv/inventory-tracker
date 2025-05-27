"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

interface ModalProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  isDismissable?: boolean;
  hideCloseButton?: boolean;
}

export default function SharedModal({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  size = "md",
  isDismissable = true,
  hideCloseButton = false,
}: ModalProps) {
  return (
    <Modal
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      isOpen={isOpen}
      size={size}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}
