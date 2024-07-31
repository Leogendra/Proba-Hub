const input_nombres = document.querySelectorAll(".input-nombre");
const input_nombre_min = document.querySelector("#input-nombre-min");
const input_nombre_max = document.querySelector("#input-nombre-max");
const input_nombre_nombre = document.querySelector("#input-nombre-nombre");

const radios_nombres = document.querySelectorAll(".radio-nombre");
const radio_alea_remise = document.querySelector("#radio-alea-remise");
const radio_alea_sans_remise = document.querySelector("#radio-alea-sans-remise");
const radio_decimal = document.querySelector("#radio-decimal");

const radio_alea_alea = document.querySelector("#radio-alea-alea");
const radio_alea_gaussien = document.querySelector("#radio-alea-gaussien");

const div_alea_nombre_result = document.querySelector("#div-alea-nombre-result");



function randomGaussian(moy, equart) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * equart + moy;
}


function getRandomNumber() {

    let isAllFilled = true;
    input_nombres.forEach(function (input_nombre) {
        if (input_nombre.value == '') {
            isAllFilled = false;
        }
    });

    if (isAllFilled) {
        const nbMin = parseInt(input_nombre_min.value);
        const nbMax = parseInt(input_nombre_max.value);
        const nbNombres = parseInt(input_nombre_nombre.value);

        const isAvecRemise = radio_alea_remise.checked;
        const isDecimal = radio_decimal.checked;

        const isGaussien = radio_alea_gaussien.checked;

        if (nbMin > nbMax) {
            input_nombre_min.classList.add('input-error');
            input_nombre_max.classList.add('input-error');
            div_alea_nombre_result.textContent = "";
        }
        else {
            input_nombre_min.classList.remove('input-error');
            input_nombre_max.classList.remove('input-error');
            div_alea_nombre_result.innerHTML = '';

            const moyenne = (nbMin + nbMax) / 2;
            const ecartType = (nbMax - nbMin) / 6;

            var liste_tiree = [];
            var liste_nombres = [];
            if (!(isAvecRemise || isDecimal)) {
                for (let i = nbMin; i <= nbMax; i++) {
                    liste_nombres.push(i);
                }
            }

            for (let i = 0; i < nbNombres; i++) {
                let nombre = nbMin - 1;
                if (isAvecRemise) {
                    if (isGaussien) {
                        while (nombre < nbMin || nombre > nbMax) {
                            nombre = randomGaussian(moyenne, ecartType).toFixed(0);
                        }
                    }
                    else {
                        nombre = Math.floor(Math.random() * (nbMax - nbMin + 1) + nbMin);
                    }
                }
                else if (isDecimal) {
                    if (isGaussien) {
                        while (nombre < nbMin || nombre > nbMax) {
                            nombre = randomGaussian(moyenne, ecartType).toFixed(3);
                        }
                    }
                    else {
                        nombre = (Math.random() * (nbMax - nbMin) + nbMin).toFixed(3);
                    }
                }
                else {
                    if (liste_nombres.length == 0) {
                        liste_nombres = liste_tiree;
                    }
                    indiceRandom = Math.floor(Math.random() * liste_nombres.length);
                    nombre = liste_nombres[indiceRandom];
                    liste_nombres.splice(indiceRandom, 1);
                }
                liste_tiree.push(nombre);
            }

            div_alea_nombre_result.textContent = liste_tiree.join(', ');
        }
    }
    else {
        div_alea_nombre_result.textContent = "";
    }

}




// update si les champs sont mis à jour
input_nombres.forEach(function (input_nombre) {
    input_nombre.addEventListener('input', function () {
        getRandomNumber();
    });
});

// update si les champs sont mis à jour
radios_nombres.forEach(function (radio_nombre) {
    radio_nombre.addEventListener('change', function () {
        getRandomNumber();
    });
});