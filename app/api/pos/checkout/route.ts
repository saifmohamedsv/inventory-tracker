import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Start a transaction to ensure all updates are atomic
    const result = await prisma.$transaction(async (tx) => {
      // Update inventory quantities
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: product.quantity - item.quantity,
          },
        });
      }

      // Create a sale record
      const sale = await tx.sale.create({
        data: {
          total: items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          ),
          items: {
            create: items.map((item: any) => ({
              product: {
                connect: {
                  id: item.productId,
                },
              },
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return sale;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process checkout" },
      { status: 400 }
    );
  }
}
