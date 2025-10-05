import robin_stocks.robinhood as rh
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from math import sqrt
import numpy as np

username = input("Enter your Robinhood username: ")
password = input("Enter your Robinhood password: ")

login = rh.login(username=username, password=password)

portfolio = rh.load_portfolio_profile()
print("Portfolio equity:", portfolio["equity"])

#Build stock data frame 
stock_positions = rh.build_holdings()
all_stock_positions = pd.DataFrame(stock_positions).T
all_stock_positions["quantity"] = all_stock_positions["quantity"].astype("float")
all_stock_positions["price"] = all_stock_positions["price"].astype("float")
all_stock_positions["equity"] = all_stock_positions["equity"].astype("float")
all_stock_positions["percentage"] = all_stock_positions["percentage"].astype("float")
all_stock_positions["average_buy_price"] = all_stock_positions["average_buy_price"].astype("float")
#filtering only those that are actually prsent in the portfolio
stocks = all_stock_positions[all_stock_positions['quantity']>0.0].copy()
stocks["weight"] = stocks["equity"] / (stocks["equity"].sum())


# Get beta of each ticker
def get_beta(ticker):
    stock = yf.Ticker(ticker)
    beta = stock.info.get('beta', 1)
    return beta

stocks["beta"] = stocks.index.map(get_beta)
# use market beta for stocks with no data
#stocks["beta"].fillna(1, inplace=True)
portfolio_beta  = (stocks["weight"]*stocks["beta"]).sum()
print(stocks)
print("Portfolio beta: ", portfolio_beta)

# Calculate sharpe ratio of portfolio
stock_list = stocks.index.tolist()
end_date = datetime.today().date()
start_date = end_date - timedelta(days=360)

ticker_data = yf.download(stock_list, start=start_date, end=end_date, auto_adjust=True)
if len(stock_list)>1:
    adj_close = ticker_data['Close']
else:
    adj_close = ticker_data[['Close']]
#returns = adj_close.pct_change().dropna(how='all')
log_returns = np.log(adj_close / adj_close.shift(1))
weights = stocks["weight"].reindex(log_returns.columns)
portfolio_return = log_returns.dot(weights)

mean_return_annual = portfolio_return.mean()*252
sd_annual = portfolio_return.std() * sqrt(252)
print(mean_return_annual)
print(sd_annual)
sharpe_ratio = (mean_return_annual - 0.0375 ) / sd_annual
print("Sharpe Ratio: ", sharpe_ratio)