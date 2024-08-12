const inputs_tarot = document.querySelectorAll(".input-tarot");
const input_tarot_cartes = document.querySelector("#input-tarot-cartes");
const input_tarot_joueurs = document.querySelector("#input-tarot-joueurs");

const div_tarot_result = document.querySelector("#div-tarot-result");




function tirageSansRemise(N, m, n, k) {
    if ((k > m) || ((n - k) > (N - m))) { 
        return 0; 
    }
    else { 
        return combinaison(k, m) * combinaison(n - k, N - m) / combinaison(n, N); 
    }
}



class TarotGame {
    constructor(cards, nbPlayers) {
        this.hand = cards;
        this.nbPlayers = nbPlayers;
    }

    getHand() {
        return this.hand;
    }

    getNbPlayers() {
        return this.nbPlayers;
    }

    numberOfCards() {
        return this.hand.length;
    }

    tarotProbabiliteMain() {
        const nbCards = this.numberOfCards();
        let arrayProbas = [];
        switch (nbCards) {
            case 1:
                arrayProbas = this.tarotProbabiliteMain1();
                break;
            case 2:
                arrayProbas = this.tarotProbabiliteMain2();
                break;
            case 3:
                arrayProbas = this.tarotProbabiliteMain3();
                break;
            case 4:
                arrayProbas = this.tarotProbabiliteMain4();
                break;
            case 5:
                arrayProbas = this.tarotProbabiliteMain5();
                break;
        }
        return arrayProbas;
    }

    tarotProbabiliteMain1() {
        // on veut juste calculer la proba que des joueurs aient tous plus ou tous moins que nous
        const hand = this.hand;
        const carte = hand[0];
        const nbAdversaires = this.nbPlayers - 1;
        let probas = [0, 0];

        // proba 0 : au moins un joueur a une carte plus grande que nous
        probas[0] = 1 - tirageSansRemise(21, 21 - carte, nbAdversaires, 0);

        // proba 1 : tous les joueurs ont une carte plus petite que nous
        if (carte === 0) {
            probas[1] = 1;
        }
        else {
            probas[1] = tirageSansRemise(21, carte, nbAdversaires, nbAdversaires);
        }
        return probas;
    }

    tarotProbabiliteMain2() { return ["0"]; }
    tarotProbabiliteMain3() { return ["0"]; }
    tarotProbabiliteMain4() { return ["0"]; }
    tarotProbabiliteMain5() { return ["0"]; }



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
            chiffre = "0"; // L'excuse
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
            let formattedProbas = "";
            for (let i = 0; i < probas.length; i++) {
                formattedProbas += `${i} : ${formaterProbabilite(probas[i])}%<br>`;
            }
            div_tarot_result.innerHTML = `Plis pour cette main :<br>${formattedProbas}`;
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