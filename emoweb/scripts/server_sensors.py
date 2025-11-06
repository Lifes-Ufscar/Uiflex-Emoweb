from flask import Flask, request, jsonify
from classificadorECG import ClassificadorECG

app = Flask(__name__)

@app.route('/classificar_ecg', methods=['POST'])
def classificar_ecg():
    data = request.get_json()
    sinalECG = data.get('sinalECG', [])

    # Certifique-se de que sinalECG é um array numpy
    import numpy as np
    sinalECG = np.array(sinalECG)

    # Reshape se necessário
    sinalECG = sinalECG.reshape(1, -1)

    # Instanciar o classificador e classificar
    classificador = ClassificadorECG(sinalECG)
    resultado = classificador.classificador_ecg()

    # Converter o resultado para uma lista, caso seja um array numpy
    resultado = resultado.tolist()

    return jsonify({'resultado': resultado})

if __name__ == '__main__':
    app.run(port=5000)
