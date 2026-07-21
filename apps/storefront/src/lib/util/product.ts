import { HttpTypes } from "@medusajs/types";

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
  return product.options?.length === 1 && product.options[0].values?.length === 1;
};

export const getProductTeam = (product: HttpTypes.StoreProduct): string => {
  return (
    (product.metadata?.team as string) ||
    (product.metadata?.teamName as string) ||
    product.subtitle ||
    "Sportswear"
  );
};

export const getProductDetails = (product: HttpTypes.StoreProduct): string[] | undefined => {
  const rawDetails = product.metadata?.details;
  return Array.isArray(rawDetails) ? rawDetails.map(String) : undefined;
};

export const getProductPlayers = (
  product: HttpTypes.StoreProduct
): { name: string; label: string }[] | undefined => {
  const rawPlayers = product.metadata?.players;
  if (Array.isArray(rawPlayers)) {
    return rawPlayers.map((p) => {
      const item = p as Record<string, unknown> | null | undefined;
      return {
        name: typeof item === "object" && item ? String(item.name || "") : String(p),
        label:
          typeof item === "object" && item
            ? String(item.label || item.name || "")
            : String(p),
      };
    });
  }

  // Fallback: Parse from description
  if (product.description) {
    const playerRegex = /Player customization options:\s*([^.]+)/i;
    const match = product.description.match(playerRegex);
    if (match && match[1]) {
      const parts = match[1].split(",").map((s) => s.trim());
      return parts.map((p) => ({
        name: p,
        label: p,
      }));
    }
  }

  return undefined;
};

export const getProductPatches = (product: HttpTypes.StoreProduct): string[] | undefined => {
  const rawPatches = product.metadata?.patches;
  if (Array.isArray(rawPatches)) {
    return rawPatches.map(String);
  }

  // Fallback: Parse from description
  if (product.description) {
    const patchRegex = /Patch options:\s*([^.]+)/i;
    const match = product.description.match(patchRegex);
    if (match && match[1]) {
      return match[1].split(",").map((s) => s.trim());
    }
  }

  return undefined;
};

export const getProductSoldCount = (product: HttpTypes.StoreProduct): number | undefined => {
  return (
    (product.metadata?.soldCount as number) ||
    (product.metadata?.sold_count as number) ||
    undefined
  );
};

export const getProductViewingCount = (product: HttpTypes.StoreProduct): number | undefined => {
  return (
    (product.metadata?.viewingCount as number) ||
    (product.metadata?.viewing_count as number) ||
    undefined
  );
};