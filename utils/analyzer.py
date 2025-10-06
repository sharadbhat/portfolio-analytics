import robin_stocks.robinhood as rh
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from math import sqrt
import numpy as np

def get_portfolio_equity():
    portfolio = rh.load_portfolio_profile()
    return portfolio['equity']

def analyze_portfolio():
    #Build stock data frame 
    stock_positions = rh.build_holdings()
    all_stock_positions = pd.DataFrame(stock_positions).T
    all_stock_positions["quantity"] = all_stock_positions["quantity"].astype("float")
    all_stock_positions["price"] = all_stock_positions["price"].astype("float")
    all_stock_positions["equity"] = all_stock_positions["equity"].astype("float")
    all_stock_positions["percentage"] = all_stock_positions["percentage"].astype("float")
    all_stock_positions["average_buy_price"] = all_stock_positions["average_buy_price"].astype("float")

    #filtering only those that are actually present in the portfolio
    stocks = all_stock_positions[all_stock_positions['quantity']>0.0].copy()
    stocks["weight"] = stocks["equity"] / (stocks["equity"].sum())

    def get_beta(ticker):
        stock = yf.Ticker(ticker)
        beta = stock.info.get('beta', 1)
        return beta

    stocks["beta"] = stocks.index.map(get_beta)
    portfolio_beta  = (stocks["weight"]*stocks["beta"]).sum()

    stock_list = stocks.index.tolist()
    end_date = datetime.today().date()
    start_date = end_date - timedelta(days=360)

    ticker_data = yf.download(stock_list, start=start_date, end=end_date, auto_adjust=True)
    if len(stock_list)>1:
        adj_close = ticker_data['Close']
    else:
        adj_close = ticker_data[['Close']]

    log_returns = np.log(adj_close / adj_close.shift(1))
    weights = stocks["weight"].reindex(log_returns.columns)
    portfolio_return = log_returns.dot(weights)

    mean_return_annual = portfolio_return.mean()*252
    sd_annual = portfolio_return.std() * sqrt(252)
    sharpe_ratio = (mean_return_annual - 0.0375 ) / sd_annual

    return {
        "portfolio_beta": portfolio_beta,
        "portfolio_return": mean_return_annual,
        "portfolio_volatility": sd_annual,
        "sharpe_ratio": sharpe_ratio,
        "stocks": stocks.to_dict(orient="index")
    }    
