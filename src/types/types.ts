export type AssetType = 'Au' | 'Ag';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';
export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  experience: ExperienceLevel;
  riskProfile: RiskProfile;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  assets: Record<AssetType, number>;
  transactions: Transaction[];
  profile: Profile | null;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  asset: AssetType;
  amount: number;
  price: number;
  date: Date;
}

export interface PriceDataPoint {
  time: string;
  price: number;
}

export interface AssetData {
  current: number;
  history: PriceDataPoint[];
}

export type PriceData = Record<AssetType, AssetData>;