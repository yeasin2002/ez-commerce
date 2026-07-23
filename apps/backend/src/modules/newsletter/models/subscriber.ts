import { model } from "@medusajs/framework/utils";

const Subscriber = model.define("newsletter_subscriber", {
  id: model.id().primaryKey(),
  email: model.text(),
});

export default Subscriber;
