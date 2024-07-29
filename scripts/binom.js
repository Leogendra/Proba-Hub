const inputs_binom = document.querySelectorAll('.input-binom');
const input_binom_n = document.querySelector('#input-binom-essais');
const input_binom_p = document.querySelector('#input-binom-proba');
const input_binom_k = document.querySelector('#input-binom-succes');

const radios_binom = document.querySelectorAll('.radio-binom');
const radio_inf = document.querySelector('#radio-succes-inf');
const radio_sup = document.querySelector('#radio-succes-sup');
const radio_egal = document.querySelector('#radio-succes-egal');

const div_proba_binom_result = document.querySelector('#div-proba-binom-result');




function calculateProbabilityBinom() {
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    inputs_binom.forEach(function(input_binom) {
        if (input_binom.value == '' || parseFloat(input_binom.value) < 0) {
            isAllFilled = false;
        }
    });

    if (isAllFilled) {
        const n = parseInt(input_binom_n.value);
        const p = parseFloat(input_binom_p.value);
        const k = parseInt(input_binom_k.value);
        
        let probabilite;
        const inf = radio_inf.checked;
        const sup = radio_sup.checked;
        const egal = radio_egal.checked;

        if (inf) {
            probabilite = 0;
            for (let i = 0; i <= k; i++) {
                probabilite += combinaison(i, n) * Math.pow(p, i) * Math.pow(1 - p, n - i);
            }
        }
        else if (sup) {
            probabilite = 0;
            for (let i = k; i <= n; i++) {
                probabilite += combinaison(i, n) * Math.pow(p, i) * Math.pow(1 - p, n - i);
            }
        }
        else if (egal) {
            probabilite = combinaison(k, n) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        }

        probabiliteFormatee = formaterProbabilite(probabilite);
        let chanceSur = (1 / (probabiliteFormatee/100)).toFixed(0)
        div_proba_binom_result.textContent = `${probabiliteFormatee}% (1 chance sur ${chanceSur})`;
    }
}


inputs_binom.forEach(function(input_binom) {
    input_binom.addEventListener('input', function() {
        calculateProbabilityBinom();
    });
});


radios_binom.forEach(function(radio_binom) {
    radio_binom.addEventListener('change', function() {
        calculateProbabilityBinom();
    });
});