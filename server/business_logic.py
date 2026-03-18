import pandas as pd
from utils import get_risk_metrics

def analyze_portfolio(csv):
    portfolio_df = pd.read_csv(csv)
    risk_metrics = get_risk_metrics(portfolio_df)
    print(risk_metrics)
    # sharpe_ratio = get_sharpe_ratio(portfolio_df)
    # ...

    # send more details, not just sector allocation
    #return sector_allocation.to_dict(orient='records')