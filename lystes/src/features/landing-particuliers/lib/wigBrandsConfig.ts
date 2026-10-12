// Registry of wig partner brands (Pro clients). Used by /perruques pages.
// tryOnAgentId is the TRY_ON role agent that owns the catalog for the wig-tryon flow.
// When null, the "Essayer" button falls back to the product's purchase link.

export type WigBrand = {
  slug: string;
  accountId: string;
  name: string;
  tagline?: string;
  tryOnAgentId: string | null;
  expectedCount?: number;
};

export const WIG_BRANDS: WigBrand[] = [
  {
    slug: "dream-virgin-hair",
    accountId: "5f02a89f-186b-406b-abaa-aa1186ee30ec",
    name: "Dream Virgin Hair",
    tagline: "Cheveux 100% naturels — perruques, lace wigs, closures",
    tryOnAgentId: null,
    expectedCount: 564,
  },
  {
    slug: "fanny-beauty",
    accountId: "a4c379a5-6757-4dbb-bff9-211917911ba5",
    name: "Fanny's Beauty",
    tagline: "Lace wigs premium et coiffures sur mesure",
    tryOnAgentId: "8ccf9411-0144-41a2-9492-3fa0b48d2175",
    expectedCount: 438,
  },
  {
    slug: "fabhairconcept",
    accountId: "9ce10cd8-bd0c-4ad0-a528-037df9b4ef23",
    name: "Fabhairconcept",
    tagline: "Maison de perruques HD lace et frontals",
    tryOnAgentId: "6540130a-8360-4b9f-84a2-03aca299c986",
    expectedCount: 165,
  },
  {
    slug: "ezinris-beauty",
    accountId: "de2594cb-61b1-49b4-958c-c6016c8a8a89",
    name: "Ezinris Beauty",
    tagline: "Perruques signature et lace premium",
    tryOnAgentId: "31af3084-5353-4aaf-84e1-cace1eed8409",
    expectedCount: 28,
  },
  // Aliases sans tiret — correspondent aux slugs des multi-liens lystes.ai/{slug}.
  // Permettent d'exposer la même page essayage + avis que Lolo Paris.
  {
    slug: "dreamvirginhair",
    accountId: "5f02a89f-186b-406b-abaa-aa1186ee30ec",
    name: "Dream Virgin Hair",
    tagline: "Cheveux 100% naturels — perruques, lace wigs, closures",
    tryOnAgentId: null,
    expectedCount: 564,
  },
  {
    slug: "fannysbeauty",
    accountId: "a4c379a5-6757-4dbb-bff9-211917911ba5",
    name: "Fanny's Beauty",
    tagline: "Lace wigs premium et coiffures sur mesure",
    tryOnAgentId: "8ccf9411-0144-41a2-9492-3fa0b48d2175",
    expectedCount: 438,
  },
  {
    slug: "ezinrisbeauty",
    accountId: "de2594cb-61b1-49b4-958c-c6016c8a8a89",
    name: "Ezinris Beauty",
    tagline: "Perruques signature et lace premium",
    tryOnAgentId: "31af3084-5353-4aaf-84e1-cace1eed8409",
    expectedCount: 28,
  },
  {
    slug: "lambertbeauty",
    accountId: "9a02f834-5ad0-4836-964b-3c4c13102b9d",
    name: "Lambert Beauty",
    tagline: "Perruques et tissages premium",
    tryOnAgentId: null,
    expectedCount: 134,
  },
];


export const getWigBrand = (slug: string): WigBrand | undefined =>
  WIG_BRANDS.find((b) => b.slug === slug);

export const getWigBrandByAccount = (accountId: string): WigBrand | undefined =>
  WIG_BRANDS.find((b) => b.accountId === accountId);
