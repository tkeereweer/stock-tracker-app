from flask import Flask, jsonify, session, request, redirect, url_for
from dotenv import load_dotenv
import os
from flask_cors import CORS
from hashlib import sha1
from sqlalchemy import create_engine, text
import pymysql
import requests

app = Flask(__name__)
app.config["SECRET_KEY"] = "super secret key"
CORS(app, supports_credentials=True)

# database connection
db_user = "flask-stock-tracker"
db_pass = "Vissermeet1122"
db_name = "capstone-database"
# db_public_ip = "34.140.3.223"
cloud_sql_connection_name = "mcsbt-integration-415614:europe-west1:capstone-db"
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
db_string = f"mysql+pymysql://{db_user}:{db_pass}@/{db_name}?unix_socket=/cloudsql/{cloud_sql_connection_name}"

engine = create_engine(db_string)

# load the environment variables
# load_dotenv()

# API_KEY = os.getenv('API_KEY')
API_KEY = 'UDJ8FEEUYB4NYVJ6'

stock_values = {}
portfolio = {}

def hash_value(string):
    hash = sha1()
    hash.update(string.encode())
    return hash.hexdigest()

# get stocks in a user's portfolio, hardcoded for now
def user_database(user_id):
    global portfolio
    user_stocks_query = text("""
        SELECT STOCKSYMBOL, QUANTITY
        FROM USER_STOCKS
        WHERE USERID=:user_id;
    """)
    with engine.connect() as connection:
        stocks = connection.execute(user_stocks_query, {"user_id": user_id}).fetchall()
        portfolio.clear()
        for stock in stocks:
            portfolio[stock[0]] = stock[1]
    return portfolio

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

# flask endpoints
@app.route("/register", methods=["POST"])
def handle_register():
    username = str(request.form["username"])
    password = str(hash_value(request.form["password"]))
    insert_query = text("""
        INSERT INTO USERS(USERNAME, PASSWORD)
        VALUES (:username, :password);
    """)
    get_user_query = text("""
        SELECT USERID, USERNAME FROM USERS 
        WHERE USERNAME=:username;
    """)
    with engine.connect() as connection:
        with connection.begin() as transaction:
            connection.execute(
                insert_query, {"username": username, "password": password}
            )
            transaction.commit()
        user = connection.execute(get_user_query, {"username": username}).fetchone()
        session["user_id"] = user[0]
    return jsonify({"message": "Registration successful"}), 200

@app.route("/login", methods=["POST"])
def handle_login():
    username = request.form["username"]
    password = hash_value(request.form["password"])
    login_query = text("""
        SELECT USERID, USERNAME
        FROM USERS
        WHERE USERNAME=:username and PASSWORD=:password
    """)
    with engine.connect() as connection:
        user = connection.execute(
            login_query, {"username": username, "password": password}
        ).fetchone()
        if user:
            session["user_id"] = user[0]
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401

@app.route("/logout")
def logout():
    session.pop("user_id")
    return redirect("https://storage.googleapis.com/capstone-frontend/index.html")

# get the portfolio of a user
@app.route('/overview')
def stocklist():
    # if 'user_id' not in session:
    #     return redirect("https://storage.googleapis.com/capstone-frontend/index.html")
    user_id = 1
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

@app.route('/modifyPortfolio', methods=['POST'])
def modify_portfolio():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid JSON or no data provided"}), 400
    user_id = 1  # This should ideally come from the session or request, not hardcoded
    stock = data.get('stock_symbol')
    quantity = data.get('quantity')
    operation = data.get('operation')
    try:
        quantity = int(quantity)
    except ValueError:
        return jsonify({"error": "Quantity should be a number"}), 400
    if operation == 'add':
        return add_stock(user_id, stock, quantity)
    elif operation == 'remove':
        return remove_stock(user_id, stock, quantity)
    else:
        return jsonify({"error": "Invalid operation"}), 400

# add a stock to a user's portfolio
def add_stock(user_id, stock, quantity):
    response = requests.get(f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={stock}&apikey={API_KEY}")
    real_stock_check = response.json()
    if "Error Message" in real_stock_check.keys():
        return jsonify({"error": "Invalid stock symbol"}), 400
    insert_query = text("""
        INSERT INTO USER_STOCKS (USERID, STOCKSYMBOL, QUANTITY) 
        VALUES (:user_id, :stock, :quantity)
        ON DUPLICATE KEY UPDATE QUANTITY = QUANTITY + :quantity;
    """)
    with engine.connect() as connection:
        with connection.begin() as transaction:
            connection.execute(insert_query, {"user_id": user_id, "stock": stock, "quantity": quantity})
            transaction.commit()
    user_database(user_id)
    return jsonify({"message": "Portfolio updated successfully"}), 200

# remove a stock from a user's portfolio
def remove_stock(user_id, stock, quantity):
    if stock not in portfolio:
        return jsonify({"error": "Stock not found in portfolio"}), 400
    elif portfolio[stock] < quantity:
        return jsonify({"error": "Requested quantity exceeds stocks in portfolio"}), 400
    elif portfolio[stock] == quantity:
        remove_query = text("""
            DELETE FROM USER_STOCKS 
            WHERE USERID = :user_id AND STOCKSYMBOL = :stock;
        """)
        with engine.connect() as connection:
            with connection.begin() as transaction:
                connection.execute(remove_query, {"user_id": user_id, "stock": stock})
                transaction.commit()
        user_database(user_id)
    elif portfolio[stock] > quantity:
        remove_query = text("""
            UPDATE USER_STOCKS 
            SET QUANTITY = QUANTITY - :quantity 
            WHERE USERID = :user_id AND STOCKSYMBOL = :stock;
        """)
        with engine.connect() as connection:
            with connection.begin() as transaction:
                connection.execute(remove_query, {"user_id": user_id, "stock": stock, "quantity": quantity})
                transaction.commit()
        user_database(user_id)
    return jsonify({"message": "Portfolio updated successfully"}), 200

# serve the stock info for a given symbol
@app.route('/stockinfo/<symbol>')
def stock_info(symbol):
    if symbol not in stock_values:
        get_past_values([symbol])
    output = stock_values[symbol]
    return jsonify(output)

if __name__ == '__main__':
    app.run()
