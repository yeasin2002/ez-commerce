import { model } from "@medusajs/framework/utils"

const CategoryImage = model.define("category_image", {
  id: model.id().primaryKey(),
  image_url: model.text(),
})

export default CategoryImage
