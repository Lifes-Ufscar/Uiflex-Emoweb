from flask import Flask, request, jsonify, render_template
import joblib

app = Flask(__name__)
modelo = joblib.load('modelo_ecg.sav')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/classificar', methods=['POST'])
def classificar():
    dados_ecg = request.json['dados']
    predicao = modelo.predict([dados_ecg])
    return jsonify({'classificacao': predicao[0]})

if __name__ == '__main__':
    app.run(port=5000)
