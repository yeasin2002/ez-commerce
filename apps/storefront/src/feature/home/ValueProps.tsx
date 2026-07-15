import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $80 worldwide" },
  { icon: RotateCcw, title: "30-Day Returns", desc: "No-questions swap or refund" },
  { icon: Shield, title: "Authentic Only", desc: "Officially licensed from source" },
  { icon: Headphones, title: "24/7 Support", desc: "Real humans, usually under an hour" },
];

export function ValueProps() {
  return (
    <section className="border-y border-hairline-soft py-12">
      <div className="container-page grid grid-cols-2 gap-8 md:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-cloud">
              <Icon className="h-5 w-5 text-ink" />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">{title}</div>
              <div className="text-xs text-mute mt-1">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
