// principal

document.addEventListener('DOMContentLoaded', function () {
    const cacheKeys = [
        "gsr_oitante", 
        "ecg_oitante", 
        "eeg_oitante", 
        "moda", "cor_intervencao", 
        "tempo_intervencao", 
        "moda_resultante_inicial", 
        "oitante_resultante1", 
        "oitante_inicial_camera", 
        "oitante_camera",
        "valence",
        "valence1",
        "arousal",
        "arousal1",
        "control",
        "control1",
        "conclusion",
        "conclusion1"
    ]
    let isRecording = false;
    let socket;
    let sensorDataArray = [];
    let dados_processados = [];
    let modas = []
    let facs = []
    let oitantesCamera = []
    let valores_camera = []
    let oitantes_iniciais = []
    let cors_intervencao = []
    let tempo_intervencoes = []
    let dados_completos = []

    function initializeWebSocket() {
        const socket = new WebSocket('ws://localhost:3000');
        socket.addEventListener('message', async function (event) {
            if (isRecording) {
                const dataElement = document.getElementById('data');
                dataElement.textContent = event.data;

                // Regex atualizado para o novo formato
                const idEegMatch = event.data.match(/ID_EEG: (\d+)/);
                const idGsrMatch = event.data.match(/ID_GSR_ECG: (\d+)/);
                const eegOitanteMatch = event.data.match(/Resultado EEG: (\d+)/);
                const gsrMatch = event.data.match(/ GSR: (\d+)/);
                const ecgMatch = event.data.match(/ ECG: (\d+)/);

                if (idEegMatch && idGsrMatch && eegOitanteMatch && gsrMatch && ecgMatch) {
                    const getStorageData = () =>
                        new Promise((resolve) => {
                            chrome.storage.local.get(null, resolve);
                        });

                    const dataStorege = await getStorageData();

                    console.log(dataStorege)

                    // Extração dos valores
                    const idEeg = parseInt(idEegMatch[1], 10);
                    const idGsrEcg = parseInt(idGsrMatch[1], 10);
                    const eegClassificado = parseInt(eegOitanteMatch[1], 10);
                    const gsrClassificado = parseInt(gsrMatch[1], 10);
                    const ecgClassificado = parseInt(ecgMatch[1], 10);

                    // Armazenar oitante gsr
                    chrome.storage.local.set({ gsr_oitante: gsrClassificado }, function () {
                        if (chrome.runtime.lastError) {
                            console.error('Erro ao salvar oitante gsr:', chrome.runtime.lastError);
                        }
                    });

                    // Armazenar oitante ecg
                    chrome.storage.local.set({ ecg_oitante: ecgClassificado }, function () {
                        if (chrome.runtime.lastError) {
                            console.error('Erro ao salvar oitante ecg:', chrome.runtime.lastError);
                        }
                    });

                    // Armazenar oitante eeg
                    chrome.storage.local.set({ eeg_oitante: eegClassificado }, function () {
                        if (chrome.runtime.lastError) {
                            console.error('Erro ao salvar oitante eeg:', chrome.runtime.lastError);
                        }
                    });

                    if (dataStorege.moda_resultante_inicial) {
                        
                        console.log("temp int", dataStorege.tempo_intervencao)
                        tempo_intervencoes.push(dataStorege.tempo_intervencao)

                        // Adicionar o oitante ao array de dados processados
                        dados_processados.push(eegClassificado, gsrClassificado, ecgClassificado, dataStorege.oitante_inicial_camera, dataStorege.moda_resultante_inicial);

                        // Calculando a moda com os dados atualizados
                        const moda = mode(dados_processados);

                        // Atualizar arrays de histórico
                        modas.push(moda);

                        let dadosExibicao = `${getCurrentTime()}: ID_EEG: ${idEeg}, ID_GSR: ${idGsrEcg}, EEG: ${eegClassificado}, GSR: ${gsrClassificado}, ECG: ${ecgClassificado}, Oitante Inicial (Moda): ${dataStorege.moda_resultante_inicial}, Oitante Desejado - Slider: ${dataStorege.oitante_resultante1}, Oitante Câmera (Tempo real): ${dataStorege.oitante_camera}, Oitante(s) Aferido(s) (Moda): ${moda}, Cor da intervenção: ${dataStorege.cor_intervencao}`;
                        dados_completos.push(dadosExibicao)
                        // Armazenar a nova moda
                        chrome.storage.local.set({ moda: moda }, function () {
                            if (chrome.runtime.lastError) {
                                console.error('Erro ao salvar a moda:', chrome.runtime.lastError);
                            } else {
                                // console.log('Nova moda salva com sucesso:', moda);
                            }
                        });
                    }

                    // Formatando e armazenando os dados
                    let sensorData = `${getCurrentTime()}: ID_EEG: ${idEeg}, ID_GSR: ${idGsrEcg}, EEG: ${eegClassificado}, GSR: ${gsrClassificado}, ECG: ${ecgClassificado}`;
                    sensorDataArray.push(sensorData);

                    oitantesCamera.push({
                        oitante_inicial: dataStorege.oitante_inicial_camera,
                        oitante_camera: dataStorege.oitante_camera
                    });

                    valores_camera.push({
                        arausal: dataStorege.arousal_camera,
                        valence: dataStorege.valence_camera
                    })

                    facs.push({
                        valence: dataStorege.valence || 0,
                        arousal: dataStorege.arousal || 0,
                        control: dataStorege.control || 0,
                        conclusion: dataStorege.conclusion || 0,
                        valence1: dataStorege.valence1 || 0,
                        arousal1: dataStorege.arousal1 || 0,
                        control1: dataStorege.control1 || 0,
                        conclusion1: dataStorege.conclusion1 || 0,
                    });
                    oitantes_iniciais.push({
                        oitante_resultante: dataStorege.moda_resultante_inicial || 0,
                        oitante_resultante1: dataStorege.oitante_resultante1 || 0
                    });
                    //console.log(oitantes_iniciais, facs)

                    cors_intervencao.push(dataStorege.cor_intervencao || "")

                } else {
                    console.error("Dados não estão no formato esperado:", event.data);
                }
            }
        });

        socket.addEventListener('open', function () {
            console.log('Conectado ao WebSocket');
        });

        socket.addEventListener('close', function () {
            console.log('Desconectado do WebSocket');
        });
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    document.getElementById('start-button').addEventListener('click', function () {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            initializeWebSocket();
        }
        isRecording = true;
        console.log('Gravação iniciada');
    });

    document.getElementById('stop-button').addEventListener('click', function () {
        isRecording = false;
        console.log('Gravação parada');
    });

    document.getElementById('save-button').addEventListener('click', function () {
            exportToExcel();
    });

    document.getElementById('clear-button').addEventListener('click', function () {
        isRecording = false;
        console.log('Gravação parada');

        chrome.storage.local.remove(cacheKeys)

        chrome.storage.local.clear(function () {
            console.log("Todos os dados foram limpos do local storage.");
            document.getElementById('stored-data').innerHTML = "<p>Dados foram limpos.</p>";
            sensorDataArray = []
            dados_processados = []
            modas = []
            facs = []
            oitantesCamera = []
            cors_intervencao = []
            tempo_intervencoes = []
            valores_camera = []
            dados_completos = []
        });
    });

    document.getElementById('display-button').addEventListener('click', function () {
            const displayElement = document.getElementById('stored-data');
            displayElement.innerHTML = dados_completos.map((data, index) => `<p>${index + 1}. ${data}</p>`).join("");
            displayElement.style.width = "80%";
            displayElement.style.height = "300px";
            displayElement.style.overflowY = "scroll";
            displayElement.style.border = "1px solid #ccc";
    });

    function mode(numbers) {
        var modes = [], count = [], i, number, maxIndex = 0;

        for (i = 0; i < numbers.length; i += 1) {
            number = numbers[i];
            count[number] = (count[number] || 0) + 1;
            if (count[number] > maxIndex) {
                maxIndex = count[number];
            }
        }

        for (i in count)
            if (count.hasOwnProperty(i)) {
                if (count[i] === maxIndex) {
                    modes.push(Number(i));
                }
            }

        return modes;
    }

    async function exportToExcel() {

        if (!sensorDataArray || !Array.isArray(sensorDataArray)) {
            console.error("Dados principais ausentes ou em formato inválido");
            return;
        }

        // 3. Mapeamento seguro dos dados
        const worksheetData = sensorDataArray.map((item, index) => {
            // Extração básica
            const baseData = {
                idEeg: (item.match(/ID_EEG: (\d+)/) || [, ""])[1],
                idGsr: (item.match(/ID_GSR: (\d+)/) || [, ""])[1],
                timestamp: (item.match(/(\d{2}:\d{2}:\d{2})/) || [, ""])[1],
                eeg: (item.match(/ EEG: (\d+)/) || [, ""])[1],
                gsr: (item.match(/ GSR: (\d+)/) || [, ""])[1],
                ecg: (item.match(/ ECG: (\d+)/) || [, ""])[1]
            };

            // Dados complementares com fallback
            const complementares = {
                facs: facs?.[index] || {},
                oitantes: oitantes_iniciais?.[index] || {},
                valores_camera: valores_camera?.[index] || {},
                camera: oitantesCamera?.[index] ?? {},
                moda: modas?.[index] ?? "",
                intervencao: cors_intervencao?.[index] ?? "",
                tempo_int: tempo_intervencoes?.[index] ?? "",
            };

            // Retorna linha formatada
            return [
                baseData.idEeg,
                baseData.idGsr,
                baseData.timestamp,
                baseData.eeg,
                baseData.gsr,
                baseData.ecg,
                complementares.camera.oitante_inicial ?? "",
                complementares.camera.oitante_camera ?? "",
                complementares.valores_camera.arausal ?? "",
                complementares.valores_camera.valence ?? "",
                complementares.facs.valence ?? "",
                complementares.facs.arousal ?? "",
                complementares.facs.control ?? "",
                complementares.facs.conclusion ?? "",
                complementares.facs.valence1 ?? "",
                complementares.facs.arousal1 ?? "",
                complementares.facs.control1 ?? "",
                complementares.facs.conclusion1 ?? "",
                complementares.oitantes.oitante_resultante ?? "",
                complementares.oitantes.oitante_resultante1 ?? "",
                Array.isArray(complementares.moda) ? complementares.moda[0] : complementares.moda,
                complementares.tempo_int,
                complementares.intervencao
            ];
        });

        // Formatação do nome do arquivo (ALTERAÇÃO PRINCIPAL)
        const now = new Date();
        const filename = `dados_experimento_${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.xlsx`;

        // Adicionar cabeçalho
        worksheetData.unshift([
            "ID_EEG",
            "ID_GSR_ECG",
            "Timestamp da Classificação",
            "EEG Oitante",
            "GSR Oitante",
            "ECG Oitante",
            "Oitante Inicial Câmera",
            "Oitante Câmera",
            "Valence Câmera",
            "Arousal Câmera",
            "Valence Inicial - Slider",
            "Arousal Inicial - Slider",
            "Controle Inicial - Slider",
            "Conclusão Inicial - Slider",
            "Valence Desejado - Slider",
            "Arousal Desejado - Slider",
            "Controle Desejado - Slider",
            "Conclusão Desejado - Slider",
            "Oitante Inicial (Moda)",
            "Oitante Desejado - Slider",
            "Oitante Aferido (Moda)",
            "Timestamp da intervenção",
            "Intervenção"
        ]);

        // Exportar
        try {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(wb, ws, "Dados");

            // DEBUG: Verifique o nome do arquivo antes de salvar
            console.log("Nome do arquivo a ser salvo:", filename);

            XLSX.writeFile(wb, filename);
            console.log(`Arquivo ${filename} salvo com sucesso!`);
        } catch (error) {
            console.error("Erro ao exportar:", error);
        }
    }
});