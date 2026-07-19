import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  
  const { limit, offset, order, fields, ...restQuery } = req.query
  const take = limit ? parseInt(limit as string) : 100
  const skip = offset ? parseInt(offset as string) : 0

  const { data: product_categories } = await query.graph({
    entity: "product_category",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "is_active",
      "is_internal",
      "parent_category_id",
      "created_at",
      "updated_at",
      "category_image.id",
      "category_image.image_url",
      "category_children.id",
      "category_children.name",
      "category_children.handle",
      "parent_category.id",
      "parent_category.name",
      "parent_category.handle"
    ],
    filters: restQuery,
    pagination: {
      take,
      skip
    }
  })

  res.json({ product_categories })
}
