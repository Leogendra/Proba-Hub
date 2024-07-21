// tirages
const input_tirages = document.querySelectorAll('.input-tirages');
const input_probas_objets = document.querySelector('#input-probas-objets');
const input_probas_tirages = document.querySelector('#input-probas-tirages');
const input_probas_objets_diff = document.querySelector('#input-probas-objets-diff');
const input_probas_tirages_diff = document.querySelector('#input-probas-tirages-diff');

const radios_tirages = document.querySelectorAll('.radio-tirages');
const radio_pourcent = document.querySelector('#radio-pourcent');
const radio_chance = document.querySelector('#radio-chance');
const radio_remise = document.querySelector('#radio-remise');
const radio_sans_remise = document.querySelector('#radio-sans-remise');

const div_proba_tirages_result = document.querySelector('.div-proba-tirages-result');

// binomiale
const input_binom = document.querySelectorAll('.input-binom');
const input_binom_n = document.querySelector('#input-binom-essais');
const input_binom_p = document.querySelector('#input-binom-proba');
const input_binom_k = document.querySelector('#input-binom-succes');

const radios_binom = document.querySelectorAll('.radio-binom');
const radio_inf = document.querySelector('#radio-succes-inf');
const radio_sup = document.querySelector('#radio-succes-sup');
const radio_egal = document.querySelector('#radio-succes-egal');

const div_proba_binom_result = document.querySelector('.div-proba-binom-result');





function factorielle(n) {
    return math.factorial(n);
}


function combinaison(k, n) {
    return factorielle(n) / (factorielle(k) * factorielle(n - k));
}


function arrangement(k, n) {
    return factorielle(n) / factorielle(n - k);
}


function formaterProbabilite(prob) {
    const formattedProb = (prob * 100).toFixed(2);
    if (parseFloat(formattedProb) === 0) {
        return (prob * 100).toExponential(1);
    }
    return formattedProb;
}


function calculateProbabilityTirage() {
   
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    input_tirages.forEach(function(input_tirage) {
        if (input_tirage.value == '' || parseFloat(input_tirage.value) < 0) {
            isAllFilled = false;
        }
    });

    if (isAllFilled) {
        const N = parseInt(input_probas_objets.value);
        const m = parseInt(input_probas_objets_diff.value);
        const n = parseInt(input_probas_tirages.value);
        const k = parseInt(input_probas_tirages_diff.value);
        
        const avecRemise = radio_remise.checked;
        let probabilite;
        
        if (avecRemise) {
            probabilite = combinaison(k, m) * Math.pow((1 / N), k) * Math.pow((1 - 1 / N), m - k);
        } 
        else {
            probabilite = combinaison(k, m) * combinaison(n - k, N - m) / combinaison(n ,N);
        }

        probabiliteFormatee = formaterProbabilite(probabilite);
        
        const resultatsPourcent = radio_pourcent.checked;
        if (resultatsPourcent) {
            div_proba_tirages_result.textContent = `${probabiliteFormatee}%`;
        }
        else {
            let chanceSur = (1 / (probabiliteFormatee/100)).toFixed(0)
            div_proba_tirages_result.textContent = `1 chance sur ${chanceSur}`;
        }
    }
        
}


function calculateProbabilityBinom() {
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    input_binom.forEach(function(input_binom) {
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
    


// update si les champs sont mis à jour
input_tirages.forEach(function(input_tirage) {
    input_tirage.addEventListener('input', function() {
        calculateProbabilityTirage();
    });
});

// update si les champs sont mis à jour
radios_tirages.forEach(function(radio_tirage) {
    radio_tirage.addEventListener('change', function() {
        calculateProbabilityTirage();
    });
});

// update si les champs sont mis à jour
input_binom.forEach(function(input_binom) {
    input_binom.addEventListener('input', function() {
        calculateProbabilityBinom();
    });
});

// update si les champs sont mis à jour
radios_binom.forEach(function(radio_binom) {
    radio_binom.addEventListener('change', function() {
        calculateProbabilityBinom();
    });
});