const input_autre_nombre = document.querySelector("#input-autres-nombre");

const radios_autres = document.querySelectorAll(".radio-autres");
const radio_autres_somme = document.querySelector("#radio-autres-somme");
const radio_autres_produit = document.querySelector("#radio-autres-produit");
const radio_autres_moyenne = document.querySelector("#radio-autres-moyenne");
const radio_autres_ecart = document.querySelector("#radio-autres-ecart");

const div_autres_nombre_result = document.querySelector("#div-autres-nombre-result");




function calculerChamps() {

    if (input_autre_nombre.value !== '') {

        const numbersRegex = (input_autre_nombre.value).match(/\d+(\.\d+)?/g);
        const nombres = numbersRegex ? numbersRegex.map(Number) : [];

        const somme = radio_autres_somme.checked;
        const produit = radio_autres_produit.checked;
        const moyenne = radio_autres_moyenne.checked;
        const ecart = radio_autres_ecart.checked;

        if (somme) {
            const sum = nombres.reduce((a, b) => a + b, 0);
            div_autres_nombre_result.textContent = sum;
        }
        else if (produit) {
            const product = nombres.reduce((a, b) => a * b, 1);
            div_autres_nombre_result.textContent = product;
        }
        else if (moyenne) {
            const average = nombres.reduce((a, b) => a + b, 0) / nombres.length;
            div_autres_nombre_result.textContent = average.toFixed(3);
        }
        else if (ecart) {
            const average = nombres.reduce((a, b) => a + b, 0) / nombres.length;
            const ecartType = Math.sqrt(nombres.reduce((a, b) => a + Math.pow(b - average, 2), 0) / nombres.length);
            div_autres_nombre_result.textContent = ecartType.toFixed(3);
        }
    }
}




// update si le champs est mis à jour
input_autre_nombre.addEventListener('input', function () {
    calculerChamps();
});

// update si les radios sont mis à jour
radios_autres.forEach(function (radio_autre) {
    radio_autre.addEventListener('change', function () {
        calculerChamps();
    });
});