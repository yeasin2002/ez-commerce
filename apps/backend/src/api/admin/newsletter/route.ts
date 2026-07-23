import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { NEWSLETTER_MODULE } from "../../../modules/newsletter";
import NewsletterModuleService from "../../../modules/newsletter/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const newsletterService: NewsletterModuleService = req.scope.resolve(NEWSLETTER_MODULE);

  const q = req.query.q as string | undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
  const order = (req.query.order as string) === "asc" ? "ASC" : "DESC";

  const filters: Record<string, any> = {};
  if (q && q.trim()) {
    filters.email = { $ilike: `%${q.trim()}%` };
  }

  const [subscribers, count] = await newsletterService.listAndCountSubscribers(
    filters,
    {
      take: limit,
      skip: offset,
      order: { created_at: order },
    }
  );

  return res.status(200).json({
    subscribers,
    count,
    limit,
    offset,
  });
}
