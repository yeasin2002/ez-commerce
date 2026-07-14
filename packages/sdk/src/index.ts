import MedusaDefault, { Admin, Auth, Client, Store } from "@medusajs/js-sdk";

export interface MedusaClientType {
  client: Client;
  admin: Admin;
  store: Store;
  auth: Auth;
  setLocale(locale: string): void;
  getLocale(): string;
}

// Handle default export interop for ESM under NodeNext
// @ts-ignore
const Medusa = (MedusaDefault.default || MedusaDefault) as unknown as new (config: any) => MedusaClientType;

export const createMedusaClient = (config: { baseUrl?: string; publishableKey?: string } = {}) => {
  return new Medusa({
    baseUrl: config.baseUrl || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
    publishableKey: config.publishableKey || process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  });
};

export { Medusa };
export type { FetchArgs, FetchInput } from "@medusajs/js-sdk";
