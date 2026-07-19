import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { setCategoryImageWorkflow } from "../../../../../workflows/set-category-image"

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { image_url } = req.body as { image_url: string }

  const { result } = await setCategoryImageWorkflow(req.scope).run({
    input: {
      category_id: id,
      image_url,
    },
  })

  res.json({ success: true, category_image: result.categoryImage })
}
