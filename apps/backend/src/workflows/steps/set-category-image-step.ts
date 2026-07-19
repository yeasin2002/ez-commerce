import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

type Input = {
  category_id: string
  image_url: string
}

export const setCategoryImageStep = createStep(
  "set-category-image",
  async (input: Input, { container }) => {
    const categoryExtensionModuleService = container.resolve("categoryExtension")
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    // 1. Check if category already has a linked image
    const { data: categories } = await query.graph({
      entity: "product_category",
      fields: ["id", "category_image.*"],
      filters: { id: input.category_id }
    })

    const category = categories[0]
    let categoryImage
    let isNewLink = false
    let oldImageId: string | null = null

    if (category?.category_image) {
      // Update existing
      oldImageId = category.category_image.id
      categoryImage = await categoryExtensionModuleService.updateCategoryImages({
        id: category.category_image.id,
        image_url: input.image_url
      })
    } else {
      // Create new
      categoryImage = await categoryExtensionModuleService.createCategoryImages({
        image_url: input.image_url
      })
      isNewLink = true

      // Link it
      await link.create({
        [Modules.PRODUCT]: {
          product_category_id: input.category_id
        },
        "categoryExtension": {
          category_image_id: categoryImage.id
        }
      })
    }

    return new StepResponse(
      { categoryImage, isNewLink, oldImageId },
      { 
        category_id: input.category_id, 
        categoryImageId: categoryImage.id, 
        isNewLink, 
        oldImageId, 
        oldImageUrl: category?.category_image?.image_url 
      }
    )
  },
  // Compensation function for rollback
  async (prevData, { container }) => {
    if (!prevData) return

    const categoryExtensionModuleService = container.resolve("categoryExtension")
    const link = container.resolve(ContainerRegistrationKeys.LINK)

    if (prevData.isNewLink) {
      // Dismiss link and delete category image
      await link.dismiss({
        [Modules.PRODUCT]: {
          product_category_id: prevData.category_id
        },
        "categoryExtension": {
          category_image_id: prevData.categoryImageId
        }
      })
      await categoryExtensionModuleService.deleteCategoryImages(prevData.categoryImageId)
    } else if (prevData.oldImageId && prevData.oldImageUrl) {
      // Restore old image URL
      await categoryExtensionModuleService.updateCategoryImages({
        id: prevData.oldImageId,
        image_url: prevData.oldImageUrl
      })
    }
  }
)
