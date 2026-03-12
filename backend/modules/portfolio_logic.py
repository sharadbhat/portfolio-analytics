import robin_stocks.robinhood as rh
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from math import sqrt
import numpy as np

def login_robinhood(username, password):
    return rh.login(username=username, password=password)

def get_portfolio_data():
    # Load portfolio and holdings
    portfolio = rh.load_portfolio_profile()
    stock_positions = rh.build_holdings()
    all_stock_positions = pd.DataFrame(stock_positions).T
    all_stock_positions = all_stock_positions.astype({
        "quantity": float,
        "price": float,
        "equity": float,
        "percentage": float,
        "average_buy_price": float
    })

    # Filter non-zero holdings and calculate weights
    stocks = all_stock_positions[all_stock_positions['quantity'] > 0.0].copy()
    stocks["weight"] = stocks["equity"] / stocks["equity"].sum()

    # Get beta for each stock
    def get_beta(ticker):
        stock = yf.Ticker(ticker)
        return stock.info.get('beta', 1)

    stocks["beta"] = stocks.index.map(get_beta)
    portfolio_beta = (stocks["weight"] * stocks["beta"]).sum()

    # Calculate portfolio Sharpe ratio and cumulative returns
    stock_list = stocks.index.tolist()
    end_date = datetime.today().date()
    start_date = end_date - timedelta(days=360)
    ticker_data = yf.download(stock_list, start=start_date, end=end_date, auto_adjust=True)
    adj_close = ticker_data['Close'] if len(stock_list) > 1 else ticker_data[['Close']]
    log_returns = np.log(adj_close / adj_close.shift(1))
    weights = stocks["weight"].reindex(log_returns.columns)
    portfolio_return = log_returns.dot(weights)

    mean_return_annual = portfolio_return.mean() * 252
    sd_annual = portfolio_return.std() * sqrt(252)
    sharpe_ratio = (mean_return_annual - 0.0375) / sd_annual
    cumulative_returns = (portfolio_return + 1).cumprod().to_dict()

    # Keep only top 10 holdings by equity
    top_stocks = stocks.sort_values(by="equity", ascending=False).head(10).reset_index()
    top_stocks.rename(columns={'index': 'ticker'}, inplace=True)



    return {
        "equity": portfolio["equity"],
        "stocks": top_stocks.to_dict(orient="records"),
        "portfolio_beta": portfolio_beta,
        "sharpe_ratio": sharpe_ratio,
        "weights_chart": top_stocks[["weight"]].to_dict(orient="records"),
        "beta_chart": top_stocks[["beta"]].to_dict(orient="records"),
        "cumulative_returns": cumulative_returns
    }