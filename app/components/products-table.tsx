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
  Pagination,
} from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";

import { useProducts } from "../hooks/use-products.hook";
import { useProduct } from "../hooks/use-product.hook";

import EditProductModal from "./product/edit-product-modal";
import ProductDetailsModal from "./product/product-details-modal";

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
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();

  const { products, error, isLoading, pagination, handlePageChange } =
    useProducts();

  const { deleteProductById, isDeleting } = useProduct({
    onSuccess: refreshProductsTable,
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onEditOpen();
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    onDetailsOpen();
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
              <Button
                isIconOnly
                className="text-default-400 text-lg"
                variant="light"
                onPress={() => handleViewDetails(product)}
              >
                <EyeIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Edit Product">
              <Button
                isIconOnly
                className="text-default-400 text-lg"
                variant="light"
                onPress={() => handleEdit(product)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete Product">
              <Button
                isIconOnly
                className="text-lg"
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
    <div className="space-y-4">
      {error && <div className="text-danger text-sm mb-4">{error}</div>}

      {selectedProduct && (
        <>
          <EditProductModal
            isOpen={isEditOpen}
            product={selectedProduct}
            onOpenChange={onEditOpenChange}
            onSuccess={() => refreshProductsTable()}
          />
          <ProductDetailsModal
            isOpen={isDetailsOpen}
            product={selectedProduct}
            onOpenChange={onDetailsOpenChange}
          />
        </>
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

      <div className="flex justify-center">
        <Pagination
          showControls
          initialPage={1}
          page={pagination.page}
          total={pagination.totalPages}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
