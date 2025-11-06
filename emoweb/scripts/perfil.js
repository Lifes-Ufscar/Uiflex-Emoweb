$(document).ready(function () {
    'use strict';



    var cont = 0;
    var oitantes;



    /*chrome.storage.local.get(function(data) {
        $.getJSON("http://slifes.dc.ufscar.br/uiflex/rules.json", function(json) {

            for (var i in json) {
                ////////Cores(Circulo de Bianchi)
                //Vermelho, Laranja, Amarelo
                if (json[i].id == "rule39" && ((data.oitante_inicial == 1 && data.resultante_final >= 7) || (data.oitante_inicial == 2 && (data.resultante_final >= 7||data.resultante_final == 1)) || ((data.oitante_inicial == 3||data.oitante_inicial == 4) && data.resultante_final == 1) || ((data.oitante_inicial == 3||data.oitante_inicial == 4) && data.resultante_final >= 7))  ) {
                    chrome.storage.local.set({
                        'rule39': '1'
                    });
                }

                //Azul Escuro, Roxo, Verde Escuro, Cinza
                if(json[i].id == "rule40" && ((data.oitante_inicial == 1||data.oitante_inicial == 2)&&(data.resultante_final == 3||data.resultante_final == 4)) ){
                    chrome.storage.local.set({
                        'rule40': '1'
                    });
                }

                //Azul Claro, Lilas, Verde Claro
                if(json[i].id == "rule41" && ((data.oitante_inicial <= 4)&&(data.resultante_final == 5||data.resultante_final == 6)) ) {
                    chrome.storage.local.set({
                        'rule41': '1'
                    });
                }

                //Amarelo, Laranja, Vermelho
                if(json[i].id == "rule42" && (((data.oitante_inicial == 5||data.oitante_inicial == 6)&&(data.resultante_final == 1||data.resultante_final >= 7)) || (data.oitante_inicial >= 7 && data.resultante_final == 1)) ) {
                    chrome.storage.local.set({
                        'rule42': '1'
                    });
                }

                //Cinza, Verde Escuro, Roxo, Azul Escuro
                if(json[i].id == "rule43" && ((data.oitante_inicial >= 4)&&(data.resultante_final == 3||data.resultante_final == 4)) ) {
                    chrome.storage.local.set({
                        'rule43': '1'
                    });
                }

                //Verde Claro, Lilas, Azul Claro
                if(json[i].id == "rule44" && ((data.oitante_inicial >= 7)&&(data.resultante_final == 5||data.resultante_final == 6)) ) {
                    chrome.storage.local.set({
                        'rule44': '1'
                    });
                }


                //Oitante 2(Preto)
                if(json[i].id == "rule44" && ((data.oitante_inicial >= 1)&&(data.resultante_final == 2)) ) {
                    chrome.storage.local.set({
                        'rule45': '1'
                    });
                }


            }

        }).fail(function() {
            alert("Não foi possível obter as regras de design");
        });
    });*/


    chrome.storage.local.get(function (data) {
        console.log(data);
        console.log('Oitante Resultante1:',data.oitante_resultante1)
        //Teste do whoami.js aqui

        if(data.flag==1){
          if(data.valence >= -1 && data.valence <= -0.5){
            chrome.storage.local.set({
                'oitante_valence00': '2',
                'oitante_valence01': '3',
            });
          }
          if(data.valence > -0.5 && data.valence < 0){
            chrome.storage.local.set({
                'oitante_valence00': '1',
                'oitante_valence01': '4',
            });
          }
          if(data.valence >= 0 && data.valence < 0.5){
            chrome.storage.local.set({
                'oitante_valence00': '5',
                'oitante_valence01': '8',
            });
          }
          if(data.valence >= -0.5 && data.valence <= 1){
            chrome.storage.local.set({
                'oitante_valence00': '6',
                'oitante_valence01': '7',
            });
          }

          if(data.arousal >= -1 && data.arousal <= -0.5){
            chrome.storage.local.set({
                'oitante_arousal00': '4',
                'oitante_arousal01': '5',
            });
          }
          if(data.arousal > -0.5 && data.arousal < 0){
            chrome.storage.local.set({
                'oitante_arousal00': '3',
                'oitante_arousal01': '6',
            });
          }
          if(data.arousal >= 0 && data.arousal < 0.5){
            chrome.storage.local.set({
                'oitante_arousal00': '2',
                'oitante_arousal01': '7',
            });
          }
          if(data.arousal >= -0.5 && data.arousal <= 1){
            chrome.storage.local.set({
                'oitante_arousal00': '1',
                'oitante_arousal01': '8',
            });
          }

          if(data.conclusion >= -1 && data.conclusion <= -0.5){
            chrome.storage.local.set({
                'oitante_conclusion00': '1',
                'oitante_conclusion01': '2',
            });
          }
          if(data.conclusion > -0.5 && data.conclusion < 0){
            chrome.storage.local.set({
                'oitante_conclusion00': '3',
                'oitante_conclusion01': '8',
            });
          }
          if(data.conclusion >= 0 && data.conclusion < 0.5){
            chrome.storage.local.set({
                'oitante_conclusion00': '4',
                'oitante_conclusion01': '7',
            });
          }
          if(data.conclusion >= -0.5 && data.conclusion <= 1){
            chrome.storage.local.set({
                'oitante_conclusion00': '5',
                'oitante_conclusion01': '6',
            });
          }

          if(data.control >= -1 && data.control <= -0.5){
            chrome.storage.local.set({
                'oitante_control00': '3',
                'oitante_control01': '4',
            });
          }
          if(data.control > -0.5 && data.control < 0){
            chrome.storage.local.set({
                'oitante_control00': '2',
                'oitante_control01': '5',
            });
          }
          if(data.control >= 0 && data.control < 0.5){
            chrome.storage.local.set({
                'oitante_control00': '1',
                'oitante_control01': '6',
            });
          }
          if(data.control >= -0.5 && data.control <= 1){
            chrome.storage.local.set({
                'oitante_control00': '7',
                'oitante_control01': '8',
            });
          }

          //////Dados em par de oitantes(resultante1)
          if(data.valence1 >= -1 && data.valence1 <= -0.5){
            chrome.storage.local.set({
                'oitante_valence10': '2',
                'oitante_valence11': '3',
            });
          }
          if(data.valence1 > -0.5 && data.valence1 < 0){
            chrome.storage.local.set({
                'oitante_valence10': '1',
                'oitante_valence11': '4',
            });
          }
          if(data.valence1 >= 0 && data.valence1 < 0.5){
            chrome.storage.local.set({
                'oitante_valence10': '5',
                'oitante_valence11': '8',
            });
          }
          if(data.valence1 >= -0.5 && data.valence1 <= 1){
            chrome.storage.local.set({
                'oitante_valence10': '6',
                'oitante_valence11': '7',
            });
          }

          if(data.arousal1 >= -1 && data.arousal1 <= -0.5){
            chrome.storage.local.set({
                'oitante_arousal10': '4',
                'oitante_arousal11': '5',
            });
          }
          if(data.arousal1 > -0.5 && data.arousal1 < 0){
            chrome.storage.local.set({
                'oitante_arousal10': '3',
                'oitante_arousal11': '6',
            });
          }
          if(data.arousal1 >= 0 && data.arousal1 < 0.5){
            chrome.storage.local.set({
                'oitante_arousal10': '2',
                'oitante_arousal11': '7',
            });
          }
          if(data.arousal1 >= -0.5 && data.arousal1 <= 1){
            chrome.storage.local.set({
                'oitante_arousal10': '1',
                'oitante_arousal11': '8',
            });
          }

          if(data.conclusion1 >= -1 && data.conclusion1 <= -0.5){
            chrome.storage.local.set({
                'oitante_conclusion10': '1',
                'oitante_conclusion11': '2',
            });
          }
          if(data.conclusion1 > -0.5 && data.conclusion1 < 0){
            chrome.storage.local.set({
                'oitante_conclusion10': '3',
                'oitante_conclusion11': '8',
            });
          }
          if(data.conclusion1 >= 0 && data.conclusion1 < 0.5){
            chrome.storage.local.set({
                'oitante_conclusion10': '4',
                'oitante_conclusion11': '7',
            });
          }
          if(data.conclusion1 >= -0.5 && data.conclusion1 <= 1){
            chrome.storage.local.set({
                'oitante_conclusion10': '5',
                'oitante_conclusion11': '6',
            });
          }

          if(data.control1 >= -1 && data.control1 <= -0.5){
            chrome.storage.local.set({
                'oitante_control10': '3',
                'oitante_control11': '4',
            });
          }
          if(data.control1 > -0.5 && data.control1 < 0){
            chrome.storage.local.set({
                'oitante_control10': '2',
                'oitante_control11': '5',
            });
          }
          if(data.control1 >= 0 && data.control1 < 0.5){
            chrome.storage.local.set({
                'oitante_control10': '1',
                'oitante_control11': '6',
            });
          }
          if(data.control1 >= -0.5 && data.control1 <= 1){
            chrome.storage.local.set({
                'oitante_control10': '7',
                'oitante_control11': '8',
            });
          }
        }




        var t = 0;

        if (data.perfilusuario === 1) {
            $("#pu").html('<i class="material-icons">create</i> Alterar Opções de Acessibilidade');
            $("#deletePU").show();
            if (data.gerou != 1) {

                t = 2000;
            }
            setTimeout(function () {

                // $.getJSON("http://slifes.dc.ufscar.br/uiflex/oitanteAtivo.json", function (json) {
                //     oitantes = json[0].ativo;
                //     console.log(json);
                // }).fail(function () {
                //     alert("Não foi possível obter oitantes");
                // });
                $.getJSON("http://slifes.dc.ufscar.br/uiflex/rules.json", function (json) {


                    console.log(json);
                    //alert(json[0].context.user.predicate);
                    for (var i in json) {
                        if (json[i].id == "rule12" && json[i].context.user.predicate == "AbilityToHear" && json[i].context.user.object == "no" && data.audicao == 2) {
                            if (data.rule12 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule13" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "low" && (data.visao2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule13 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank" >' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule8" && json[i].context.user.predicate == "AbilityToDifferentiateColors" && json[i].context.user.object == "no" && (data.daltonismo == 2 || data.daltonismo2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule8 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '<input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank" >' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank" >' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule5" && json[i].context.user.predicate == "AbilityToDifferentiateColors" && json[i].context.user.object == "no" && (data.daltonismo == 2 || data.daltonismo2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule5 == 1 && data.rule35 != 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');

                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule35" && json[i].context.user.predicate == "AbilityToDifferentiateColors" && json[i].context.user.object == "no" && (data.daltonismo == 2 || data.daltonismo2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule35 == 1 && data.rule5 != 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                                chrome.storage.local.set({ 'rule5': 2 });
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule6" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "no" && data.visao1 == 2 && data.visao2 == 2 && data.visao3 == 2) {
                            if (data.rule6 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }

                        if (json[i].id == "rule7") {
                            if (data.rule7 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule9" && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule9 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule10" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "low" && (data.visao1 == 2 || data.visao2 == 2 || data.visao3 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule10 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule11" && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule11 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule14" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "medium" && (data.visao3 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule14 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule33" && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule33 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule34" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "no" && (data.visao1 == 2 && data.visao2 == 2 && data.visao3 == 2)) {
                            if (data.rule34 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule36") {
                            if (data.rule36 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                        if (json[i].id == "rule37" && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
                            if (data.rule37 == 1) {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input" checked>' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            } else {
                                $("#regras").append('<label id="l' + json[i].id + '" class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="' + json[i].id + '"> ' +
                                    '  <input type="checkbox" id="' + json[i].id + '" class="mdl-switch__input">' +
                                    '  <span class="mdl-switch__label"><span id="t' + json[i].id + '">' + json[i].name + '</span></span>' +
                                    '</label><div class="source">Autoridade: <a href="' + json[i].link_source + '" target="_blank">' + json[i].source + '</a></div>' +
                                    '<div class="mdl-tooltip mdl-tooltip--large" data-mdl-for="t' + json[i].id + '">' + json[i].description + '</div>');
                            }
                            cont++;
                        }
                    }

                    $('#rule5').change(function () {
                        chrome.storage.local.set({
                            'rule5': $('#rule5').is(':checked') ? 1 : 2
                        });
                        if ($('#rule5').is(':checked')) {
                            var domE3 = document.getElementById("lrule35");
                            var mdlComp3 = new MaterialSwitch(domE3);
                            mdlComp3.off();
                            chrome.storage.local.set({
                                'rule35': 2
                            });

                        }
                    });
                    $('#rule6').change(function () {
                        chrome.storage.local.set({
                            'rule6': $('#rule6').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule7').change(function () {
                        chrome.storage.local.set({
                            'rule7': $('#rule7').is(':checked') ? 1 : 2
                        });

                    });
                    $('#rule8').change(function () {
                        chrome.storage.local.set({
                            'rule8': $('#rule8').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule9').change(function () {
                        chrome.storage.local.set({
                            'rule9': $('#rule9').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule10').change(function () {
                        chrome.storage.local.set({
                            'rule10': $('#rule10').is(':checked') ? 1 : 2
                        });

                    });
                    $('#rule11').change(function () {
                        chrome.storage.local.set({
                            'rule11': $('#rule11').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule12').change(function () {
                        chrome.storage.local.set({
                            'rule12': $('#rule12').is(':checked') ? 1 : 2
                        });

                    });
                    $('#rule13').change(function () {
                        chrome.storage.local.set({
                            'rule13': $('#rule13').is(':checked') ? 1 : 2
                        });

                    });
                    $('#rule14').change(function () {
                        chrome.storage.local.set({
                            'rule14': $('#rule14').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule33').change(function () {
                        chrome.storage.local.set({
                            'rule33': $('#rule33').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule34').change(function () {
                        chrome.storage.local.set({
                            'rule34': $('#rule34').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule35').change(function () {
                        chrome.storage.local.set({
                            'rule35': $('#rule35').is(':checked') ? 1 : 2
                        });
                        if ($('#rule35').is(':checked')) {
                            var domE3 = document.getElementById("lrule5");
                            var mdlComp3 = new MaterialSwitch(domE3);
                            mdlComp3.off();
                            chrome.storage.local.set({
                                'rule5': 2
                            });
                        }
                    });
                    $('#rule36').change(function () {
                        chrome.storage.local.set({
                            'rule36': $('#rule36').is(':checked') ? 1 : 2
                        });
                    });
                    $('#rule37').change(function () {
                        chrome.storage.local.set({
                            'rule37': $('#rule37').is(':checked') ? 1 : 2
                        });
                    });
                    //console.log(oitantes);
                    // chrome.storage.local.set({
                    //     'oitante': oitantes
                    // });
                    chrome.storage.local.set({
                        'quant': cont
                    });
                    chrome.storage.local.set({
                        'gerou': 1
                    });
                    chrome.browserAction.setBadgeText({
                        text: '' + cont + ''
                    });
                    componentHandler.upgradeDom();
                    //
                }).fail(function () {
                    alert("Não foi possível obter as regras de design");
                });
            }, t);
        } else {
            $("#deletePU").hide();

            $("#regras").hide();
            $("#perfilInteracao").hide();
        }

        if (data.perfilusuarioemocao === 1) {
          $("#pu1").html('<i class="material-icons">create</i> Alterar Opções de Emoção');
          $("#deletePU").show();
          if (data.gerouemocao != 1) {
              $("#animacaoPI").show();
              $("#concluido").hide();
              t = 2000;
              chrome.storage.local.set({
                  'flag_barra': '1',
              });
          }
          setTimeout(function () {
              $("#animacaoPI").hide();
              $("#concluido").show();
              // $.getJSON("http://slifes.dc.ufscar.br/uiflex/oitanteAtivo.json", function (json) {
              //     oitantes = json[0].ativo;
              //     console.log(json);
              // }).fail(function () {
              //     alert("Não foi possível obter oitantes");
              // });

          }, t);
      } else {
          $("#deletePU").hide();
          $("#animacaoPI").hide();
          $("#regras").hide();
          $("#perfilInteracao").hide();
      }
    });

    // var oitanteAtual = oitantes;

    // setInterval(function () {
    //     $.getJSON("http://slifes.dc.ufscar.br/uiflex/oitanteAtivo.json", function (json) {
    //         oitantes = json[0].ativo;
    //         if (oitanteAtual != oitantes) {
    //             chrome.storage.local.set({
    //                 'oitante': oitantes
    //             });
    //             oitanteAtual = oitantes;
    //         }
    //         console.log(oitantes);
    //     }).fail(function () {
    //         alert("Não foi possível obter oitantes");
    //     });

    // }, 1000);



    $('#excluirSim').click(function () {
        chrome.storage.local.set({
            'perfilusuario': 2
        });
        chrome.storage.local.set({
            'gerou': 0
        });
        window.location.href = "perfil.html";
    });


    //exibir dialog exclusao
    var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#deletePU');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function () {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });

    $('#m1').click(function () {
        chrome.tabs.executeScript({
            file: 'inject.js'
        });
    });
    $('#baixarPI').click(function () {

        chrome.storage.local.get(function (data) {
            var jsonStr = '{"perfil":[]}';
            var obj = JSON.parse(jsonStr);

            if (data.rule5 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "css",
                    "element": "all",
                    "value": "no_color"
                });
            }
            if (data.rule6 == 1) {
                obj['perfil'].push({
                    "action": "remove",
                    "type": "file",
                    "element": "css",
                    "value": ""
                });
            }
            if (data.rule7 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "js",
                    "element": "audio",
                    "value": "pause"
                });
            }
            if (data.rule8 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "css",
                    "element": ":focus",
                    "value": "color: red"
                });
            }
            if (data.rule9 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "css",
                    "element": "table",
                    "value": "th{ background: #ccc; } tr:nth-child(even) { background: #eee; } tr:nth-child(odd) { background: #ddd; }"
                });
            }
            if (data.rule10 == 1) {
                obj['perfil'].push({
                    "action": "include",
                    "type": "js",
                    "element": "forms",
                    "value": ""
                });
            }
            if (data.rule11 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "css",
                    "element": "a",
                    "value": "a { color: #ff0000; } a:hover, a:visited, a:focus { color: #a60000; text-decoration: none; } a:active { color: #000000; background-color: #a60000; }"
                });
            }
            if (data.rule12 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "js",
                    "element": "legend",
                    "value": "auto"
                });
            }
            if (data.rule13 == 1) {
                obj['perfil'].push({
                    "action": "update",
                    "type": "css",
                    "element": "text",
                    "value": "+4"
                });
            }
            if (data.rule14 == 1) {
                obj['perfil'].push({
                    "action": "include",
                    "type": "js",
                    "element": "text",
                    "value": "+2"
                });
            }
            if (data.rule33 == 1) {
                obj['perfil'].push({
                    "action": "include",
                    "type": "css",
                    "element": "p",
                    "value": "line-height: 200%"
                });
            }
            if (data.rule34 == 1) {
                obj['perfil'].push({
                    "action": "",
                    "type": "js",
                    "element": "all",
                    "value": "only_text"
                });
            }
            if (data.rule35 == 1) {
                obj['perfil'].push({
                    "action": "include",
                    "type": "css",
                    "element": "body",
                    "value": "background:#efefef;"
                });
            }
            if (data.rule36 == 1) {
                obj['perfil'].push({
                    "action": "",
                    "type": "js",
                    "element": "title",
                    "value": "auto"
                });
            }
            var jsn = JSON.stringify(obj);
            var a = $("<a style='display: none;'/>");
            var url = window.URL.createObjectURL(new Blob([jsn], {
                type: "application/json"
            }));
            a.attr("href", url);
            a.attr("download", "pi.json");
            $("body").append(a);
            a[0].click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
    });
});

function first() {
    chrome.storage.local.set({ 'rule5': 1 });
    chrome.storage.local.set({ 'rule6': 1 });
    chrome.storage.local.set({ 'rule7': 1 });
    chrome.storage.local.set({ 'rule8': 1 });
    chrome.storage.local.set({ 'rule9': 1 });
    chrome.storage.local.set({ 'rule10': 1 });
    chrome.storage.local.set({ 'rule11': 1 });
    chrome.storage.local.set({ 'rule12': 1 });
    chrome.storage.local.set({ 'rule13': 1 });
    chrome.storage.local.set({ 'rule14': 1 });
    chrome.storage.local.set({ 'rule15': 1 });
    chrome.storage.local.set({ 'rule16': 1 });
    chrome.storage.local.set({ 'rule17': 1 });
    chrome.storage.local.set({ 'rule18': 1 });
    chrome.storage.local.set({ 'rule19': 1 });
    chrome.storage.local.set({ 'rule20': 1 });
    chrome.storage.local.set({ 'rule21': 1 });
    chrome.storage.local.set({ 'rule22': 1 });
    chrome.storage.local.set({ 'rule23': 1 });
    chrome.storage.local.set({ 'rule24': 1 });
    chrome.storage.local.set({ 'rule25': 1 });
    chrome.storage.local.set({ 'rule26': 1 });
    chrome.storage.local.set({ 'rule27': 1 });
    chrome.storage.local.set({ 'rule28': 1 });
    chrome.storage.local.set({ 'rule29': 1 });
    chrome.storage.local.set({ 'rule30': 1 });
    chrome.storage.local.set({ 'rule31': 1 });
    chrome.storage.local.set({ 'rule32': 1 });
    chrome.storage.local.set({ 'rule33': 1 });
    chrome.storage.local.set({ 'rule34': 1 });
    chrome.storage.local.set({ 'rule35': 1 });
    chrome.storage.local.set({ 'rule36': 1 });
    chrome.storage.local.set({ 'rule37': 1 });
    chrome.storage.local.set({ 'rule38': 1 });
    chrome.storage.local.set({ 'rule39': 1 });
    chrome.storage.local.set({ 'rule40': 1 });
    chrome.storage.local.set({ 'rule41': 1 });
    chrome.storage.local.set({ 'rule42': 1 });
    chrome.storage.local.set({ 'rule43': 1 });
    chrome.storage.local.set({ 'rule44': 1 });
    chrome.storage.local.set({ 'rule45': 1 });
    chrome.storage.local.set({ 'rule46': 1 });
    chrome.storage.local.set({ 'rule47': 1 });
    chrome.storage.local.set({ 'rule48': 1 });
    chrome.storage.local.set({ 'rule49': 1 });
    chrome.storage.local.set({ 'rule50': 1 });
    chrome.storage.local.set({ 'first': 1 });
}

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }


$('#linkopcoes').click(function() {
 if (chrome.runtime.openOptionsPage) {
   chrome.runtime.openOptionsPage();
 } else {
   window.open(chrome.runtime.getURL('options.html'));
 }
});

$('#download_json').click(function() {
  chrome.storage.local.get(function(data) {
    var download =  data.tempo_alteracao + data.json_array;
    var url = 'data:application/json;base64,' + btoa(download);
    chrome.downloads.download({
        url: url,
        filename: 'resultados_camera.json'
    });
  });
});

$('#download_json_2').click(function() {
  chrome.storage.local.get(function(data) {
    var download =  "Atual: V " + data.valence + " E " + data.arousal + " O " + data.conclusion + " C " + data.control + " Desejado: V " + data.valence1 + " E " + data.arousal1 + " O " + data.conclusion1 + " C " + data.control1;
    var url = 'data:application/json;base64,' + btoa(download);
    chrome.downloads.download({
        url: url,
        filename: 'resultados_sliders.json'
    });
  });
});
