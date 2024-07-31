const inputs_normal = document.querySelectorAll('.input-normal');
const input_normal_moy = document.querySelector('#input-normal-moyenne');
const input_normal_equart = document.querySelector('#input-normal-equart');
const input_normal_inf = document.querySelector('#input-normal-inf');
const input_normal_sup = document.querySelector('#input-normal-sup');

const div_proba_normal_result = document.querySelector('#div-proba-normal-result');




function normalDensity(x, mean, stdDev) {
    const coeff = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    return coeff * Math.exp(exponent);
}


function probabilityBetween(a, b, mean, stdDev) {
    const step = 0.001; // Précision du calcul
    let total = 0;
    for (let x = a; x < b; x += step) {
        total += normalDensity(x, mean, stdDev) * step;
    }
    return total;
}


function calculateProbabilityNormal() {
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    inputs_normal.forEach(function (input_normal) {
        if (input_normal.value == '') {
            isAllFilled = false;
            div_proba_normal_result.textContent = "";
        }
    });
    if (input_normal_equart.value == '' || parseFloat(input_normal_equart.value) <= 0) {
        isAllFilled = false;
        input_normal_equart.classList.add('input-error');
    }
    else {
        input_normal_equart.classList.remove('input-error');
    }
    if (parseFloat(input_normal_inf.value) >= parseFloat(input_normal_sup.value)) {
        isAllFilled = false;
        input_normal_inf.classList.add('input-error');
        input_normal_sup.classList.add('input-error');
    }
    else {
        input_normal_inf.classList.remove('input-error');
        input_normal_sup.classList.remove('input-error');
    }

    if (isAllFilled) {
        const moy = parseInt(input_normal_moy.value);
        const equart = parseFloat(input_normal_equart.value);
        const a = parseFloat(input_normal_inf.value);
        const b = parseFloat(input_normal_sup.value);

        const probabilite = probabilityBetween(a, b, moy, equart);

        probabiliteFormatee = formaterProbabilite(probabilite);
        let chanceSur = (1 / (probabiliteFormatee / 100));
        div_proba_normal_result.textContent = `${probabiliteFormatee}% (1 chance sur ${formaterChiffre(chanceSur)})`;
    }
    else {
        div_proba_normal_result.textContent = "";
    }
}




inputs_normal.forEach(function (input_binom) {
    input_binom.addEventListener('input', function () {
        calculateProbabilityNormal();
    });
});