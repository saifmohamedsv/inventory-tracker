"use client";

import { Button, useDisclosure } from "@heroui/react";

import ProductsTable from "./components/products-table";
import AddProductModal from "./components/product/add-product-modal";

import { PlusIcon } from "@/components/icons";
import { refreshProductsTable } from "@/lib/products";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <Button color="primary" startContent={<PlusIcon />} onPress={onOpen}>
            Add Product
          </Button>
        </div>
        <AddProductModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSuccess={() => refreshProductsTable()}
        />
        <ProductsTable />
      </div>
    </section>
  );
}
