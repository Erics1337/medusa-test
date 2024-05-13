// Combined imports
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { isEqual } from "lodash"
import { Button } from "@medusajs/ui"
import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { ProductMedia } from "types/product-media"
import { Variant } from "../../../../types/medusa"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"
import MobileActions from "../mobile-actions"
import ProductPrice from "../product-price"
import ProductMediaPreview from "../product-media-preview"
import { useIntersection } from "@lib/hooks/use-in-view"
import { addToCart } from "@modules/cart/actions"
import { getProductMediaPreviewByVariant } from "../../actions"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
  disabled?: boolean
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  region,
  disabled,
}) => {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [productMedia, setProductMedia] = useState<ProductMedia>()

  const countryCode = useParams().countryCode as string
  const variants = product.variants

  useEffect(() => {
    const optionObj: Record<string, string> = {}
    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }
    setOptions(optionObj)
  }, [product])

  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}
    for (const variant of variants) {
      if (!variant.options || !variant.id) continue
      const temp: Record<string, string> = {}
      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }
      map[variant.id] = temp
    }
    return map
  }, [variants])

  const variant = useMemo(() => {
    let variantId: string | undefined = undefined
    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }
    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])

  useEffect(() => {
    const getProductMedia = async () => {
      if (!variant) return
      const media = await getProductMediaPreviewByVariant(variant as Variant)
      setProductMedia(media)
    }
    getProductMedia()
  }, [variant])

  const inStock = useMemo(() => {
    if (variant && !variant.manage_inventory) return true
    if (variant && variant.allow_backorder) return true
    if (variant?.inventory_quantity && variant.inventory_quantity > 0)
      return true
    return false
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!variant?.id) return
    setIsAdding(true)
    await addToCart({ variantId: variant.id, quantity: 1, countryCode })
    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={(update) =>
                      setOptions({ ...options, ...update })
                    }
                    title={option.title}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
          <ProductPrice product={product} variant={variant} region={region} />
          {productMedia && <ProductMediaPreview media={productMedia} />}
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !variant || !!disabled || isAdding}
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!variant
            ? "Select variant"
            : !inStock
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={variant}
          region={region}
          options={options}
          updateOptions={(update) => setOptions({ ...options, ...update })}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}

export default ProductActions
