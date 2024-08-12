const input_tarot_cartes = document.querySelector("#input-tarot-cartes");
const div_tarot_result = document.querySelector("#div-tarot-result");



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
            chiffre = "E"; // L'excuse
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

    if (input_tarot_cartes.value !== '') {

        const hand = parseTarotHand(input_tarot_cartes.value);
        // si on a bien une liste
        if (Array.isArray(hand)) {
            input_tarot_cartes.classList.remove('input-error');

            // const proba = tarotProbabiliteMain(hand).toFixed(2);
            const proba = "Wola tu gagneras jamais";
            div_tarot_result.innerText = `Probabilité de cette main: ${proba}%`;
        }
        else {
            input_tarot_cartes.classList.add('input-error');
            if (typeof hand === "string") {
                div_tarot_result.innerText = hand;
            }
            else {
                div_tarot_result.innerText = "";
            }
        }
    }
}







input_tarot_cartes.addEventListener('input', function () {
    calculerProbabiliteMainTarot();
});