const inputs_collision = document.querySelectorAll(".input-collision");
const input_collision_valeurs = document.querySelector("#input-collision-valeurs");
const input_collision_tirages = document.querySelector("#input-collision-tirages");

const div_proba_collision_result = document.querySelector("#div-proba-collision-result");




function calculerCollisions() {
   
    let isAllFilled = true;
    inputs_collision.forEach(function(input_collision) {
        if (input_collision.value == "" || parseFloat(input_collision.value) < 1) {
            isAllFilled = false;
            if (input_collision.value != "") {
                input_collision.classList.add("input-error");
            }
        }
        else {
            input_collision.classList.remove("input-error");
        }
    });
    const x = parseInt(input_collision_valeurs.value);
    const n = parseInt(input_collision_tirages.value);

    if (x < n) {
        input_collision_valeurs.classList.add("input-error");
        input_collision_tirages.classList.add("input-error");
        isAllFilled = false;
    }
    else {
        input_collision_valeurs.classList.remove("input-error");
        input_collision_tirages.classList.remove("input-error");
    }

    if (isAllFilled) {
        let probabilite = 1.0
        for (let k = 0; k < n; k++) {
            probabilite *= (x - k) / x
        }
        const probabiliteFormatee = formaterProbabilite(1 - probabilite);
        const chanceSur = (1 / (probabiliteFormatee / 100));
        div_proba_collision_result.textContent = `${probabiliteFormatee}% (1 chance sur ${formaterChiffre(chanceSur)})`;
    }
    else {
        div_proba_collision_result.textContent = "";
    }
}




inputs_collision.forEach(function(input_collision) {
    input_collision.addEventListener("input", function() {
        calculerCollisions();
    });
});