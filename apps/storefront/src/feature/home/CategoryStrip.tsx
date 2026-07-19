import Image from "next/image"
import Link from "next/link"

interface CategoryWithImage {
  id: string
  name: string
  handle: string
  is_active: boolean
  is_internal: boolean
  category_image?: {
    image_url: string
  }
}

interface CategoryStripProps {
  categories: CategoryWithImage[]
}

export function CategoryStrip({ categories = [] }: CategoryStripProps) {
  // filter active and non-internal ones
  const activeCategories = categories.filter((c) => c.is_active && !c.is_internal)

  if (activeCategories.length === 0) {
    return null
  }

  return (
    <section className="border-b border-hairline-soft py-16">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl md:text-5xl uppercase">Top Collections</h2>
            <p className="mt-2 text-sm text-mute">Browse the moments that defined the game.</p>
          </div>
          <Link href="/shop" className="hidden md:inline text-sm font-medium underline underline-offset-4">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-6">
          {activeCategories.map((c) => {
            const fallbackImg = "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80"
            const imgUrl = c.category_image?.image_url || fallbackImg

            return (
              <Link 
                key={c.id} 
                href={`/shop?category=${c.id}`} 
                className="group flex flex-col items-center gap-3 text-center cursor-pointer"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-pill bg-cloud ring-1 ring-hairline-soft">
                  <Image
                    src={imgUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-ink">{c.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
