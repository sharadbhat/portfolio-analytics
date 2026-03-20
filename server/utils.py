# utils.py
# Shared helper functions for the portfolio analytics tool.

import datetime as dt
from functools import lru_cache

import numpy as np
import pandas as pd
import yfinance as yf

ANNUAL_TRADING_DAYS = 252
RISK_FREE_RATE = 0.0423


def get_sector_allocation(portfolio_df):
    total_value = portfolio_df["amount_invested"].sum()

    sector_group = (
        portfolio_df.groupby("sector")
        .agg(
            invested_per_sector=("amount_invested", "sum"),
            num_holdings=("ticker", "count"),
        )
        .reset_index()
    )
    sector_group["percent_in_sector"] = round(
        sector_group["invested_per_sector"] * 100 / total_value,
        2,
    )
    sector_group = sector_group.sort_values("percent_in_sector", ascending=False)
    portfolio_df = portfolio_df.sort_values("amount_invested", ascending=False)
    return {
        "sector_allocation": sector_group,
        "portfolio_allocation": portfolio_df,
    }


def get_benchmark_comparison(portfolio_df, daily_return):
    if "SPY" not in daily_return.columns:
        raise RuntimeError("Unable to fetch benchmark data for SPY.")

    daily_portfolio_returns = get_weighted_portfolio_returns(
        portfolio_df,
        daily_return,
    )
    benchmark_return = daily_return["SPY"]

    cumulative_return_portfolio_series = (1 + daily_portfolio_returns).cumprod()
    cumulative_return_portfolio_series /= cumulative_return_portfolio_series.iloc[0]
    cumulative_return_portfolio = cumulative_return_portfolio_series.iloc[-1] - 1

    cumulative_return_benchmark_series = (1 + benchmark_return).cumprod()
    cumulative_return_benchmark_series /= cumulative_return_benchmark_series.iloc[0]
    cumulative_return_benchmark = cumulative_return_benchmark_series.iloc[-1] - 1

    portfolio_alpha = cumulative_return_portfolio - cumulative_return_benchmark
    tracking_error = (daily_portfolio_returns - benchmark_return).std()

    return {
        "portfolio_daily_return": cumulative_return_portfolio_series,
        "benchmark_daily_return": cumulative_return_benchmark_series,
        "portfolio_alpha": portfolio_alpha,
        "tracking_error": tracking_error,
    }


def normalize_price_history(downloaded_prices):
    if downloaded_prices.empty:
        return pd.DataFrame()

    if isinstance(downloaded_prices.columns, pd.MultiIndex):
        if "Close" not in downloaded_prices.columns.get_level_values(0):
            return pd.DataFrame()

        close_prices = downloaded_prices["Close"]
    else:
        close_prices = downloaded_prices.to_frame(name="Close")

    close_prices = close_prices.dropna(axis=1, how="all")
    close_prices.index = pd.to_datetime(close_prices.index, errors="coerce")
    close_prices = close_prices.sort_index()
    return close_prices


def get_daily_returns(portfolio_df):
    end_time = dt.date.today()
    start_time = end_time - dt.timedelta(days=365)

    ticker_list = portfolio_df["ticker"].dropna().astype(str).str.upper().tolist()
    if "SPY" not in ticker_list:
        ticker_list.append("SPY")

    historical_price_df = yf.download(
        ticker_list,
        start=start_time,
        end=end_time,
        auto_adjust=False,
        progress=False,
        threads=False,
        group_by="column",
    )

    close_prices = normalize_price_history(historical_price_df)
    if "SPY" not in close_prices.columns:
        raise RuntimeError("Unable to fetch benchmark price history for SPY.")

    daily_return = close_prices.pct_change(fill_method=None).dropna(how="all")
    return daily_return


def get_weighted_portfolio_returns(portfolio_df, daily_return):
    portfolio_df = portfolio_df.sort_values("weights", ascending=False)
    weights = portfolio_df.set_index("ticker")["weights"]
    weights.index = weights.index.astype(str).str.upper()
    weights = weights.reindex(daily_return.columns).dropna()

    weighted_returns = daily_return[weights.index] * weights
    daily_portfolio_returns = weighted_returns.sum(axis=1)
    return daily_portfolio_returns


def get_performance(portfolio_df, daily_return):
    daily_portfolio_returns = get_weighted_portfolio_returns(
        portfolio_df,
        daily_return,
    )
    cumulative_return_portfolio_series = (1 + daily_portfolio_returns).cumprod()
    portfolio_cumulative_return = cumulative_return_portfolio_series.iloc[-1] - 1
    portfolio_annualized_return = (1 + portfolio_cumulative_return) ** (
        ANNUAL_TRADING_DAYS / len(daily_portfolio_returns)
    ) - 1
    total_value = portfolio_df["amount_invested"].sum()
    daily_pl = daily_portfolio_returns * total_value

    return {
        "cumulative_return_series": cumulative_return_portfolio_series,
        "portfolio_cumulative_return": portfolio_cumulative_return,
        "portfolio_annualized_return": portfolio_annualized_return,
        "daily_pl": daily_pl,
    }


@lru_cache(maxsize=256)
def get_ticker_snapshot(ticker):
    ticker_client = yf.Ticker(ticker)

    current_price = 0
    sector = "ETF"

    try:
        fast_info = ticker_client.fast_info
        current_price = (
            fast_info.get("lastPrice")
            or fast_info.get("regularMarketPrice")
            or 0
        )
    except Exception:
        current_price = 0

    try:
        info = ticker_client.info
        sector = info.get("sector", "ETF") or "ETF"
        current_price = (
            current_price
            or info.get("currentPrice")
            or info.get("regularMarketPrice")
            or 0
        )
    except Exception:
        sector = sector or "Unknown"

    return {
        "ticker": ticker,
        "sector": sector,
        "current_price": current_price,
    }


def get_portfolio_weights(stocks_df):
    snapshots = []
    for ticker in stocks_df["ticker"].astype(str).str.upper():
        try:
            snapshots.append(get_ticker_snapshot(ticker))
        except Exception:
            snapshots.append(
                {
                    "ticker": ticker,
                    "sector": "Unknown",
                    "current_price": 0,
                }
            )

    cp_df = pd.DataFrame(snapshots)
    portfolio_df = pd.merge(stocks_df, cp_df, on="ticker")
    portfolio_df["amount_invested"] = (
        portfolio_df["quantity"] * portfolio_df["current_price"]
    )
    total_value = portfolio_df["amount_invested"].sum()
    portfolio_df["weights"] = round(portfolio_df["amount_invested"] / total_value, 2)
    return portfolio_df


def get_risk_metrics(portfolio_df, daily_return):
    daily_portfolio_returns = get_weighted_portfolio_returns(
        portfolio_df,
        daily_return,
    )
    cumulative_return_portfolio_series = (1 + daily_portfolio_returns).cumprod()
    portfolio_cumulative_return = cumulative_return_portfolio_series.iloc[-1] - 1
    portfolio_annualized_return = (1 + portfolio_cumulative_return) ** (
        ANNUAL_TRADING_DAYS / len(daily_portfolio_returns)
    ) - 1
    portfolio_std_dev_ann = daily_portfolio_returns.std() * np.sqrt(
        ANNUAL_TRADING_DAYS
    )
    portfolio_sharpe_ratio = (
        portfolio_annualized_return - RISK_FREE_RATE
    ) / portfolio_std_dev_ann

    daily_portfolio_returns_positive = daily_portfolio_returns[
        daily_portfolio_returns < 0
    ]
    portfolio_std_dev_ann_neg = daily_portfolio_returns_positive.std() * np.sqrt(
        ANNUAL_TRADING_DAYS
    )
    portfolio_sortino_ratio = (
        portfolio_annualized_return - RISK_FREE_RATE
    ) / portfolio_std_dev_ann_neg

    var = np.percentile(daily_portfolio_returns, 5)
    cvar = daily_portfolio_returns[daily_portfolio_returns <= var].mean()

    running_max = cumulative_return_portfolio_series.cummax()
    drawdown = (cumulative_return_portfolio_series - running_max) / running_max
    max_drawdown = drawdown.min()

    return {
        "portfolio_sharpe_ratio": portfolio_sharpe_ratio,
        "portfolio_sortino_ratio": portfolio_sortino_ratio,
        "portfolio_var": var,
        "portfolio_cvar": cvar,
        "portfolio_max_drawdown": max_drawdown,
    }
