import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, ctx: any) {
  try {
    const body = await request.json();
    // get the search params from request.
    const params = ctx.params as { id: string };
    const { id } = params;
    const { name, sku, quantity, price, categoryId } = body;

    // Validate required fields
    if (!name || !sku || quantity === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if SKU already exists for a different product
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku,
        id: { not: id },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this SKU already exists" },
        { status: 400 }
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        sku,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch {
    // Log error to your preferred error tracking service
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}
