# test.py

import pandas as pd
from utils import get_sector_allocation

df = pd.read_csv('data/demo_portfolio.csv')

get_sector_allocation(df)
