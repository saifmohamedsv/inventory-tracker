import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  createdAt: string;
}
