# app.py
from flask import Flask, render_template, request
from portfolio_logic import login_robinhood, get_portfolio_data

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    data = None
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        login_robinhood(username, password)
        data = get_portfolio_data()
    return render_template("index.html", data=data)

if __name__ == "__main__":
    app.run(debug=True)
