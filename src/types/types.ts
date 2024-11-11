export type AssetType = 'Au' | 'Ag';

export interface User {
  id: string;
  username: string;
  balance: number;
  assets: Record<AssetType, number>;
  transactions: Transaction[];
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