"use client";
import { Key, useState, ReactNode } from "react";
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
  Select,
  SelectItem,
} from "@heroui/react";
import { Tooltip } from "@heroui/tooltip";

import { useProducts } from "../hooks/use-products.hook";
import { useProduct } from "../hooks/use-product.hook";
import { useCategories } from "../hooks/use-categories.hook";

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
  category?: {
    id: string;
    name: string;
  };
}

export default function ProductsTable() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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

  const {
    products,
    error,
    isLoading,
    pagination,
    handlePageChange,
    fetchProducts,
  } = useProducts({ selectedCategory });
  const { categories } = useCategories();

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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchProducts(1, pagination.limit, categoryId);
  };

  const columns = [
    { name: "NAME", uid: "name" },
    { name: "SKU", uid: "sku" },
    { name: "CATEGORY", uid: "category" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "PRICE", uid: "price" },
    { name: "CREATED AT", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = (product: Product, columnKey: Key): ReactNode => {
    switch (columnKey) {
      case "price":
        return `$${product.price.toFixed(2)}`;
      case "createdAt":
        return new Date(product.createdAt).toLocaleDateString();
      case "category":
        return product.category?.name || "Uncategorized";
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
        return String(product[columnKey as keyof Product] ?? "");
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-danger text-sm mb-4">{error}</div>}

      <div className="flex justify-end mb-4">
        <Select
          className="max-w-xs"
          placeholder="Filter by category"
          selectedKeys={selectedCategory ? [selectedCategory] : []}
          onSelectionChange={(keys) =>
            handleCategoryChange(Array.from(keys)[0] as string)
          }
          items={[{ id: "", name: "All Categories" }, ...categories]}
        >
          {(category) => (
            <SelectItem key={category.id} textValue={category.name}>
              {category.name}
            </SelectItem>
          )}
        </Select>
      </div>

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
                <TableCell>
                  {renderCell(product, columnKey as keyof Product)}
                </TableCell>
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
