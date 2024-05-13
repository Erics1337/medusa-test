import { ProductMedia } from "types/product-media"
import { Variant } from "../../types/medusa"

export async function getProductMediaPreviewByVariant(
  variant: Variant
): Promise<ProductMedia> {
  const { product_medias } = await fetch(
    `${
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    }/store/product-media?variant_id=${variant.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err
    })

  return product_medias[0]
}
