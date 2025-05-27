"use client";
import SharedModal from "../shared/modal";

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
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onOpenChange,
}: Props) {
  const details = [
    { label: "Name", value: product.name },
    { label: "SKU", value: product.sku },
    { label: "Quantity", value: product.quantity.toString() },
    { label: "Price", value: `$${product.price.toFixed(2)}` },
    {
      label: "Created At",
      value: new Date(product.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <SharedModal
      isOpen={isOpen}
      size="md"
      title="Product Details"
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4 pb-4">
        {details.map((detail) => (
          <div key={detail.label} className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-default-500">
              {detail.label}
            </span>
            <span className="text-base">{detail.value}</span>
          </div>
        ))}
      </div>
    </SharedModal>
  );
}
