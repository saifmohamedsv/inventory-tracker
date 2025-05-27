import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function generateRandomProduct(index: number) {
  return {
    name: `Test Product ${index + 1}`,
    sku: `SKU-${String(index + 1).padStart(3, "0")}`,
    quantity: Math.floor(Math.random() * 100) + 1,
    price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
  };
}

export async function POST() {
  try {
    // Clear existing products
    await prisma.product.deleteMany();

    // Generate 100 products
    const products = Array.from({ length: 100 }, (_, index) =>
      generateRandomProduct(index)
    );

    // Insert all products
    await prisma.product.createMany({
      data: products,
    });

    return NextResponse.json({
      message: "Successfully seeded 100 products",
      count: products.length,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Error seeding database" },
      { status: 500 }
    );
  }
}
