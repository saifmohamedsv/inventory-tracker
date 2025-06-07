"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@heroui/input";
import { addToast, Button, Card, Select, SelectItem } from "@heroui/react";

import { useProducts } from "../hooks/use-products.hook";
import { useCategories } from "../hooks/use-categories.hook";

import { refreshProductsTable } from "@/lib/products";
import { Product } from "@/types";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POSPage() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const filteredProducts = products?.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedCategory || product.category?.id === selectedCategory)
  );

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const response = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process checkout");
      }

      addToast({
        title: "Success",
        description: "Sale completed successfully",
      });

      setCart([]);
      refreshProductsTable();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message,
        color: "danger",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Selection */}
        <div className="md:col-span-2">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              className="w-48"
              placeholder="Filter by category"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onSelectionChange={(keys) =>
                setSelectedCategory(Array.from(keys)[0] as string)
              }
            >
              {[
                <SelectItem key="all">All Categories</SelectItem>,
                ...categories.map((category) => (
                  <SelectItem key={category.id}>{category.name}</SelectItem>
                )),
              ]}
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredProducts?.map((product) => (
              <Card key={product.id} className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
                {product.category && (
                  <p className="text-sm text-muted-foreground">
                    Category: {product.category.name}
                  </p>
                )}
                <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
                <p className="text-sm">Stock: {product.quantity}</p>
                <Button
                  className="w-full mt-2"
                  disabled={product.quantity === 0}
                  onPress={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-card rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-muted-foreground">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  isLoading={isCheckingOut}
                  onPress={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
