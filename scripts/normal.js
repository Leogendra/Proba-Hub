const inputs_normal = document.querySelectorAll('.input-normal');
const input_normal_moy = document.querySelector('#input-normal-moyenne');
const input_normal_equart = document.querySelector('#input-normal-equart');
const input_normal_inf = document.querySelector('#input-normal-inf');
const input_normal_sup = document.querySelector('#input-normal-sup');

const div_proba_normal_result = document.querySelector('#div-proba-normal-result');


function calculNormale(x, m, e) {
    return (1 / (e * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - m, 2) / (2 * Math.pow(e, 2)));
}


function calculateProbabilityNormal() {
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    inputs_normal.forEach(function(input_normal) {
        if (input_normal.value == '') {
            isAllFilled = false;
            div_proba_normal_result.textContent = "";
        }
    });
    if (input_normal_moy.value == '' || parseFloat(input_normal_moy.value) < 0) {
        isAllFilled = false;
        div_proba_normal_result.textContent = "La moyenne doit être un nombre positif";
    }
    if (input_normal_equart.value == '' || parseFloat(input_normal_equart.value) < 0) {
        isAllFilled = false;
        div_proba_normal_result.textContent = "L'écart-type doit être un nombre positif";
    }
    if (parseFloat(input_normal_inf.value) >= parseFloat(input_normal_sup.value)) {
        isAllFilled = false;
        div_proba_normal_result.textContent = "La borne 'a' doit être inférieure à la borne 'b'";
    }

    if (isAllFilled) {
        const m = parseInt(input_normal_moy.value);
        const e = parseFloat(input_normal_equart.value);
        const a = parseFloat(input_normal_inf.value);
        const b = parseFloat(input_normal_sup.value);
        
        const probA = calculNormale(a, m, e);
        const probB = calculNormale(b, m, e);
        const probabilite = probB - probA;

        probabiliteFormatee = formaterProbabilite(probabilite);
        let chanceSur = (1 / (probabiliteFormatee/100)).toFixed(0)
        div_proba_normal_result.textContent = `${probabiliteFormatee}% (1 chance sur ${chanceSur})`;
    }
}




inputs_normal.forEach(function(input_binom) {
    input_binom.addEventListener('input', function() {
        calculateProbabilityNormal();
    });
});