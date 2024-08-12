const input_poker_cartes = document.querySelector("#input-poker-cartes");
const div_poker_explications = document.querySelector(".div-poker-explications");

const radios_poker = document.querySelectorAll('.radio-poker');
const radio_poker_fr = document.querySelector('#radio-poker-fr');
const radio_poker_en = document.querySelector('#radio-poker-en');

const div_poker_result = document.querySelector("#div-poker-result");

const types_mains = {
    "quinte_flush": 1,
    "carre": 2,
    "full_house": 3,
    "couleur": 4,
    "quinte": 5,
    "brelan": 6,
    "deux_paires": 7,
    "paire": 8,
    "carte_haute": 9,
}

const combinaisons_mains = {
    1: 41584, // Quinte flush
    2: 224848, // Carré
    3: 3473184, // Full
    4: 4047644, // Couleur
    5: 6180020, // Quinte
    6: 6461620, // Brelan
    7: 31433400, // Deux paires
    8: 58627800, // Paire
    9: 23294460, // Carte haute
    "total": 133784560,
};

const suites = [
    '2 3 4 5 6',
    '3 4 5 6 7',
    '4 5 6 7 8',
    '5 6 7 8 9',
    '6 7 8 9 10',
    '7 8 9 10 11',
    '8 9 10 11 12',
    '9 10 11 12 13',
    '10 11 12 13 14',
    '14 2 3 4 5',
]

class PokerHand {
    constructor(cards) {
        this.hand = cards.trim();
    }

    getHandProbability() {
        const handType = this.getHandType();
        const gagnantes = combinaisons_mains[handType];
        const totalCombinaisons = combinaisons_mains.total;
        return gagnantes / totalCombinaisons;
    }

    getProbabilityBeating() {
        const handType = this.getHandType();
        let total = 0;
        for (const key in combinaisons_mains) {
            if (key !== "total" && key > handType) {
                total += combinaisons_mains[key];
            }
        }

        // calculer la probabilité de de notre carte haute par rapport aux autres
        let highCard = "0";
        if (handType === types_mains.carte_haute) {
            highCard = this.maxFace();
        }
        else if (handType === types_mains.paire) {
            let faces = this.facesOfset(2);
            highCard = Math.max(...faces);
        }
        else if (handType === types_mains.deux_paires) {
            const faces = this.facesOfset(2);
            highCard = Math.max(...faces);
        }
        else if (handType === types_mains.brelan) {
            const faces = this.facesOfset(3);
            highCard = Math.max(...faces);
        }
        else if (handType === types_mains.quinte) {
            highCard = this.maxFace();
        }
        else if (handType === types_mains.couleur) {
            highCard = this.maxFace();
        }
        else if (handType === types_mains.full_house) {
            let faces = this.facesOfset(3);
            highCard = Math.max(...faces);
        }
        else if (handType === types_mains.carre) {
            let faces = this.facesOfset(4);
            highCard = Math.max(...faces);
        }
        else if (handType === types_mains.quinte_flush) {
            highCard = this.maxFace();
        }

        const highCardProba = (highCard - 1) / 14; // on est pas sur de gagner, donc on retire 1 pour l'égalité
        total += highCardProba * combinaisons_mains[handType]; // ajouter la probabilité de la carte haute
        return total / combinaisons_mains.total;
    }

    getValue(key) {
        return {
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            'T': 10,
            'J': 11,
            'Q': 12,
            'K': 13,
            'A': 14
        }[key];
    }

    sortHand() {
        const cards = this.getCards();
        return cards.sort((a, b) => this.getValue(this.getFace(a)) > this.getValue(this.getFace(b)) ? 1 : -1);
    }

    getHandType() {
        if (this.isQuinteFlush())
            return types_mains.quinte_flush;
        else if (this.isCarre())
            return types_mains.carre;
        else if (this.isFullHouse())
            return types_mains.full_house;
        else if (this.isCouleur())
            return types_mains.couleur;
        else if (this.isSuite())
            return types_mains.quinte;
        else if (this.isBrelan())
            return types_mains.brelan;
        else if (this.isDeuxPaires())
            return types_mains.deux_paires;
        else if (this.isPaire())
            return types_mains.paire;
        else if (this.isCarteHaute())
            return types_mains.carte_haute;

        return false;
    }

    getHandName() {
        const handType = this.getHandType();
        switch (handType) {
            case 1:
                return "Quinte flush";
            case 2:
                return "Carré";
            case 3:
                return "Full";
            case 4:
                return "Couleur";
            case 5:
                return "Quinte";
            case 6:
                return "Brelan";
            case 7:
                return "Deux paires";
            case 8:
                return "Paire";
            case 9:
                return "Carte haute";
        }
    }

    sameFace() {
        const cards = this.getCards();
        return cards.every(e => this.getFace(e) === this.getFace(cards[0]));
    }

    sameSuit() {
        const cards = this.getCards();
        return cards.every(e => this.getSuit(e) === this.getSuit(cards[0]));
    }

    getFace(card) {
        return card.length === 3 ? card.substr(0, 2) : card[0];
    }

    getSuit(card) {
        return card.length === 3 ? card.substr(2, 3) : card[1];
    }

    getCards() {
        return this.hand.split(" ");
    }

    // Retourne la valeur de la carte la plus haute
    maxFace() {
        return this.getValue(this.getFace(this.sortHand().pop()));
    }

    // Retourne les valeurs des cartes ayant une occurence donnée
    facesOfset(set) {
        let map = this.countOccurences();
        let result = [];
        Object.keys(map).forEach(face => {
            if (map[face] === set)
                result.push(this.getValue(face));
        });
        return result;
    }

    // Retourne les valeurs des cartes
    handValues() {
        return this.getCards().map(c => this.getValue(this.getFace(c)));
    }

    // Retourne le nombre d'occurences de chaque carte
    countOccurences() {
        let map = {};
        let cards = this.getCards();

        cards.forEach(card => {
            let suit = this.getFace(card);
            if (map[suit] !== undefined) {
                map[suit]++;
            }
            else {
                map[suit] = 1;
            }
        });

        return map;

    }

    countPairesEtBrelans(type) {
        const map = this.countOccurences();
        const num = (type === 'p') ? 2 : 3;
        let count = 0;
        for (const prop in map)
            if (map[prop] === num)
                count++;
        return count;
    }

    isQuinteFlush() {
        return this.sameSuit() && this.isSuite();
    }
    isCarre() {
        return Object.values(this.countOccurences()).filter(e => e === 4).length > 0;
    }
    isFullHouse() {
        return this.countPairesEtBrelans('t') === 1 && this.countPairesEtBrelans('p') === 1;
    }
    isCouleur() {
        return this.sameSuit();
    }
    isSuite() {
        return suites.includes(this.handValues().sort().join(' ')) && Object.keys(this.countOccurences()).length === 5;
    }
    isBrelan() {
        return this.countPairesEtBrelans('t');
    }
    isDeuxPaires() {
        return this.countPairesEtBrelans('p') === 2;
    }
    isPaire() {
        return this.countPairesEtBrelans('p') === 1;
    }
    isCarteHaute() {
        return this.getCards().filter((v, i, a) => a.indexOf(v) === i).length === 5;
    }
}



function parsePokerHand(hand_input) {
    const cartes_raw = hand_input.trim().toUpperCase().split(" ");
    if ((cartes_raw.length > 5) || (cartes_raw.length < 2)) {
        return "Nombre de cartes invalide";
    }

    let cards = [];
    for (const carte of cartes_raw) {
        if ((carte.length !== 2) && (carte.length !== 3)) { // On vérifie la longueur de la carte
            return `Carte ${carte} invalide`;
        }

        let chiffre;
        if (carte.length === 3) {
            if (carte.substring(0, 2) !== "10") { // On vérifie que la carte est bien un 10
                return `Chiffre de ${carte} inconnu`;
            }
            else {
                chiffre = 'T';
            }
        }
        else {
            const rawChiffre = carte[0];
            // On vérifie que le chiffre est dans la liste
            if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A', 'V', 'D', 'R'].includes(rawChiffre)) {
                return `Chiffre de ${carte} inconnu`;
            }
            // On transforme les V -> J
            const table_mapping = {
                'V': 'J',
                'D': 'Q',
                'R': 'K',
                '1': 'A'
            }
            chiffre = table_mapping[rawChiffre] || rawChiffre;
        }

        let couleur = carte[carte.length - 1];
        if (radio_poker_fr.checked) {
            if (!['T', 'C', 'P', 'K'].includes(couleur)) { // Trèfle, Coeur, Pique, Carreau
                return `Couleur de ${carte} inconnue`;
            }
            else {
                const table_mapping = {
                    'T': 'C',
                    'C': 'H',
                    'P': 'S',
                    'K': 'D',
                }
                couleur = table_mapping[couleur];
            }
        }
        else {
            if (!['C', 'H', 'S', 'D'].includes(couleur)) { // Clubs, Hearts, Spades, Diamonds
                return `Couleur de ${carte} inconnue`;
            }
        }
        cards.push(chiffre + couleur);
    }

    // on check qu'il y ait pas de doublons
    if (new Set(cards).size !== cards.length) {
        return "Doublons dans la main";
    }

    if (cards.length === 5) {
        return new PokerHand(cards.join(" "));
    }
    else {
        // TODO: On a une main incomplète
        return "Main incomplète";
    }
}


function calculerProbabiliteMainPoker() {

    if (input_poker_cartes.value !== '') {

        const cartes = parsePokerHand(input_poker_cartes.value);
        if (cartes instanceof PokerHand) {
            input_poker_cartes.classList.remove('input-error');
            let probaVictoire = (100 * cartes.getProbabilityBeating()).toFixed(3);
            div_poker_result.innerHTML = `Type de main : <span class="special">${cartes.getHandName()}</span></br>Vous battez ${probaVictoire}% des mains`;
        }
        else {
            input_poker_cartes.classList.add('input-error');
            if (cartes === undefined) {
                div_poker_result.innerHTML = "";
            }
            else {
                div_poker_result.innerHTML = cartes;
            }
        }
    }

}


input_poker_cartes.addEventListener('input', function () {
    calculerProbabiliteMainPoker();
});

radios_poker.forEach(function (radio_poker) {
    radio_poker.addEventListener('change', function () {
        calculerProbabiliteMainPoker();
        if (radio_poker_fr.checked) {
            // mettre les emojis correspondant aux couleurs
            div_poker_explications.innerHTML = ['♣️:T', '<span class="special">♥️</span>:C', '♠️:P', '<span class="special">♦️</span>:K'].join(',&nbsp;');
        }
        else {
            div_poker_explications.innerHTML = ['♣️:C', '<span class="special">♥️</span>:H', '♠️:S', '<span class="special">♦️</span>:D'].join(',&nbsp;');
        }
    });
});

















function tests() {
    let all_players = [
        new PokerHand("TH JH QH KH AH"), // Quinte flush
        new PokerHand("AS AC AD AH QD"), // Carre
        new PokerHand("2H 2S 3H 3S 3D"), // Full
        new PokerHand("2H 4H 5H 7H 9H"), // Couleur
        new PokerHand("2H 3D 4S 5H 6H"), // Quinte
        new PokerHand("2H 2S 2D 3H 4H"), // Brelan
        new PokerHand("2H 2S 3H 3S 4H"), // Deux paires
        new PokerHand("2H 2S 3H 4S 5H"), // Paire
        new PokerHand("2H 3D 5S 9C KD"), // Carte haute
    ];
    for (const player of all_players) {
        let probaVictoire = (100 * player.getProbabilityBeating()).toFixed(3);
        console.log(`Main 1 : ${player.hand}, type : ${player.getHandName()}, proba : ${probaVictoire}%`);
    }
}
// tests();