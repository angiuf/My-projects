//MAIN
//Crea tutti gli elementi

//Prendiamo i dati dal database
fetch("pizzerie.php").then(onResponseJSON).then(onPizzerieJSON);
let pizzerie;

//Aggiunge l'event listener per il blocco del logout
const profilo = document.querySelector('#profile_pic');
profilo.addEventListener('click', mostraProfilo);

//Aggiunge l'event listener alla barra di ricerca
const search_bar = document.querySelector('header input');
search_bar.addEventListener('keyup', ricerca);

//Aggiorna il bottone col totale del carrello
aggiornaBottoneCarrello();

function onText(text){
    console.log(text);
}

function onResponseJSON(response){
    return response.json();
}

function onResponseText(response){
    return response.text();
}

//Funzione che crea una pizzeria e la inserisce all'interno di section
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

    //Freccia per espandere la descrizione
    arrow = document.createElement('img');
    arrow.src = "images/arrow_down.png";
    arrow.classList.add("arrow");
    arrow.addEventListener('click', espandiDescrizione);
    favorite_icon = document.createElement('img');
    favorite_icon.src = "images/favorite_icon_add.png";
    favorite_icon.classList.add("favorite_icon");
    favorite_icon.addEventListener('click', aggiungiPreferiti);

    const section = document.querySelector(sezione);

    //Aggiunge il blocco alla section in HTML
    blocco.appendChild(blocco_imm);
    blocco_imm.appendChild(imm);
    blocco_imm.appendChild(favorite_icon);
    blocco.appendChild(h1);
    h1.appendChild(tit);    
    blocco.appendChild(descr);
    blocco.appendChild(arrow);
    section.appendChild(blocco);

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

//Funzione per aggiungere un preferito
function aggiungiPreferiti(event) {
    const favorite_icon = event.currentTarget;
    //Modifica l'icona del preferito
    favorite_icon.src = "images/favorite_icon_remove.png";
    favorite_icon.removeEventListener('click', aggiungiPreferiti);
    favorite_icon.addEventListener('click', rimuoviPreferiti);

    //Identifica l'indice e il contenuto che ha attivato l'evento
    const index = (favorite_icon.parentNode.parentNode).dataset.index;
    const formData = new FormData();
    formData.append("id", index);
    fetch("aggiungiPreferito.php", {method: 'post',
                                    body: formData}).then(onResponseText);

    //Costruisce la lista dei preferiti
    visualizzaPreferiti();
}

//Rimuove dai preferiti
function rimuoviPreferiti(event) {
    let favorite_icon = event.currentTarget;
    //Identifica il blocco padre dell'icona che ha scatenato l'evento
    const blocco_padre = (favorite_icon.parentNode.parentNode);
    let id;

    //Distingue se abbiamo cliccato l'icona sul blocco nei preferiti o in tutte le pizzerie
    if(blocco_padre.classList.contains('favorite')){
        //Seleziona il blocco corrispondente nella lista di tutte le pizzerie
        id = blocco_padre.dataset.id; 
        const blocco_pizzeria = document.querySelector("[data-index='" + id + "']");
        //Riassegna favorite icon
        favorite_icon = blocco_pizzeria.childNodes[0].childNodes[1];     
    } else {
        id = blocco_padre.dataset.index;
    }

    //Modifica l'immagine e l'event listener dell'icona
    favorite_icon.src = "images/favorite_icon_add.png";
    favorite_icon.removeEventListener('click', rimuoviPreferiti);
    favorite_icon.addEventListener('click', aggiungiPreferiti);

    //Rimuove l'oggetto dalla lista dei preferiti nel database e ricrea la sezione HTML dei preferiti
    const formData = new FormData();
    formData.append("id", id);
    fetch("rimuoviPreferito.php", {method: 'post',
                                    body: formData}).then(onResponseText);

    visualizzaPreferiti();
}

//Funzione per creare un elemento preferito simile a creaContenuto
function creaPreferito(titolo, immagine, sezione, id) {
    blocco = document.createElement('div');
    blocco.classList.add('content');
    blocco.classList.add('favorite');
    blocco.dataset.id = id;
    h1 = document.createElement('h1');
    tit = document.createElement('a');
    tit.textContent = titolo;
    tit.addEventListener('click', apriModale);
    imm = document.createElement('img');
    imm.src = immagine;
    imm.addEventListener('click', apriModale);
    blocco_imm = document.createElement('div');
    blocco_imm.classList.add('blocco_imm');
    favorite_icon = document.createElement('img');
    favorite_icon.src = "images/favorite_icon_remove.png";
    favorite_icon.classList.add("favorite_icon");
    favorite_icon.addEventListener('click', rimuoviPreferiti);

    const section = document.querySelector(sezione);

    blocco.appendChild(blocco_imm);
    blocco_imm.appendChild(imm);
    blocco_imm.appendChild(favorite_icon);
    blocco.appendChild(h1);
    h1.appendChild(tit);    
    section.appendChild(blocco);
}

//Funzione che ricrea la sezione con gli elementi preferiti a partire dalla lista dei preferiti
function visualizzaPreferiti() {
    fetch("preferiti.php").then(onResponseJSON).then(onPreferitiJSON);
}

//Ricerca testuale

//Funzione per la ricerca dei contenuti sulla base del titolo, della descrizione, o del menu
function ricerca(){    
    //La ricera non è case sensitive
    const value = search_bar.value.toLowerCase();
    listap = document.querySelectorAll('#lista_pizzerie .content');
    pref = document.querySelector('#lista_preferiti');
    const pref_div = document.querySelector('#lista_preferiti div');

    //Verifica se la barra di ricerca è vuota e mostra tutti i contenuti
    if(value === '') {
        for(c of listap){
            c.classList.remove('hidden');
        }

        if(pref_div.innerHTML !== ""){
            pref.classList.remove('hidden');
        }
    } else {
        for(c of listap){
            c.classList.add('hidden');
        }
        pref.classList.add('hidden');

        for(contenuto of pizzerie) {
            let titolo = contenuto.Nome.toLowerCase();
            let descrizione = contenuto.Descrizione.toLowerCase();
            
            if(titolo.includes(value) || descrizione.includes(value) || haPizzaMenu(contenuto.Pizze_menu, value)) {
                const c = document.querySelector("[data-index='" + contenuto.ID + "']")
                c.classList.remove('hidden');
            }
        }
    } 
}

//Funzione per vedere se il menu di una pizzeria ha la pizza da cercare
function haPizzaMenu(Menu, v){
    for(pm of Menu){
        if(pm.Nome.toLowerCase().includes(v)){
            return true;
        }
    }
    return false;
}


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

//Gestione del JSON dei contenuti
function onPizzerieJSON(json){
    pizzerie = json;
    console.log(pizzerie);

    for(contenuto of pizzerie){        
        creaContenuto(contenuto.Nome, contenuto.Immagine, contenuto.Descrizione, contenuto.ID, '#lista_pizzerie');
    }

    visualizzaPreferiti();
}

//Funzione per gestire il JSON dei preferiti
function onPreferitiJSON(json){
    pref = document.querySelector('#lista_preferiti');
    div = document.querySelector('#lista_preferiti div');
    div.innerHTML = '';
    console.log(json);

    if(json === null) {
        pref.classList.add('hidden');
    }else {
        pref.classList.remove('hidden');
        for(contenuto of json){
            creaPreferito(contenuto.Nome, contenuto.Immagine, '#lista_preferiti div', contenuto.ID);
            toggleFavIcon(contenuto.ID);
        }
    }
}

//Funzione che se una pizzaria è tra i preferiti modifica l'icona
function toggleFavIcon(id){
    const pizza = document.querySelector("[data-index='" + id +"']");

    const icon = pizza.childNodes[0].childNodes[1];
    icon.src = "images/favorite_icon_remove.png";
    icon.removeEventListener('click', aggiungiPreferiti);
    icon.addEventListener('click', rimuoviPreferiti); 
}


/*******************************************Modale e carrello************************************************/
//Funzione per creare un blocco della pizza
function creaPizza(id, nome, ingredienti, prezzo, pizzeria){    
    const blocco = document.createElement('div');
    blocco.classList.add('pizza_block');
    blocco.dataset.id = id;
    blocco.dataset.pizzeria = pizzeria;
    const nome_pizza = document.createElement('h3');
    nome_pizza.classList.add('pizza_name');
    nome_pizza.textContent = nome;
    const div = document.createElement('div');
    div.classList.add('ingr_prezzo_p');
    const ingredienti_pizza = document.createElement('span');
    ingredienti_pizza.classList.add('ingredienti');
    ingredienti_pizza.textContent = ingredienti;
    const div_prezzo = document.createElement('prezzo_add');
    div_prezzo.classList.add('prezzo_add');
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
    blocco.appendChild(nome_pizza);
    div.appendChild(ingredienti_pizza);
    qty_block.appendChild(minus_icon);
    qty_block.appendChild(qty);
    qty_block.appendChild(plus_icon);
    div_prezzo.appendChild(qty_block);
    div_prezzo.appendChild(prezzo_pizza);
    div_prezzo.appendChild(icon);
    div.appendChild(div_prezzo);
    blocco.appendChild(div);
    modale.appendChild(blocco);
}

//Funzione per incrementare la quantità
function increaseQty(event){
    const qty = event.currentTarget.parentNode.childNodes[1];
    qty.textContent++;
}

//Funzione per decrementare la quantità
function decreaseQty(event){
    const qty = event.currentTarget.parentNode.childNodes[1];
    if(qty.textContent != 1){
        qty.textContent--;
    }
}

//Funzione per aggiungere al carrello
function aggiungiCarrello(event){
    //Prende il blocco della pizza e il suo id
    const blocco = event.currentTarget.parentNode.parentNode.parentNode;
    const pizza_id = blocco.dataset.id;
    let nome_pizza;
    const pizzeria_id = blocco.dataset.pizzeria;
    let nome_pizzeria;
    let prezzo;
    for(p of pizzerie){
        if(p.ID === pizzeria_id){
            nome_pizzeria = p.Nome;
            for(pz of p.Pizze_menu){
                 if(pz.Id == pizza_id){
                     nome_pizza = pz.Nome;
                     prezzo = pz.Prezzo;
                 }
             }
        }
    }
    const qty = blocco.childNodes[1].childNodes[1].childNodes[0].childNodes[1].textContent;
    //Crea il form da mandare al server
    const formData = new FormData();
    formData.append("pizza_id", pizza_id);
    formData.append("nome_pizza", nome_pizza);
    formData.append("pizzeria_id", pizzeria_id);
    formData.append("nome_pizzeria", nome_pizzeria);
    formData.append("quantita", qty);
    formData.append("prezzo", prezzo);
    fetch("aggiungiCarrello.php", {method: 'post',
                                    body: formData}).then(onResponseText).then(onText);
          
    //Aggiorna il bottone con il nuovo totale
    aggiornaBottoneCarrello()
}

//Funzione per aprire la modale
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
    let id;
    //Distingue se abbiamo cliccato l'icona sul blocco nei preferiti o in tutte le pizzerie
    if(blocco_padre.classList.contains('favorite')){
        //Seleziona il blocco corrispondente nella lista di tutte le pizzerie
        id = blocco_padre.dataset.id; 
        const blocco_pizzeria = document.querySelector("[data-index='" + id + "']");
        //Riassegna favorite icon
        favorite_icon = blocco_pizzeria.childNodes[0].childNodes[1];     
    } else {
        id = blocco_padre.dataset.index;
    }

    //Aggiunge l'event listener per chiudere la modale
    modale.addEventListener('click', chiudiModale);

    for(p of pizzerie){
        if(p.ID == id){
            for(pizza of p.Pizze_menu){
                creaPizza(pizza.Id, pizza.Nome, pizza.Ingredienti, pizza.Prezzo, pizza.Pizzeria);
            }
            break;
        }
    }
}

//Funzione che chiude la modale
function chiudiModale(event){
    const modale = document.querySelector('#modale');
    
    if(event.target === modale){
        modale.classList.add('hidden');
        modale.removeEventListener('click', chiudiModale);
        const body = document.querySelector('body');
        body.classList.remove('no-scroll');
    }   
}

//Funzione che aggiorna il bottone col totale del carrello
function aggiornaBottoneCarrello(){
    fetch("isCarrelloEmpty.php").then(onResponseJSON).then(onAggiornaBottoneCarrello);
}

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

/************************************************************************************************************/