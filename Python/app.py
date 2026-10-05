from flask import Flask, jsonify
import json

app = Flask(__name__)

try:
    with open('precomputed_recommendations.json', 'r') as file:
        recommendations = json.load(file)
except FileNotFoundError:
    print("Error: precomputed_recommendations.json not found.")
    recommendations = {}

@app.route('/api/recommendations/<int:product_id>', methods=['GET'])
def get_recommendations(product_id):
    product_id_str = str(product_id)
    
    if product_id_str in recommendations:
        return jsonify(recommendations[product_id_str]), 200
    else:
        return jsonify([]), 404

if __name__ == '__main__':
    app.run(port=5002, debug=True)