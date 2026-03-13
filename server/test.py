# test.py

import pandas as pd
from utils import get_benchmark_comparison

df = pd.read_csv('data/demo_portfolio.csv')

a = get_benchmark_comparison(df)
print(a)