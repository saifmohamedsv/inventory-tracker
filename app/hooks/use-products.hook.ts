import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

interface Props {}

export function useProducts({}: Props = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProducts = async (page = 1, limit = 10) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: ProductsResponse = await response.json();

      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch products"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, pagination.limit);
  };

  useEffect(() => {
    fetchProducts();

    // Add event listener for table refresh
    const handleRefresh = () =>
      fetchProducts(pagination.page, pagination.limit);

    window.addEventListener("refresh-table", handleRefresh);

    return () => {
      window.removeEventListener("refresh-table", handleRefresh);
    };
  }, []);

  return {
    products,
    error,
    isLoading,
    pagination,
    handlePageChange,
    fetchProducts,
  };
}
