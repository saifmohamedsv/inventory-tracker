import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sku, quantity, price } = body;

    // Validate required fields
    if (!name || !sku || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Create new product
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const sku = searchParams.get("sku");

    if (!id && !sku) {
      return NextResponse.json(
        { error: "Either id or sku is required" },
        { status: 400 }
      );
    }

    const where = id ? { id } : { sku: sku! };

    const product = await prisma.product.delete({
      where,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}
