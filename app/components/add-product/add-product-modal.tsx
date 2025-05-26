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

import { useProducts } from "@/app/hooks/use-products.hook";

interface Props {
  onSuccess?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function AddProductModal({
  onSuccess,
  isOpen,
  onOpenChange,
}: Props) {
  const { error, isLoading, addProduct } = useProducts({ onSuccess });

  return (
    <div className="place-self-end">
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <Form
              className="space-y-4"
              onSubmit={(e) => addProduct(e, onClose)}
            >
              <ModalHeader className="flex flex-col gap-1">
                Add New Product
              </ModalHeader>
              <ModalBody className="w-full">
                {error && (
                  <div className="text-danger text-sm mb-4">{error}</div>
                )}
                <Input
                  isRequired
                  errorMessage="Please enter a product name"
                  label="Product Name"
                  labelPlacement="outside"
                  name="name"
                  placeholder="Enter product name"
                />
                <Input
                  isRequired
                  errorMessage="Please enter a valid SKU"
                  label="SKU"
                  labelPlacement="outside"
                  name="sku"
                  placeholder="Enter SKU"
                />
                <Input
                  isRequired
                  errorMessage="Please enter a valid quantity"
                  label="Quantity"
                  labelPlacement="outside"
                  name="quantity"
                  placeholder="Enter quantity"
                  type="number"
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
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" isLoading={isLoading} type="submit">
                  Save
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
