import { BRANDING, SOCIAL_CONTACT } from "@/config";
import Image from "next/image";

const COLS = [
  {
    title: "Shop",
    links: [
      "New Arrivals",
      "Best Sellers",
      "National Teams",
      "Club Kits",
      "Retro",
      "Accessories",
    ],
  },
  {
    title: "Help",
    links: [
      "Contact",
      "Shipping",
      "Returns",
      "Size Guide",
      "Track Order",
      "FAQ",
    ],
  },
  {
    title: "Company",
    links: [
      "About",
      "Sustainability",
      "Press",
      "Careers",
      "Affiliates",
      "Wholesale",
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline-soft bg-canvas pt-16">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Image
              width={200}
              height={200}
              src={BRANDING.logo}
              alt={BRANDING.title}
              priority
            />
            {/* <span className="font-display text-3xl tracking-wider">
              FOOTY<span className="text-mute">STYLE</span>HUB
            </span> */}
            <p className="mt-4 max-w-xs text-sm text-mute">
              {BRANDING.description}
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIAL_CONTACT.map((contact, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-pill bg-cloud text-ink transition-colors hover:bg-ink hover:text-canvas"
                >
                  <contact.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-mute transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-hairline-soft py-8 md:flex-row md:items-center">
          <p className="text-xs text-mute">
            © {new Date().getFullYear()} {BRANDING.title}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-mute">
            <a href="#" className="hover:text-ink">
              Privacy
            </a>
            <a href="#" className="hover:text-ink">
              Terms
            </a>
            <a href="#" className="hover:text-ink">
              Cookies
            </a>
            <a href="#" className="hover:text-ink">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
