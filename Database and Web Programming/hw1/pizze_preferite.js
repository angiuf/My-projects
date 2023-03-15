//Seleziona il blocco del profilo e aggiunge il listener
const profilo = document.querySelector("#profile_pic");
profilo.addEventListener('click', mostraProfilo);

//Richiede al server la pizza preferita
fetch("getPizzaPreferita.php").then(onResponseJSON).then(onJSON);
let pizze_pref;

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

function onJSON(json){
    console.log(json);

    //Se il json è vuoto stampa nessuna pizza preferita

    if(json.length == 0){
        const tit = document.createElement("h3");
        tit.textContent = "Nessuna pizza preferita ancora";
        const div = document.querySelector("#pizze_pref");
        div.appendChild(tit);
    }else{
        pizze_pref = json;
        for(pizza of pizze_pref){
            creaContenuto(pizza.Nome, pizza.Immagine, pizza.Ingredienti, pizza.ID_Pizza, pizza.Num_pizze_ordinate, "#pizze_pref");
        }
    }
}

function creaContenuto(titolo, immagine, descrizione, id, n, sezione) {
    //Creazione del blocco di contenuto
    blocco = document.createElement('div');
    blocco.classList.add('content');
    blocco.classList.add('big');
    
    //Aggiunge l'indice per identificarlo successivamente
    blocco.dataset.index = id;
    h1 = document.createElement('h1');
    tit = document.createElement('a');
    tit.textContent = titolo;
    imm = document.createElement('img');
    imm.src = immagine;
    blocco_imm = document.createElement('div');
    blocco_imm.classList.add('blocco_imm');
    descr = document.createElement('p');
    ingredienti = document.createElement('span');
    ingredienti.classList.add('ingredienti');
    ingredienti.textContent = descrizione;
    n_ordinate = document.createElement('span');
    n_ordinate.classList.add('n_ordinate');
    n_ordinate.textContent = "Pizze ordinate: " + n;

    const section = document.querySelector(sezione);
    console.log(section);

    //Aggiunge il blocco alla section in HTML
    blocco.appendChild(blocco_imm);
    blocco_imm.appendChild(imm);
    blocco.appendChild(h1);
    h1.appendChild(tit);
    descr.appendChild(ingredienti);
    descr.appendChild(n_ordinate);    
    blocco.appendChild(descr);
    section.appendChild(blocco);
}