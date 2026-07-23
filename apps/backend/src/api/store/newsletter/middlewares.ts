import { MiddlewareRoute, validateAndTransformBody } from "@medusajs/framework";
import { z } from "@medusajs/framework/zod";

export const CreateSubscriberSchema = z.object({
  email: z.string().email(),
});

export type CreateSubscriberSchema = z.infer<typeof CreateSubscriberSchema>;

export const newsletterStoreMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/store/newsletter",
    method: "POST",
    middlewares: [validateAndTransformBody(CreateSubscriberSchema)],
  },
];
