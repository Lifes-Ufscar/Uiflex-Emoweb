// Variavel para alterar o tempo de troca das cores
const temp = 10000 
const oitanteDesejado = 0;

const emotions = {
    1: "Feliz",
    2: "Triste",
    3: "Ansioso",
    4: "Relaxado",
    5: "Irritado",
    6: "Animado",
    7: "Cansado",
    8: "Concentrado"
};

const dialogo = [
    ["Olá, de acordo com os sensores, eu percebi que você está se sentindo (emoção de acordo com o oitante). Está correto?", ["Sim", "Não"]],
    ["Você gostaria de falar mais sobre isso?", ["Sim", "Prefiro não falar"]],
    ["O que poderia melhorar seu estado emocional?", ["Descansar", "Conversar com alguém", "Fazer uma pausa"]]
];


function get_colors(desired_octant) {
    // Tabela de cores baseada nos oitantes de emoções
    const color_table = {
        1: ["#FF0000", "#FFA500", "#FFFF00"],   // Oitante 1: Vermelho, Laranja, Amarelo
        2: ["#000000"],  // Oitante 2: Preto
        3: ["#00008B", "#006400", "#800080", "#808080"],  // Oitante 3: Azul Escuro, Verde Escuro, Roxo, Cinza
        4: ["#00008B", "#006400", "#800080", "#808080"],  // Oitante 4: Azul Claro, Lilás, Verde Claro
        5: ["#ADD8E6", "#C8A2C8", "#90EE90"],  // Oitante 5: Azul Claro, Lilás, Verde Claro
        6: ["#FF0000", "#FFA500", "#FFFF00"],  // Oitante 6: Vermelho, Laranja, Amarelo
        7: ["#FF0000", "#FFA500", "#FFFF00"],  // Oitante 7: Vermelho, Laranja, Amarelo
        8: ["#FF0000", "#FFA500", "#FFFF00"],  // Oitante 8: Vermelho, Laranja, Amarelo
    };

    return color_table[desired_octant] || ["#000000"]; // Retorna preto como padrão caso não encontre
}

function renderizarDialogo(index) {
    slider.innerHTML = "";
    const pergunta = document.createElement("p");
    pergunta.textContent = dialogo[index][0];
    slider.appendChild(pergunta);
    
    dialogo[index][1].forEach(opcao => {
        const botao = document.createElement("button");
        botao.textContent = opcao;
        botao.style.padding = "10px";
        botao.style.border = "none";
        botao.style.borderRadius = "5px";
        botao.style.backgroundColor = "#28a745";
        botao.style.color = "white";
        botao.style.cursor = "pointer";
        botao.style.marginTop = "5px";
        botao.onclick = () => alert(`Você escolheu: ${opcao}`);
        slider.appendChild(botao);
    });
}

function monitorarValores() {
    setInterval(() => {
        const getStorageData = () =>
            new Promise((resolve) => {
                chrome.storage.local.get(null, resolve);
            });
        
        getStorageData().then(data => {
            const oitanteDesejado = data.oitante_resultante1;
            const moda = data.moda || [];
            if (!moda.includes(oitanteDesejado)) {
                renderizarDialogo(0);
            }
        });
    }, 5000);
}

// Função para ajustar o texto para branco ou preto dependendo do fundo
function adjust_text_color(backgroundColor) {
    const color = backgroundColor.startsWith("#")
        ? parseInt(backgroundColor.slice(1), 16)
        : 0x000000;

    const red = (color >> 16) & 0xff;
    const green = (color >> 8) & 0xff;
    const blue = color & 0xff;

    // Calcula a luminância relativa
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

    // Define a cor do texto: branco para fundos escuros, preto para fundos claros
    return luminance < 128 ? "#FFFFFF" : "#000000";
}

(async function () {
    function checkModaAndUpdateColors() {
        const useColors = get_colors(oitanteDesejado);

        if (useColors.length > 0) {
            let colorIndex = 0;
            let styleElement = document.getElementById("dynamic-style");

            if (!styleElement) {
                styleElement = document.createElement("style");
                styleElement.id = "dynamic-style";
                document.head.appendChild(styleElement);
            }

            const intervalId = setInterval(() => {
                const getStorageData = () =>
                    new Promise((resolve) => {
                        chrome.storage.local.get(null, resolve);
                    });
            
                const data = getStorageData();
                oitanteDesejado = data.oitante_resultante1

                const moda = data.moda || [];

                const currentColor = useColors[colorIndex];
                const textColor = adjust_text_color(currentColor);
                
                const stopColorChange = moda.includes(oitanteDesejado);

                // Verifica se oitante desejado igual moda
                if (stopColorChange) {
                    console.log(`Parar cores`)
                    clearInterval(intervalId);
                    return;
                }
                // embed canvas
                if(useColors[(colorIndex + 1) % useColors.length]){
                    if(useColors[(colorIndex + 2) % useColors.length]){
                        const css = `
                            body, div {
                                background: ${currentColor} !important;
                                color: ${textColor} !important;
                                transition: background-color 2s ease, color 2s ease; /* Animação suave */
                            }
                            nav, header, section, footer, button {
                                background: ${useColors[(colorIndex + 1) % useColors.length]} !important;
                                color: ${textColor} !important;
                                transition: background-color 2s ease, color 2s ease; /* Animação suave */
                            }
                            input, select, label, table, th, td, span, li, pre, aside {
                                background: ${useColors[(colorIndex + 2) % useColors.length]} !important;
                                color: ${textColor} !important;
                                transition: background-color 2s ease, color 2s ease; /* Animação suave */
                            }
                            tr:nth-child(even) {
                                background: ${adjust_text_color("#292929")} !important;
                                transition: background-color 2s ease;
                            }
                            tr:nth-child(odd) {
                                background: ${adjust_text_color("#363636")} !important;
                                transition: background-color 2s ease;
                            }
                            a:hover, a:visited, a:focus {
                                color: ${textColor} !important;
                                text-decoration-line: underline;
                                text-decoration-style: wavy;
                                text-decoration-color: red;
                                transition: color 2s ease;
                            }
                            a:active {
                                text-decoration-line: underline;
                                text-decoration-style: wavy;
                                text-decoration-color: red;
                                transition: color 2s ease;
                            }
                            i {
                                color: ${textColor};
                                transition: color 2s ease;
                            }
                            `;
            
                        styleElement.innerHTML = css;
                    }
                    else{
                        const css = `
                            body, div {
                                background: ${currentColor} !important;
                                color: ${textColor} !important;
                                transition: background-color 2s ease, color 2s ease; /* Animação suave */
                            }
                            nav, header, section, footer, table, th, td, span, li, pre, aside, button, input, select, label {
                                background: ${useColors[(colorIndex + 1) % useColors.length]} !important;
                                color: ${textColor} !important;
                                transition: background-color 2s ease, color 2s ease; /* Animação suave */
                            }
                            tr:nth-child(even) {
                                background: ${adjust_text_color("#292929")} !important;
                                transition: background-color 2s ease;
                            }
                            tr:nth-child(odd) {
                                background: ${adjust_text_color("#363636")} !important;
                                transition: background-color 2s ease;
                            }
                            a:hover, a:visited, a:focus {
                                color: ${textColor} !important;
                                text-decoration-line: underline;
                                text-decoration-style: wavy;
                                text-decoration-color: red;
                                transition: color 2s ease;
                            }
                            a:active {
                                text-decoration-line: underline;
                                text-decoration-style: wavy;
                                text-decoration-color: red;
                                transition: color 2s ease;
                            }
                            i {
                                color: ${textColor};
                                transition: color 2s ease;
                            }
                            `;
            
                        styleElement.innerHTML = css;
                    }
                }
                else{
                    const css = `
                    body, div, nav, header, section, footer, table, th, td, span, li, pre, aside, button, input, select, label {
                        background: ${currentColor} !important;
                        color: ${textColor} !important;
                        transition: background-color 2s ease, color 2s ease; /* Animação suave */
                    }
                    tr:nth-child(even) {
                        background: ${adjust_text_color("#292929")} !important;
                        transition: background-color 2s ease;
                    }
                    tr:nth-child(odd) {
                        background: ${adjust_text_color("#363636")} !important;
                        transition: background-color 2s ease;
                    }
                    a:hover, a:visited, a:focus {
                        color: ${textColor} !important;
                        text-decoration-line: underline;
                        text-decoration-style: wavy;
                        text-decoration-color: red;
                        transition: color 2s ease;
                    }
                    a:active {
                        text-decoration-line: underline;
                        text-decoration-style: wavy;
                        text-decoration-color: red;
                        transition: color 2s ease;
                    }
                    i {
                        color: ${textColor};
                        transition: color 2s ease;
                    }
                    `;

                    styleElement.innerHTML = css;
                }

                // Atualiza o índice para a próxima cor
                if(!stopColorChange){
                    colorIndex = (colorIndex + 1) % useColors.length;
                }
            }, temp); // Troca a cada 10 segundos
        }
    }

    checkModaAndUpdateColors();

    const button = document.createElement("button");
    button.id = "floating-chat-button";

    const icon = document.createElement("span");
    icon.innerHTML = "💬";
    icon.style.fontSize = "28px";
    icon.style.display = "flex";
    icon.style.alignItems = "center";
    icon.style.justifyContent = "center";
    icon.style.width = "100%";
    icon.style.height = "100%";

    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.backgroundColor = "#28a745";
    button.style.color = "#FFFFFF";
    button.style.border = "none";
    button.style.borderRadius = "50%";
    button.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    button.style.cursor = "grab";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.transition = "all 0.2s ease-in-out";
    button.style.zIndex = "99999";

    const slider = document.createElement("div");
    slider.id = "chat-slider";
    slider.style.position = "fixed";
    slider.style.top = "0";
    slider.style.right = "-600px";
    slider.style.width = "400px";
    slider.style.height = "100vh";
    slider.style.backgroundColor = "#FFF";
    slider.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    slider.style.transition = "right 0.8s ease-in-out";
    slider.style.padding = "20px";
    slider.style.display = "flex";
    slider.style.flexDirection = "column";
    slider.style.gap = "10px";
    slider.style.zIndex = "100000";

    let posX = window.innerWidth - 140;
    let posY = window.innerHeight - 140;
    button.style.left = `${posX}px`;
    button.style.top = `${posY}px`;

    button.addEventListener("mouseenter", () => {
        button.style.transform = "scale(1.1)";
        button.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.3)";
        button.style.backgroundColor = "#32CD32";
        button.style.transition = "0.5s";
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "scale(1)";
        button.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
        button.style.backgroundColor = "#28a745";
        button.style.transition = "0.5s";
    });

    let isDragging = false;
    let offsetX, offsetY;

    button.addEventListener("mousedown", (event) => {
        isDragging = true;
        button.style.cursor = "grabbing";
        offsetX = event.clientX - posX;
        offsetY = event.clientY - posY;
    });

    function moveButton(event) {
        if (!isDragging) return;
        posX = event.clientX - offsetX;
        posY = event.clientY - offsetY;
        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - 120;
        posX = Math.max(0, Math.min(posX, maxX));
        posY = Math.max(0, Math.min(posY, maxY));
        button.style.left = `${posX}px`;
        button.style.top = `${posY}px`;
    }

    document.addEventListener("mousemove", moveButton);
    document.addEventListener("mouseup", () => {
        isDragging = false;
        button.style.cursor = "grab";
    });

    button.addEventListener("click", () => {
        button.style.display = "none";
        slider.style.right = "0";
    });

    slider.querySelector("#close-slider").addEventListener("click", () => {
        slider.style.right = "-600px";
        setTimeout(() => {
            button.style.display = "flex";
        }, 800);
    });

    button.appendChild(icon);
    document.body.appendChild(button);
    document.body.appendChild(slider);

    monitorarValores()
})();