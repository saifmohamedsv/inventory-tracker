"use client";
import { useProducts } from "@/app/hooks/use-products.hook";
import ProductFormModal from "./product-form-modal";

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
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={addProduct}
      title="Add New Product"
      submitButtonText="Save"
      isLoading={isLoading}
      error={error}
    />
  );
}
