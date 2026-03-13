# utils.py
# Shared helper functions for the portfolio analytics tool.

import pandas as pd
import numpy as np
import yfinance as yf

def get_sector_allocation(stocks_df):
    sector_df = {}
    sectors = []
    for ticker in stocks_df['ticker']:
        try:
            info = yf.Ticker(ticker).info
            sector = info.get('sector', 'ETF')
            current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
        except Exception:
            sector = 'Unknown'
            current_price = 0
        sectors.append({'ticker': ticker,
                        'sector': sector,
                        'Current Price': current_price})
    sector_df = pd.DataFrame(sectors)
    portfolio_df = pd.merge(stocks_df, sector_df, on="ticker")
    portfolio_df['Amount Invested'] = portfolio_df['quantity'] * portfolio_df['Current Price']
    total_value = portfolio_df['Amount Invested'].sum()
    sector_group = portfolio_df.groupby('sector').agg(invested_per_sector = ('Amount Invested', 'sum'),
                                                       num_holdings = ('ticker', 'count')).reset_index()
    sector_group['percent_in_sector'] = round(sector_group['invested_per_sector']*100/total_value, 2)
    return sector_group