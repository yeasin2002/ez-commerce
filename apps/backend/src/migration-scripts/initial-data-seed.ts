import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function initial_data_seed({
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
  const storeModuleService = container.resolve(ModuleRegistrationName.STORE);

  logger.info("🇧🇩 Starting unified Bangladesh & Global Jersey Store Data Seed...");

  // 1. Default Sales Channel
  logger.info("1. Checking Sales Channels...");
  const { data: existingSalesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });

  let defaultSalesChannel: any = existingSalesChannels[0];
  if (!defaultSalesChannel) {
    logger.info("Creating Default Sales Channel...");
    const {
      result: [newSalesChannel],
    } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
            description: "Primary sales channel for EZ Commerce DTC Storefront",
          },
        ],
      },
    });
    defaultSalesChannel = newSalesChannel;
  }
  logger.info(`✅ Default Sales Channel: ${defaultSalesChannel.name} (ID: ${defaultSalesChannel.id})`);

  // 2. Publishable API Key
  logger.info("2. Checking Publishable API Key...");
  const { data: existingApiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type", "title"],
  });

  let publishableApiKey: any = existingApiKeys.find((k: any) => k.type === "publishable");
  if (!publishableApiKey) {
    logger.info("Creating Publishable API Key...");
    const {
      result: [newApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Storefront Publishable API Key",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });
    publishableApiKey = newApiKey;

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel.id],
      },
    });
  } else {
    try {
      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: publishableApiKey.id,
          add: [defaultSalesChannel.id],
        },
      });
    } catch {
      // already linked
    }
  }
  logger.info(`✅ Publishable API Key: ${publishableApiKey?.id} (token: ${publishableApiKey?.token})`);

  // 3. Store Configuration (BDT as Default Currency, USD, EUR)
  logger.info("3. Configuring Store Currencies (BDT Primary Default, USD, EUR)...");
  const { data: existingStores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "supported_currencies.*", "default_sales_channel_id"],
  });

  const targetCurrencies = [
    { currency_code: "bdt", is_default: true },
    { currency_code: "usd", is_default: false },
    { currency_code: "eur", is_default: false },
  ];

  if (!existingStores || existingStores.length === 0) {
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "EZ Commerce Jersey Store",
            supported_currencies: targetCurrencies,
            default_sales_channel_id: defaultSalesChannel.id,
          },
        ],
      },
    });
  } else {
    await storeModuleService.updateStores(existingStores[0].id, {
      name: "EZ Commerce Jersey Store",
      supported_currencies: targetCurrencies,
      default_sales_channel_id: defaultSalesChannel.id,
    });
  }
  logger.info("✅ Store configured with BDT default currency.");

  // 4. Regions Setup
  logger.info("4. Configuring Regions...");
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.*"],
  });

  const assignedCountries = new Set<string>();
  existingRegions.forEach((r: any) => {
    r.countries?.forEach((c: any) => {
      if (c.iso_2) assignedCountries.add(c.iso_2.toLowerCase());
    });
  });

  let bdRegion: any = existingRegions.find(
    (r: any) => r.currency_code === "bdt" || r.countries?.some((c: any) => c.iso_2?.toLowerCase() === "bd")
  );

  if (!bdRegion && !assignedCountries.has("bd")) {
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
    assignedCountries.add("bd");
  }

  const europeanTarget = ["gb", "de", "dk", "se", "fr", "es", "it", "nl", "pt", "be"];
  const unassignedEurope = europeanTarget.filter((c) => !assignedCountries.has(c));

  let eurRegion: any = existingRegions.find((r: any) => r.currency_code === "eur");
  if (!eurRegion && unassignedEurope.length > 0) {
    logger.info(`Creating Europe Region (EUR) with ${unassignedEurope.length} countries...`);
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Europe",
            currency_code: "eur",
            countries: unassignedEurope,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    eurRegion = regionResult[0];
    unassignedEurope.forEach((c) => assignedCountries.add(c));
  }

  const intlTarget = [
    "us", "ca", "au", "ae", "sa", "in", "pk", "my", "sg", "nz",
    "jp", "kr", "br", "mx", "za", "tr", "th", "id", "vn", "ph"
  ];
  const unassignedIntl = intlTarget.filter((c) => !assignedCountries.has(c));

  let intlRegion: any = existingRegions.find((r: any) => r.currency_code === "usd");
  if (!intlRegion && unassignedIntl.length > 0) {
    logger.info(`Creating International Region (USD) with ${unassignedIntl.length} countries...`);
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "International",
            currency_code: "usd",
            countries: unassignedIntl,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    intlRegion = regionResult[0];
    unassignedIntl.forEach((c) => assignedCountries.add(c));
  }
  logger.info("✅ Regions configuration verified.");

  // 5. Tax Regions
  logger.info("5. Verifying Tax Regions...");
  const taxCountries = ["bd", ...europeanTarget, "us"];
  try {
    await createTaxRegionsWorkflow(container).run({
      input: taxCountries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
  } catch {
    // tax regions may already exist
  }

  // 6. Stock Location: Dhaka Central Warehouse
  logger.info("6. Checking Stock Locations...");
  const { data: existingStockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });

  let bdStockLocation: any = existingStockLocations.find((l: any) => l.name?.includes("Dhaka") || l.name?.includes("Bangladesh")) || existingStockLocations[0];

  if (!bdStockLocation) {
    logger.info("Creating Dhaka Central Warehouse...");
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Dhaka Central Warehouse",
            address: {
              city: "Dhaka",
              country_code: "BD",
              address_1: "Dhanmondi 27, Dhaka-1209",
              postal_code: "1209",
            },
          },
        ],
      },
    });
    bdStockLocation = stockLocationResult[0];
  }

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: bdStockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  } catch {}

  try {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: bdStockLocation.id,
        add: [defaultSalesChannel.id],
      },
    });
  } catch {}

  // 7. Shipping Profiles & Fulfillment Sets
  logger.info("7. Configuring Fulfillment & Shipping Options...");
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const shippingProfile: any = shippingProfiles[0];

  const { data: existingFulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.*"],
  });

  let bdFulfillmentSet: any = existingFulfillmentSets.find((fs: any) =>
    fs.name?.includes("Bangladesh") || fs.service_zones?.some((sz: any) => sz.geo_zones?.some((gz: any) => gz.country_code === "bd"))
  );

  if (!bdFulfillmentSet) {
    logger.info("Creating Bangladesh Courier Fulfillment Set...");
    bdFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
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

    try {
      if (bdFulfillmentSet?.id) {
        await link.create({
          [Modules.STOCK_LOCATION]: {
            stock_location_id: bdStockLocation.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_set_id: bdFulfillmentSet.id,
          },
        });
      }
    } catch {}
  }

  const { data: existingShippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  });

  const hasBDShipping = existingShippingOptions.some((so: any) =>
    so.name?.includes("Dhaka") || so.name?.includes("Bangladesh")
  );

  if (!hasBDShipping && bdFulfillmentSet?.service_zones?.[0]) {
    logger.info("Creating Bangladesh Shipping Options...");
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
            description: "Delivery within 24-48 hours via Paperfly / Pathao.",
            code: "dhaka_standard",
          },
          prices: [
            { currency_code: "bdt", amount: 80 },
            ...(bdRegion ? [{ region_id: bdRegion.id, amount: 80 }] : []),
            { currency_code: "usd", amount: 1 },
            { currency_code: "eur", amount: 1 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Outside Dhaka Courier Delivery (Steadfast / Sundarban)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: bdFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Outside Dhaka",
            description: "Nationwide delivery across all 64 districts within 2-4 days.",
            code: "nationwide_courier",
          },
          prices: [
            { currency_code: "bdt", amount: 130 },
            ...(bdRegion ? [{ region_id: bdRegion.id, amount: 130 }] : []),
            { currency_code: "usd", amount: 2 },
            { currency_code: "eur", amount: 2 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Dhaka Same-Day Express Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: bdFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express Same-Day",
            description: "Same day express delivery for orders placed before 1:00 PM.",
            code: "dhaka_express",
          },
          prices: [
            { currency_code: "bdt", amount: 180 },
            ...(bdRegion ? [{ region_id: bdRegion.id, amount: 180 }] : []),
            { currency_code: "usd", amount: 3 },
            { currency_code: "eur", amount: 3 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
    logger.info("✅ Created Bangladesh shipping options (৳80 Inside Dhaka, ৳130 Nationwide, ৳180 Express).");
  }

  // 8. Categories & Collections
  logger.info("8. Checking Categories & Collections...");
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  });

  let categoryMap: Record<string, string> = {};
  existingCategories.forEach((c: any) => {
    if (c.handle) categoryMap[c.handle] = c.id;
  });

  const categoriesToCreate = [
    { name: "Club Jerseys", handle: "club-jerseys", is_active: true, description: "Official and player issue jerseys from top European football clubs." },
    { name: "National Teams", handle: "national-teams", is_active: true, description: "World Cup and continental tournament national team kits." },
    { name: "Retro Classics", handle: "retro-classics", is_active: true, description: "Iconic vintage football kits from golden eras." },
    { name: "Special Edition", handle: "special-edition", is_active: true, description: "Limited drops, designer collaborations, and anniversary kits." },
    { name: "Jackets & Outerwear", handle: "outerwear", is_active: true, description: "Club anthem track jackets, windbreakers, and training gear." },
  ].filter((c) => !categoryMap[c.handle]);

  if (categoriesToCreate.length > 0) {
    const { result: createdCats } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: categoriesToCreate },
    });
    createdCats.forEach((c: any) => {
      if (c.handle) categoryMap[c.handle] = c.id;
    });
  }

  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"],
  });

  let collectionMap: Record<string, string> = {};
  existingCollections.forEach((c: any) => {
    if (c.handle) collectionMap[c.handle] = c.id;
  });

  const collectionsToCreate = [
    { title: "Best Sellers", handle: "best-sellers" },
    { title: "New Arrivals", handle: "new-arrivals" },
    { title: "World Cup 2026", handle: "world-cup-2026" },
    { title: "Retro Legends", handle: "retro-legends" },
  ].filter((c) => !collectionMap[c.handle]);

  if (collectionsToCreate.length > 0) {
    const { result: createdCols } = await createCollectionsWorkflow(container).run({
      input: { collections: collectionsToCreate },
    });
    createdCols.forEach((c: any) => {
      if (c.handle) collectionMap[c.handle] = c.id;
    });
  }

  // 9. Product Options
  logger.info("9. Checking Product Options...");
  const { data: existingOptions } = await query.graph({
    entity: "product_option",
    fields: ["id", "title", "values.*"],
  });

  let sizeOption = existingOptions.find((o: any) => o.title === "Size");
  let editionOption = existingOptions.find((o: any) => o.title === "Edition");

  const optionsToCreate: any[] = [];
  if (!sizeOption) {
    optionsToCreate.push({ title: "Size", values: ["S", "M", "L", "XL"] });
  }
  if (!editionOption) {
    optionsToCreate.push({ title: "Edition", values: ["Fan Version", "Player Issue"] });
  }

  if (optionsToCreate.length > 0) {
    const { result: createdOpts } = await createProductOptionsWorkflow(container).run({
      input: { product_options: optionsToCreate },
    });
    createdOpts.forEach((o: any) => {
      if (o.title === "Size") sizeOption = o;
      if (o.title === "Edition") editionOption = o;
    });
  }

  // 10. Products Catalog
  logger.info("10. Seeding Football Jersey Catalog...");
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });
  const existingHandles = new Set(existingProducts.map((p: any) => p.handle));

  function createJerseyVariants(skuPrefix: string, fanBdt: number, playerBdt: number, fanUsd: number, playerUsd: number) {
    const sizes = ["S", "M", "L", "XL"];
    const editions = [
      { name: "Fan Version", code: "FAN", bdt: fanBdt, usd: fanUsd, eur: Math.round(fanUsd * 0.92) },
      { name: "Player Issue", code: "PLY", bdt: playerBdt, usd: playerUsd, eur: Math.round(playerUsd * 0.92) },
    ];

    const variants: any[] = [];
    for (const ed of editions) {
      for (const sz of sizes) {
        variants.push({
          title: `${sz} / ${ed.name}`,
          sku: `${skuPrefix}-${sz}-${ed.code}`,
          options: {
            Size: sz,
            Edition: ed.name,
          },
          prices: [
            { currency_code: "bdt", amount: ed.bdt },
            { currency_code: "usd", amount: ed.usd },
            { currency_code: "eur", amount: ed.eur },
          ],
        });
      }
    }
    return variants;
  }

  const allProducts = [
    // 1. Barcelona 24/25 Home
    {
      title: "FC Barcelona 2024/25 Home Jersey",
      handle: "barcelona-24-25-home-jersey",
      subtitle: "FC Barcelona",
      description:
        "The official FC Barcelona 2024/25 Home Jersey commemorating the club's 125th Anniversary. Featuring the iconic half-and-half Blaugrana design, gold anniversary crest, and engineered moisture-wicking Dri-FIT ADV fabric. Perfect for matchdays at Camp Nou or streetwear styling.",
      material: "100% Recycled Polyester (Dri-FIT ADV)",
      weight: 220,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["club-jerseys"]].filter(Boolean),
      collection_id: collectionMap["best-sellers"],
      thumbnail: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("BAR-2425-H", 1450, 1850, 25, 32),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "FC Barcelona",
        teamName: "FC Barcelona",
        soldCount: 142,
        viewingCount: 38,
        details: [
          "125th Anniversary special edition half-and-half design.",
          "Dri-FIT ADV technology delivers targeted ventilation and moisture absorption.",
          "Embroidered metallic gold club crest and Spotify sponsor print.",
          "Authentic athletic cut tailored for maximum range of motion.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Lamine Yamal #19", label: "Lamine Yamal #19" },
          { name: "Raphinha #11", label: "Raphinha #11" },
          { name: "Lewandowski #9", label: "Lewandowski #9" },
          { name: "Pedri #8", label: "Pedri #8" },
        ],
        patches: ["UCL Starball Badge", "La Liga Champions Patch", "No Patch"],
      },
    },

    // 2. Real Madrid 24/25 Home
    {
      title: "Real Madrid 2024/25 Home Jersey",
      handle: "real-madrid-24-25-home-jersey",
      subtitle: "Real Madrid",
      description:
        "The Real Madrid 2024/25 Home Jersey features an ultra-clean all-white finish with custom houndstooth pattern woven directly into the fabric. Accented with subtle golden details celebrating Los Blancos' 15th UEFA Champions League crown.",
      material: "100% Recycled Polyester (HEAT.RDY)",
      weight: 210,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["club-jerseys"]].filter(Boolean),
      collection_id: collectionMap["best-sellers"],
      thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("RMA-2425-H", 1450, 1850, 25, 32),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Real Madrid",
        teamName: "Real Madrid",
        soldCount: 198,
        viewingCount: 54,
        details: [
          "Custom houndstooth woven jacquard texture.",
          "HEAT.RDY air-cooling fabric for sweat-free comfort.",
          "High-definition heat applied silicone club crest.",
          "Official UEFA Champions League 15-time trophy sleeve badge available.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Kylian Mbappé #9", label: "Kylian Mbappé #9" },
          { name: "Vinicius Jr. #7", label: "Vinicius Jr. #7" },
          { name: "Jude Bellingham #5", label: "Jude Bellingham #5" },
          { name: "Luka Modrić #10", label: "Luka Modrić #10" },
        ],
        patches: ["UCL 15-Time Winners Badge", "La Liga Champions Sleeve Badge", "No Patch"],
      },
    },

    // 3. Manchester United 24/25 Home
    {
      title: "Manchester United 2024/25 Home Jersey",
      handle: "manchester-united-24-25-home-jersey",
      subtitle: "Manchester United",
      description:
        "The Manchester United 2024/25 Home Kit introduces dual-tone scarlet and crimson gradients under stadium floodlights, honoring the rich footballing heritage of the Red Devils. Built with moisture-wicking AEROREADY.",
      material: "100% Recycled Polyester (AEROREADY)",
      weight: 230,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["club-jerseys"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("MUN-2425-H", 1350, 1750, 23, 29),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Manchester United",
        teamName: "Manchester United",
        soldCount: 95,
        viewingCount: 29,
        details: [
          "Dual-tone gradient red with Snapdragon front sponsor.",
          "AEROREADY moisture management technology.",
          "Sewn-on woven Red Devils crest.",
          "Classic ribbed crewneck collar.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Bruno Fernandes #8", label: "Bruno Fernandes #8" },
          { name: "Alejandro Garnacho #17", label: "Alejandro Garnacho #17" },
          { name: "Kobbie Mainoo #37", label: "Kobbie Mainoo #37" },
          { name: "Rashford #10", label: "Rashford #10" },
        ],
        patches: ["Premier League Sleeve Patch", "No Patch"],
      },
    },

    // 4. Arsenal 24/25 Home
    {
      title: "Arsenal 2024/25 Home Jersey",
      handle: "arsenal-24-25-home-jersey",
      subtitle: "Arsenal FC",
      description:
        "The Arsenal 2024/25 Home Jersey brings back the historic standalone cannon crest for the first time on a primary home shirt in 35 years. Classic red body with clean white raglan sleeves and navy accents.",
      material: "100% Recycled Polyester (AEROREADY)",
      weight: 220,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["club-jerseys"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("ARS-2425-H", 1350, 1750, 23, 29),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Arsenal FC",
        teamName: "Arsenal FC",
        soldCount: 88,
        viewingCount: 31,
        details: [
          "Iconic standalone Cannon emblem on chest.",
          "Navy and white side tape accents for dynamic shape.",
          "Sweat-wicking AEROREADY high-performance construction.",
          "Breathable side mesh ventilation panels.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Bukayo Saka #7", label: "Bukayo Saka #7" },
          { name: "Martin Ødegaard #8", label: "Martin Ødegaard #8" },
          { name: "Declan Rice #41", label: "Declan Rice #41" },
          { name: "Kai Havertz #29", label: "Kai Havertz #29" },
        ],
        patches: ["Premier League Sleeve Badge", "UCL Starball Badge", "No Patch"],
      },
    },

    // 5. AC Milan 2006/07 Away Retro Jersey
    {
      title: "AC Milan 2006/07 Away Retro Jersey",
      handle: "ac-milan-06-07-away-retro-jersey",
      subtitle: "AC Milan",
      description:
        "Relive the glorious 2006/07 Champions League triumph in Athens with this faithful AC Milan Away Retro Jersey. Featuring the legendary gold star, Bwin sponsor, and breathable retro double-knit fabric worn by Kaká and Maldini.",
      material: "100% Vintage Heavyweight Polyester",
      weight: 260,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["retro-classics"]].filter(Boolean),
      collection_id: collectionMap["retro-legends"],
      thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("ACM-0607-A", 1550, 1950, 26, 33),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "AC Milan",
        teamName: "AC Milan",
        soldCount: 215,
        viewingCount: 65,
        details: [
          "Authentic Athens 2007 Final embroidery above the crest.",
          "Embroidered gold 7-times UCL champion star.",
          "Classic V-neck collar with red and black retro stripe trim.",
          "Historically precise Bwin heat-press sponsor.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Kaká #22", label: "Kaká #22" },
          { name: "Paolo Maldini #3", label: "Paolo Maldini #3" },
          { name: "Andrea Pirlo #21", label: "Andrea Pirlo #21" },
          { name: "Filippo Inzaghi #9", label: "Filippo Inzaghi #9" },
        ],
        patches: ["UCL Athens 2007 Final Matchday Patch", "UCL 7-Time Trophy Patch", "No Patch"],
      },
    },

    // 6. Manchester United 2007/08 Home Retro Jersey
    {
      title: "Manchester United 2007/08 Home Retro Jersey",
      handle: "manchester-united-07-08-home-retro-jersey",
      subtitle: "Manchester United",
      description:
        "The legendary 2007/08 Manchester United Home Jersey from Cristiano Ronaldo's 42-goal Ballon d'Or campaign. Famous for the Premier League and Moscow Champions League double, featuring the iconic white back stripe and felt AIG sponsor.",
      material: "100% Vintage Poly-Mesh",
      weight: 250,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["retro-classics"]].filter(Boolean),
      collection_id: collectionMap["retro-legends"],
      thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("MUN-0708-H", 1550, 1950, 26, 33),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Manchester United",
        teamName: "Manchester United",
        soldCount: 310,
        viewingCount: 82,
        details: [
          "Distinctive vertical white mesh back stripe running from neck to hem.",
          "Velvet-feel AIG sponsor logo on chest.",
          "Stitched retro Red Devils badge and gold star outline.",
          "Breathable side mesh inserts.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Cristiano Ronaldo #7", label: "Cristiano Ronaldo #7" },
          { name: "Wayne Rooney #10", label: "Wayne Rooney #10" },
          { name: "Carlos Tevez #32", label: "Carlos Tevez #32" },
          { name: "Paul Scholes #18", label: "Paul Scholes #18" },
        ],
        patches: ["Premier League Gold Champions Patch", "UCL Moscow 2008 Final Patch", "No Patch"],
      },
    },

    // 7. Argentina 1994 Away Retro Jersey
    {
      title: "Argentina 1994 Away Retro Jersey",
      handle: "argentina-1994-away-retro-jersey",
      subtitle: "Argentina",
      description:
        "The unforgettable deep royal blue Argentina 1994 Away Retro Jersey worn by Diego Armando Maradona during USA '94. Featuring vertical black diamond pattern stripes on the right side and classic trefoil branding.",
      material: "100% Retro Double-Knit Polyester",
      weight: 270,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["retro-classics"]].filter(Boolean),
      collection_id: collectionMap["retro-legends"],
      thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("ARG-1994-A", 1650, 2050, 28, 35),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Argentina",
        teamName: "Argentina",
        soldCount: 180,
        viewingCount: 45,
        details: [
          "Iconic black diamond printed panel along the right torso.",
          "Embroidered classic AFA shield with retro 2 stars.",
          "Ribbed knit collar with Argentina flag piping.",
          "Heavyweight retro polyester drape.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Diego Maradona #10", label: "Diego Maradona #10" },
          { name: "Gabriel Batistuta #9", label: "Gabriel Batistuta #9" },
          { name: "Claudio Caniggia #7", label: "Claudio Caniggia #7" },
        ],
        patches: ["USA 1994 World Cup Sleeve Patch", "No Patch"],
      },
    },

    // 8. Brazil National Team 2026 Home Jersey
    {
      title: "Brazil National Team 2026 Home Jersey",
      handle: "brazil-national-team-2026-home-jersey",
      subtitle: "Brazil",
      description:
        "The vibrant Amarelinha returns for the 2026 World Cup campaign. Featuring Brazil's classic canary yellow with subtle embossed jaguar (onça-pintada) prints woven into the fabric and five golden championship stars over the CBF shield.",
      material: "100% Recycled Polyester (Dri-FIT ADV)",
      weight: 215,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["national-teams"]].filter(Boolean),
      collection_id: collectionMap["world-cup-2026"],
      thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("BRA-2026-H", 1450, 1850, 25, 32),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Brazil",
        teamName: "Brazil",
        soldCount: 220,
        viewingCount: 58,
        details: [
          "Authentic canary yellow with forest green and blue accents.",
          "Embossed jaguar print celebrating Brazilian fauna and power.",
          "Dri-FIT ADV ultra-breathable moisture regulation.",
          "5 World Championship stars above the CBF crest.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Vinicius Jr. #7", label: "Vinicius Jr. #7" },
          { name: "Neymar Jr. #10", label: "Neymar Jr. #10" },
          { name: "Rodrygo #11", label: "Rodrygo #11" },
          { name: "Endrick #9", label: "Endrick #9" },
        ],
        patches: ["FIFA World Cup 2026 Qualifiers Patch", "No Patch"],
      },
    },

    // 9. Argentina 2024/25 Three-Star Home Jersey
    {
      title: "Argentina 2024/25 Three-Star Home Jersey",
      handle: "argentina-2024-three-star-home-jersey",
      subtitle: "Argentina",
      description:
        "The official Argentina 2024/25 Three-Star Home Kit celebrating back-to-back Copa América and World Cup glory. Traditional sky blue and white vertical stripes embellished with metallic gold crest, central gold FIFA World Champions badge, and Sol de Mayo neck motif.",
      material: "100% Recycled Polyester (HEAT.RDY)",
      weight: 220,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["national-teams"]].filter(Boolean),
      collection_id: collectionMap["best-sellers"],
      thumbnail: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("ARG-2425-H", 1450, 1850, 25, 32),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Argentina",
        teamName: "Argentina",
        soldCount: 340,
        viewingCount: 94,
        details: [
          "Three metallic gold stars celebrating World Cup victories.",
          "Central gold FIFA World Champions 2022 silicone chest badge.",
          "HEAT.RDY cooling fabric technology for peak breathability.",
          "Golden Sol de Mayo graphic at the back neck.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Lionel Messi #10", label: "Lionel Messi #10" },
          { name: "Julian Alvarez #9", label: "Julian Alvarez #9" },
          { name: "Angel Di Maria #11", label: "Angel Di Maria #11" },
          { name: "Alexis Mac Allister #20", label: "Alexis Mac Allister #20" },
        ],
        patches: ["Copa América 2024 Champions Patch", "FIFA World Champions Badge", "No Patch"],
      },
    },

    // 10. Portugal 2026 Home Jersey
    {
      title: "Portugal 2026 Home Jersey",
      handle: "portugal-2026-home-jersey",
      subtitle: "Portugal",
      description:
        "Portugal's home identity wrapped in deep university red and pine green. Inspired by the nation's naval exploration heritage and the armillary sphere, this jersey represents pride, grit, and passion for Cristiano Ronaldo's national team.",
      material: "100% Recycled Polyester (VaporKnit)",
      weight: 220,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["national-teams"]].filter(Boolean),
      collection_id: collectionMap["world-cup-2026"],
      thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("POR-2026-H", 1450, 1850, 25, 32),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Portugal",
        teamName: "Portugal",
        soldCount: 175,
        viewingCount: 46,
        details: [
          "Classic rich Portuguese red body with green collar and sleeve trim.",
          "VaporKnit high-stretch weave for ergonomic fit.",
          "Silicone FPF crest with golden laurel borders.",
          "National flag detail on inner back collar.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Cristiano Ronaldo #7", label: "Cristiano Ronaldo #7" },
          { name: "Bruno Fernandes #8", label: "Bruno Fernandes #8" },
          { name: "Bernardo Silva #10", label: "Bernardo Silva #10" },
          { name: "Rafael Leão #17", label: "Rafael Leão #17" },
        ],
        patches: ["Euro 2024 Sleeve Badge", "World Cup Qualifiers Patch", "No Patch"],
      },
    },

    // 11. Bangladesh Tigers Official Fan Jersey 2025
    {
      title: "Bangladesh Tigers Official Fan Jersey 2025",
      handle: "bangladesh-tigers-fan-jersey-2025",
      subtitle: "Bangladesh",
      description:
        "The official Bangladesh Tigers 2025 Special Edition Jersey. Featuring deep bottle green with fiery red Bengal tiger stripe motifs and geometric golden accents. Specially crafted for passionate Bangladeshi sports enthusiasts at an accessible price point.",
      material: "100% Breathable Micro-Interlock Polyester",
      weight: 200,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["national-teams"], categoryMap["special-edition"]].filter(Boolean),
      collection_id: collectionMap["best-sellers"],
      thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("BD-TIGERS-25", 950, 1350, 16, 22),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Bangladesh",
        teamName: "Bangladesh",
        soldCount: 420,
        viewingCount: 110,
        details: [
          "Royal Bengal Tiger stripe geometric gradient prints.",
          "Sublimated red sun disk design on back neck.",
          "Quick-dry micro-honeycomb mesh fabric tailored for local climate.",
          "High-definition embroidered national emblem.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Shakib #75", label: "Shakib #75" },
          { name: "Tamim #28", label: "Tamim #28" },
          { name: "Mustafiz #90", label: "Mustafiz #90" },
          { name: "Mahmudullah #30", label: "Mahmudullah #30" },
        ],
        patches: ["Tigers Spirit Gold Badge", "ICC Tournament Official Patch", "No Patch"],
      },
    },

    // 12. Japan 2024/25 Y-3 Flame Special Edition Jersey
    {
      title: "Japan 2024/25 Y-3 Flame Special Edition",
      handle: "japan-2024-y3-special-edition-jersey",
      subtitle: "Japan",
      description:
        "Designed in collaboration with world-renowned Japanese fashion visionary Yohji Yamamoto and the Y-3 label. Featuring an intense dark navy base with hand-drawn electric blue and crimson flame graphics surging up the chest.",
      material: "100% Recycled Poly-Jacquard (HEAT.RDY)",
      weight: 230,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["special-edition"], categoryMap["national-teams"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("JPN-Y3-24", 1750, 2250, 30, 38),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Japan",
        teamName: "Japan",
        soldCount: 160,
        viewingCount: 48,
        details: [
          "Official Yohji Yamamoto Y-3 collaboration branding.",
          "Hand-drawn artisanal flame gradient graphic.",
          "Heat-pressed monochromatic JFA crow crest.",
          "Premium lifestyle streetwear drape and cut.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Mitoma #7", label: "Mitoma #7" },
          { name: "Kubo #20", label: "Kubo #20" },
          { name: "Endo #6", label: "Endo #6" },
        ],
        patches: ["AFC Asian Cup Special Badge", "No Patch"],
      },
    },

    // 13. France 2026 Away Jersey
    {
      title: "France 2026 Away Jersey",
      handle: "france-2026-away-jersey",
      subtitle: "France",
      description:
        "Representing French elegance and sartorial style, the 2026 France Away Kit combines a clean white aesthetic with subtle vintage pinstripes alternating between blue and red, representing the Tricolore.",
      material: "100% Recycled Polyester (Dri-FIT ADV)",
      weight: 215,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["national-teams"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("FRA-2026-A", 1450, 1850, 25, 32),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "France",
        teamName: "France",
        soldCount: 130,
        viewingCount: 35,
        details: [
          "Tricolore pinstripe gradient detail woven across front and back.",
          "Oversized golden Gallic Cockerel emblem highlighting heritage.",
          "Lightweight athletic construction for matchday speed.",
          "French motto 'Nos différences nous unissent' on inner collar.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Kylian Mbappé #10", label: "Kylian Mbappé #10" },
          { name: "Antoine Griezmann #7", label: "Antoine Griezmann #7" },
          { name: "Eduardo Camavinga #6", label: "Eduardo Camavinga #6" },
        ],
        patches: ["Euro 2024 Sleeve Patch", "FIFA World Champions Badge", "No Patch"],
      },
    },

    // 14. Manchester City 2024/25 Home Jersey
    {
      title: "Manchester City 2024/25 Home Jersey",
      handle: "manchester-city-24-25-home-jersey",
      subtitle: "Manchester City",
      description:
        "The Manchester City 2024/25 Home Jersey features the iconic sky blue base highlighted with Manchester's telephone dialing code '0161' graffiti graphic knitted into the collar and sleeve cuffs.",
      material: "100% Recycled Polyester (dryCELL)",
      weight: 220,
      length: 30,
      width: 25,
      height: 2,
      origin_country: "BD",
      hs_code: "6109.10",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["club-jerseys"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("MCI-2425-H", 1350, 1750, 23, 29),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Manchester City",
        teamName: "Manchester City",
        soldCount: 110,
        viewingCount: 33,
        details: [
          "0161 Manchester area code collar jacquard artwork.",
          "dryCELL performance moisture regulation.",
          "Raised 3D metallic Man City club badge.",
          "Premier League 4-in-a-row champions sleeve patch available.",
        ],
        players: [
          { name: "Patch Only", label: "Patch Only" },
          { name: "Erling Haaland #9", label: "Erling Haaland #9" },
          { name: "Kevin De Bruyne #17", label: "Kevin De Bruyne #17" },
          { name: "Phil Foden #47", label: "Phil Foden #47" },
          { name: "Rodri #16", label: "Rodri #16" },
        ],
        patches: ["Premier League Champions Gold Patch", "FIFA Club World Cup Badge", "No Patch"],
      },
    },

    // 15. Real Madrid 2024/25 Windbreaker Jacket
    {
      title: "Real Madrid 2024/25 Windbreaker Jacket",
      handle: "real-madrid-24-25-windbreaker-jacket",
      subtitle: "Real Madrid",
      description:
        "Stay protected in style with the official Real Madrid 2024/25 all-weather Windbreaker Jacket. Built from durable water-repellent ripstop with breathable mesh lining, zipped storm pockets, and high-neck hood.",
      material: "100% Recycled Water-Repellent Ripstop Nylon",
      weight: 380,
      length: 35,
      width: 28,
      height: 4,
      origin_country: "BD",
      hs_code: "6201.93",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["outerwear"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("RMA-2425-JKT", 2250, 2650, 36, 44),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Real Madrid",
        teamName: "Real Madrid",
        soldCount: 65,
        viewingCount: 22,
        details: [
          "Durable water-repellent (DWR) windproof coating.",
          "Internal breathable air-mesh ventilation lining.",
          "Zipped storm hand pockets and adjustable drawcord hood.",
          "Embroidered club crest and signature 3-stripes along sleeves.",
        ],
        players: [],
        patches: [],
      },
    },

    // 16. Arsenal 2024/25 Anthem Pre-Match Track Jacket
    {
      title: "Arsenal 2024/25 Anthem Track Jacket",
      handle: "arsenal-24-25-anthem-track-jacket",
      subtitle: "Arsenal FC",
      description:
        "The official Arsenal Anthem Track Jacket worn by the Gunners lineup before kickoff at Emirates Stadium. Features a full-zip front, ribbed stand-up collar, zip pockets, and clean canon logo embroidery.",
      material: "100% Recycled Tricot Polyester",
      weight: 360,
      length: 35,
      width: 28,
      height: 4,
      origin_country: "BD",
      hs_code: "6201.93",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryMap["outerwear"]].filter(Boolean),
      collection_id: collectionMap["new-arrivals"],
      thumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80" },
      ],
      options: [{ id: sizeOption!.id }, { id: editionOption!.id }],
      variants: createJerseyVariants("ARS-2425-JKT", 2150, 2550, 34, 42),
      sales_channels: [{ id: defaultSalesChannel.id }],
      metadata: {
        team: "Arsenal FC",
        teamName: "Arsenal FC",
        soldCount: 52,
        viewingCount: 18,
        details: [
          "Pre-match anthem jacket worn by players entering the pitch.",
          "Soft brushed tricot interior for warmth and comfort.",
          "Full front zipper with ribbed protective chin guard.",
          "Embroidered retro cannon badge on chest.",
        ],
        players: [],
        patches: [],
      },
    },
  ];

  const newProducts = allProducts.filter((p) => !existingHandles.has(p.handle));

  if (newProducts.length > 0) {
    logger.info(`Creating ${newProducts.length} new jersey products...`);
    await createProductsWorkflow(container).run({
      input: {
        products: newProducts,
      },
    });
    logger.info(`✅ Successfully created ${newProducts.length} jersey products with full multi-currency variants!`);
  } else {
    logger.info(`✅ All ${allProducts.length} products already exist.`);
  }

  // 11. Inventory levels at Dhaka Central Warehouse
  logger.info("11. Verifying Inventory Levels for Dhaka Central Warehouse...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "location_levels.*"],
  });

  const unstockedItems = inventoryItems.filter(
    (item: any) => !item.location_levels?.some((ll: any) => ll.location_id === bdStockLocation.id)
  );

  if (unstockedItems.length > 0) {
    logger.info(`Seeding inventory for ${unstockedItems.length} inventory items...`);
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: unstockedItems.map((item: any) => ({
          location_id: bdStockLocation.id,
          stocked_quantity: 1000,
          inventory_item_id: item.id,
        })),
      },
    });
    logger.info(`✅ Seeded inventory (1,000 units each) for ${unstockedItems.length} items.`);
  } else {
    logger.info("✅ All inventory items are stocked at Dhaka Central Warehouse.");
  }

  logger.info("🎉 Bangladesh & Global Jersey Store Seed COMPLETED SUCCESSFULLY!");
}
