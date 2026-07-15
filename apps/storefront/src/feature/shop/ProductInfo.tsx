"use client";

import { useState } from "react";
import type { Product } from "@/feature/home/ProductCard";
import { Heart, Share2, HelpCircle, ChevronDown, Minus, Plus, Truck, Calendar } from "lucide-react";

export function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedPlayer, setSelectedPlayer] = useState(product.players?.[0]?.name || "Patch Only");
  const [customName, setCustomName] = useState("");
  const [selectedPatch, setSelectedPatch] = useState(product.patches?.[0] || "No Patch");
  const [quantity, setQuantity] = useState(1);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasDiscount = product.original && product.original > product.price;

  return (
    <div className="flex flex-col gap-6 text-ink">
      {/* Badge & Title */}
      <div>
        <div className="flex items-center gap-3">
          {product.discount ? (
            <span className="inline-flex items-center rounded-pill bg-sale px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-canvas">
              -{product.discount}%
            </span>
          ) : null}
          <div className="flex items-center gap-1.5 text-xs text-sale font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sale opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sale"></span>
            </span>
            <span>{product.soldCount || 22} sold in last 10 hours</span>
          </div>
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl uppercase tracking-wide leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-sale">${product.price.toFixed(2)}</span>
        {hasDiscount ? (
          <span className="text-lg text-mute line-through">${product.original!.toFixed(2)}</span>
        ) : null}
      </div>

      {/* Shipping & Delivery card */}
      <div className="rounded-lg border border-hairline-soft bg-cloud/50 p-4 space-y-3">
        <div className="flex items-start gap-3 text-xs text-charcoal">
          <Calendar className="h-4 w-4 text-mute mt-0.5" />
          <div>
            <span className="font-semibold">Estimated delivery time:</span> 7-21 Days.
          </div>
        </div>
        <div className="flex items-start gap-3 text-xs text-charcoal">
          <Truck className="h-4 w-4 text-mute mt-0.5" />
          <div>
            <span className="font-semibold">Free shipping:</span> Min Order of 3+ Items
          </div>
        </div>
      </div>

      {/* Real-time viewers */}
      <div className="text-xs text-charcoal flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        <span>{product.viewingCount || 35} people are viewing this right now</span>
      </div>

      {/* Size Selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wide text-ink">Size: {selectedSize}</span>
            <button className="text-mute underline underline-offset-4 hover:text-ink">Size guide</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-12 h-10 px-3 rounded-pill text-xs font-semibold border transition-all ${
                  selectedSize === size
                    ? "bg-ink border-ink text-canvas"
                    : "bg-canvas border-hairline-soft text-ink hover:border-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Player Customization */}
      {product.players && product.players.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide block">Player Name</span>
          <div className="flex flex-wrap gap-2">
            {product.players.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedPlayer(p.name)}
                className={`h-10 px-4 rounded-pill text-xs font-semibold border transition-all ${
                  selectedPlayer === p.name
                    ? "bg-ink border-ink text-canvas"
                    : "bg-cloud border-transparent text-ink hover:border-hairline"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Custom Name and Number (Leave Note At Checkout)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full h-11 rounded-pill border border-hairline-soft px-4 text-xs placeholder:text-mute outline-none focus:border-ink transition-colors"
          />
        </div>
      )}

      {/* Patch Selector */}
      {product.patches && product.patches.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wide block">Patch</span>
          <div className="flex flex-wrap gap-2">
            {product.patches.map((patch) => (
              <button
                key={patch}
                onClick={() => setSelectedPatch(patch)}
                className={`h-10 px-4 rounded-pill text-xs font-semibold border transition-all ${
                  selectedPatch === patch
                    ? "bg-ink border-ink text-canvas"
                    : "bg-cloud border-transparent text-ink hover:border-hairline"
                }`}
              >
                {patch}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Social Actions */}
      <div className="flex items-center gap-6 py-2 text-xs border-y border-hairline-soft">
        <button className="flex items-center gap-2 text-mute hover:text-ink">
          <HelpCircle className="h-4 w-4" />
          <span>Ask a question</span>
        </button>
        <button className="flex items-center gap-2 text-mute hover:text-ink">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Purchase Actions */}
      <div className="space-y-3 mt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex h-12 items-center rounded-pill bg-cloud px-4 border border-hairline-soft">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-mute hover:text-ink transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-mute hover:text-ink transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Add to Cart */}
          <button className="flex-1 h-12 rounded-pill bg-ink text-xs font-semibold uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity">
            Add to Cart
          </button>

          {/* Wishlist */}
          <button
            aria-label="Add to wishlist"
            className="flex h-12 w-12 items-center justify-center rounded-pill border border-hairline-soft bg-canvas text-ink hover:bg-cloud transition-colors"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Buy with Shop */}
        <button className="w-full h-12 rounded-pill bg-[#5a31f4] text-xs font-bold uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity">
          Buy with <span className="font-extrabold italic lowercase">shop</span>
        </button>

        {/* More options */}
        <button className="w-full text-center text-xs font-semibold underline underline-offset-4 hover:text-mute">
          More payment options
        </button>
      </div>

      {/* Accordions */}
      <div className="mt-4 border-t border-hairline-soft">
        {[
          {
            key: "description",
            title: "Description",
            content: (
              <div className="space-y-3">
                <p>{product.description}</p>
                {product.details && product.details.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          },
          {
            key: "shipping",
            title: "Shipping and Returns",
            content: (
              <p>
                We offer worldwide trackable shipping. Orders are processed within 1-2 business days. Estimated delivery is 7-21 days depending on your location. Returns are accepted within 30 days of receipt if the items are unworn and tags remain intact.
              </p>
            ),
          },
          {
            key: "refunds",
            title: "Refund Policies",
            content: (
              <p>
                Refunds will be processed back to your original payment method once the returned item is inspected and approved. Customized player jerseys (with custom name/number) are final sale and cannot be returned unless there is a manufacturer defect.
              </p>
            ),
          },
          {
            key: "patchGuide",
            title: "Don't Know How to Add Patch or Number and Name?",
            content: (
              <p>
                To customize your jersey, select the player button or choose &quot;Patch Only&quot;. If you want a custom name and number not listed, type it in the text box exactly as you&apos;d like it to appear. You can also specify any extra instructions in the order note field during checkout.
              </p>
            ),
          },
        ].map((tab) => {
          const isOpen = !!openAccordions[tab.key];
          return (
            <div key={tab.key} className="border-b border-hairline-soft py-4">
              <button
                onClick={() => toggleAccordion(tab.key)}
                className="flex w-full items-center justify-between text-left focus:outline-none"
              >
                <span className="text-sm font-semibold uppercase tracking-wide">{tab.title}</span>
                <ChevronDown
                  className={`h-4 w-4 text-mute transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
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
    </div>
  );
}
