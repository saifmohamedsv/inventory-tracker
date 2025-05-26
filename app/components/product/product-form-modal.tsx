"use client";
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

interface ProductFormData {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface ProductFormModalProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => Promise<void>;
  title: string;
  submitButtonText: string;
  isLoading?: boolean;
  error?: string;
  initialData?: Partial<ProductFormData>;
}

export default function ProductFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  submitButtonText,
  isLoading,
  error,
  initialData,
}: ProductFormModalProps) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <Form className="space-y-4" onSubmit={(e) => onSubmit(e, onClose)}>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="w-full">
              {error && <div className="text-danger text-sm mb-4">{error}</div>}
              <Input
                isRequired
                errorMessage="Please enter a product name"
                label="Product Name"
                labelPlacement="outside"
                name="name"
                placeholder="Enter product name"
                defaultValue={initialData?.name}
              />
              <Input
                isRequired
                errorMessage="Please enter a valid SKU"
                label="SKU"
                labelPlacement="outside"
                name="sku"
                placeholder="Enter SKU"
                defaultValue={initialData?.sku}
              />
              <Input
                isRequired
                errorMessage="Please enter a valid quantity"
                label="Quantity"
                labelPlacement="outside"
                name="quantity"
                placeholder="Enter quantity"
                type="number"
                defaultValue={initialData?.quantity?.toString()}
              />
              <Input
                isRequired
                errorMessage="Please enter a valid price"
                label="Price"
                labelPlacement="outside"
                name="price"
                placeholder="Enter price"
                step="0.01"
                type="number"
                defaultValue={initialData?.price?.toString()}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" isLoading={isLoading} type="submit">
                {submitButtonText}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
