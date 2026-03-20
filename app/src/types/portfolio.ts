export type SampleHolding = {
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
};

export type SampleCsv = {
  title: string;
  description: string;
  fileName: string;
  holdings: string;
  rows: SampleHolding[];
};

export type PortfolioAllocationRow = {
  amount_invested: number;
  current_price: number;
  avg_buy_price: number;
  quantity: number;
  sector: string;
  ticker: string;
  weights: number;
};

export type SectorAllocationRow = {
  invested_per_sector: number;
  num_holdings: number;
  percent_in_sector: number;
  sector: string;
};

export type HoldingsAnalytics = {
  portfolio_allocation: PortfolioAllocationRow[];
  sector: SectorAllocationRow[];
};

export type PerformanceAnalytics = {
  annualized_return: number;
  benchmark_perf: Record<string, number>;
  daily_pl_series: Record<string, number>;
  portfolio_perf: Record<string, number>;
  portolio_alpha: number;
  return_series: Record<string, number>;
  tracking_error: number;
};

export type RiskAnalytics = {
  portfolio_cvar: number;
  portfolio_max_drawdown: number;
  portfolio_var: number;
  sharpe_ratio: number;
  sortino_ratio: number;
};

export type PortfolioAnalytics = {
  holdings: HoldingsAnalytics;
  performance: PerformanceAnalytics;
  risk: RiskAnalytics;
};

export type PortfolioAnalyticsResponse = {
  analytics: PortfolioAnalytics;
};
