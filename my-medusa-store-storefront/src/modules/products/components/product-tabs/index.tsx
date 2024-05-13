// Combined imports
import React, { useMemo } from "react"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Accordion from "./accordion"

type ProductTabsProps = {
  product: PricedProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = useMemo(
    () => [
      {
        label: "Product Information",
        component: <ProductInfoTab product={product} />,
      },
      {
        label: "Shipping & Returns",
        component: <ShippingInfoTab />,
      },
      {
        label: "E-book delivery",
        component: <EbookDeliveryInfoTab />,
      },
    ],
    [product]
  )

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, index) => (
          <Accordion.Item
            key={index}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const metadata = useMemo(() => {
    if (!product.metadata) return []
    return Object.keys(product.metadata || {}).map((key) => {
      return { key, value: product.metadata?.[key] }
    })
  }, [product])

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        {metadata.slice(0, 4).map(({ key, value }, index) => (
          <div key={index} className="flex flex-col gap-y-4">
            <span className="font-semibold">{key}</span>
            <p>{value || "-"}</p>
          </div>
        ))}
      </div>
      {product.tags?.length ? (
        <div>
          <span className="font-semibold">Tags</span>
          {/* Mapping tags */}
        </div>
      ) : null}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const EbookDeliveryInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Instant delivery</span>
            <p className="max-w-sm">
              Your e-book will be delivered instantly via email. You can also
              download it from your account anytime.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Free previews</span>
            <p className="max-w-sm">
              Get a free preview of the e-book before you buy it. Just click the
              button above to download it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
