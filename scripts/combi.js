const inputs_combinaison = document.querySelectorAll('.input-combi');
const input_combi_objets = document.querySelector('#input-combi-objets');
const input_combi_tirages = document.querySelector('#input-combi-tirages');

const radios_combinaison = document.querySelectorAll('.radio-combi');
const radio_combinaison = document.querySelector('#radio-combinaison');
const radio_arrangement = document.querySelector('#radio-arrangement');

const div_proba_combi_result = document.querySelector('#div-proba-combi-result');




function calculerCombinaisons() {
   
    let isAllFilled = true;
    inputs_combinaison.forEach(function(input_combi) {
        if (input_combi.value == '' || parseFloat(input_combi.value) < 1) {
            isAllFilled = false;
            if (input_combi.value != '') {
                input_combi.classList.add('input-error');
            }
        }
        else {
            input_combi.classList.remove('input-error');
        }
    });
    if (parseInt(input_combi_objets.value) < parseInt(input_combi_tirages.value)) {
        input_combi_objets.classList.add('input-error');
        input_combi_tirages.classList.add('input-error');
        isAllFilled = false;
    }
    else {
        input_combi_objets.classList.remove('input-error');
        input_combi_tirages.classList.remove('input-error');
    }

    if (isAllFilled) {
        const n = parseInt(input_combi_objets.value);
        const k = parseInt(input_combi_tirages.value);
        
        if (radio_combinaison.checked) {
            div_proba_combi_result.textContent = `${formaterChiffre(combinaison(k, n))} combinaisons possibles`;
        } 
        else if (radio_arrangement.checked) {
            div_proba_combi_result.textContent = `${formaterChiffre(arrangement(k, n))} arrangements possibles`;
        }
    }
    else {
        div_proba_combi_result.textContent = "";
    }
}



inputs_combinaison.forEach(function(input_combi) {
    input_combi.addEventListener('input', function() {
        calculerCombinaisons();
    });
});

radios_combinaison.forEach(function(radio_combi) {
    radio_combi.addEventListener('change', function() {
        calculerCombinaisons();
    });
});