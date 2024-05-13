import { Product } from "@medusajs/medusa"
import { ProductVariant } from "@medusajs/product"

export enum ProductMediaVariantType {
  PREVIEW = "preview",
  MAIN = "main",
}

export type ProductMedia = {
  id: string
  variant_id: string
  name?: string
  file_key?: string
  mime_type?: string
  created_at?: Date
  updated_at?: Date
  type?: ProductMediaVariantType
  variants?: ProductVariant[]
}

export type DigitalProduct = Omit<Product, "variants"> & {
  product_medias?: ProductMedia[]
  variants?: DigitalProductVariant[]
}

export type DigitalProductVariant = ProductVariant & {
  product_medias?: ProductMedia
}
