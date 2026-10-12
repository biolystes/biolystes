/**
 * Centralized try-on agent routing utility.
 * Maps all try-on agent types to their appropriate demo pages.
 * 
 * Used by: AgentPage.tsx, MonEquipePage.tsx, OnboardingWizard.tsx
 */

/** All recognized try-on agent types */
export const TRYON_AGENT_TYPES = [
  'wig_tryon',
  'glasses_tryon',
  'clothing_tryon',
  'makeup_tryon',
  'shoes_tryon',
  'jewelry_tryon',
  'watch_tryon',
  'decor_tryon',
] as const;

export type TryOnAgentType = typeof TRYON_AGENT_TYPES[number];

/**
 * Maps each try-on agent type to its demo page path.
 * Types without dedicated demo pages use eyewear-tryon which is the most
 * generic implementation (same virtual-tryon edge function, accepts ?agent=).
 */
const TRYON_ROUTE_MAP: Record<string, string> = {
  wig_tryon: '/demo/wig-tryon',
  glasses_tryon: '/demo/eyewear-tryon',
  clothing_tryon: '/demo/clothing-tryon-template',
  makeup_tryon: '/demo/makeup-tryon-template',
  shoes_tryon: '/demo/shoes-tryon-template',
  jewelry_tryon: '/demo/jewelry-tryon-template',
  watch_tryon: '/demo/watch-tryon-template',
  decor_tryon: '/demo/decor-tryon-template',
};

/**
 * Check if an agent type is a try-on type
 */
export function isTryOnAgentType(agentType: string | null | undefined): boolean {
  if (!agentType) return false;
  return TRYON_AGENT_TYPES.includes(agentType as TryOnAgentType);
}

/**
 * Get the demo URL for a try-on agent, including agent ID and optional product ID.
 * Returns null if the agent is not a try-on type.
 */
export function getTryOnDemoUrl(
  agentType: string | null | undefined,
  agentId: string,
  productId?: string | null
): string | null {
  if (!agentType || !TRYON_ROUTE_MAP[agentType]) return null;
  
  const basePath = TRYON_ROUTE_MAP[agentType];
  const params = new URLSearchParams({ agent: agentId });
  if (productId) params.set('product', productId);
  
  return `${basePath}?${params.toString()}`;
}
