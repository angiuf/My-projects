//Seleziona il blocco del profilo e aggiunge il listener
const profilo = document.querySelector("#profile_pic");
profilo.addEventListener('click', mostraProfilo);

//Variabile per memorizzare il JSON restituito da php
let ordini;

//Richiede il JSON al server
fetch("getOrdini.php?").then(onResponseJSON).then(onJSON);
//fetch("getOrdini.php?").then(onResponseText).then(onText);


//Funzione per mostrare il blocco per il logout
function mostraProfilo(event){
    const blocco_profilo = document.querySelector("#profile_block");
    blocco_profilo.classList.remove("hidden");
    profilo.removeEventListener('click', mostraProfilo);
    profilo.addEventListener('click', nascondiProfilo);
}

//Funzione per nasconder il blocco per il logout
function nascondiProfilo(event){
    const blocco_profilo = document.querySelector("#profile_block");
    blocco_profilo.classList.add("hidden");
    profilo.removeEventListener('click', nascondiProfilo);
    profilo.addEventListener('click', mostraProfilo);
}

function onResponseJSON(response){
    return response.json();
}

function onResponseText(response){
    return response.text();
}

function onText(text){
    console.log(text);
}

//Elaborazione del JSON
function onJSON(json){
    //Salva il JSON su ordini
    console.log(json);
    ordini = json;

    //Se è vuoto e non c'è nessun ordine mostra la scritta "Nessun ordine" altrimenti mostra tutti gli ordini effettuati
    if(ordini.length == 0){
        const nessun_ordine = document.createElement("span");
        nessun_ordine.textContent = "Ancora non hai effettuato nessun ordine";
        nessun_ordine.classList.add("nessun_ordine");
        const ordini = document.querySelector("#ordini");
        ordini.appendChild(nessun_ordine);
    }else{
        for(ordine of ordini){
            creaOrdine(ordine.ID, ordine.Data, ordine.Totale, ordine.Pizze_ordinate)
        }
    }    
}

//Funzione per creare l'HTML per ogni ordine
function creaOrdine(id, d, t, p){
    const blocco_ordine = document.createElement("div");
    blocco_ordine.classList.add("blocco_ordine");
    blocco_ordine.dataset.id = id;
    const info = document.createElement("div");
    info.classList.add("info");
    const data = document.createElement("h3");
    data.textContent = d;
    const blocco_totale = document.createElement("div");
    blocco_totale.classList.add("blocco_totale");
    const totale = document.createElement("span");
    totale.textContent = "€" + t;
    const arrow = document.createElement("img");
    arrow.src = "images/arrow_down.png";
    arrow.addEventListener('click', mostraPizze);
    pizze = creaPizze(p);

    blocco_totale.appendChild(totale);
    blocco_totale.appendChild(arrow);
    info.appendChild(data);
    info.appendChild(blocco_totale);
    blocco_ordine.appendChild(info);
    //Crea e nasconde tutte le pizze ordinate
    pizze = creaPizze(p);
    pizze.classList.add("hidden");
    blocco_ordine.appendChild(pizze);

    const ordini = document.querySelector("#ordini");
    ordini.appendChild(blocco_ordine);
    
}

//Funzione per creare tutte le pizze in un ordine
function creaPizze(p){
    const pizze = document.createElement("div");
    pizze.classList.add("pizze");

    for(pizza of p){
        creaPizza(pizza.Pizza_nome, pizza.Pizzeria_nome, pizza.Quantita, pizza.Prezzo, pizze);
    }

    return pizze;
}

//Funzione che crea l'elemento HTML per una pizza
function creaPizza(nome, pizzeria, quantita, prezzo, spazio){    
    const blocco = document.createElement('div');
    blocco.classList.add('pizza_block');
    const nome_pizza = document.createElement('h3');
    nome_pizza.classList.add('pizza_name');
    nome_pizza.textContent = nome;
    const div = document.createElement('div');
    div.classList.add('ingr_prezzo_p');
    const ingredienti_pizza = document.createElement('span');
    ingredienti_pizza.classList.add('pizzeria');
    ingredienti_pizza.textContent = pizzeria;
    const div_prezzo = document.createElement('prezzo_add');
    div_prezzo.classList.add('prezzo_add');
    const prezzo_pizza = document.createElement('span');
    prezzo_pizza.classList.add('prezzo');
    prezzo_pizza.textContent = "€" + prezzo;
    const qty_block = document.createElement('div');
    qty_block.classList.add('qty_block');
    const qty = document.createElement('span');
    qty.textContent = quantita;

    //Se non è la prima pizza del menu aggiunge il divisore
    if(!(spazio.innerHTML === "")){
        const divider = document.createElement('hr');
        divider.classList.add('solid');
        spazio.appendChild(divider);
    }

    //Aggiunge alla pagina HTML
    blocco.appendChild(nome_pizza);
    div.appendChild(ingredienti_pizza);
    qty_block.appendChild(qty);
    div_prezzo.appendChild(qty_block);
    div_prezzo.appendChild(prezzo_pizza);
    div.appendChild(div_prezzo);
    blocco.appendChild(div);
    spazio.appendChild(blocco);
}

//Funzione chiamata dal listener per mostrare tutte le pizze
function mostraPizze(event){
    const arrow = event.currentTarget;
    arrow.src = "images/arrow_up.png";
    const blocco_ordine = arrow.parentNode.parentNode.parentNode;
    const blocco_pizze = blocco_ordine.childNodes[1];
    blocco_pizze.classList.remove("hidden");
    arrow.removeEventListener('click', mostraPizze);
    arrow.addEventListener('click', nascondiPizze);
}

//Funzione chiamata dal listener per nascondere tutte le pizze
function nascondiPizze(event){
    const arrow = event.currentTarget;
    arrow.src = "images/arrow_down.png";
    const blocco_ordine = arrow.parentNode.parentNode.parentNode;
    const blocco_pizze = blocco_ordine.childNodes[1];
    blocco_pizze.classList.add("hidden");
    arrow.removeEventListener('click', nascondiPizze);
    arrow.addEventListener('click', mostraPizze);
}