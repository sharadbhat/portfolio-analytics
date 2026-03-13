import pandas as pd
from utils import get_sector_allocation

def analyze_portfolio(csv):
    portfolio_df = pd.read_csv(csv)
    sector_allocation = get_sector_allocation(portfolio_df)
    print(sector_allocation)
    # sharpe_ratio = get_sharpe_ratio(portfolio_df)
    # ...

    # send more details, not just sector allocation
    return sector_allocation.to_dict(orient='records')