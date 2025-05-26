import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface Props {}

export function useProducts({}: Props = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch products"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Add event listener for table refresh
    const handleRefresh = () => fetchProducts();

    window.addEventListener("refresh-table", handleRefresh);

    return () => {
      window.removeEventListener("refresh-table", handleRefresh);
    };
  }, []);

  return {
    products,
    error,
    isLoading,
    fetchProducts,
  };
}
