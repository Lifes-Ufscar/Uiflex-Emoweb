$(document).ready(function () {
    'use strict';
    chrome.storage.local.get(function (data) {
        console.log(data);
        if (data.locomocao === '1') {
            var domEl = document.getElementById("Teste1");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();

        } else {
            var domEl = document.getElementById("Teste2");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        }
        if (data.audicao === '1') {
            var domEl = document.getElementById("A1");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        } else {
            var domEl = document.getElementById("A2");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        }
        if (data.fala === '1') {
            var domEl = document.getElementById("F1");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        } else {
            var domEl = document.getElementById("F2");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        }
        if (data.daltonismo === '1') {
            var domEl = document.getElementById("D1");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        } else {
            var domEl = document.getElementById("D2");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        }
        if (data.daltonismo2 === '1') {
            var domEl = document.getElementById("D3");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        } else {
            var domEl = document.getElementById("D4");
            var mdlComp = new MaterialRadio(domEl);
            mdlComp.check();
        }
        if (data.visao1 === 1) {
            var domEl = document.getElementById("V1");
            var mdlComp = new MaterialCheckbox(domEl);
            mdlComp.check();
        }
        if (data.visao2 === 1) {
            var domEl = document.getElementById("V2");
            var mdlComp = new MaterialCheckbox(domEl);
            mdlComp.check();
        }
        if (data.visao3 === 1) {
            var domEl = document.getElementById("V3");
            var mdlComp = new MaterialCheckbox(domEl);
            mdlComp.check();
        }
    });

});
audio = document.getElementById('audio');

$(document).ready(function () {
    $('.semantic').click(function (e) {
        var offset = $(this).offset();
        var x = e.pageX - offset.left
        var y = e.pageY - offset.top

        var valence = (((1 - (-1)) / (650 - 5) * (x - 650) + 1).toFixed(2)) * -1
        var arousal = (((1 - (-1)) / (650 - 3) * (y - 650) + 1).toFixed(2)) * -1
        var angulo = (Math.atan2(valence, -arousal) / (Math.PI / 180)) + 180

        $('#valence').val(valence);
        $('#arousal').val(arousal);
        $('#angulo').val(angulo);
        //Usar atan2() para pegar angulos


        //CONFIGURAÇÃO
        clickX = 86
        clickY = 820

        $("#circulo").css({ "margin-left": e.pageX - clickX, "margin-top": e.pageY - clickY - offset.top + 165, "visibility": "initial" });
        console.log("X: " + e.pageX + " Y: " + e.pageY);
    });

});

$(document).ready(function () {
    $('.semantic1').click(function (e) {
        var offset = $(this).offset();
        var x = e.pageX - offset.left
        var y = e.pageY - offset.top

        var valence = (((1 - (-1)) / (650 - 5) * (x - 650) + 1).toFixed(2)) * -1
        var arousal = (((1 - (-1)) / (650 - 3) * (y - 650) + 1).toFixed(2)) * -1
        var angulo = (Math.atan2(valence, -arousal) / (Math.PI / 180)) + 180

        $('#valence1').val(valence);
        $('#arousal1').val(arousal);
        $('#angulo1').val(angulo);


        //CONFIGURAÇÃO
        clickX = 86
        clickY = 905

        $("#circulo1").css({ "margin-left": e.pageX - clickX, "margin-top": e.pageY - clickY - offset.top + 250, "visibility": "initial" });
        console.log("X: " + e.pageX + " Y: " + e.pageY);
    });

});



$(".som").mouseover(function () {
    audio.play();
});
$(".som").mouseout(function () {
    audio.pause();
});

$(document).ready(function () {

    var currentValue = $('#currentValue');
    var currentValue2 = $('#currentValue2');
    var currentValue3 = $('#currentValue3');
    var currentValue4 = $('#currentValue4');

    $('#defaultSlider').change(function () {
        currentValue.html(this.value);
        $(this).val(parseFloat($(this).val()).toFixed(2));
    });

    $('#defaultSlider2').change(function () {
        currentValue2.html(this.value);
    });

    $('#defaultSlider3').change(function () {
        currentValue3.html(this.value);
    });

    $('#defaultSlider4').change(function () {
        currentValue4.html(this.value);
    });

    // Trigger the event on load, so
    // the value field is populated:

    $('#defaultSlider').change();
    $('#defaultSlider2').change();
    $('#defaultSlider3').change();
    $('#defaultSlider4').change();

});

$(document).ready(function () {

    var currentValue = $('#1currentValue');
    var currentValue2 = $('#1currentValue2');
    var currentValue3 = $('#1currentValue3');
    var currentValue4 = $('#1currentValue4');

    $('#1defaultSlider').change(function () {
        currentValue.html(this.value);
        $(this).val(parseFloat($(this).val()).toFixed(2));
    });

    $('#1defaultSlider2').change(function () {
        currentValue2.html(this.value);
    });

    $('#1defaultSlider3').change(function () {
        currentValue3.html(this.value);
    });

    $('#1defaultSlider4').change(function () {
        currentValue4.html(this.value);
    });

    // Trigger the event on load, so
    // the value field is populated:

    $('#1defaultSlider').change();
    $('#1defaultSlider2').change();
    $('#1defaultSlider3').change();
    $('#1defaultSlider4').change();

});



$('#btnS0').click(async function () {
    'use strict';

    await chrome.storage.local.set({
        'valence': $('#defaultSlider').val(),
        'arousal': $('#defaultSlider2').val(),
        'conclusion': $('#defaultSlider3').val(),
        'control': $('#defaultSlider4').val(),
    });

    console.log("Iniciando calculo da moda para o oitante inicial")

    console.log("Valores core", "Valencia:", $('#defaultSlider').val(), "Arousal: ", $('#defaultSlider2').val(), "Conclusion: ", $('#defaultSlider3').val(), "Controle: ", $('#defaultSlider4').val())

    const getStorageData = () =>
        new Promise((resolve) => {
            chrome.storage.local.get(null, resolve);
        });

    const data = await getStorageData();

    var array_oitantes = Array.from([data.oitante_valence00, data.oitante_valence01, data.oitante_arousal00, data.oitante_arousal01, data.oitante_control00, data.oitante_control01, data.oitante_conclusion00, data.oitante_conclusion01, data.oitante_inicial_camera, data.gsr_oitante, data.ecg_oitante, data.eeg_oitante]);
    var moda = mode(array_oitantes);
    let resultante_inicial

    if (moda.length > 1) {
        let resultante_inicial_moda = mean(moda);
        resultante_inicial = Math.round(resultante_inicial_moda);
    } else {
        resultante_inicial = moda[0];
    }

    chrome.storage.local.set({
        'moda_resultante_inicial': resultante_inicial,
    });

});

$('#btnS01').click(function () {
    'use strict';
    chrome.storage.local.set({
        'valence1': $('#1defaultSlider').val(),
        'arousal1': $('#1defaultSlider2').val(),
        'conclusion1': $('#1defaultSlider3').val(),
        'control1': $('#1defaultSlider4').val(),
    });
    chrome.storage.local.get(function (data) {
        var angulo = (Math.atan2(data.valence, -data.arousal) / (Math.PI / 180)) + 180
        var angulo1 = (Math.atan2(data.valence1, -data.arousal1) / (Math.PI / 180)) + 180
        console.log(angulo);
        var tempo_alteracao = data.tempo;


        //Reset das regras das cores, permitindo o funcionando do "Alterar Perfil"
        chrome.storage.local.set({
            'rule39': '0'
        });
        chrome.storage.local.set({
            'rule40': '0'
        });
        chrome.storage.local.set({
            'rule41': '0'
        });
        chrome.storage.local.set({
            'rule42': '0'
        });
        chrome.storage.local.set({
            'rule43': '0'
        });
        chrome.storage.local.set({
            'rule44': '0'
        })
        chrome.storage.local.set({
            'rule45': '0'
        })
        chrome.storage.local.set({
            'rule46': '0'
        })
        chrome.storage.local.set({
            'rule47': '0'
        })
        chrome.storage.local.set({
            'rule48': '0'
        })

        //Flags para espera
        chrome.storage.local.set({
            'flag': "1"
        });
        chrome.storage.local.set({
            'flag1': "0"
        });

        chrome.storage.local.set({
            'flag_cor': '0',
            'flag_fonte': '0'
        });

        chrome.storage.local.set({
            'perfilusuarioemocao': 1
        });
        chrome.storage.local.set({
            'gerouemocao': 0
        });
        chrome.storage.local.set({
            'tempo_alteracao': tempo_alteracao
        });

    });

});

$('#btnS1').click(function () {
    'use strict';
    chrome.storage.local.set({
        'locomocao': $('input[name="locomocao"]:checked').val()
    });
    audio.play();
});

$('#btnS2').click(function () {
    'use strict';
    chrome.storage.local.set({
        'audicao': $('input[name="audicao"]:checked').val()
    });
    chrome.storage.local.get(function (data) {
        if (data.audicao == 1) {
            chrome.storage.local.set({
                'mailson': 2
            });
        }
    });
    audio.pause();
});

$('#btnS3').click(function () {
    'use strict';
    chrome.storage.local.set({
        'fala': $('input[name="fala"]:checked').val()
    });
});
$('#btnS4').click(function () {
    'use strict';
    var vi = $('#visao-1').is(':checked') ? 1 : 2;
    chrome.storage.local.set({
        'visao1': vi
    });
    chrome.storage.local.set({
        'visao2': $('#visao-2').is(':checked') ? 1 : 2
    });
    chrome.storage.local.set({
        'visao3': $('#visao-3').is(':checked') ? 1 : 2
    });
});
$('#btnS5').click(function () {
    'use strict';
    chrome.storage.local.set({
        'daltonismo': $('input[name="daltonismo"]:checked').val()
    });
    chrome.storage.local.set({
        'daltonismo2': $('input[name="daltonismo2"]:checked').val()
    });
    chrome.storage.local.set({
        'perfilusuario': 1
    });
    chrome.storage.local.set({
        'gerou': 0
    });

    // chrome.storage.local.get(function(data) {

    //     $.getJSON("http://slifes.dc.ufscar.br/uiflex/rules.json", function(json) {
    //         console.log(json);
    //         //alert(json[0].context.user.predicate);


    //         chrome.storage.local.set({
    //             'flag_cor': '0',
    //             'flag_fonte': '0'
    //         });
    //         //////////Regras antigas(UIFLex)
    //         for (var i in json) {
    //             if (json[i].id == "rule12" && json[i].context.user.predicate == "AbilityToHear" && json[i].context.user.object == "no" && data.audicao == 2) {
    //                 chrome.storage.local.set({
    //                     'rule12': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule13" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "low" && (data.visao2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule13': '1',
    //                     'flag_fonte': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule8" && json[i].context.user.predicate == "AbilityToDifferentiateColors" && json[i].context.user.object == "no" && (data.daltonismo == 2 || data.daltonismo2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule8': '1',
    //                     'flag_cor': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule5" && json[i].context.user.predicate == "AbilityToDifferentiateColors" && json[i].context.user.object == "no" && (data.daltonismo == 2 || data.daltonismo2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule5': '2',
    //                     'flag_cor': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule6" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "no" && data.visao1 == 2 && data.visao2 == 2 && data.visao3 == 2) {
    //                 chrome.storage.local.set({
    //                     'rule6': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule9"&& (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule9': '1',
    //                     'flag_cor': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule10" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "low" && (data.visao1 == 2 || data.visao2 == 2 || data.visao3 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule10': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule11" && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule11': '1',
    //                     'flag_cor': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule14" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "medium" && (data.visao3 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule14': '1',
    //                     'flag_fonte': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule33" && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule33': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule34" && json[i].context.user.predicate == "AbilityToSee" && json[i].context.user.object == "no" && (data.visao1 == 2 && data.visao2 == 2 && data.visao3 == 2)) {
    //                 chrome.storage.local.set({
    //                     'rule34': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule35" && json[i].context.user.predicate == "AbilityToDifferentiateColors" && json[i].context.user.object == "no" && (data.daltonismo == 2 || data.daltonismo2 == 2) && (data.visao1 != 2 || data.visao2 != 2 || data.visao3 != 2)) {
    //                 chrome.storage.local.set({
    //                     'rule35': '1',
    //                     'flag_cor': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule36") {
    //                 chrome.storage.local.set({
    //                     'rule36': '1'
    //                 });
    //             }
    //             if (json[i].id == "rule7") {
    //                 chrome.storage.local.set({
    //                     'rule7': '1'
    //                 });
    //             }

    //         }

    //     }).fail(function() {
    //         alert("Não foi possível obter as regras de design");
    //     });
    // });

});

$('#btnS6').click(function () {
    'use strict';
    sleep_pause(180000); //Pausar por 3 minutos(180 segundos)

    $.getJSON("http://slifes.dc.ufscar.br/uiflex/oitanteresultantefinal.json", function (json_teste) {
        chrome.storage.local.set({
            'resultante_final': json_teste[0].resultante_final
        });
    })

});

(function () {
    'use strict';
    var dialogButton = document.querySelector('.dialog-button');
    var dialog = document.querySelector('#dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialogButton.addEventListener('click', function () {
        dialog.showModal();
    });
    dialog.querySelector('button:not([disabled])')
        .addEventListener('click', function () {
            dialog.close();
            window.setTimeout(function () {
                window.location.href = "perfil.html";
            }, 500);
        });
}());


(function () {
    'use strict';
    // Stepper non-linear demonstration
    var demoNonLinear = function (e) {
        var element = document.querySelector('.mdl-stepper#demo-stepper-non-linear');

        if (!element) {
            return;
        }

        var stepper = element.MaterialStepper;
        var steps = element.querySelectorAll('.mdl-step');
        var step;

        for (var i = 0; i < steps.length; i++) {
            step = steps[i];
            step.addEventListener('onstepnext', function (e) {
                stepper.next();
            });
        }
        element.addEventListener('onsteppercomplete', function (e) {
            var toast = document.querySelector('#snackbar-stepper-complete');

            if (!toast) return false;

            toast.MaterialSnackbar.showSnackbar({
                message: 'Stepper non-linear are completed',
                timeout: 4000,
                actionText: 'Ok'
            });
        });
    };

    window.addEventListener('load', demoNonLinear);
})();

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mean(numbers) {
    let total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}


function sleep_pause(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}
