// Tirages
const inputs_tirages = document.querySelectorAll('.input-tirages');
const input_probas_objets = document.querySelector('#input-probas-objets');
const input_probas_tirages = document.querySelector('#input-probas-tirages');
const input_probas_objets_diff = document.querySelector('#input-probas-objets-diff');
const input_probas_tirages_diff = document.querySelector('#input-probas-tirages-diff');

const radios_tirages = document.querySelectorAll('.radio-tirages');
const radio_remise = document.querySelector('#radio-remise');
const radio_sans_remise = document.querySelector('#radio-sans-remise');

const div_proba_tirages_result = document.querySelector('#div-proba-tirages-result');



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
    const formattedProb = (prob * 100).toFixed(3);
    if (parseFloat(formattedProb) === 0) {
        let exp = (prob * 100).toExponential(1);
        let [_, exponent] = exp.split('e'); // Séparer le coefficient et l'exposant
        let exponentValue = parseInt(exponent, 10); // Convertir l'exposant en entier
        return `10^${exponentValue}`;
    }
    if (parseFloat(formattedProb) <= 0) {
        return 0;
    }
    return formattedProb;
}


function formaterChiffre(chiffre) {
    chiffre = chiffre.toFixed(0);
    // ex : si 1000000 -> 1'000'000
    if (chiffre > 999_000_000_000) {
        let exp = (chiffre * 1).toExponential(1);
        let [_, exponent] = exp.split('e'); // Séparer le coefficient et l'exposant
        let exponentValue = parseInt(exponent, 10); // Convertir l'exposant en entier
        return `10^${exponentValue}`;
    }
    else {
        return chiffre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }
}


function calculateProbabilityTirage() {
   
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    inputs_tirages.forEach(function(input_tirage) {
        if (input_tirage.value == '' || parseFloat(input_tirage.value) < 0) {
            isAllFilled = false;
            if (input_tirage.value != '') {
                input_tirage.classList.add('input-error');
            }
        }
        else if (parseFloat(input_tirage.value) > 10000) {
            input_tirage.classList.add('input-error');
        }
        else {
            input_tirage.classList.remove('input-error');
        }
    });
    // N >= m 
    if (parseInt(input_probas_objets.value) < parseInt(input_probas_objets_diff.value)) {
        input_probas_objets.classList.add('input-error');
        input_probas_objets_diff.classList.add('input-error');
        isAllFilled = false;
    }
    else {
        input_probas_objets.classList.remove('input-error');
        input_probas_objets_diff.classList.remove('input-error');
    }
    // n >= k
    if (parseInt(input_probas_tirages.value) < parseInt(input_probas_tirages_diff.value)) {
        input_probas_tirages.classList.add('input-error');
        input_probas_tirages_diff.classList.add('input-error');
        isAllFilled = false;
    }
    else {
        input_probas_tirages.classList.remove('input-error');
        input_probas_tirages_diff.classList.remove('input-error');
    }

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
        let chanceSur = (1 / (probabiliteFormatee/100));
        div_proba_tirages_result.textContent = `${probabiliteFormatee}% (1 chance sur ${formaterChiffre(chanceSur)})`;
    }
    else {
        div_proba_tirages_result.textContent = "";
    }
}



// update si les champs sont mis à jour
inputs_tirages.forEach(function(input_tirage) {
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