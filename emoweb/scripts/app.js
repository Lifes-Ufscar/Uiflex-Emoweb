socket.onmessage = function(event) {
    const data = event.data;
    
    // Exibir os dados recebidos no elemento <pre>
    output.textContent += `\n${data}`;

    // Recuperar os dados anteriores do localStorage (se existirem)
    let storedData = JSON.parse(localStorage.getItem('arduinoData')) || [];

    // Adicionar a nova leitura ao array de dados
    storedData.push(data);

    // Armazenar o array atualizado no localStorage
    localStorage.setItem('arduinoData', JSON.stringify(storedData));

    // Verificar os dados armazenados
    console.log("Dados armazenados no localStorage:", storedData);
};
