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
              //console.log('GSR', dataArray[0]);

              // Crie objetos para armazenar diferentes arrays
              let json_sensor1 = { "GRC1": dataArray[0] };
              let json_sensor2 = { "GRC2": dataArray[1] };
              let json_sensor3 = { "GRC3": dataArray[2] };
              let json_sensor4 = { "GRC4": dataArray[3] };

              // Buscar os arrays anteriores do armazenamento
              chrome.storage.local.get(['array1', 'array2', 'array3', 'array4'], function(result) {
                  // Se não houver arrays anteriores, inicialize-os
                  let array1 = result.array1 || [];
                  let array2 = result.array2 || [];
                  let array3 = result.array3 || [];
                  let array4 = result.array4 || [];

                  // Adicione os novos dados a cada array
                  array1.push(json_sensor1);
                  array2.push(json_sensor2);
                  array3.push(json_sensor3);
                  array4.push(json_sensor4);

                  // Armazene os arrays atualizados no chrome.storage.local
                  chrome.storage.local.set({
                      'array1': array1,
                      'array2': array2,
                      'array3': array3,
                      'array4': array4
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
      chrome.storage.local.get(['array1', 'array2', 'array3', 'array4'], function(result) {
          if (result.array1.length || result.array2.length || result.array3.length || result.array4.length) {
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
      chrome.storage.local.get(['array1', 'array2', 'array3', 'array4'], function(result) {
          const displayElement = document.getElementById('stored-data');
          displayElement.innerHTML = `
              <h3>Dados Armazenados:</h3>
              <p><strong>Array 1:</strong> ${JSON.stringify(result.array1 || [])}</p>
              <p><strong>Array 2:</strong> ${JSON.stringify(result.array2 || [])}</p>
              <p><strong>Array 3:</strong> ${JSON.stringify(result.array3 || [])}</p>
              <p><strong>Array 4:</strong> ${JSON.stringify(result.array4 || [])}</p>
          `;
      });
  });

  // Atualize a exibição inicial dos dados
  updateStoredData();
});
