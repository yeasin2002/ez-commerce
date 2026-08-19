import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedBangladeshData({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );
  const pricingModuleService = container.resolve(ModuleRegistrationName.PRICING);
  const storeModuleService = container.resolve(ModuleRegistrationName.STORE);

  logger.info("🇧🇩 Starting Bangladesh & Global Store Configuration...");

  // 1. Update Store Supported Currencies
  logger.info("1. Configuring Store supported currencies (BDT as primary, USD, EUR)...");
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "supported_currencies.*", "default_sales_channel_id"],
  });

  const store = stores[0];
  if (store) {
    await storeModuleService.updateStores(store.id, {
      supported_currencies: [
        { currency_code: "bdt", is_default: true },
        { currency_code: "usd", is_default: false },
        { currency_code: "eur", is_default: false },
      ],
    });
    logger.info("✅ Store updated: BDT (Default), USD, EUR supported.");
  }

  // 2. Fetch existing sales channel, shipping profiles, and regions
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const defaultSalesChannel = salesChannels[0];

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile = shippingProfiles[0];

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.*"],
  });

  // 3. Create Bangladesh Region if not existing
  let bdRegion = existingRegions.find((r) =>
    r.countries?.some((c: any) => c.iso_2?.toLowerCase() === "bd")
  );

  if (!bdRegion) {
    logger.info("Creating Bangladesh Region (BDT)...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Bangladesh",
            currency_code: "bdt",
            countries: ["bd"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    bdRegion = regionResult[0];
    logger.info("✅ Created Bangladesh Region.");

    // Tax region for BD
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "bd", provider_id: "tp_system" }],
    });
  } else {
    logger.info(`✅ Bangladesh Region already exists (ID: ${bdRegion.id})`);
  }

  // 4. Create Global / International Region (USD) for rest of world if missing
  const assignedCountries = new Set<string>();
  existingRegions.forEach((r: any) => {
    r.countries?.forEach((c: any) => {
      if (c.iso_2) assignedCountries.add(c.iso_2.toLowerCase());
    });
  });
  if (bdRegion?.countries) {
    bdRegion.countries.forEach((c: any) => {
      if (c.iso_2) assignedCountries.add(c.iso_2.toLowerCase());
    });
  }

  const candidateCountries = [
    "us",
    "ca",
    "au",
    "ae",
    "sa",
    "in",
    "pk",
    "my",
    "sg",
    "nz",
    "jp",
    "kr",
    "br",
    "mx",
    "za",
  ];
  const unassignedCountries = candidateCountries.filter(
    (c) => !assignedCountries.has(c)
  );

  let intlRegion = existingRegions.find((r) => r.currency_code === "usd");

  if (!intlRegion && unassignedCountries.length > 0) {
    logger.info(`Creating International Region (USD) with ${unassignedCountries.length} countries...`);
    const { result: intlResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "International",
            currency_code: "usd",
            countries: unassignedCountries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    intlRegion = intlResult[0];
    logger.info("✅ Created International Region.");
  }

  // 5. Create Bangladesh Stock Location & Fulfillment
  logger.info("2. Creating Bangladesh Warehouse and Shipping Options...");
  const { result: bdStockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Dhaka Central Warehouse",
          address: {
            city: "Dhaka",
            country_code: "BD",
            address_1: "Dhanmondi, Dhaka",
          },
        },
      ],
    },
  });
  const bdStockLocation = bdStockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: bdStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  if (defaultSalesChannel) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: bdStockLocation.id,
        add: [defaultSalesChannel.id],
      },
    });
  }

  // Fulfillment Set for Bangladesh
  const bdFulfillmentSet =
    await fulfillmentModuleService.createFulfillmentSets({
      name: "Bangladesh Home & Courier Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Bangladesh All Districts",
          geo_zones: [
            {
              country_code: "bd",
              type: "country",
            },
          ],
        },
      ],
    });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: bdStockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: bdFulfillmentSet.id,
    },
  });

  // Create Bangladesh Shipping Options (Inside Dhaka, Outside Dhaka, Express)
  if (shippingProfile && bdFulfillmentSet.service_zones[0]) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Inside Dhaka Standard Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: bdFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Inside Dhaka",
            description: "Delivery within 24-48 hours.",
            code: "dhaka_standard",
          },
          prices: [
            {
              currency_code: "bdt",
              amount: 80,
            },
            ...(bdRegion
              ? [
                  {
                    region_id: bdRegion.id,
                    amount: 80,
                  },
                ]
              : []),
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Outside Dhaka Courier Delivery (Steadfast / Pathao)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: bdFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Outside Dhaka",
            description: "Delivery across Bangladesh in 2-4 days.",
            code: "nationwide_courier",
          },
          prices: [
            {
              currency_code: "bdt",
              amount: 130,
            },
            ...(bdRegion
              ? [
                  {
                    region_id: bdRegion.id,
                    amount: 130,
                  },
                ]
              : []),
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Dhaka Same-Day Express Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: bdFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Same day express delivery for orders before 12 PM.",
            code: "dhaka_express",
          },
          prices: [
            {
              currency_code: "bdt",
              amount: 180,
            },
            ...(bdRegion
              ? [
                  {
                    region_id: bdRegion.id,
                    amount: 180,
                  },
                ]
              : []),
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
    logger.info("✅ Created Bangladesh shipping options (৳80, ৳130, ৳180).");
  }

  // 6. Update/Seed Prices on ALL Product Variants
  logger.info("3. Seeding BDT, USD, and EUR prices across all product variants...");
  const { data: allProducts } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "variants.id",
      "variants.title",
      "variants.sku",
      "variants.price_set.id",
      "variants.price_set.prices.*",
    ],
  });

  logger.info(`Found ${allProducts.length} products to process.`);

  let updatedVariantsCount = 0;

  for (const prod of allProducts) {
    for (const v of prod.variants || []) {
      const existingPrices = v.price_set?.prices || [];
      const hasBDT = existingPrices.some(
        (p: any) => p.currency_code?.toLowerCase() === "bdt"
      );
      const hasUSD = existingPrices.some(
        (p: any) => p.currency_code?.toLowerCase() === "usd"
      );
      const hasEUR = existingPrices.some(
        (p: any) => p.currency_code?.toLowerCase() === "eur"
      );

      // Find base price
      const usdPriceObj = existingPrices.find(
        (p: any) => p.currency_code?.toLowerCase() === "usd"
      );
      const eurPriceObj = existingPrices.find(
        (p: any) => p.currency_code?.toLowerCase() === "eur"
      );

      const baseAmount = usdPriceObj?.amount || eurPriceObj?.amount || 75;

      // Realistic Bangladesh pricing (approx 1 USD = 30 BDT scaled for domestic market, or realistic ৳1,450 - ৳2,450)
      const bdtAmount = Math.round((baseAmount * 28) / 50) * 50 || 1850;
      const usdAmount = baseAmount || 25;
      const eurAmount = Math.round(baseAmount * 0.92 * 100) / 100 || 23;

      const pricesToAdd: { amount: number; currency_code: string }[] = [];

      if (!hasBDT) {
        pricesToAdd.push({ amount: bdtAmount, currency_code: "bdt" });
      }
      if (!hasUSD) {
        pricesToAdd.push({ amount: usdAmount, currency_code: "usd" });
      }
      if (!hasEUR) {
        pricesToAdd.push({ amount: eurAmount, currency_code: "eur" });
      }

      if (pricesToAdd.length > 0) {
        let priceSetId = v.price_set?.id;

        if (!priceSetId) {
          // Create new price set and link to variant
          const priceSet = await pricingModuleService.createPriceSets({
            prices: [
              { amount: bdtAmount, currency_code: "bdt" },
              { amount: usdAmount, currency_code: "usd" },
              { amount: eurAmount, currency_code: "eur" },
            ],
          });
          priceSetId = priceSet.id;

          await link.create({
            [Modules.PRODUCT]: {
              variant_id: v.id,
            },
            [Modules.PRICING]: {
              price_set_id: priceSet.id,
            },
          });
        } else {
          // Add missing prices to existing price set
          await pricingModuleService.addPrices({
            priceSetId,
            prices: pricesToAdd,
          });
        }
        updatedVariantsCount++;
      }
    }
  }

  logger.info(
    `✅ Successfully verified and added multi-currency prices (BDT, USD, EUR) to ${updatedVariantsCount} product variants!`
  );
  logger.info("🎉 Bangladesh & Global Commerce setup completed successfully!");
}
