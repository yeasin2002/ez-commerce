import { ChevronDown } from "lucide-react";
import React from "react";
import { HttpTypes } from "@medusajs/types";
import { getProductDetails } from "@lib/util/product";

type Props = {
  product: HttpTypes.StoreProduct;
  toggleAccordion: (key: string) => void;
  openAccordions: Record<string, boolean>;
};

export const ProductAccordions = ({
  product,
  toggleAccordion,
  openAccordions,
}: Props) => {
  const details = getProductDetails(product);

  const hasSpecs =
    !!product.material ||
    !!product.weight ||
    !!product.length ||
    !!product.width ||
    !!product.height ||
    !!product.origin_country ||
    !!product.hs_code ||
    !!product.collection?.title ||
    !!product.type?.value;

  const accordionsContents = [
    {
      key: "description",
      title: "Description",
      content: (
        <div className="space-y-3">
          <p>{product.description}</p>
          {details && details.length > 0 && (
            <ul className="list-disc pl-4 space-y-1">
              {details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    ...(hasSpecs
      ? [
          {
            key: "specifications",
            title: "Specifications",
            content: (
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1">
                {product.material && (
                  <>
                    <span className="text-mute font-medium">Material</span>
                    <span className="text-ink font-semibold">
                      {product.material}
                    </span>
                  </>
                )}
                {product.weight && (
                  <>
                    <span className="text-mute font-medium">Weight</span>
                    <span className="text-ink font-semibold">
                      {product.weight}g
                    </span>
                  </>
                )}
                {(product.length || product.width || product.height) && (
                  <>
                    <span className="text-mute font-medium">Dimensions</span>
                    <span className="text-ink font-semibold">
                      {[product.length, product.width, product.height]
                        .filter((v) => v !== null && v !== undefined)
                        .join(" × ")}{" "}
                      cm
                    </span>
                  </>
                )}
                {product.origin_country && (
                  <>
                    <span className="text-mute font-medium">
                      Origin Country
                    </span>
                    <span className="text-ink font-semibold">
                      {product.origin_country}
                    </span>
                  </>
                )}
                {product.hs_code && (
                  <>
                    <span className="text-mute font-medium">HS Code</span>
                    <span className="text-ink font-semibold">
                      {product.hs_code}
                    </span>
                  </>
                )}
                {product.collection?.title && (
                  <>
                    <span className="text-mute font-medium">Collection</span>
                    <span className="text-ink font-semibold">
                      {product.collection.title}
                    </span>
                  </>
                )}
                {product.type?.value && (
                  <>
                    <span className="text-mute font-medium">Type</span>
                    <span className="text-ink font-semibold">
                      {product.type.value}
                    </span>
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      key: "shipping",
      title: "Shipping and Returns",
      content: (
        <p>
          We offer worldwide trackable shipping. Orders are processed within 1-2
          business days. Estimated delivery is 7-21 days depending on your
          location. Returns are accepted within 30 days of receipt if the items
          are unworn and tags remain intact.
        </p>
      ),
    },
    {
      key: "refunds",
      title: "Refund Policies",
      content: (
        <p>
          Refunds will be processed back to your original payment method once
          the returned item is inspected and approved. Customized player jerseys
          (with custom name/number) are final sale and cannot be returned unless
          there is a manufacturer defect.
        </p>
      ),
    },
    /*
    {
      key: "patchGuide",
      title: "Don't Know How to Add Patch or Number and Name?",
      content: (
        <p>
          To customize your jersey, select the player button or choose &quot;Patch
          Only&quot;. If you want a custom name and number not listed, type it in
          the text box exactly as you&apos;d like it to appear. You can also
          specify any extra instructions in the order note field during checkout.
        </p>
      ),
    },
    */
  ];

  return (
    <div className="mt-4 border-t border-hairline-soft">
      {accordionsContents.map((tab) => {
        const isOpen = !!openAccordions[tab.key];
        return (
          <div key={tab.key} className="border-b border-hairline-soft py-4">
            <button
              onClick={() => toggleAccordion(tab.key)}
              className="flex w-full items-center justify-between text-left focus:outline-none cursor-pointer"
            >
              <span className="text-sm font-semibold uppercase tracking-wide">
                {tab.title}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-mute transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100 mt-3"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden text-xs text-charcoal leading-relaxed">
                {tab.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
