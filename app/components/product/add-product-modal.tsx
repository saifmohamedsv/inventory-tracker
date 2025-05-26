"use client";
import ProductFormModal from "./product-form-modal";

import { useProduct } from "@/app/hooks/use-product.hook";

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
  const { error, isLoading, addProduct } = useProduct({ onSuccess });

  return (
    <ProductFormModal
      error={error}
      isLoading={isLoading}
      isOpen={isOpen}
      submitButtonText="Save"
      title="Add New Product"
      onOpenChange={onOpenChange}
      onSubmit={addProduct}
    />
  );
}
