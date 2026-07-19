import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { setCategoryImageStep } from "./steps/set-category-image-step"

type Input = {
  category_id: string
  image_url: string
}

export const setCategoryImageWorkflow = createWorkflow(
  "set-category-image",
  function (input: Input) {
    const result = setCategoryImageStep(input)
    return new WorkflowResponse(result)
  }
)
