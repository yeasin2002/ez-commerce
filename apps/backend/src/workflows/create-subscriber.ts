import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { NEWSLETTER_MODULE } from "../modules/newsletter";
import NewsletterModuleService from "../modules/newsletter/service";

export type CreateSubscriberInput = {
  email: string;
};

export const createSubscriberStep = createStep(
  "create-subscriber",
  async (input: CreateSubscriberInput, { container }) => {
    const newsletterService: NewsletterModuleService = container.resolve(NEWSLETTER_MODULE);
    
    // Check if subscriber already exists
    const existing = await newsletterService.listSubscribers({ email: input.email });
    if (existing.length > 0) {
      return new StepResponse(existing[0], existing[0].id);
    }

    const subscriber = await newsletterService.createSubscribers(input);
    return new StepResponse(subscriber, subscriber.id);
  },
  async (subscriberId, { container }) => {
    if (!subscriberId) return;
    const newsletterService: NewsletterModuleService = container.resolve(NEWSLETTER_MODULE);
    await newsletterService.deleteSubscribers(subscriberId);
  }
);

export const createSubscriberWorkflow = createWorkflow(
  "create-subscriber",
  function (input: CreateSubscriberInput) {
    const subscriber = createSubscriberStep(input);
    return new WorkflowResponse(subscriber);
  }
);
