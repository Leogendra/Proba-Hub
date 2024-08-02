const inputs_equipes = document.querySelectorAll('.input-equipes');
const input_equipes_joueurs = document.querySelector('#input-equipes-joueurs');
const input_equipes_taille = document.querySelector('#input-equipes-taille');
const input_equipes_parties = document.querySelector('#input-equipes-parties');

const div_equipes_result = document.querySelector('#div-equipe-result');




function calculerEquipes() {
   
    // check si tous les champs sont complétés et des nombres positifs
    let isAllFilled = true;
    inputs_equipes.forEach(function(input_tirage) {
        if (input_tirage.value == '' || parseFloat(input_tirage.value) < 0) {
            isAllFilled = false;
            if (input_tirage.value != '') {
                input_tirage.classList.add('input-error');
            }
        }
    });
    if (parseInt(input_equipes_joueurs.value) < parseInt(input_equipes_taille.value)) {
        input_equipes_joueurs.classList.add('input-error');
        input_equipes_taille.classList.add('input-error');
        isAllFilled = false;
    }
    else {
        input_equipes_joueurs.classList.remove('input-error');
        input_equipes_taille.classList.remove('input-error');
    }

    if (isAllFilled) {
        const N = parseInt(input_equipes_joueurs.value);
        const m = parseInt(input_equipes_taille.value);
        const k = parseInt(input_equipes_parties.value);
        
        const allPlayers = Array.from({ length: N }, (_, i) => i + 1);
        const maxMatchs = combinaison(m, N);
        const results = [];
    
        while ((results.length < maxMatchs) && (results.length < k)) {
            let teams = [];
            let availablePlayers = [...allPlayers];
            let uniqueTeams = true;
    
            while (availablePlayers.length >= m) {
                let team = [];
                for (let i = 0; i < m; i++) {
                    const randIndex = Math.floor(Math.random() * availablePlayers.length);
                    team.push(availablePlayers.splice(randIndex, 1)[0]);
                }
                teams.push(team);
            }
    
            // Vérifie si l'ensemble des équipes est unique
            if (results.some(result => JSON.stringify(result) === JSON.stringify(teams))) {
                uniqueTeams = false;
            } else {
                results.push(teams);
            }
    
            if (!uniqueTeams && results.length >= k) {
                console.error('Erreur: Impossible de générer suffisamment de tirages uniques.');
                return;
            }
        }
        let formattedResults = results.map((result, index) => {
            return `Partie ${index + 1} : ` + result.map(team => team.join(', ')).join(' | ');
        });
        div_equipes_result.innerHTML = formattedResults.join('<br>');
    }
    else {
        div_equipes_result.innerHTML = "";
    }
}



inputs_equipes.forEach(function(input_equipe) {
    input_equipe.addEventListener('input', function() {
        calculerEquipes();
    });
});