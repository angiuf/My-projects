//Esegue la fetch inserendo come parametro di ricerca Pizza
fetch("https://api.punkapi.com/v2/beers?food=Pizza").then(onResponse).then(onJSON);

function onResponse(response) {
    return response.json();
}

function onJSON(json) {
    const beers = json;

    for(beer of beers) {
        //Chiama la funzione per creare l'elemento HTML
        creaBirra(beer.name, beer.abv, beer.tagline, beer.description, beer.image_url);
    }
}

//Funzione per la creazione dell'elemento HTML
function creaBirra(nome, abv, tagline, descrizione, immagine){
    const cont = document.createElement('div');
    cont.classList.add('container');
    //Immagine
    const img = document.createElement('img');    
    //Se non vi è un immagine nel JSON ne inserisce una di default
    if(immagine !== null){
        img.src = immagine;
        img.classList.add('img');
    }else{
        img.src = 'images/birra_default.png'
        img.classList.add('img');
    }
    const tit = document.createElement('div');
    tit.classList.add('title');
    //Nome
    const name = document.createElement('h1');
    name.textContent = nome;
    //% alcolica
    const alch = document.createElement('h3');
    alch.textContent = abv + '%';
    //Categoria
    const tagl = document.createElement('h3');
    tagl.textContent = tagline;
    //Descrizione
    const descr = document.createElement('p');
    descr.textContent = descrizione;

    //Aggiunge gli elementi all'HTML nella sezione #birre
    cont.appendChild(img);
    cont.appendChild(tit);
    tit.appendChild(name);
    tit.appendChild(alch);
    cont.appendChild(tagl);
    cont.appendChild(descr);

    const sezione = document.querySelector('#birre');
    sezione.appendChild(cont);
}