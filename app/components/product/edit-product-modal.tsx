"use client";
import ProductFormModal from "./product-form-modal";

import { useProduct } from "@/app/hooks/use-product.hook";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface Props {
  product: Product;
  onSuccess?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function EditProductModal({
  product,
  onSuccess,
  isOpen,
  onOpenChange,
}: Props) {
  const { error, isLoading, updateProduct } = useProduct({
    onSuccess,
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void,
  ) => {
    await updateProduct(e, product.id, onClose);
  };

  return (
    <ProductFormModal
      error={error}
      initialData={{
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: product.price,
      }}
      isLoading={isLoading}
      isOpen={isOpen}
      submitButtonText="Update"
      title="Edit Product"
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  );
}
