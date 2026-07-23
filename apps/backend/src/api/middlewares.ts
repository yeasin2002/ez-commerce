import { defineMiddlewares } from "@medusajs/framework/http";
import { newsletterStoreMiddlewares } from "./store/newsletter/middlewares";

export default defineMiddlewares({
  routes: [
    ...newsletterStoreMiddlewares,
  ],
});
