import type { SampleCsv } from "../types/portfolio";

export const sampleCsvs: SampleCsv[] = [
  {
    title: "Starter Portfolio",
    description: "A balanced mix of large-cap equities and bond exposure.",
    fileName: "starter-portfolio.csv",
    holdings: "6 holdings",
    rows: [
      { ticker: "AAPL", quantity: 20, avgBuyPrice: 182.4 },
      { ticker: "MSFT", quantity: 14, avgBuyPrice: 398.25 },
      { ticker: "JNJ", quantity: 12, avgBuyPrice: 158.1 },
      { ticker: "JPM", quantity: 16, avgBuyPrice: 189.35 },
      { ticker: "VTI", quantity: 18, avgBuyPrice: 268.2 },
      { ticker: "BND", quantity: 24, avgBuyPrice: 72.85 },
    ],
  },
  {
    title: "Growth Tilt",
    description: "A concentrated tech and innovation-focused allocation.",
    fileName: "growth-tilt.csv",
    holdings: "7 holdings",
    rows: [
      { ticker: "NVDA", quantity: 16, avgBuyPrice: 910.5 },
      { ticker: "MSFT", quantity: 10, avgBuyPrice: 405.8 },
      { ticker: "AMZN", quantity: 18, avgBuyPrice: 176.4 },
      { ticker: "META", quantity: 12, avgBuyPrice: 495.1 },
      { ticker: "TSLA", quantity: 14, avgBuyPrice: 205.25 },
      { ticker: "QQQ", quantity: 20, avgBuyPrice: 436.9 },
      { ticker: "SHOP", quantity: 22, avgBuyPrice: 77.6 },
    ],
  },
  {
    title: "Income Focus",
    description: "Dividend-oriented holdings for income and lower volatility.",
    fileName: "income-focus.csv",
    holdings: "6 holdings",
    rows: [
      { ticker: "SCHD", quantity: 28, avgBuyPrice: 79.45 },
      { ticker: "VYM", quantity: 24, avgBuyPrice: 120.6 },
      { ticker: "PG", quantity: 16, avgBuyPrice: 151.8 },
      { ticker: "JNJ", quantity: 12, avgBuyPrice: 159.25 },
      { ticker: "O", quantity: 30, avgBuyPrice: 55.1 },
      { ticker: "DUK", quantity: 18, avgBuyPrice: 102.35 },
    ],
  },
];
