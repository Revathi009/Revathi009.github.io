import { Category } from "./category";

export interface Product {
    [x: string]: any;
    _id: string;
    name: string;
    price: number;
    category: Category;
    productImage: string;
  }