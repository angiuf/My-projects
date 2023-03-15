import pandas as pd
import numpy as np

# to convert notation from ISTAT to iso3166-2
def istat_iso(istat):
    if istat == '01':
        return 'IT-21'
    if istat == '02':
        return 'IT-23'
    if istat == '03':
        return 'IT-25'
    if istat == '04':
        return 'IT-32'
    if istat == '05':
        return 'IT-34'
    if istat == '06':
        return 'IT-36'
    if istat == '07':
        return 'IT-42'
    if istat == '08':
        return 'IT-45'
    if istat == '09':
        return 'IT-52'
    if istat == '10':
        return 'IT-55'
    if istat == '11':
        return 'IT-57'
    if istat == '12':
        return 'IT-62'
    if istat == '13':
        return 'IT-65'
    if istat == '14':
        return 'IT-67'
    if istat == '15':
        return 'IT-72'
    if istat == '16':
        return 'IT-75'
    if istat == '17':
        return 'IT-77'
    if istat == '18':
        return 'IT-78'
    if istat == '19':
        return 'IT-82'
    if istat == '20':
        return 'IT-88'


dfSubVax = pd.read_csv('somministrazioni-vaccini-latest.csv')

#df_size = dfSubVax.size # [165232 rows x 14 columns]
df_len = len(dfSubVax) # 165232

# add two columns
dfSubVax.assign(ISTAT='', ISO3166='')

for i in range(0, df_len):
    istat = f'{(dfSubVax.at[i, "codice_regione_ISTAT"]):02}'
    iso = istat_iso(istat)
    dfSubVax.at[i, "ISTAT"] = istat
    dfSubVax.at[i, "ISO3166"] = iso

print(dfSubVax)

dfSubVax.to_csv('somministrazioni-vaccini-latest-edit.csv')