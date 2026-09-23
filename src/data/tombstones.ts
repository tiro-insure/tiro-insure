export type TombstoneCategory = 'Adult Tombstones' | 'Baby Tombstones' | 'Headstones' | 'Premium / Limited Edition' | 'Customised Range' | 'Shrines / Special Memorials' | 'Cremation Memorials';

export interface Tombstone {
  name: string;
  slug: string;
  category: TombstoneCategory;
  image: string;
  brochurePrices: string[];
  previousPrice?: string;
  promotionalBadge?: string;
  laybyeEnabled: boolean;
  featured: boolean;
  needsReview: boolean;
  description: string;
}

// Values preserve the brochure's labels exactly. T/P and A/P definitions require TIRO confirmation.
export const tombstones: Tombstone[] = [
  { name: 'Baby Kemi', slug: 'baby-kemi', category: 'Baby Tombstones', image: '/images/tombstones/baby-kemi.webp', brochurePrices: ['Now R15,300 A/P'], previousPrice: 'Was R18,000', laybyeEnabled: true, featured: true, needsReview: true, description: 'Overhanging kerbs and copings.' },
  { name: 'Baby Butterfly', slug: 'baby-butterfly', category: 'Baby Tombstones', image: '/images/tombstones/baby-butterfly.webp', brochurePrices: ['R8,330 T/P', 'Now R11,730 A/P'], previousPrice: 'Was R13,800', laybyeEnabled: true, featured: true, needsReview: true, description: 'Product shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Baby Sibaba Full', slug: 'baby-sibaba-full', category: 'Baby Tombstones', image: '/images/tombstones/baby-sibaba.webp', brochurePrices: ['R6,162.50 T/P', 'Now R7,225 A/P'], previousPrice: 'Was R8,500', laybyeEnabled: true, featured: false, needsReview: true, description: 'Product shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Molise', slug: 'molise', category: 'Headstones', image: '/images/tombstones/molise.webp', brochurePrices: ['Now R34,850'], previousPrice: 'Was R41,000', laybyeEnabled: true, featured: true, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Curtain', slug: 'curtain', category: 'Headstones', image: '/images/tombstones/curtain.webp', brochurePrices: ['Now R27,497.50'], previousPrice: 'Was R32,350', laybyeEnabled: true, featured: false, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Chapel', slug: 'chapel', category: 'Headstones', image: '/images/tombstones/chapel.webp', brochurePrices: ['Now R8,975'], previousPrice: 'Was R10,500', laybyeEnabled: true, featured: true, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Faro', slug: 'faro', category: 'Headstones', image: '/images/tombstones/faro.webp', brochurePrices: ['Now R12,750'], previousPrice: 'Was R15,000', laybyeEnabled: true, featured: false, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'House Prestige', slug: 'house-prestige', category: 'Headstones', image: '/images/tombstones/house-prestige.webp', brochurePrices: ['Now R24,225'], previousPrice: 'Was R28,500', laybyeEnabled: true, featured: true, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Nteso', slug: 'nteso', category: 'Headstones', image: '/images/tombstones/nteso.webp', brochurePrices: ['Now R7,225'], previousPrice: 'Was R8,500', laybyeEnabled: true, featured: true, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Minzi', slug: 'minzi', category: 'Headstones', image: '/images/tombstones/minzi.webp', brochurePrices: ['Now R19,125'], previousPrice: 'Was R22,500', laybyeEnabled: true, featured: false, needsReview: false, description: 'Headstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Jonker', slug: 'jonker', category: 'Adult Tombstones', image: '/images/tombstones/jonker.webp', brochurePrices: ['R5,525 T/P', 'Now R7,650 A/P'], previousPrice: 'Was R9,000', laybyeEnabled: true, featured: false, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Faku Full', slug: 'faku-full', category: 'Adult Tombstones', image: '/images/tombstones/faku-full.webp', brochurePrices: ['R11,050 T/P', 'Now R12,750 A/P'], previousPrice: 'Was R15,000', promotionalBadge: 'Premium quality', laybyeEnabled: true, featured: true, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Nteso Full', slug: 'nteso-full', category: 'Adult Tombstones', image: '/images/tombstones/nteso-full.webp', brochurePrices: ['R8,925 T/P', 'Now R11,050 A/P'], previousPrice: 'Was R13,000', laybyeEnabled: true, featured: true, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Tlhabanello', slug: 'tlhabanello', category: 'Adult Tombstones', image: '/images/tombstones/tlhabanello.webp', brochurePrices: ['Now R13,600 A/P'], previousPrice: 'Was R16,000', laybyeEnabled: true, featured: false, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Moiloole', slug: 'moiloole', category: 'Adult Tombstones', image: '/images/tombstones/moiloole.webp', brochurePrices: ['R13,175 T/P', 'Now R15,300 A/P'], previousPrice: 'Was R18,000', laybyeEnabled: true, featured: false, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Gimma', slug: 'gimma', category: 'Adult Tombstones', image: '/images/tombstones/gimma.webp', brochurePrices: ['R10,914 T/P', 'Now R8,789 A/P'], previousPrice: 'Was R10,340', laybyeEnabled: true, featured: false, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Lebona', slug: 'lebona', category: 'Adult Tombstones', image: '/images/tombstones/lebona.webp', brochurePrices: ['Now R52,700'], previousPrice: 'Was R62,000', laybyeEnabled: true, featured: true, needsReview: false, description: 'Rustic A/P tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Chapel Full', slug: 'chapel-full', category: 'Adult Tombstones', image: '/images/tombstones/chapel-full.webp', brochurePrices: ['R11,050 T/P', 'Now R12,750 A/P'], previousPrice: 'Was R15,000', promotionalBadge: 'Premium quality', laybyeEnabled: true, featured: true, needsReview: true, description: 'Adult tombstone shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Brizollari', slug: 'brizollari', category: 'Premium / Limited Edition', image: '/images/tombstones/brizollari.webp', brochurePrices: ['Now R49,300'], previousPrice: 'Was R58,000', promotionalBadge: 'Limited edition', laybyeEnabled: true, featured: true, needsReview: false, description: 'Premium product shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Curtain', slug: 'premium-curtain', category: 'Premium / Limited Edition', image: '/images/tombstones/premium-curtain.webp', brochurePrices: ['Now R50,660'], previousPrice: 'Was R59,600', promotionalBadge: 'Limited edition', laybyeEnabled: true, featured: true, needsReview: false, description: 'Premium product shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Mayor Double', slug: 'mayor-double', category: 'Customised Range', image: '/images/tombstones/mayor-double.webp', brochurePrices: ['Now R32,640'], previousPrice: 'Was R38,400', laybyeEnabled: true, featured: true, needsReview: false, description: 'Customised-range double tombstone shown in the 2026 catalogue.' },
  { name: 'Statai', slug: 'statai', category: 'Customised Range', image: '/images/tombstones/statai.webp', brochurePrices: ['Now R55,250'], previousPrice: 'Was R65,000', laybyeEnabled: true, featured: true, needsReview: false, description: 'Customised-range tombstone shown in the 2026 catalogue.' },
  { name: 'Bonanza', slug: 'bonanza', category: 'Shrines / Special Memorials', image: '/images/tombstones/bonanza.webp', brochurePrices: ['Now R4,165'], previousPrice: 'Was R4,900', promotionalBadge: 'Big bargain', laybyeEnabled: true, featured: true, needsReview: false, description: 'Special memorial shown in the 2026 TIRO tombstones catalogue.' },
  { name: 'Marble Shrine', slug: 'marble-shrine', category: 'Shrines / Special Memorials', image: '/images/tombstones/marble-shrine.webp', brochurePrices: ['Now R56,950'], previousPrice: 'Was R67,000', promotionalBadge: 'Limited edition', laybyeEnabled: true, featured: true, needsReview: false, description: 'Polished marble, contrasted with high gloss Zimbabwe black granite, resting on a cladding foundation.' },
  { name: 'Cremation Vase', slug: 'cremation-vase', category: 'Cremation Memorials', image: '/images/tombstones/cremation-vase.webp', brochurePrices: ['Now R22,100'], previousPrice: 'Was R26,000', laybyeEnabled: true, featured: true, needsReview: false, description: 'Cremation memorial shown in the 2026 TIRO tombstones catalogue.' },
];

export const tombstoneCategories: TombstoneCategory[] = ['Adult Tombstones', 'Baby Tombstones', 'Headstones', 'Premium / Limited Edition', 'Customised Range', 'Shrines / Special Memorials', 'Cremation Memorials'];
