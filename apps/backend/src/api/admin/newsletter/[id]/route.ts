import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { deleteSubscriberWorkflow } from "../../../../workflows/delete-subscriber";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  await deleteSubscriberWorkflow(req.scope).run({
    input: { id },
  });

  return res.status(200).json({
    id,
    object: "newsletter_subscriber",
    deleted: true,
  });
}
