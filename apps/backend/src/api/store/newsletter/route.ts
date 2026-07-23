import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createSubscriberWorkflow } from "../../../workflows/create-subscriber";
import { CreateSubscriberSchema } from "./middlewares";

export async function POST(
  req: MedusaRequest<CreateSubscriberSchema>,
  res: MedusaResponse
) {
  const { email } = req.validatedBody;

  const { result } = await createSubscriberWorkflow(req.scope).run({
    input: { email },
  });

  return res.status(200).json({ subscriber: result });
}
