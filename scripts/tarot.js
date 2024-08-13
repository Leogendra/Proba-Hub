const inputs_tarot = document.querySelectorAll(".input-tarot");
const input_tarot_cartes = document.querySelector("#input-tarot-cartes");
const input_tarot_joueurs = document.querySelector("#input-tarot-joueurs");

const div_tarot_result = document.querySelector("#div-tarot-result");




function max(a, b) {
    return a > b ? a : b;
}


function tirageSansRemise(N, m, n, k) {
    if ((k > m) || ((n - k) > (N - m))) {
        return 0;
    }
    else {
        return combinaison(k, m) * combinaison(n - k, N - m) / combinaison(n, N);
    }
}


function genererSequenceBinaire(n) {
    const sequences = Array.from({ length: n + 1 }, () => Array(n).fill(1));
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            sequences[i][n-j-1] = 0;
        }
    }
    return sequences;
}



class TarotGame {
    constructor(cards, nbPlayers) {
        this.hand = cards.sort((a, b) => a - b);
        this.nbPlayers = nbPlayers;
    }

    getHand() {
        return this.hand;
    }

    getNbPlayers() {
        return this.nbPlayers;
    }

    getNbPlis() {
        return this.hand.length;
    }

    isPossedeExcuse() {
        return this.hand.includes(0);
    }

    tarotProbabiliteMain() {
        const hand = this.getHand();
        const nbAdversaires = this.getNbPlayers() - 1;
        const nbPlis = this.getNbPlis();

        let arrayProbas = Array(nbPlis).fill(0);
        const poids = genererSequenceBinaire(nbPlis);

        for (let i = 0; i <= nbPlis; i++) {
            let possedeExcuse = this.isPossedeExcuse();
            arrayProbas[i] = 1;
            for (let j = 0; j < nbPlis; j++) {
                if (hand[j] === 0) {
                    continue;
                }
                let carte = hand[j];
                let nombreCartesInferieures = max(carte - j, 0);
                if (!possedeExcuse && (nombreCartesInferieures === (22-nbPlis))) { 
                    nombreCartesInferieures -= 1; 
                    possedeExcuse = true;
                }
                const probabiliteCarteToutesInferieures = tirageSansRemise(22-nbPlis, nombreCartesInferieures, nbAdversaires, nbAdversaires);
                if (poids[i][j] === 1) { // on veut pas le pli, au moins un joueur à une carte supérieure
                    arrayProbas[i] *= 1 - probabiliteCarteToutesInferieures;
                }
                else {
                    arrayProbas[i] *= probabiliteCarteToutesInferieures;
                }
            }
        }
        return arrayProbas;
    }

}

function parseTarotHand(hand_input) {
    const cartes_raw = hand_input.trim().toUpperCase().split(" ");
    if ((cartes_raw.length > 5) || (cartes_raw.length < 1)) {
        return "Nombre de cartes invalide";
    }

    let cards = [];
    for (const carte of cartes_raw) {
        if ((carte.length !== 1) && (carte.length !== 2)) { // On vérifie la longueur de la carte
            return `Carte ${carte} invalide`;
        }

        let chiffre;
        // On vérifie que la carte est soit un chiffre entre 1 et 21, soit une ou deux lettres
        if (isNaN(carte)) {
            chiffre = 0; // L'excuse
        }
        else {
            chiffre = parseInt(carte);
            if ((chiffre < 1) || (chiffre > 21)) {
                return `Valeur ${carte} invalide`;
            }
        }
        cards.push(chiffre);
    }
    // on check qu'il y ait pas de doublons
    if (new Set(cards).size !== cards.length) {
        return "Doublons dans la main";
    }
    return cards;
}


function calculerProbabiliteMainTarot() {

    let isAllFilled = true;
    inputs_tarot.forEach(function (input_tarot) {
        if (input_tarot.value == '') {
            isAllFilled = false;
            div_tarot_result.innerHTML = "";
        }
    });

    if (isAllFilled) {

        let hand = parseTarotHand(input_tarot_cartes.value);
        let nbPlayers = parseInt(input_tarot_joueurs.value);
        // si on a bien une liste
        if (Array.isArray(hand)) {
            input_tarot_cartes.classList.remove('input-error');
            hand = new TarotGame(hand, nbPlayers);

            const probas = hand.tarotProbabiliteMain();
            if (typeof probas === "string") {
                div_tarot_result.innerHTML = probas;
            }
            else {
                let formattedProbas = "";
                for (let i = 0; i < probas.length; i++) {
                    let chanceSur = (1 / probas[i]);
                    formattedProbas += `${i} : ${formaterProbabilite(probas[i])}% (1 chance sur ${formaterChiffre(chanceSur)})<br>`;
                }
                div_tarot_result.innerHTML = `Plis pour cette main :<br>${formattedProbas}`;
            }
        }
        else {
            input_tarot_cartes.classList.add('input-error');
            if (typeof hand === "string") {
                div_tarot_result.innerHTML = hand;
            }
            else {
                div_tarot_result.innerHTML = "";
            }
        }
    }
}





inputs_tarot.forEach(function (input_tarot) {
    input_tarot.addEventListener('input', function () {
        calculerProbabiliteMainTarot();
    });
});