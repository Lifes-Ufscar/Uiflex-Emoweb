document.addEventListener('DOMContentLoaded', function() {
    const dataElement = document.getElementById('data');
    if (dataElement) {
      chrome.storage.local.get('arduinoData', function(result) {
        if (result.arduinoData) {
          dataElement.textContent = result.arduinoData;
        } else {
          dataElement.textContent = 'Nenhum dado disponível.';
        }
      });
    } else {
      console.error('Elemento com ID "data" não encontrado.');
    }
  });
  