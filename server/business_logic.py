import pandas as pd
import numpy as np
import utils

def analyze_portfolio(csv):
    portfolio_df = pd.read_csv(csv)
    results = {}
    results['holdings'] = {}
    results['performance'] = {}
    results['risk'] = {}
    
    sector_result = utils.get_sector_allocation(portfolio_df)
    results['holdings']['sector'] = sector_result['sector_allocation'].to_dict(orient='records')
    results['holdings']['portfolio_allocation'] = sector_result['portfolio_allocation'].to_dict(orient='records')
    
    benchmark_perf_result = utils.get_benchmark_comparison(portfolio_df)
    results['performance']['portfolio_perf'] = series_to_dict(benchmark_perf_result['portfolio_daily_return'])
    results['performance']['benchmark_perf'] = series_to_dict(benchmark_perf_result['benchmark_daily_return'])
    results['performance']['portolio_alpha'] = convert_numpy(benchmark_perf_result['portfolio_alpha'])
    results['performance']['tracking_error'] = convert_numpy(benchmark_perf_result['tracking_error'])

    perf_results = utils.get_performance(portfolio_df)
    results['performance']['return_series'] = series_to_dict(perf_results['cumulative_return_series'])
    results['performance']['annualized_return'] = convert_numpy(perf_results['portfolio_annualized_return'])
    results['performance']['daily_pl_series'] = series_to_dict(perf_results['daily_pl'])

    risk_results = utils.get_risk_metrics(portfolio_df)
    results['risk']['sharpe_ratio'] = convert_numpy(risk_results['portfolio_sharpe_ratio'])
    results['risk']['sortino_ratio'] = convert_numpy(risk_results['portfolio_sortino_ratio'])
    results['risk']['portfolio_var'] = convert_numpy(risk_results['portfolio_var'])
    results['risk']['portfolio_cvar'] = convert_numpy(risk_results['portfolio_cvar'])
    results['risk']['portfolio_max_drawdown'] = convert_numpy(risk_results['portfolio_max_drawdown'])

    return results

def series_to_dict(series):
    return {str(k):v for k, v in series.items()}

def convert_numpy(obj):
    if isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    return obj