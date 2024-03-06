from flask import Flask, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# load the environment variables
# load_dotenv()

# API_KEY = os.getenv('API_KEY')
API_KEY = 'UDJ8FEEUYB4NYVJ6'

stock_values = {}

# get stocks in a user's portfolio, hardcoded for now
def user_database(user_id):
    user_portfolio_db = {
        'user1': {
            'AAPL': 10,
            'GOOGL': 5,
            'AMZN': 3
        },
        'user2': {
            'AAPL': 5,
            'GOOGL': 3,
            'AMZN': 2
        }
    }
    return user_portfolio_db.get(user_id, {})

# get values for stocks
def get_past_values(portfolio):
    for stock in portfolio:
        try:
            response = requests.get(f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}") 
            response.raise_for_status()  # Raises HTTPError for bad response status codes
            data = response.json()
            stock_values_lst = list(data['Time Series (Daily)'].items())[0:5]
            stock_values[stock] = stock_values_lst
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data for {stock}: {e}")
    return stock_values


# get the portfolio of a user
@app.route('/<user_id>')
def index(user_id):
    portfolio = user_database(user_id)
    get_past_values(portfolio.keys())
    output = {'symbols': {}}
    total_value = 0
    for stock in portfolio:
        close_price = float(stock_values[stock][0][1]['4. close'])
        stock_value = round(close_price * portfolio[stock], 2)
        total_value += stock_value
        output['symbols'][stock] = {
            'quantity': portfolio[stock],
            'value': stock_value
        }
    output['total_value']= round(total_value, 2)
    return jsonify(output)

# serve the stock info for a given symbol
@app.route('/stockinfo/<symbol>')
def stock_info(symbol):
    if symbol not in stock_values:
        get_past_values([symbol])
    output = stock_values[symbol]
    return jsonify(output)

if __name__ == '__main__':
    app.run()
