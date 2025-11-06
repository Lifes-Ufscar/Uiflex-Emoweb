'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

function updateSetting() {

    chrome.storage.local.set(function (data) {
        return data.quant;
    });
    return 6;
}

//chrome.extension.getBackgroundPage().updateSetting();
//chrome.browserAction.setBadgeText({
//    text: '' + updateSetting() + ''
//});

//inicia servidor websocket




//fim servidor websocket


console.log("BackgroundAAA");

setInterval(function () {
  chrome.storage.local.get(function(data) {
      if(data.flag == 1){
          console.log("BackgroundBBB");
          if(data.flag1 == 0) {
              OitanteResultante();
          }
          if(data.flag2 == 1) {

            // chrome.storage.local.get(function(data) {
            //     $.getJSON("http://slifes.dc.ufscar.br/uiflex/rules.json", function(json) {

            //         for (var i in json) {
            //             ////////Cores(Circulo de Bianchi)
            //             //Vermelho, Laranja, Amarelo
            //             if (json[i].id == "rule39" && ((data.resultante_inicial == 1 && data.oitante_resultante1 >= 7) || (data.resultante_inicial == 2 && (data.oitante_resultante1 >= 7||data.oitante_resultante1 == 1)) || ((data.resultante_inicial == 3||data.resultante_inicial == 4) && data.oitante_resultante1 == 1) || ((data.resultante_inicial == 3||data.resultante_inicial == 4) && data.oitante_resultante1 >= 7))  ) {
            //                 chrome.storage.local.set({
            //                     'rule39': '1'
            //                 });
            //             }

            //             //Azul Escuro, Roxo, Verde Escuro, Cinza
            //             if(json[i].id == "rule40" && ((data.resultante_inicial == 1||data.resultante_inicial == 2)&&(data.oitante_resultante1 == 3||data.oitante_resultante1 == 4)) ){
            //                 chrome.storage.local.set({
            //                     'rule40': '1'
            //                 });
            //             }

            //             //Azul Claro, Lilas, Verde Claro
            //             if(json[i].id == "rule41" && ((data.resultante_inicial <= 4)&&(data.oitante_resultante1 == 5||data.oitante_resultante1 == 6)) ) {
            //                 chrome.storage.local.set({
            //                     'rule41': '1'
            //                 });
            //             }

            //             //Amarelo, Laranja, Vermelho
            //             if(json[i].id == "rule42" && (((data.resultante_inicial == 5||data.resultante_inicial == 6)&&(data.oitante_resultante1 == 1||data.oitante_resultante1 >= 7)) || (data.resultante_inicial >= 7 && data.oitante_resultante1 == 1)) ) {
            //                 chrome.storage.local.set({
            //                     'rule42': '1'
            //                 });
            //             }

            //             //Cinza, Verde Escuro, Roxo, Azul Escuro
            //             if(json[i].id == "rule43" && ((data.resultante_inicial >= 4)&&(data.oitante_resultante1 == 3||data.oitante_resultante1 == 4)) ) {
            //                 chrome.storage.local.set({
            //                     'rule43': '1'
            //                 });
            //             }

            //             //Verde Claro, Lilas, Azul Claro
            //             if(json[i].id == "rule44" && ((data.resultante_inicial >= 7)&&(data.oitante_resultante1 == 5||data.oitante_resultante1 == 6)) ) {
            //                 chrome.storage.local.set({
            //                     'rule44': '1'
            //                 });
            //             }


            //             //Oitante 2(Preto)
            //             if(json[i].id == "rule44" && ((data.resultante_inicial >= 1)&&(data.oitante_resultante1 == 2)) ) {
            //                 chrome.storage.local.set({
            //                     'rule45': '1'
            //                 });
            //             }

            //             //Regras Fontes
            //             if(data.oitante_resultante1 <= 4) {
            //                 chrome.storage.local.set({
            //                     'rule46': '1'
            //                 });
            //             }

            //             if(data.oitante_resultante1 == 5 || data.oitante_resultante1 == 7) {
            //                 chrome.storage.local.set({
            //                     'rule47': '1'
            //                 });
            //             }

            //             if(data.oitante_resultante1 == 6 || data.oitante_resultante1 == 8) {
            //                 chrome.storage.local.set({
            //                     'rule48': '1'
            //                 });
            //             }


            //         }

            //     }).fail(function() {
            //         alert("Não foi possível obter as regras de design");
            //     });
            // });
          }
      }
  });
}, 1000);

var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

async function OitanteResultante(){
  chrome.storage.local.set({
      'flag1': "1"
  });
  await sleep(1200); ///Espera 120 segundos(2 minutos)
  chrome.storage.local.get(function(data) {
    //   var array_oitantes = Array.from([data.oitante_valence00,data.oitante_valence01,data.oitante_arousal00,data.oitante_arousal01,data.oitante_control00,data.oitante_control01,data.oitante_conclusion00,data.oitante_conclusion01,data.oitante_inicial_camera]);
    //   var moda = mode(array_oitantes);

      var array_oitantes1 = Array.from([data.oitante_valence10,data.oitante_valence11,data.oitante_arousal10,data.oitante_arousal11,data.oitante_control10,data.oitante_control11,data.oitante_conclusion10,data.oitante_conclusion11]);
      var moda1 = mode(array_oitantes1);
      //var resultante_inicial = Math.round((parseInt(data.oitante_inicial)+parseInt(data.oitante_inicial_camera))/2);
    //   if (moda.length > 1){
    //     var resultante_inicial = mean(moda);
    //     resultante_inicial = Math.round(resultante_inicial);
    //   } else {
    //     resultante_inicial = moda[0];
    //   }
      
      if (moda1.length > 1){
        var oitante_resultante1 = mean(moda1);
        oitante_resultante1 = Math.round(oitante_resultante1);
      } else {
        oitante_resultante1 = moda1[0];
      }
      chrome.storage.local.set({
          //'resultante_inicial': resultante_inicial,
          'oitante_resultante1': oitante_resultante1
      });
    //   console.log(array_oitantes);
    //   console.log(moda);
      console.log(array_oitantes1);
      console.log(moda1);
  });
  //$.getJSON("http://slifes.dc.ufscar.br/uiflex/oitanteresultanteinicial.json", function(json_teste) {
  //    chrome.storage.local.set({
  //        'resultante_inicial': json_teste[0].resultante_inicial
  //    });
  //})
  chrome.storage.local.set({
      'flag2': "1"
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mode(numbers) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
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

function mean(numbers) {
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}
