import { FormEvent, useState } from "react";

interface UseProductsProps {
  onSuccess?: () => void;
}

export function useProducts({ onSuccess }: UseProductsProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const addProduct = async (
    e: FormEvent<HTMLFormElement>,
    onClose: () => void
  ) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        sku: formData.get("sku"),
        quantity: formData.get("quantity"),
        price: formData.get("price"),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create product");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    onClose: () => void
  ) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name"),
        sku: formData.get("sku"),
        quantity: formData.get("quantity"),
        price: formData.get("price"),
      };

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProductById = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    error,
    isLoading,
    isDeleting,
    addProduct,
    updateProduct,
    deleteProductById,
  };
}
