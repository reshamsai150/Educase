import {PAGE_SIZE, Product, ProductsResponse} from '../types/product';

const BASE_URL = 'https://dummyjson.com/products';

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error('Something went wrong while loading products.');
  }

  return (await response.json()) as T;
}

export function fetchProductList(page: number): Promise<ProductsResponse> {
  const skip = (page - 1) * PAGE_SIZE;
  return request<ProductsResponse>(`?limit=${PAGE_SIZE}&skip=${skip}`);
}

export function searchProductList(
  query: string,
  page: number,
): Promise<ProductsResponse> {
  const skip = (page - 1) * PAGE_SIZE;
  return request<ProductsResponse>(
    `/search?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&skip=${skip}`,
  );
}

export function fetchProductDetail(productId: number): Promise<Product> {
  return request<Product>(`/${productId}`);
}
