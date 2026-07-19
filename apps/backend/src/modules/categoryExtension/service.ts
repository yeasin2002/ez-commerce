import { MedusaService } from "@medusajs/framework/utils"
import CategoryImage from "./models/category-image"

class CategoryExtensionModuleService extends MedusaService({
  CategoryImage,
}) {}

export default CategoryExtensionModuleService
