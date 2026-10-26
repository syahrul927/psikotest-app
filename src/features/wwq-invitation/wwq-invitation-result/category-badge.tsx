import { Badge } from "@/components/ui/badge";
import { type WwqCategory } from "@/lib/wwq-utils";

// Kategori badge style per WWQ category (Normal / Kecendrungan / Gangguan)
const categoryBadgeStyles: Record<
  WwqCategory,
  { variant: "positive" | "secondary" | "destructive"; className: string }
> = {
  Normal: { variant: "positive", className: "" },
  "Kecendrungan Pathologis": {
    variant: "secondary",
    className:
      "border-2 border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  "Gangguan Pathologis": { variant: "destructive", className: "" },
};

export function WwqCategoryBadge({ category }: { category: string }) {
  // Stray strings in old DB rows fall back to the neutral outline badge
  const style = categoryBadgeStyles[category as WwqCategory];
  if (!style) {
    return <Badge variant="outline">{category}</Badge>;
  }
  return (
    <Badge variant={style.variant} className={style.className}>
      {category}
    </Badge>
  );
}
