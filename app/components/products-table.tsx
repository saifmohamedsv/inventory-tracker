"use client";
import { Key, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";

import { useProducts } from "../hooks/use-products.hook";
import { useProduct } from "../hooks/use-product.hook";

import EditProductModal from "./product/edit-product-modal";

import { DeleteIcon, EditIcon, EyeIcon } from "@/components/icons";
import { refreshProductsTable } from "@/lib/products";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export default function ProductsTable() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { products, error, isLoading } = useProducts();
  const { deleteProductById, isDeleting } = useProduct({
    onSuccess: refreshProductsTable,
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "SKU", uid: "sku" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "PRICE", uid: "price" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (product: Product, columnKey: Key) => {
    switch (columnKey) {
      case "price":
        return `$${product.price.toFixed(2)}`;
      case "createdAt":
        return new Date(product.createdAt).toLocaleDateString();
      case "actions":
        return (
          <div className="relative flex items-center">
            <Tooltip content="View Details">
              <Button isIconOnly className="text-default-400" variant="light">
                <EyeIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Product">
              <Button
                isIconOnly
                className="text-default-400"
                variant="light"
                onPress={() => handleEdit(product)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete Product">
              <Button
                isIconOnly
                color="danger"
                isLoading={isDeleting}
                variant="light"
                onPress={() => deleteProductById(product.id)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return product[columnKey as keyof Product];
    }
  };

  return (
    <div>
      {error && <div className="text-danger text-sm mb-4">{error}</div>}

      {selectedProduct && (
        <EditProductModal
          isOpen={isOpen}
          product={selectedProduct}
          onOpenChange={onOpenChange}
          onSuccess={() => refreshProductsTable()}
        />
      )}

      <Table aria-label="Products table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={products}
          loadingContent={<div>Loading...</div>}
          loadingState={isLoading || isDeleting ? "loading" : "idle"}
        >
          {(product) => (
            <TableRow key={product.id}>
              {(columnKey) => (
                <TableCell>{renderCell(product, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
