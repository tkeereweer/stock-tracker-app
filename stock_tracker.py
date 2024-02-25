from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "UDJ8FEEUYB4NYVJ6"

@app.route('/<user_id>')
def index(user_id):
    portfolio = get_portfolio(user_id)
    return jsonify(portfolio)

@app.route('/stockinfo/<symbol>')
def stock_info(symbol):
    response = requests.get(f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}") 
    data = response.json()
    output = list(data['Time Series (Daily)'].items())[0:5]
    return jsonify(output)

def get_portfolio(user_id):
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

if __name__ == '__main__':
    app.run(debug=True)
