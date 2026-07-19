import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import CategoryExtensionModule from "../modules/categoryExtension"

export default defineLink(
  ProductModule.linkable.productCategory,
  CategoryExtensionModule.linkable.categoryImage
)
