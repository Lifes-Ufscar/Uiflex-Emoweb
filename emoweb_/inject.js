// Variavel para alterar o tempo de troca das cores
const temp = 20000 //milesec 20s
let modaAtual = []
let oitanteSlider = 0
let useColors = get_colors(0);

// Usar escala de 0 a 5, para medir sats
const questions = [
    [
        "Qual destes resultados melhor representa seu estado emocional, sentimentos ou condição mental no momento?", 
        [
            "Com base nos dados informados, sua posição atual está no Oitante []. Emoções, sentimentos ou estados mentais comuns nesse oitante incluem: {}.",
            "Nossos sensores indicam que você está no Oitante []. Emoções, sentimentos ou estados mentais típicos nesse oitante incluem: {}.",
            "A combinação entre os dados informados e os sensores sugere que seu estado emocional está no Oitante []. Emoções, sentimentos ou estados mentais associados a esse oitante incluem: {}.",
        ]
    ]
]

const colorNames = {
    "#FF0000": "Vermelho",
    "#FFA500": "Laranja",
    "#FFFF00": "Amarelo",
    "#000000": "Preto",
    "#00008B": "Azul Escuro",
    "#006400": "Verde Escuro",
    "#800080": "Roxo",
    "#808080": "Cinza",
    "#ADD8E6": "Azul Claro",
    "#C8A2C8": "Lilás",
    "#90EE90": "Verde Claro"
};

const emotions = [
    ["Hostil", "Bravo", "Medo", "Amedrontado", "Tenso", "Raiva"],
    ["Ativo", "Estresse", "Depressão", "Frustrado", "Enojado"],
    ["Depressão", "Tristeza", "Chateado", "Solidão"],
    ["Ansiedade", "Nervoso", "Envergonhado", "Entediado", "Preocupado"],
    ["Calmo", "Empático", "Sério", "Pensativo"],
    ["Relaxado", "Solemne", "Sentindo-se bem", "Contente"],
    ["Felicidade", "Repulsa", "Determinado", "Alerta", "Atento", "Diversão"],
    ["Empolgação", "Convencido", "Surpreso", "Desejando"]
]

function getHours(){
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(new Date())
}

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

        if (useColors.length > 0) {
            let colorIndex = 0;
            let styleElement = document.getElementById("dynamic-style");

            if (!styleElement) {
                styleElement = document.createElement("style");
                styleElement.id = "dynamic-style";
                document.head.appendChild(styleElement);
            }

            const intervalId = setInterval(async() => {
                 let data = await new Promise((resolve) => {
                    chrome.storage.local.get(null, resolve);
                });

                useColors = get_colors(data.oitante_resultante1)

                oitanteSlider = data.moda_resultante_inicial

                modaAtual = data.moda || [];

                let currentColor = useColors[colorIndex];
                let textColor = adjust_text_color(currentColor);
                let nextColor = useColors[(colorIndex + 1) % useColors.length];

                let nextColorName = colorNames[nextColor]
                
                await chrome.storage.local.set({ cor_intervencao: nextColorName }, function () {
                    if (chrome.runtime.lastError) {
                        console.error('Erro ao salvar oitante gsr:', chrome.runtime.lastError);
                    }
                });

                let time_change = getHours()

                await chrome.storage.local.set({ tempo_intervencao: time_change }, function () {
                    if (chrome.runtime.lastError) {
                        console.error('Erro ao salvar oitante gsr:', chrome.runtime.lastError);
                    }
                });
                
                const stopColorChange = modaAtual.includes(data.oitante_resultante1);

                //Verifica se oitante desejado igual moda
                //if (stopColorChange) {
                // if(stopColorChange){
                //     console.log(`Parar cores`)
                //     clearInterval(intervalId);
                //     return;
                // }
                //embed canvas
                if(useColors[(colorIndex + 1) % useColors.length]){
                    console.log("Troca de cores")
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

                if(!stopColorChange){
                    colorIndex = (colorIndex + 1) % useColors.length;
                }
            }, temp);
        }
    }

    checkModaAndUpdateColors();

//     // const ioniconsScript = document.createElement("script");
//     // ioniconsScript.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
//     // ioniconsScript.type = "module"
//     // document.head.appendChild(ioniconsScript);

//     const button = document.createElement("button");
//     button.id = "floating-chat-button";

//     const icon = document.createElement("img");
//     icon.src = chrome.runtime.getURL("images/icons/reader-outline.svg");
//     icon.style.width = "35px";
//     icon.style.height = "35px";

//     const slider = document.createElement("div");
//     slider.id = "chat-slider";
//     slider.innerHTML = `
//         <div class="slider-content">
//             <div class="title-content"><h3>Chat de Feedback</h3><button class="menuBtn"></button></div>
//             <div class="menu">
//                 <div id="saveBtn">Salvar conversa</div>
//                 <div id="clear-chat">Recarregar chat</div>
//                 <div id="close-slider">Fechar chat</div>
//             </div>
//             <div class="chat-content"></div>
//         </div>
//     `;

//     slider.style.position = "fixed";
//     slider.style.top = "0";
//     slider.style.right = "-600px";
//     slider.style.width = "400px";
//     slider.style.height = "100vh";
//     slider.style.backgroundColor = "#FFF";
//     slider.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
//     slider.style.transition = "right 0.8s ease-in-out";
//     slider.style.padding = "0px";
//     slider.style.display = "flex";
//     slider.style.flexDirection = "column";
//     slider.style.gap = "10px";
//     slider.style.zIndex = "9999999";

//     // const overlay = slider.querySelector(".overlay")
//     // overlay.style.backgroundColor = "#424649";
//     // overlay.style.width = "100%";
//     // overlay.style.height = "100%";
//     // overlay.style.zIndex = "999999";

//     const menu = slider.querySelector(".menu")
//     menu.style.display = "none";
//     menu.style.flexDirection = "column";
//     menu.style.position = "absolute";
//     menu.style.backgroundColor = "white";
//     menu.style.width = "150px";
//     menu.style.height = "150px";

//     const iconMenu = document.createElement("img");
//     iconMenu.src = chrome.runtime.getURL("images/icons/ellipsis-vertical.svg");
//     iconMenu.style.width = "25px";
//     iconMenu.style.height = "25px";

//     const closeButton = slider.querySelector("#close-slider");
//     closeButton.style.fontFamily = "Arial !important"
//     closeButton.style.backgroundColor = "white";
//     closeButton.style.border = "none";
//     closeButton.style.padding = "10px 20px";
//     closeButton.style.cursor = "pointer";
//     closeButton.style.transition = "background 0.3s ease-in-out";

//     const clearChat = slider.querySelector("#clear-chat");
//     clearChat.style.fontFamily = "Arial !important"
//     clearChat.style.backgroundColor = "white";
//     clearChat.style.border = "none";
//     clearChat.style.padding = "10px 20px";
//     clearChat.style.cursor = "pointer";
//     clearChat.style.transition = "background 0.3s ease-in-out";

//     const saveBtn = slider.querySelector("#saveBtn");
//     saveBtn.style.fontFamily = "Arial !important"
//     saveBtn.style.backgroundColor = "white";
//     saveBtn.style.border = "none";
//     saveBtn.style.padding = "10px 20px";
//     saveBtn.style.cursor = "pointer";
//     saveBtn.style.transition = "background 0.3s ease-in-out";

//     const sliderContent = slider.querySelector(".slider-content");
//     sliderContent.style.fontFamily = "Arial !important"
//     sliderContent.style.display = "flex";
//     sliderContent.style.flexDirection = "column";
//     sliderContent.style.alignItems = "flex-end";
//     sliderContent.style.justifyContent = "flex-start";
//     sliderContent.style.height = "100%";

//     const sliderTitle = slider.querySelector(".title-content");
//     sliderTitle.style.fontFamily = "Arial !important"
//     sliderTitle.style.width = "100%";
//     sliderTitle.style.minHeight = "60px";
//     sliderTitle.style.display = "flex"
//     sliderTitle.style.justifyContent = "space-between";
//     sliderTitle.style.alignItems = "center";
//     sliderTitle.style.boderBottom = "0.5px solid black";
//     sliderTitle.style.backgroundColor = "#28a745"

//     const chatContent = slider.querySelector(".chat-content");
//     chatContent.style.display = "flex";
//     chatContent.style.flexDirection = "column";
//     chatContent.style.justifyContent = "flex-start";
//     chatContent.style.alignItems = "flex-start";
//     chatContent.style.width = "100%";
//     chatContent.style.height = "100%";
//     chatContent.style.backgroundColor = "#D3D3D3";
//     chatContent.style.paddingBottom = "50px";

//     chatContent.style.overflow = "hidden"
//     chatContent.style.overflowY = "auto";
//     chatContent.style.scrollBehavior = "smooth";
//     chatContent.style.scrollbarWidth = "none";
//     chatContent.style.msOverflowStyle = "none";

//     const btnMenu = slider.querySelector(".menuBtn");
//     btnMenu.style.fontSize = "20px";
//     btnMenu.style.color = "white";
//     btnMenu.style.marginRight = "10px";
//     btnMenu.style.border = "none";
//     btnMenu.style.backgroundColor = "#28a745";

//     const h3 = slider.querySelector("h3");
//     h3.style.fontSize = "20px";
//     h3.style.color = "white";
//     h3.style.marginLeft = "10px";
// ;

//     btnMenu.addEventListener("mouseenter", () => {
//         menu.style.display = "flex";
//     })

//     menu.addEventListener("mouseleave", () => {
//         menu.style.display = "none";
//     })

//     closeButton.addEventListener("mouseenter", () => {
//         closeButton.style.backgroundColor = "#D3D3D3";
//     });
//     closeButton.addEventListener("mouseleave", () => {
//         closeButton.style.backgroundColor = "white";
//     });

//     clearChat.addEventListener("mouseenter", () => {
//         clearChat.style.backgroundColor = "#D3D3D3";
//     });
//     clearChat.addEventListener("mouseleave", () => {
//         clearChat.style.backgroundColor = "white";
//     });
//     clearChat.addEventListener("click", () => {
//         clearSavedResponses()
//     })

//     saveBtn.addEventListener("mouseenter", () => {
//         saveBtn.style.backgroundColor = "#D3D3D3";
//     });
//     saveBtn.addEventListener("mouseleave", () => {
//         saveBtn.style.backgroundColor = "white";
//     });

//     button.style.position = "fixed";
//     button.style.bottom = "20px";
//     button.style.right = "20px";
//     button.style.width = "60px";
//     button.style.height = "60px";
//     button.style.backgroundColor = "#28a745";
//     button.style.color = "#FFFFFF";
//     button.style.border = "none";
//     button.style.borderRadius = "50%";
//     button.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
//     button.style.cursor = "grab";
//     button.style.display = "flex";
//     button.style.alignItems = "center";
//     button.style.justifyContent = "center";
//     button.style.transition = "all 0.2s ease-in-out";
//     button.style.zIndex = "99999";

//     let posX = window.innerWidth - 140;
//     let posY = window.innerHeight - 140;
//     button.style.left = `${posX}px`;
//     button.style.top = `${posY}px`;

//     button.addEventListener("mouseenter", () => {
//         button.style.transform = "scale(1.1)";
//         button.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.3)";
//         button.style.backgroundColor = "#32CD32";
//         button.style.transition = "0.5s";
//     });

//     button.addEventListener("mouseleave", () => {
//         button.style.transform = "scale(1)";
//         button.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
//         button.style.backgroundColor = "#28a745";
//         button.style.transition = "0.5s";
//     });

//     let isDragging = false;
//     let offsetX, offsetY;

//     button.addEventListener("mousedown", (event) => {
//         isDragging = true;
//         button.style.cursor = "grabbing";
//         offsetX = event.clientX - posX;
//         offsetY = event.clientY - posY;
//     });

//     function moveButton(event) {
//         if (!isDragging) return;
//         posX = event.clientX - offsetX;
//         posY = event.clientY - offsetY;
//         const maxX = window.innerWidth - 120;
//         const maxY = window.innerHeight - 120;
//         posX = Math.max(0, Math.min(posX, maxX));
//         posY = Math.max(0, Math.min(posY, maxY));
//         button.style.left = `${posX}px`;
//         button.style.top = `${posY}px`;
//     }

//     document.addEventListener("mousemove", moveButton);
//     document.addEventListener("mouseup", () => {
//         isDragging = false;
//         button.style.cursor = "grab";
//     });

//     button.addEventListener("click", () => {
//         button.style.display = "none";
//         slider.style.right = "0";
//     });

//     slider.querySelector("#close-slider").addEventListener("click", () => {
//         slider.style.right = "-600px";
//         setTimeout(() => {
//             button.style.display = "flex";
//         }, 500);
//     });

//     button.appendChild(icon);
//     btnMenu.appendChild(iconMenu)
//     document.body.appendChild(button);
//     document.body.appendChild(slider);

//     const chatContainer = document.querySelector(".chat-content");

// if (chatContainer) {
//     console.log(".chat-content");

//     function createMessageBubble(text) {
//         const messageBubble = document.createElement("div");
//         messageBubble.classList.add("message-bubble");
//         messageBubble.textContent = text;
//         messageBubble.style.backgroundColor = "#f5f5f5";
//         messageBubble.style.padding = "10px";
//         messageBubble.style.borderRadius = "10px";
//         messageBubble.style.margin = "10px";
//         messageBubble.style.maxWidth = "70%";
//         messageBubble.style.alignSelf = "flex-start";
//         chatContent.appendChild(messageBubble);
//     }

//     function createOptions(options, question) {
//         const optionsContainer = document.createElement("div");
//         optionsContainer.classList.add("options-container");
//         optionsContainer.style.display = "flex";
//         optionsContainer.style.flexDirection = "column";
//         optionsContainer.style.padding = "10px";

//         options.forEach((optionText) => {
//             const label = document.createElement("label");
//             label.classList.add("option-label");
//             label.style.display = "flex";
//             label.style.gap = "8px";
//             label.style.justifyContent = "flex-start";
//             label.style.alignItems = "center";
//             label.style.margin = "4px 0px";
//             label.style.backgroundColor = "#f5f5f5";
//             label.style.borderRadius = "10px";
//             label.style.width = "auto";
//             label.style.maxWidth = "310px";
//             label.style.padding = "10px";

//             const input = document.createElement("input");
//             input.type = "radio";
//             input.name = "question-options";
//             input.value = optionText;

//             label.appendChild(input);
//             label.appendChild(document.createTextNode(optionText));

//             label.addEventListener("click", () => {
//                 handleOptionSelection(optionText, optionsContainer, question);
//             });

//             optionsContainer.appendChild(label);
//         });

//         chatContent.appendChild(optionsContainer);
//     }

//     function generateResponses(oitantes) {
//         return questions[0][1].map((sentence, index) => {
//             let oitanteIndex = oitantes[index] - 1; 
    
//             if (oitanteIndex >= 0 && oitanteIndex < emotions.length) {
//                 const oitanteEmotions = emotions[oitanteIndex].join(", ");
//                 return sentence.replace("{}", oitanteEmotions).replace("[]", oitantes[index]);
//             } else {
//                 return sentence.replace("{}", "N/A").replace("[]", "N/A");
//             }
//         });
//     }

//     function showQuestion(oitantes) {
//         const question = questions[0][0];
//         const formattedResponses = generateResponses(oitantes);
    
//         chrome.storage.local.get([question], (result) => {
//             if (result[question]) {
//                 createMessageBubble(question);
//                 handleSavedResponse(result[question]);
//             } else {
//                 createMessageBubble(question);
//                 createOptions(formattedResponses, question);
//             }
//         });
//     }
    
//     function handleSavedResponse(savedOption) {
//         const userMessageBubble = document.createElement("div");
//         userMessageBubble.classList.add("user-message-bubble");
//         userMessageBubble.textContent = savedOption;
//         userMessageBubble.style.backgroundColor = "#87FFC6";
//         userMessageBubble.style.padding = "10px";
//         userMessageBubble.style.borderRadius = "10px";
//         userMessageBubble.style.margin = "10px";
//         userMessageBubble.style.maxWidth = "70%";
//         userMessageBubble.style.alignSelf = "flex-end";
//         userMessageBubble.style.opacity = "0";
//         userMessageBubble.style.transform = "translateX(100%)";
//         userMessageBubble.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    
//         chatContent.appendChild(userMessageBubble);
    
//         setTimeout(() => {
//             userMessageBubble.style.opacity = "1";
//             userMessageBubble.style.transform = "translateX(0)";
//         }, 50);
//     }

//     function handleOptionSelection(selectedOption, optionsContainer) {
//         if (document.querySelector(".user-message-bubble")) return;
    
//         optionsContainer.remove();
    
//         const userMessageBubble = document.createElement("div");
//         userMessageBubble.classList.add("user-message-bubble");
//         userMessageBubble.textContent = selectedOption;
//         userMessageBubble.style.backgroundColor = "#87FFC6"; 
//         userMessageBubble.style.padding = "10px";
//         userMessageBubble.style.borderRadius = "10px";
//         userMessageBubble.style.margin = "10px";
//         userMessageBubble.style.maxWidth = "70%";
//         userMessageBubble.style.alignSelf = "flex-end";
//         userMessageBubble.style.opacity = "0";
//         userMessageBubble.style.transform = "translateX(100%)";
//         userMessageBubble.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    
//         chatContent.appendChild(userMessageBubble);
    
//         setTimeout(() => {
//             userMessageBubble.style.opacity = "1";
//             userMessageBubble.style.transform = "translateX(0)";
//         }, 50);
    
//         const questionKey = questions[0][0];
//         chrome.storage.local.set({ [questionKey]: selectedOption }, () => {
//             console.log("Resposta salva:", selectedOption);
//         });
//     }    

//     console.log(modaAtual);
//     showQuestion([1, 3, 5]);

//     function clearSavedResponses() {
//         chrome.storage.local.get(null, (items) => {
//             if (chrome.runtime.lastError) {
//                 console.error("Erro ao acessar o armazenamento:", chrome.runtime.lastError);
//                 return;
//             }
    
//             const keysToRemove = questions.map(q => q[0]);
    
//             chrome.storage.local.remove(keysToRemove, () => {
//                 console.log("Respostas salvas foram apagadas!");
                
//                 const chatContent = document.querySelector(".chat-content");
//                 if (chatContent) {
//                     chatContent.innerHTML = "";
//                 }
    
//                 showQuestion([1, 3, 5]); 
//             });
//         });
//     }    
// }
})();

// //     chrome.storage.local.get(function (data) {
// //         console.log(data);
// //         var styleNode = document.createElement('style');
// //         styleNode.type = "text/css";
// //         var ativo;



// //         if (data.rule12 == 1) {
// //             var videoElement = document.querySelector("video");
// //             if (videoElement) {
// //                 var textTracks = videoElement.textTracks; // one for each track element
// //                 var textTrack = textTracks[0]; // corresponds to the first track
// //                 textTrack.mode = 'showing';
// //                 var v = document.getElementsByTagName("video")[0];
// //                 v.play();
// //             }
// //         }
// //         if (data.rule8 == 1) {

// //             // browser detection (based on prototype.js)
// //             if (!!(window.attachEvent && !window.opera)) {
// //                 styleNode.styleSheet.cssText = ':focus {background: rgb(139, 195, 74)!important; color:#fff!important; }';
// //                 //styleNode.styleSheet.cssText = ':focus {background: pink;}';
// //             } else {
// //                 var styleText = document.createTextNode(':focus {background: rgb(139, 195, 74)!important; color:#fff!important;}');
// //                 styleNode.appendChild(styleText);
// //             }

// //         }
// //         if (data.rule6 == 1) {
// //             $(document).ready(function () {
// //                 $('link[rel=stylesheet]').remove();
// //             });

// //         }
// //         if (data.rule13 == 1) {
// //             $(document).ready(function () {
// //                 $('*').each(function () {
// //                     var k = parseInt($(this).css('font-size'));
// //                     //alert(k);
// //                     if (k >= 18)
// //                         var redSize = ((k * 106) / 100); //here, you can give the percentage( now it is reduced to 90%)
// //                     else
// //                         var redSize = ((k * 106) / 100); //here, you can give the percentage( now it is reduced to 90%)
// //                     $(this).css('font-size', redSize);

// //                 });
// //             });

// //         } else if (data.rule14 == 1) {
// //             $(document).ready(function () {
// //                 $('*').each(function () {
// //                     var k = parseInt($(this).css('font-size'));
// //                     //alert(k);
// //                     if (k >= 18)
// //                         var redSize = ((k * 106) / 100); //here, you can give the percentage( now it is reduced to 90%)
// //                     else
// //                         var redSize = ((k * 106) / 100); //here, you can give the percentage( now it is reduced to 90%)
// //                     $(this).css('font-size', redSize);

// //                 });
// //             });
// //         }
// //         if (data.rule7 == 1) {
// //             $(document).ready(function () {
// //                 $('audio').each(function () {
// //                     this.pause(); // Stop playing
// //                     this.currentTime = 0;
// //                 });
// //             });

// //         }
// //         if (data.rule34 == 1) {
// //             $(document).ready(function () {
// //                 $('link[rel=stylesheet],img, video, audio').remove();
// //             });

// //         }
// //         if (data.rule10 == 1) {
// //             $(document).ready(function () {
// //                 $('form').find("input[type=text], input[type=password], textarea").each(function (ev) {
// //                     if (!$(this).val()) {
// //                         $(this).attr("placeholder", "Digite a(o) " + $('label[for="' + this.id + '"]').html());
// //                     }
// //                 });
// //             });
// //             var css = 'input::placeholder {color: grey;font-weight: bold!important; font-size:14px!important;}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //             style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);

// //         }
// //         if (data.rule9 == 1) {
// //             var css = 'th[scope="col"], th { background: #455A64; color:#fff!important; padding:10px; }td{ padding:10px;}tr:nth-child(even) { background: #ECEFF1; }tr:nth-child(odd) { background: #CFD8DC; }',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //             style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }
// //         if (data.rule33 == 1) {
// //             var css = 'p{margin-bottom:20px!important; padding:0;line-height:30px!important} ol li{margin-bottom:10px!important;}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //             style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }

// //             head.appendChild(style);

// //         }
// //         if (data.rule5 == 1) {
// //             var css = "a{color:black!important}*{ color:black!important; background:#fff!important } a:hover{ background: black!important;color:white!important}footer{background:#efefef!important;}img {-moz-opacity: 0.75; filter: alpha(opacity=75); -webkit-filter: opacity(0.75); /*filtro P/B*/  filter: gray!important; /* IE6-9 */ -webkit-filter: grayscale(100%); /* Chrome 19+ & Safari 6+ */ /*qualidade*/ image-rendering: auto;}p,h1,h2,h3,h4,h5{color:black!important;}",
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //             style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }

// //             head.appendChild(style);

// //         }
// //         if (data.rule11 == 1) {
// //             var css = "a {font-weight:bold!important;text-decoration: underline!important;}a:hover, a:visited, a:focus {text-decoration-line: underline; text-decoration-style: wavy; text-decoration-color: red;}a:active {text-decoration-line: underline; text-decoration-style: wavy; text-decoration-color: red;}",
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //             style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }

// //             head.appendChild(style);
// //         }
// //         if (data.rule36 == 1) {
// //             var titulo = document.getElementsByTagName('title')[0].innerHTML;
// //             var elements = document.getElementsByTagName('h1');
// //             if (elements.length >= 1)
// //                 titulo = document.getElementsByTagName('h1')[0].textContent;
// //             else {
// //                 elements = document.getElementsByTagName('h2');
// //                 if (elements.length >= 1)
// //                     titulo = document.getElementsByTagName('h2')[0].textContent;
// //                 else {
// //                     elements = document.getElementsByTagName('h3');
// //                     if (elements.length >= 1)
// //                         titulo = document.getElementsByTagName('h3')[0].textContent;
// //                 }
// //             }
// //             document.getElementsByTagName('title')[0].innerHTML = window.location.hostname + " - " + titulo;
// //         }
// //         document.getElementsByTagName('head')[0].appendChild(styleNode);
// //         if (data.rule35 == 1) {
// //             var css = "body,div,nav,header,section,footer,table,th,td,p,a,h1,h2,h3,h4,span,th,td,li,pre,aside,button,input,select,label,span{ background:#222222!important; color:#fff!important;}tr:nth-child(even) { background: #292929!important; }tr:nth-child(odd) { background: #363636!important; }a:hover, a:visited, a:focus {color:#fff!important;text-decoration-line: underline; text-decoration-style: wavy; text-decoration-color: red;}a:active {text-decoration-line: underline; text-decoration-style: wavy; text-decoration-color: red;} i{color:#fff;}",
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //             style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }

// //             head.appendChild(style);
// //         }

// //         ////////////Regras de cores (Bianchi)
// //         //Vermelho, laranja, Amarelo
// //         if (data.rule39 == 1 && data.flag_cor == 0) {
// //             var css = 'body,header {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}45% {background-color: #E90000;}66% {background-color: #EC5F00;}100% {background-color: #E6DB00;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Azul Escuro, Roxo, Verde Escuro, Cinza
// //         if (data.rule40 == 1 && data.flag_cor == 0) {
// //             var css = 'span,h1,h2,h3,h4,a,p,em,text,th,td,table {animation:12s multicolor_fonte forwards} body,header {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}45% {background-color: #262C7F;}66% {background-color: #5E1E66;}80% {background-color: #267F3F;}100% {background-color: #6F6F6F;}} @keyframes multicolor_fonte {0% {color: current-color;}100% {color:#BAF73C;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Azul Claro, Lilas, Verde Claro
// //         if (data.rule41 == 1 && data.flag_cor == 0) {
// //             var css = 'body {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}45% {background-color: #5A95F2;}66% {background-color: #C35BEF;}100% {background-color: #7BEF5B;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Amarelo, Laranja, Vermelho
// //         if (data.rule42 == 1 && data.flag_cor == 0) {
// //             var css = 'span,h1,h2,h3,h4,a,p,em,text,th,td,table {animation:12s multicolor_fonte forwards} body,header {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}45% {background-color: #E6DB00;}66% {background-color: #EC5F00;}100% {background-color: #E90000;}} @keyframes multicolor_fonte {0% {color: current-color;}100% {color:#ffee00;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Cinza, Verde Escuro, Roxo, Azul Escuro
// //         if (data.rule43 == 1 && data.flag_cor == 0) {
// //             var css = 'span,h1,h2,h3,h4,a,p,em,text,th,td,table {animation:12s multicolor_fonte forwards} body {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}45% {background-color: #6F6F6F;}66% {background-color: #267F3F;}80% {background-color: #5E1E66;}100% {background-color: #262C7F;}} @keyframes multicolor_fonte {0% {color: current-color;}100% {color:#BAF73C;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Verde Claro, Lilas, Azul Claro
// //         if (data.rule44 == 1 && data.flag_cor == 0) {
// //             var css = 'body {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}45% {background-color: #7BEF5B;}66% {background-color: #C35BEF;}100% {background-color: #5A95F2;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Oitantes 2(Preto)
// //         //span,h1,h2,h3,h4,a
// //         if (data.rule45 == 1 && data.flag_cor == 0) {
// //             var css = 'span,h1,h2,h3,h4,a,p,em,text,th,td,table {animation:12s multicolor_fonte forwards} body {animation:12s multicolor forwards} @keyframes multicolor {0% {background-color: current-background-color;}100% {background-color: #000000;}} @keyframes multicolor_fonte {0% {color: current-color;}100% {color:#FFFFFF;}}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         //Fontes
// //         if (data.rule46 == 1 && data.flag_fonte == 0) {
// //             var css = 'p,a,div {font-family: Arial!important; font-size: 8pt!important;}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }

// //         if (data.rule47 == 1 && data.flag_fonte == 0) {
// //             var css = 'p,a,div {font-family: Arial!important; font-size: 12pt!important;}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }
// //         //p,a,div,h1,h2,h3,h4,li,span,strong
// //         if (data.rule48 == 1 && data.flag_fonte == 0) {
// //             var css = 'p,a,div {font-family: Arial!important; font-size: 16pt!important;}',
// //                 head = document.head || document.getElementsByTagName('head')[0],
// //                 style = document.createElement('style');

// //               style.type = 'text/css';
// //             if (style.styleSheet) {
// //                 style.styleSheet.cssText = css;
// //             } else {
// //                 style.appendChild(document.createTextNode(css));
// //             }
// //             head.appendChild(style);
// //         }


// //     });

// // })();


