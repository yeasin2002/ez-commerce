import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { NEWSLETTER_MODULE } from "../modules/newsletter";
import NewsletterModuleService from "../modules/newsletter/service";

export type DeleteSubscriberInput = {
  id: string;
};

export const deleteSubscriberStep = createStep(
  "delete-subscriber",
  async (input: DeleteSubscriberInput, { container }) => {
    const newsletterService: NewsletterModuleService = container.resolve(NEWSLETTER_MODULE);
    const subscriber = await newsletterService.retrieveSubscriber(input.id);
    await newsletterService.deleteSubscribers(input.id);
    return new StepResponse(subscriber, subscriber);
  },
  async (subscriber, { container }) => {
    if (!subscriber) return;
    const newsletterService: NewsletterModuleService = container.resolve(NEWSLETTER_MODULE);
    await newsletterService.createSubscribers({
      id: subscriber.id,
      email: subscriber.email,
    });
  }
);

export const deleteSubscriberWorkflow = createWorkflow(
  "delete-subscriber",
  function (input: DeleteSubscriberInput) {
    const deleted = deleteSubscriberStep(input);
    return new WorkflowResponse(deleted);
  }
);
