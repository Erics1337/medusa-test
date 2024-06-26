import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import ProductMediaService from "../../../services/product-media"
import { MediaType } from "../../../models/product-media"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
	const productMediaService = req.scope.resolve<ProductMediaService>(
		"productMediaService"
	)
	// omitting pagination for simplicity
	const [productMedias, count] = await productMediaService.listAndCount(
		{
			type: MediaType.MAIN,
		},
		{
			relations: ["variant"],
		}
	)

	res.json({
		product_medias: productMedias,
		count,
	})
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	// validation omitted for simplicity

	// @ts-ignore
	const { variant_id, file_key, type = "main", name, mime_type } = req.body

	const productMediaService = req.scope.resolve<ProductMediaService>(
		"productMediaService"
	)
	const productMedia = await productMediaService.create({
		variant_id,
		file_key,
		type,
		name,
		mime_type,
	})

	res.json({
		product_media: productMedia,
	})
}
