import { Button } from "@/components/ui/button";
import { IconReload } from "@tabler/icons-react";
import { Grid, Grid3X3, LayoutGrid, List } from "lucide-react";

interface ShopToolbarProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onRefetch?: () => void;
  isRefetching?: boolean;
}

const gridOptions = [
  { id: "grid-2", label: "2 Columns", icon: LayoutGrid },
  { id: "grid-3", label: "3 Columns", icon: Grid },
  { id: "grid-4", label: "4 Columns", icon: Grid3X3 },
  { id: "list", label: "List View", icon: List },
];

export function ShopToolbar({
  activeMode,
  onModeChange,
  sortBy,
  onSortChange,
  onRefetch,
  isRefetching = false,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-hairline-soft pb-4 mb-8 text-ink">
      {/* Grid Layout Toggles */}
      <div className="flex items-center gap-1.5">
        {gridOptions.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onModeChange(mode.id)}
              aria-label={mode.label}
              className={`p-2 rounded transition-colors border-0 outline-none ${
                isActive
                  ? "bg-cloud text-ink"
                  : "text-mute hover:text-ink hover:bg-cloud/50 cursor-pointer"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
            </button>
          );
        })}
      </div>

      {/* Sort Selector */}
      <div className="flex  items-center justify-center gap-x-8">
        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl cursor-pointer"
          onClick={onRefetch}
          disabled={isRefetching}
        >
          <span>refresh</span>
          <IconReload className={isRefetching ? "animate-spin" : ""} />
        </Button>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <span className="text-xs text-mute font-medium">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-canvas border border-hairline-soft rounded-pill px-4 pr-10 py-2 text-xs font-semibold focus:border-ink outline-none cursor-pointer transition-colors"
            >
              <option value="az">Alphabetically, A-Z</option>
              <option value="za">Alphabetically, Z-A</option>
              <option value="low-high">Price, low to high</option>
              <option value="high-low">Price, high to low</option>
              <option value="best-selling">Best Selling</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-mute">
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
