import CategoryExtensionModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CATEGORY_EXTENSION_MODULE = "categoryExtension"

export default Module(CATEGORY_EXTENSION_MODULE, {
  service: CategoryExtensionModuleService,
})
