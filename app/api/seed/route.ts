import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const categories = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Beauty & Personal Care",
  "Books & Stationery",
  "Toys & Games",
];

function generateRandomProduct(
  index: number,
  categoryId: string,
  categoryIndex: number
) {
  const productNames = [
    "Premium",
    "Deluxe",
    "Professional",
    "Standard",
    "Basic",
    "Ultimate",
    "Essential",
    "Advanced",
  ];

  const productTypes = [
    "Gadget",
    "Device",
    "Tool",
    "Kit",
    "Set",
    "System",
    "Package",
    "Bundle",
  ];

  const name = `${productNames[index % productNames.length]} ${
    productTypes[Math.floor(index / productNames.length) % productTypes.length]
  } ${index + 1}`;

  // Create unique SKU by combining category index and product index
  const sku = `SKU-${String(categoryIndex).padStart(2, "0")}-${String(index + 1).padStart(3, "0")}`;

  return {
    name,
    sku,
    quantity: Math.floor(Math.random() * 100) + 1,
    price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    categoryId,
  };
}

export async function POST() {
  try {
    console.log("Starting database cleanup...");
    // Clear existing data
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log("Database cleanup completed");

    // Create categories one by one
    console.log("Creating categories...");
    const createdCategories = [];
    for (const name of categories) {
      try {
        const category = await prisma.category.create({
          data: { name },
        });
        createdCategories.push(category);
        console.log(`Created category: ${name}`);
      } catch (error) {
        console.error(`Error creating category ${name}:`, error);
        throw error;
      }
    }
    console.log("Categories created successfully");

    // Generate products for each category
    console.log("Generating products...");
    const productsPerCategory = 12; // 12 products per category
    const allProducts = [];

    for (
      let categoryIndex = 0;
      categoryIndex < createdCategories.length;
      categoryIndex++
    ) {
      const category = createdCategories[categoryIndex];
      const categoryProducts = Array.from(
        { length: productsPerCategory },
        (_, index) => generateRandomProduct(index, category.id, categoryIndex)
      );
      allProducts.push(...categoryProducts);
    }
    console.log(`Generated ${allProducts.length} products`);

    // Insert all products one by one
    console.log("Creating products...");
    for (const product of allProducts) {
      try {
        await prisma.product.create({
          data: product,
        });
      } catch (error) {
        console.error("Error creating product:", product, error);
        throw error;
      }
    }
    console.log("Products created successfully");

    return NextResponse.json({
      message: `Successfully seeded ${categories.length} categories and ${
        allProducts.length
      } products`,
      categories: categories.length,
      products: allProducts.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error seeding database",
      },
      { status: 500 }
    );
  }
}
