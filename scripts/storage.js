const details_sections = document.querySelectorAll("details");
const big_titre = document.querySelector(".big-titre");
let allOpen = false;




function saveState() {
    let details_states = [];
    details_sections.forEach((detail) => {
        details_states.push(detail.open);
    });
    localStorage.setItem("details_states", JSON.stringify(details_states));
}


function restoreState() {
    if (localStorage.getItem("details_states")) {
        const details_states = JSON.parse(localStorage.getItem("details_states"));
        for (let i = 0; i < details_states.length; i++) {
            details_sections[i].open = details_states[i];
        }
    }
}


function viderChamps() {
    details_sections.forEach((detail) => {
        detail.querySelectorAll("input").forEach((input) => {
            input.value = "";
        });
    });
}




// on sauvegarde à la modification d'une section
details_sections.forEach((detail) => {
    detail.addEventListener("toggle", () => {
        saveState();
    });
});


// on restaure au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    restoreState();
});


// On replie toutes les sections
big_titre.addEventListener("click", () => {
    if (allOpen) {
        details_sections.forEach((detail) => {
            detail.open = false;
        });
        allOpen = false;
    }
    else {
        details_sections.forEach((detail) => {
            detail.open = true;
        });
        allOpen = true;
    }
    viderChamps();
    saveState();
});