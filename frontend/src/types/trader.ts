// TODO: This is a placeholder. In a real monorepo setup,
// this would be imported from a shared types package.

export interface Trader {
  traderId: string; // Corresponds to user's UID in Firebase Auth
  name: string;
  elo: number;
  wins: number;
  losses: number;
  xp: number;
  tier: string;
}
