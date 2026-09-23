import { tombstoneCategories as fallbackCategories, tombstones as fallbackTombstones } from '../../data/tombstones';
import { createPublicContentClient } from './public-content';

export interface CatalogueTombstone {
  name: string;
  slug: string;
  category: string;
  image: string;
  brochurePrices: string[];
  previousPrice?: string;
  promotionalBadge?: string;
  laybyeEnabled: boolean;
  featured: boolean;
  needsReview: boolean;
  description: string;
}

type TombstoneRow = {
  name: string;
  slug: string;
  description: string | null;
  previous_price: number | null;
  brochure_price_labels: unknown;
  promotional_badge: string | null;
  laybye_available: boolean;
  is_featured: boolean;
  needs_review: boolean;
  tombstone_categories: { name: string } | { name: string }[] | null;
  tombstone_images: { url: string; alt_text: string | null; display_order: number }[] | null;
};

function formatPreviousPrice(value: number | null) {
  return value === null ? undefined : `Was R${new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 2 }).format(value)}`;
}

function categoryName(value: TombstoneRow['tombstone_categories']) {
  if (Array.isArray(value)) return value[0]?.name ?? 'Tombstones';
  return value?.name ?? 'Tombstones';
}

function priceLabels(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : [];
}

function toCatalogueTombstone(row: TombstoneRow): CatalogueTombstone {
  const images = row.tombstone_images ?? [];
  const image = [...images].sort((a, b) => a.display_order - b.display_order)[0]?.url;

  return {
    name: row.name,
    slug: row.slug,
    category: categoryName(row.tombstone_categories),
    image: image ?? '/images/tombstones/placeholder.webp',
    brochurePrices: priceLabels(row.brochure_price_labels),
    previousPrice: formatPreviousPrice(row.previous_price),
    promotionalBadge: row.promotional_badge ?? undefined,
    laybyeEnabled: row.laybye_available,
    featured: row.is_featured,
    needsReview: row.needs_review,
    description: row.description ?? 'Product shown in the TIRO tombstones catalogue.',
  };
}

/** Reads only published public content. Falls back to the verified local brochure data if Supabase is unavailable. */
export async function getPublicTombstoneCatalogue() {
  const client = createPublicContentClient();
  if (!client) return { tombstones: fallbackTombstones, tombstoneCategories: fallbackCategories, source: 'fallback' as const };

  const [{ data: categoryData, error: categoryError }, { data: tombstoneData, error: tombstoneError }] = await Promise.all([
    client.from('tombstone_categories').select('name, slug').eq('is_active', true).order('display_order'),
    client
      .from('tombstones')
      .select('name, slug, description, previous_price, brochure_price_labels, promotional_badge, laybye_available, is_featured, needs_review, tombstone_categories(name), tombstone_images(url, alt_text, display_order)')
      .eq('status', 'published')
      .order('display_order'),
  ]);

  if (categoryError || tombstoneError || !categoryData || !tombstoneData) {
    return { tombstones: fallbackTombstones, tombstoneCategories: fallbackCategories, source: 'fallback' as const };
  }

  return {
    tombstones: (tombstoneData as TombstoneRow[]).map(toCatalogueTombstone),
    tombstoneCategories: categoryData.map((category) => category.name),
    source: 'supabase' as const,
  };
}
