from io import StringIO
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from business_logic import analyze_portfolio

app = Flask(__name__)
CORS(app)

@app.route('/submit', methods=['POST'])
@cross_origin(origins='http://localhost:5173')
def handle_submit():
    content_type = (request.content_type or '').lower()

    if content_type.startswith('text/csv'):
        csv_text = request.get_data(as_text=True)
        if not csv_text.strip():
            return jsonify({'error': 'Request body must contain CSV data.'}), 400
        csv_source = StringIO(csv_text)
    else:
        return jsonify({'error': 'Content-Type header must be set to text/csv.'}), 400

    analytics = analyze_portfolio(csv_source)
    return jsonify({'analytics': analytics})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
