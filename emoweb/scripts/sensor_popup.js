document.addEventListener('DOMContentLoaded', function() {
  let isRecording = false; // Variável para controlar se a gravação está ativa
  let socket;

  function initializeWebSocket() {
      socket = new WebSocket('ws://localhost:3000');

      socket.addEventListener('message', function(event) {
          if (isRecording) {
              const dataElement = document.getElementById('data');
              dataElement.textContent = event.data;
              let dataArray = event.data.split(',').map(Number);

              // Crie objetos para armazenar diferentes arrays
              let json_sensor1 = dataArray[0] ;
              let json_sensor2 = dataArray[1] ;
              let json_sensor3 = dataArray[2] ;
              let json_sensor4 = dataArray[3] ;

              // Buscar os arrays anteriores do armazenamento
              chrome.storage.local.get(['array1_sensor', 'array2_sensor', 'array3_sensor', 'array4_sensor'], function(result) {
                  // Se não houver arrays anteriores, inicialize-os
                  let array1_sensor = result.array1_sensor || [];
                  let array2_sensor = result.array2_sensor || [];
                  let array3_sensor = result.array3_sensor || [];
                  let array4_sensor = result.array4_sensor || [];

                  // Adicione os novos dados a cada array
                  array1_sensor.push(json_sensor1);
                  array2_sensor.push(json_sensor2);
                  array3_sensor.push(json_sensor3);
                  array4_sensor.push(json_sensor4);

                  // Armazene os arrays atualizados no chrome.storage.local
                  chrome.storage.local.set({
                      'array1_sensor': array1_sensor,
                      'array2_sensor': array2_sensor,
                      'array3_sensor': array3_sensor,
                      'array4_sensor': array4_sensor
                  }, function() {
                      console.log('Todos os arrays foram armazenados com sucesso no chrome.storage.local');
                  });
              });
          }
      });

      socket.addEventListener('open', function() {
          console.log('Conectado ao WebSocket');
      });

      socket.addEventListener('close', function() {
          console.log('Desconectado do WebSocket');
      });
  }

  // Iniciar a gravação dos dados
  document.getElementById('start-button').addEventListener('click', function() {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
          initializeWebSocket();
      }
      isRecording = true;
      console.log('Gravação iniciada');
  });

  // Parar a gravação dos dados
  document.getElementById('stop-button').addEventListener('click', function() {
      isRecording = false;
      console.log('Gravação parada');
  });

  // Salvar dados em um arquivo
  document.getElementById('save-button').addEventListener('click', function() {
      chrome.storage.local.get(['array1_sensor', 'array2_sensor', 'array3_sensor', 'array4_sensor'], function(result) {
          if (result.array1_sensor.length || result.array2_sensor.length || result.array3_sensor.length || result.array4_sensor.length) {
              let blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
              let url = URL.createObjectURL(blob);
              chrome.downloads.download({
                  url: url,
                  filename: 'dados.json'
              }, function(downloadId) {
                  console.log('Download iniciado com ID:', downloadId);
              });
          } else {
              alert('Nenhum dado disponível para salvar.');
          }
      });
  });

  // Limpar os dados armazenados
  document.getElementById('clear-button').addEventListener('click', function() {
      chrome.storage.local.clear(function() {
          console.log('Todos os dados foram limpos do chrome.storage.local');
          // Atualize a exibição para refletir a limpeza
          document.getElementById('stored-data').innerHTML = '<h3>Dados Armazenados:</h3><p>Dados foram limpos.</p>';
      });
  });

  // Exibir os dados armazenados
  document.getElementById('display-button').addEventListener('click', function() {
      chrome.storage.local.get(['array1_sensor', 'array2_sensor', 'array3_sensor', 'array4_sensor'], function(result) {
          const displayElement = document.getElementById('stored-data');
          displayElement.innerHTML = `
              <h3>Dados Armazenados:</h3>
              <p><strong>Array 1 GSR:</strong> ${JSON.stringify(result.array1_sensor || [])}</p>
              <p><strong>Array 2 A0:</strong> ${JSON.stringify(result.array2_sensor || [])}</p>
              <p><strong>Array 3 A1:</strong> ${JSON.stringify(result.array3_sensor || [])}</p>
              <p><strong>Array 4 ECG:</strong> ${JSON.stringify(result.array4_sensor || [])}</p>
          `;
      });
  });


//modificações

   // Botão ou evento que inicia o processo
    document.getElementById('classificar-button').addEventListener('click', function() {
        chrome.storage.local.get(['array1_sensor'], function(result) {
            let array1_sensor = result.array1_sensor || [];
            enviarDadosParaClassificadorECG(array1_sensor);
        });
    });


function enviarDadosParaClassificadorECG(array1_sensor) {
    fetch('http://localhost:5000/classificar_ecg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sinalECG: array1_sensor })
    })
    .then(response => response.json())
    .then(data => {
        const resultado = data.resultado;
        exibirResultadoECG(resultado);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function exibirResultadoECG(resultado) {
    const resultadoElement = document.getElementById('resultado-ecg');
    resultadoElement.textContent = 'Resultado: ' + resultado;
}




//fim





  // Atualize a exibição inicial dos dados
  updateStoredData();
});
