# api.py 
# Entry point for portfolio analytics API

import pandas as pd
from utils import get_sector_allocation

def api_handler(portfolio_df):
    sector_group_df = get_sector_allocation(portfolio_df)
