"use client";
import { useProducts } from "@/app/hooks/use-products.hook";
import ProductFormModal from "./product-form-modal";

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
  const { error, isLoading, updateProduct } = useProducts({ onSuccess });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => {
    await updateProduct(e, product.id, onClose);
  };

  return (
    <ProductFormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title="Edit Product"
      submitButtonText="Update"
      isLoading={isLoading}
      error={error}
      initialData={{
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: product.price,
      }}
    />
  );
}
