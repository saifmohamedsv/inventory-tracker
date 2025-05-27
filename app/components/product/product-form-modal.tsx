"use client";
import { FormEvent } from "react";
import { Button, Input } from "@heroui/react";

import SharedModal from "../shared/modal";

interface ProductFormData {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface Props {
  error?: string;
  isLoading?: boolean;
  isOpen?: boolean;
  initialData?: ProductFormData;
  submitButtonText?: string;
  title: string;
  onOpenChange?: (isOpen: boolean) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    onClose: () => void,
  ) => Promise<void>;
}

export default function ProductFormModal({
  error,
  isLoading,
  isOpen,
  initialData,
  submitButtonText = "Submit",
  title,
  onOpenChange,
  onSubmit,
}: Props) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    await onSubmit(e, () => onOpenChange?.(false));
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        color="danger"
        variant="light"
        onPress={() => onOpenChange?.(false)}
      >
        Cancel
      </Button>
      <Button
        color="primary"
        form="product-form"
        isLoading={isLoading}
        type="submit"
      >
        {submitButtonText}
      </Button>
    </div>
  );

  return (
    <SharedModal
      footer={footer}
      isOpen={isOpen}
      title={title}
      onOpenChange={onOpenChange}
    >
      <form className="space-y-4" id="product-form" onSubmit={handleSubmit}>
        {error && <div className="text-danger text-sm">{error}</div>}

        <div className="space-y-2">
          <Input
            isRequired
            defaultValue={initialData?.name}
            label="Name"
            name="name"
            placeholder="Enter product name"
          />
        </div>

        <div className="space-y-2">
          <Input
            isRequired
            defaultValue={initialData?.sku}
            label="SKU"
            name="sku"
            placeholder="Enter product SKU"
          />
        </div>

        <div className="space-y-2">
          <Input
            isRequired
            defaultValue={initialData?.quantity?.toString()}
            label="Quantity"
            name="quantity"
            placeholder="Enter product quantity"
            type="number"
          />
        </div>

        <div className="space-y-2">
          <Input
            isRequired
            defaultValue={initialData?.price?.toString()}
            label="Price"
            name="price"
            placeholder="Enter product price"
            step="0.01"
            type="number"
          />
        </div>
      </form>
    </SharedModal>
  );
}
