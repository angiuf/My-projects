/*********************************MAIN ********************************/
//Variabile per contare il prezzo totale dell'ordine
let tot = 0;

//Prende il JSON delle pizze presenti nel carrello e lo salva il pizze_carrello
fetch("getCarrello.php").then(onResponseJSON).then(onJSON);
let pizze_carrello = null;

//Aggiunge il listener al bottone per inviare l'ordine
const button = document.querySelector("#completa_ordine input");
button.addEventListener('click', inviaOrdine);

//Aggiunge il listener per visualizzare la tendina profilo
const profilo = document.querySelector("#profile_pic");
profilo.addEventListener('click', mostraProfilo);

//Elemento HTML per il totale
const totale = document.querySelector("#totale");

/****************************************************************** */

//Funzione per rimuovere una pizza dal carrello
function remove(event){
    const blocco = event.currentTarget.parentNode.parentNode.parentNode;
    const id_pizza = blocco.dataset.id;
    const id_pizzeria = blocco.dataset.pizzeria;
    //Rimuove la pizza dalla variabile carrello della sessione
    fetch("rimuoviCarrello.php?pizza=" + id_pizza + "&pizzeria=" + id_pizzeria).then(onResponseText).then(onText);
    
    //Cerca ed elimina la pizza dall'array pizze_carrello
    for(pizza of pizze_carrello){
        if(pizza.Pizza_id === id_pizza && pizza.Pizzeria_id === id_pizzeria){
            pizze_carrello.splice(pizze_carrello.indexOf(pizza), 1);
        }
    }

    //Ricarica le pizze nel carrello
    visualizzaPizzeCarrello();
}

function onResponseJSON(response){
    return response.json();
}

function onJSON(json){
    console.log(json);
    //Salva il JSON in pizze_carrello
    pizze_carrello = json;
    visualizzaPizzeCarrello();
}

function onResponseText(response){
    return response.text();
}

function onText(text){
    console.log(text);
}

//Funzione per visualizzare le pizze nel carrello
function visualizzaPizzeCarrello(){
    const carrello = document.querySelector("#pizze_carrello");
    const div_completa_ordine = document.querySelector("#completa_ordine");
    //Svuota l'HTML
    carrello.innerHTML = "";
    
    //Se il carrello è vuoto mostra nessuna pizza nel carrello
    if(pizze_carrello === null || pizze_carrello.length == 0){
        const nessuna_pizza = document.createElement('span');
        nessuna_pizza.classList.add("nessuna_pizza");
        nessuna_pizza.innerHTML = "Nessuna pizza presente nel carrello";
        carrello.appendChild(nessuna_pizza);
        div_completa_ordine.classList.add("hidden");
        totale.classList.add("hidden");
    }
    //Altrimenti visualizza le pizze del carrello
    else{
        tot = 0;
        for(pizza of pizze_carrello){
            creaPizzaCarrello(pizza.Pizza_id, pizza.Nome_pizza, pizza.Pizzeria_id, pizza.Nome_pizzeria,pizza.Quantita, pizza.Prezzo);
            //Aggiunge il prezzo al totale
            tot += pizza.Prezzo;
        }

        //Inserisce alla fine il tasto per completare l'ordine
        div_completa_ordine.classList.remove("hidden");
        totale.textContent = "Totale:  €" + tot;
        totale.classList.remove("hidden");
    }    
}

//Funzione che crea l'HTML per le pizze nel carrello
function creaPizzaCarrello(id, nome, pizzeria_id, pizzeria, quantita, prezzo){    
    const blocco = document.createElement('div');
    blocco.classList.add('pizza_block');
    blocco.dataset.id = id;
    blocco.dataset.pizzeria = pizzeria_id;
    const nome_pizza = document.createElement('h3');
    nome_pizza.classList.add('pizza_name');
    nome_pizza.innerHTML = nome;
    const div = document.createElement('div');
    div.classList.add('ingr_prezzo_p');
    const ingredienti_pizza = document.createElement('span');
    ingredienti_pizza.classList.add('pizzeria');
    ingredienti_pizza.innerHTML = pizzeria;
    const div_prezzo = document.createElement('prezzo_add');
    div_prezzo.classList.add('prezzo_add');
    const prezzo_pizza = document.createElement('span');
    prezzo_pizza.classList.add('prezzo');
    prezzo_pizza.innerHTML = "€" + prezzo.toFixed(2);
    //Aggiunge l'icona per rimuovere la pizza dal carrello
    const icon = document.createElement('img');
    icon.src = 'images/delete.png';
    icon.classList.add('delete_icon');
    icon.addEventListener('click', remove);
    const qty_block = document.createElement('div');
    qty_block.classList.add('qty_block');
    const qty = document.createElement('span');
    qty.innerHTML = quantita;

    const space = document.querySelector('#pizze_carrello');

    //Se non è la prima pizza del menu aggiunge il divisore
    if(!(space.innerHTML === "")){
        const divider = document.createElement('hr');
        divider.classList.add('solid');
        space.appendChild(divider);
    }

    //Aggiunge alla pagina HTML
    blocco.appendChild(nome_pizza);
    div.appendChild(ingredienti_pizza);
    qty_block.appendChild(qty);
    div_prezzo.appendChild(qty_block);
    div_prezzo.appendChild(prezzo_pizza);
    div_prezzo.appendChild(icon);
    div.appendChild(div_prezzo);
    blocco.appendChild(div);
    space.appendChild(blocco);
}

//Funzione che completa l'ordine e invia i dati al server
function inviaOrdine(event){
    const formdata = new FormData();
    formdata.append("Totale", tot);

    fetch("inviaOrdine.php", {method: 'post',
                                body: formdata}).then(onResponseText).then(onText);
    
    window.location.replace("home.php");
}

//Funzione per mostrare il blocco profilo
function mostraProfilo(event){
    const blocco_profilo = document.querySelector("#profile_block");
    blocco_profilo.classList.remove("hidden");
    profilo.removeEventListener('click', mostraProfilo);
    profilo.addEventListener('click', nascondiProfilo);
}

//Funzione per nascondere il blocco profilo
function nascondiProfilo(event){
    const blocco_profilo = document.querySelector("#profile_block");
    blocco_profilo.classList.add("hidden");
    profilo.removeEventListener('click', nascondiProfilo);
    profilo.addEventListener('click', mostraProfilo);
}