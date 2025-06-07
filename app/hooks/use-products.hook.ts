import { useState, useEffect } from "react";

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

interface Props {
  selectedCategory?: string;
}

export function useProducts({ selectedCategory }: Props = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchProducts = async (page = 1, limit = 10, categoryId?: string) => {
    setIsLoading(true);
    try {
      const url = new URL("/api/products", window.location.origin);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", limit.toString());
      if (categoryId) {
        url.searchParams.set("categoryId", categoryId);
      }
      const response = await fetch(url.toString());

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
    fetchProducts(newPage, pagination.limit, selectedCategory);
  };

  useEffect(() => {
    // Always start with page 1 on initial load
    fetchProducts(1);

    // Add event listener for table refresh
    const handleRefresh = () => fetchProducts(1);

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
