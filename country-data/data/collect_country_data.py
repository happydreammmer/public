
import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json
import pandas as pd
import os
import time

client = ApiClient()

# Use known indicator codes
gdp_per_capita_code = 'NY.GDP.PCAP.CD'  # GDP per capita (current US$)
population_code = 'SP.POP.TOTL'  # Population, total

# List of country codes (ISO 3166 alpha-3)
# This is a list of common country codes to start with
country_codes = [
    'USA', 'CHN', 'JPN', 'DEU', 'GBR', 'FRA', 'IND', 'ITA', 'BRA', 'CAN',
    'RUS', 'KOR', 'AUS', 'ESP', 'MEX', 'IDN', 'NLD', 'SAU', 'CHE', 'TUR',
    'TWN', 'POL', 'SWE', 'BEL', 'THA', 'IRN', 'AUT', 'NOR', 'ARE', 'NGA',
    'ISR', 'HKG', 'SGP', 'MYS', 'ZAF', 'PHL', 'DNK', 'IRL', 'PAK', 'COL',
    'CHL', 'FIN', 'BGD', 'EGY', 'VNM', 'PRT', 'CZE', 'ROU', 'NZL', 'PER',
    'IRQ', 'QAT', 'KAZ', 'GRC', 'DZA', 'HUN', 'KWT', 'UKR', 'MAR', 'AGO',
    'PRI', 'ECU', 'SVK', 'LKA', 'ETH', 'DOM', 'KEN', 'OMN', 'GTM', 'VEN',
    'LUX', 'BGR', 'HRV', 'URY', 'CRI', 'SVN', 'LTU', 'TZA', 'PAN', 'LBN',
    'SRB', 'UZB', 'TUN', 'JOR', 'AZE', 'BLR', 'GHA', 'MMR', 'HND', 'BOL',
    'COD', 'LVA', 'EST', 'NPL', 'CMR', 'CIV', 'BHR', 'ZWE', 'UGA', 'SEN'
]

# Function to get data for a specific indicator and country
def get_country_data(indicator_code, country_code):
    try:
        response = client.call_api('DataBank/indicator_data', 
                                  query={'indicator': indicator_code, 'country': country_code})
        return response
    except Exception as e:
        print(f'Error getting data for {country_code}, {indicator_code}: {str(e)}')
        return None

# Create dataframes to store the results
gdp_per_capita_data = []
population_data = []

# Collect data for each country
for i, country_code in enumerate(country_codes):
    print(f'Processing {i+1}/{len(country_codes)}: {country_code}')
    
    # Get GDP per capita data
    gdp_response = get_country_data(gdp_per_capita_code, country_code)
    if gdp_response and 'countryName' in gdp_response:
        latest_year = None
        latest_value = None
        
        # Find the most recent year with data
        if 'data' in gdp_response:
            for year in sorted(gdp_response['data'].keys(), reverse=True):
                if gdp_response['data'][year] is not None:
                    latest_year = year
                    latest_value = gdp_response['data'][year]
                    break
        
        if latest_year and latest_value:
            gdp_per_capita_data.append({
                'country_code': country_code,
                'country_name': gdp_response['countryName'],
                'year': latest_year,
                'gdp_per_capita': latest_value
            })
    
    # Get population data
    pop_response = get_country_data(population_code, country_code)
    if pop_response and 'countryName' in pop_response:
        latest_year = None
        latest_value = None
        
        # Find the most recent year with data
        if 'data' in pop_response:
            for year in sorted(pop_response['data'].keys(), reverse=True):
                if pop_response['data'][year] is not None:
                    latest_year = year
                    latest_value = pop_response['data'][year]
                    break
        
        if latest_year and latest_value:
            population_data.append({
                'country_code': country_code,
                'country_name': pop_response['countryName'],
                'year': latest_year,
                'population': latest_value
            })
    
    # Add a small delay to avoid rate limiting
    time.sleep(0.1)

# Convert to dataframes
gdp_df = pd.DataFrame(gdp_per_capita_data)
pop_df = pd.DataFrame(population_data)

# Save the raw data
gdp_df.to_csv('data/gdp_per_capita.csv', index=False)
pop_df.to_csv('data/population.csv', index=False)

# Merge the datasets
if not gdp_df.empty and not pop_df.empty:
    merged_df = pd.merge(gdp_df, pop_df, on=['country_code', 'country_name'], suffixes=('_gdp', '_pop'))
    merged_df.to_csv('data/merged_economic_data.csv', index=False)
    print(f'Saved data for {len(merged_df)} countries')
else:
    print('Error: One or both datasets are empty')
