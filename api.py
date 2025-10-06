from flask import Flask, request
from flask_cors import CORS, cross_origin
import robin_stocks.robinhood as rh
from utils.analyzer import get_portfolio_equity, analyze_portfolio

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/login", methods=["POST"])
@cross_origin()
def rh_login():
    username = request.json.get("username")
    password = request.json.get("password")
    login_result = rh.login(username=username, password=password)

    if login_result and "access_token" in login_result:
        return {"access_token": login_result["access_token"]}
    return {"error": "Login failed"}, 401

@app.route("/analyze", methods=["GET"])
@cross_origin()
def rh_analyze():
    # Accept token in Authorization header (Bearer <token>) or query param `token`
    auth = request.headers.get("Authorization", "")
    token = None
    if auth.startswith("Bearer "):
        token = auth.split(None, 1)[1].strip()
    if not token:
        token = request.args.get("token")
    if not token:
        return {"error": "Missing token"}, 401
    try:
        equity = get_portfolio_equity()
        analysis = analyze_portfolio()
        return {"equity": equity, **analysis}
    except Exception as e:
        return {"error": str(e)}, 401

if __name__ == "__main__":
    app.run(debug=True)