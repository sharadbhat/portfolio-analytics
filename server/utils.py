# utils.py
# Shared helper functions for the portfolio analytics tool.

import pandas as pd
import numpy as np
import yfinance as yf
import datetime as dt

ANNUAL_TRADING_DAYS = 252
RISK_FREE_RATE = 0.0423

def get_sector_allocation(portfolio_df):
    # get weight per ticker
    total_value = portfolio_df['amount_invested'].sum()

    # group by sector, calculate amount invested per sector and number of holdings per sector
    sector_group = portfolio_df.groupby('sector').agg(invested_per_sector = ('amount_invested', 'sum'),
                                                       num_holdings = ('ticker', 'count')).reset_index()
    sector_group['percent_in_sector'] = round(sector_group['invested_per_sector']*100/total_value, 2)
    sector_group = sector_group.sort_values('percent_in_sector', ascending=False)
    portfolio_df = portfolio_df.sort_values('amount_invested', ascending=False)
    return {'sector_allocation':sector_group,
            'portfolio_allocation': portfolio_df}


def get_benchmark_comparison(portfolio_df, daily_return):
    # calculate the daily and annualized returns of portfolio and the benchmark
    daily_portfolio_returns = get_weighted_portfolio_returns(portfolio_df, daily_return)
    benchmark_return = daily_return['SPY']
    cumulative_return_portfolio_series = (1 + daily_portfolio_returns).cumprod()
    cumulative_return_portfolio_series /= cumulative_return_portfolio_series.iloc[0]
    cumulative_return_portfolio = cumulative_return_portfolio_series.iloc[-1] - 1
    cumulative_return_benchmark_series = (1 + benchmark_return).cumprod()
    cumulative_return_benchmark_series /= cumulative_return_benchmark_series.iloc[0]
    cumulative_return_benchmark = cumulative_return_benchmark_series.iloc[-1] - 1
    # calculate alpha of portfolio over the benchmark
    portfolio_alpha = cumulative_return_portfolio - cumulative_return_benchmark
    # calculate the tracking error of the portfolio returns vs benchmark returns
    tracking_error = (daily_portfolio_returns - benchmark_return).std()
    return {
        "portfolio_daily_return": cumulative_return_portfolio_series,
        "benchmark_daily_return": cumulative_return_benchmark_series,
        "portfolio_alpha": portfolio_alpha,
        "tracking_error": tracking_error
    }

def get_daily_returns(portfolio_df):
    # use yf to get a 365 day history of ticker prices based on current date
    end_time = dt.date.today()
    start_time = end_time - dt.timedelta(days=365)
    ticker_list = portfolio_df['ticker'].to_list()
    # add SPY as benchmark if not already in ticker list
    if 'SPY' not in ticker_list:
        ticker_list.append('SPY')
    historical_price_df = yf.download(ticker_list, start=start_time, end=end_time)
    # calculate the daily return based on the closing prices for each ticker
    daily_return = historical_price_df['Close'].pct_change().dropna()
    return daily_return

def get_weighted_portfolio_returns(portfolio_df, daily_return):
    # fetch the weights per ticker
    portfolio_df = portfolio_df.sort_values('weights', ascending=False)
    # set weights as the index
    weights = portfolio_df.set_index('ticker')['weights']
    # multiply the weights with daily returns to get weighted returns
    weighted_returns = daily_return*weights
    daily_portfolio_returns = weighted_returns.sum(axis=1)
    return daily_portfolio_returns
    

def get_performance(portfolio_df, daily_return):
    # get daily returns of the portfolio
    daily_portfolio_returns = get_weighted_portfolio_returns(portfolio_df, daily_return)
    # find the cumulative return series of the daily returns
    cumulative_return_portfolio_series = (1 + daily_portfolio_returns).cumprod()
    # use the last row to get the total return
    portfolio_cumulative_return = cumulative_return_portfolio_series.iloc[-1] - 1
    # annualize the total return (1+r)^(trading days in a year/number of trading days)
    portfolio_annualized_return = (1 + portfolio_cumulative_return) ** (ANNUAL_TRADING_DAYS/len(daily_portfolio_returns)) - 1
    # use the total sum invested to get daily P/L
    total_value = portfolio_df['amount_invested'].sum()
    daily_pl = daily_portfolio_returns * total_value
    return {
        'cumulative_return_series': cumulative_return_portfolio_series,
        'portfolio_cumulative_return': portfolio_cumulative_return,
        'portfolio_annualized_return': portfolio_annualized_return,
        'daily_pl': daily_pl
    }

def get_portfolio_weights(stocks_df):
    # get the current price and sector of each ticker, assign ETF if no sector
    cp = []
    for ticker in stocks_df['ticker']:
        try:
            info = yf.Ticker(ticker).info
            sector = info.get('sector', 'ETF')
            current_price = info.get('currentPrice') or info.get('regularMarketPrice', 0)
        except Exception:
            sector = 'Unknown'
            current_price = 0
        cp.append({'ticker': ticker,
                        'sector': sector,
                        'current_price': current_price})
    cp_df = pd.DataFrame(cp)
    # join the price+sector df with the original df on matching ticker
    portfolio_df = pd.merge(stocks_df, cp_df, on="ticker")
    # find amount invested per ticker and total amount to get weights
    portfolio_df['amount_invested'] = portfolio_df['quantity'] * portfolio_df['current_price']
    total_value = portfolio_df['amount_invested'].sum()
    portfolio_df['weights'] = round(portfolio_df['amount_invested']/total_value, 2)
    return portfolio_df

def get_risk_metrics(portfolio_df, daily_return):
    # calculate sharpe ratio
    daily_portfolio_returns = get_weighted_portfolio_returns(portfolio_df, daily_return)
    cumulative_return_portfolio_series = (1 + daily_portfolio_returns).cumprod()
    portfolio_cumulative_return = cumulative_return_portfolio_series.iloc[-1] - 1
    portfolio_annualized_return = (1 + portfolio_cumulative_return) ** (ANNUAL_TRADING_DAYS/len(daily_portfolio_returns)) - 1
    portfolio_std_dev_ann = daily_portfolio_returns.std() * np.sqrt(ANNUAL_TRADING_DAYS)
    portfolio_sharpe_ratio = (portfolio_annualized_return - RISK_FREE_RATE ) / portfolio_std_dev_ann

    # calculate sortino ratio
    daily_portfolio_returns_positive = daily_portfolio_returns[daily_portfolio_returns<0]
    portfolio_std_dev_ann_neg = daily_portfolio_returns_positive.std() * np.sqrt(ANNUAL_TRADING_DAYS)
    portfolio_sortino_ratio = (portfolio_annualized_return - RISK_FREE_RATE) / portfolio_std_dev_ann_neg

    # calculate VAR at 95% confidence
    var = np.percentile(daily_portfolio_returns, 5)

    # calculate CVAR
    cvar = daily_portfolio_returns[daily_portfolio_returns <= var].mean()

    # calculate max drawdown
    running_max = cumulative_return_portfolio_series.cummax()
    drawdown = (cumulative_return_portfolio_series - running_max) / running_max
    max_drawdown = drawdown.min()

    return {
        'portfolio_sharpe_ratio': portfolio_sharpe_ratio,
        'portfolio_sortino_ratio': portfolio_sortino_ratio,
        'portfolio_var': var,
        'portfolio_cvar': cvar,
        'portfolio_max_drawdown': max_drawdown
    }