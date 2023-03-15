//Prende le pizze dal php e le inserisce in pizze
fetch("getPizze.php").then(onResponseJSON).then(onJSON);
let pizze;

//Aggiunge il listener per visualizzare la tendina profilo
const profilo = document.querySelector("#profile_pic");
profilo.addEventListener('click', mostraProfilo);

//Aggiorna il bottone del totale del carrello
aggiornaBottoneCarrello();

function onResponseText(response){
    return response.text();
}

function onText(text){
    console.log(text);
}

function onResponseJSON(response){
    return response.json();
}

//Salva le pizze restituite in pizze e le visualizza
function onJSON(json){
    pizze = json;
    console.log(pizze);
    visualizzaPizze();
}

//Visualizza tutte le pizze
function visualizzaPizze(){
    for(pizza of pizze){
        creaContenuto(pizza.Nome, pizza.Immagine, pizza.Ingredienti, pizza.ID, "#pizze")
    }
}

//Funzione che crea una pizza e la inserisce all'interno di section
function creaContenuto(titolo, immagine, descrizione, id, sezione) {
    //Creazione del blocco di contenuto
    blocco = document.createElement('div');
    blocco.classList.add('content');
    blocco.classList.add('big');
    
    //Aggiunge l'indice per identificarlo successivamente
    blocco.dataset.index = id;
    h1 = document.createElement('h1');
    tit = document.createElement('a');
    tit.textContent = titolo;
    tit.addEventListener('click', apriModale);
    imm = document.createElement('img');
    imm.src = immagine;
    imm.addEventListener('click', apriModale);
    blocco_imm = document.createElement('div');
    blocco_imm.classList.add('blocco_imm');
    descr = document.createElement('p');
    descr.textContent = descrizione;
    //Nasconde inizialmente la descrizione
    descr.classList.add('hidden');

    //Freccia per espandere gli ingredienti
    arrow = document.createElement('img');
    arrow.src = "images/arrow_down.png";
    arrow.classList.add("arrow");
    arrow.addEventListener('click', espandiDescrizione);

    const section = document.querySelector(sezione);

    //Aggiunge il blocco alla section in HTML
    blocco.appendChild(blocco_imm);
    blocco_imm.appendChild(imm);
    blocco.appendChild(h1);
    h1.appendChild(tit);    
    blocco.appendChild(descr);
    blocco.appendChild(arrow);
    section.appendChild(blocco);

}

function apriModale(event){   
    //Mostriamo la modale
    const modale = document.querySelector('#modale');
    modale.classList.remove('hidden');
    //Blocchiamo lo scroll del body
    const body = document.querySelector('body');
    body.classList.add('no-scroll');
    const menu = document.querySelector('#menu_block');
    menu.innerHTML = '';
    
    const blocco_padre = event.currentTarget.parentNode.parentNode;
    const id = blocco_padre.dataset.index;

    //Aggiunge l'event listener per chiudere la modale
    modale.addEventListener('click', chiudiModale);

    for(pizza of pizze){
        if(pizza.ID == id){
            for(pizzeria of pizza.Pizzerie){
                creaPizzeria(pizzeria.ID, pizzeria.Nome, pizzeria.Prezzo, pizza.ID);
            }
            break;
        }
    }
}

function chiudiModale(event){
    const modale = document.querySelector('#modale');
    
    if(event.target === modale){
        modale.classList.add('hidden');
        modale.removeEventListener('click', chiudiModale);
        const body = document.querySelector('body');
        body.classList.remove('no-scroll');
    }   
}

//Funzione per espandere la descrizione; Attivata da arrow nel contenuto
function espandiDescrizione(event) {
    const arrow = event.currentTarget;
    arrow.src = "images/arrow_up.png";
    arrow.removeEventListener('click', espandiDescrizione);
    arrow.addEventListener('click', riduciDescrizione);
    const blocco_padre = arrow.parentNode;
    const descr = blocco_padre.childNodes[2];
    descr.classList.remove('hidden');
}

//Nasconde la descrizione
function riduciDescrizione(event) {
    const arrow = event.currentTarget;
    arrow.src = "images/arrow_down.png";
    arrow.removeEventListener('click', riduciDescrizione);
    arrow.addEventListener('click', espandiDescrizione);
    const blocco_padre = arrow.parentNode;
    const descr = blocco_padre.childNodes[2]
    descr.classList.add('hidden');
}

//Crea la pizzeria per ogni pizza
function creaPizzeria(id, nome, prezzo, pizza){    
    const blocco = document.createElement('div');
    blocco.classList.add('pizza_block');
    blocco.dataset.id = id;
    blocco.dataset.pizza = pizza;
    const nome_pizzeria = document.createElement('h3');
    nome_pizzeria.classList.add('pizzeria_name');
    nome_pizzeria.textContent = nome;
    const div = document.createElement('div');
    div.classList.add('prezzo_p');
    const div_prezzo = document.createElement('prezzo_add');
    div_prezzo.classList.add('prezzo_add');
    const div2 = document.createElement('div');
    div2.classList.add('div2');
    const prezzo_pizza = document.createElement('span');
    prezzo_pizza.classList.add('prezzo');
    prezzo_pizza.textContent = "€" + prezzo;
    const icon = document.createElement('img');
    icon.src = 'images/add_icon.png';
    icon.classList.add('add_icon');
    icon.addEventListener('click', aggiungiCarrello);
    const qty_block = document.createElement('div');
    qty_block.classList.add('qty_block');
    const minus_icon = document.createElement('img');
    minus_icon.src = 'images/arrow_left.png';
    minus_icon.addEventListener('click', decreaseQty);
    const plus_icon = document.createElement('img');
    plus_icon.src = 'images/arrow_right.png';
    plus_icon.addEventListener('click', increaseQty);
    const qty = document.createElement('span');
    qty.textContent = 1;

    const modale = document.querySelector('#menu_block');

    //Se non è la prima pizza del menu aggiunge il divisore
    if(!(modale.innerHTML === "")){
        const divider = document.createElement('hr');
        divider.classList.add('solid');
        modale.appendChild(divider);
    }

    //Aggiunge alla pagina HTML
    blocco.appendChild(nome_pizzeria);
    qty_block.appendChild(minus_icon);
    qty_block.appendChild(qty);
    qty_block.appendChild(plus_icon);
    div_prezzo.appendChild(qty_block);
    div2.appendChild(prezzo_pizza);
    div2.appendChild(icon);
    div_prezzo.appendChild(div2);
    div.appendChild(div_prezzo);
    blocco.appendChild(div);
    modale.appendChild(blocco);
}

//Funzione per aggiungere al carrello
function aggiungiCarrello(event){
    //Prende il blocco della pizza e il suo id
    const blocco = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
    const pizzeria_id = blocco.dataset.id;
    let nome_pizzeria;
    const pizza_id = blocco.dataset.pizza;
    let nome_pizza;
    let prezzo;
    for(pizza of pizze){
        if(pizza.ID === pizza_id){
            nome_pizza = pizza.Nome;
            for(pz of pizza.Pizzerie){
                 if(pz.ID == pizzeria_id){
                     nome_pizzeria = pz.Nome;
                     prezzo = pz.Prezzo;
                 }
             }
        }
    }
   
    //Crea il form da mandare al server per inserire l'ordine
    const qty = blocco.childNodes[1].childNodes[0].childNodes[0].childNodes[1].textContent;
    console.log(qty);
    const formData = new FormData();
    formData.append("pizza_id", pizza_id);
    formData.append("nome_pizza", nome_pizza);
    formData.append("pizzeria_id", pizzeria_id);
    formData.append("nome_pizzeria", nome_pizzeria);
    formData.append("quantita", qty);
    formData.append("prezzo", prezzo);
    fetch("aggiungiCarrello.php", {method: 'post',
                                    body: formData}).then(onResponseText).then(onText);
                                    
    aggiornaBottoneCarrello()
}

//Incrementa la quantità
function increaseQty(event){
    const qty = event.currentTarget.parentNode.childNodes[1];
    qty.textContent++;
}

//Decrementa la quantità
function decreaseQty(event){
    const qty = event.currentTarget.parentNode.childNodes[1];
    if(qty.textContent != 1){
        qty.textContent--;
    }
}

//Esegue la fetch alla pagina php che verifica il carrello
function aggiornaBottoneCarrello(){
    fetch("isCarrelloEmpty.php").then(onResponseJSON).then(onAggiornaBottoneCarrello);
    //fetch("isCarrelloEmpty.php").then(onResponseText).then(onText);
}

//Restituito il json crea il bottone
function onAggiornaBottoneCarrello(json){
    console.log(json);
    const bottone_carrello = document.querySelector("#vai_a_carrello");
    
    if(!json.Empty){
        bottone_carrello.innerHTML = "";
        const t1 = document.createElement("h4");
        const t2 = document.createElement("h4");
        t1.textContent = json.N_el + " pizze";
        t2.textContent = "Totale: €" + json.Totale;
        bottone_carrello.appendChild(t1);
        bottone_carrello.appendChild(t2);
        bottone_carrello.classList.remove("hidden");
    }else{
        bottone_carrello.classList.add("hidden");
    }
    
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