"use client";
import ProductFormModal from "./product-form-modal";

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
