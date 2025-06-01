// Tirages
const inputs_tirages = document.querySelectorAll(".input-tirages");
const input_probas_objets = document.querySelector("#input-probas-objets");
const input_probas_tirages = document.querySelector("#input-probas-tirages");
const input_probas_objets_diff = document.querySelector("#input-probas-objets-diff");
const input_probas_tirages_diff = document.querySelector("#input-probas-tirages-diff");

const radios_tirages = document.querySelectorAll(".radio-tirages");
const radio_remise = document.querySelector("#radio-remise");
const radio_sans_remise = document.querySelector("#radio-sans-remise");

const radio_tirage_inf = document.querySelector("#radio-tirage-inf");
const radio_tirage_sup = document.querySelector("#radio-tirage-sup");
const radio_tirage_egal = document.querySelector("#radio-tirage-egal");

const div_proba_tirages_result = document.querySelector("#div-proba-tirages-result");




function factorielle(n) {
    return math.factorial(n);
}


function combinaison(k, n) {
    if (k < 0 || n < 0 || k > n) return 0;
    k = BigInt(Math.min(k, n - k)); // plus petit entre k et n-k pour optimiser le calcul
    n = BigInt(n);
    
    let num = 1n, den = 1n;
    for (let i = 1n; i <= k; i++) {
        num *= n - i + 1n;
        den *= i;
    }
    return parseFloat(num / den);
}



function arrangement(k, n) {
    return factorielle(n) / factorielle(n - k);
}


function formaterProbabilite(prob) {
    if (parseFloat(prob) <= 0) {
        return 0;
    }
    else if (parseFloat(prob) >= 1) {
        return 100;
    }
    const formattedProb = (prob * 100).toFixed(3);
    if (parseFloat(formattedProb) === 0) {
        let exp = (prob * 100).toExponential(1);
        let [_, exponent] = exp.split("e"); // Séparer le coefficient et l"exposant
        let exponentValue = parseInt(exponent, 10); // Convertir l"exposant en entier
        return `10^${exponentValue}`;
    }
    return formattedProb;
}


function formaterChiffre(chiffre) {
    chiffre = chiffre.toFixed(0);
    if (chiffre == "Infinity") {
        return "∞";
    }
    else if (chiffre > 999_000_000_000) {
        let exp = (chiffre * 1).toExponential(1);
        let [_, exponent] = exp.split("e"); // Séparer le coefficient et l'exposant
        let exponentValue = parseInt(exponent, 10); // Convertir l'exposant en entier
        return `10^${exponentValue}`;
    }
    else {
        return chiffre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }
}


function calculerProbabiliteTirage() {

    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    inputs_tirages.forEach(function (input_tirage) {
        if (input_tirage.value == "" || parseFloat(input_tirage.value) < 0) {
            isAllFilled = false;
            if (input_tirage.value != "") {
                input_tirage.classList.add("input-error");
            }
        }
        else if (parseFloat(input_tirage.value) > 10000) {
            input_tirage.classList.add("input-error");
        }
        else {
            input_tirage.classList.remove("input-error");
        }
    });

    const N = parseInt(input_probas_objets.value);
    const m = parseInt(input_probas_objets_diff.value);
    const n = parseInt(input_probas_tirages.value);
    const k = parseInt(input_probas_tirages_diff.value);

    if (N < m) {
        input_probas_objets.classList.add("input-error");
        input_probas_objets_diff.classList.add("input-error");
        isAllFilled = false;
    }
    else {
        input_probas_objets.classList.remove("input-error");
        input_probas_objets_diff.classList.remove("input-error");
    }

    if (n < k) {
        input_probas_tirages.classList.add("input-error");
        input_probas_tirages_diff.classList.add("input-error");
        isAllFilled = false;
    }
    else {
        input_probas_tirages.classList.remove("input-error");
        input_probas_tirages_diff.classList.remove("input-error");
    }

    if (isAllFilled) {
        const inf = radio_tirage_inf.checked;
        const sup = radio_tirage_sup.checked;
        const egal = radio_tirage_egal.checked;

        const avecRemise = radio_remise.checked;
        let probabilite = 0;

        if (inf) {
            if (avecRemise) {
                for (let i = 0; i <= k; i++) {
                    probabilite += combinaison(i, m) * Math.pow((1 / N), i) * Math.pow((1 - 1 / N), m - i);
                }
            }
            else {
                for (let i = 0; i <= k; i++) {
                    if ((i > m) || ((n - i) > (N - m))) { break; }
                    else { probabilite += combinaison(i, m) * combinaison(n - i, N - m) / combinaison(n, N); }
                }
            }
        }
        else if (sup) {
            if (avecRemise) {
                for (let i = k; i <= n; i++) {
                    probabilite += combinaison(i, m) * Math.pow((1 / N), i) * Math.pow((1 - 1 / N), m - i);
                }
            }
            else {
                for (let i = k; i <= n; i++) {
                    if ((i > m) || ((n - i) > (N - m))) { break; }
                    else { probabilite += combinaison(i, m) * combinaison(n - i, N - m) / combinaison(n, N); }
                }
            }
        }
        else if (egal) {
            if (avecRemise) {
                probabilite = combinaison(k, m) * Math.pow((1 / N), k) * Math.pow((1 - 1 / N), m - k);
            }
            else {
                console.log(`Probabilité : ${probabilite}`);
                if ((k > m) || ((n - k) > (N - m))) { probabilite = 0; }
                else { probabilite = combinaison(k, m) * combinaison(n - k, N - m) / combinaison(n, N); }
                console.log(`Probabilité : ${probabilite}, combinaison(k, m) : ${combinaison(k, m)}, combinaison(n - k, N - m) : ${combinaison(n - k, N - m)}, combinaison(n, N) : ${combinaison(n, N)}`);
            }
        }
        else {
            div_proba_tirages_result.textContent = "";
            return;
        }

        let chanceSur = probabilite ? (1 / probabilite) : Infinity;
        probabiliteFormatee = formaterProbabilite(probabilite);
        div_proba_tirages_result.textContent = `${probabiliteFormatee}% (1 chance sur ${formaterChiffre(chanceSur)})`;
    }
    else {
        div_proba_tirages_result.textContent = "";
    }
}




// update si les champs sont mis à jour
inputs_tirages.forEach(function (input_tirage) {
    input_tirage.addEventListener("input", function () {
        calculerProbabiliteTirage();
    });
});


radios_tirages.forEach(function (radio_tirage) {
    radio_tirage.addEventListener("change", function () {
        calculerProbabiliteTirage();
    });
});