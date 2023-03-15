const iscr = document.querySelector('#iscriviti_button');
const iscr_form = document.forms['iscrizione'];
const login = document.querySelector('#login_button');
const login_form = document.forms['login'];
iscr.addEventListener('click', iscrform);
login.addEventListener('click', loginform);
const form = document.querySelector('#form_block');
const error_campi = document.querySelector('#err_campi');
const error_pwd = document.querySelector('#err_pwd');
const error_pwd_len = document.querySelector('#err_pwd_len');
const error_pwd_sc = document.querySelector('#err_pwd_sc');
const error_cell = document.querySelector('#err_cell');
const error_cred = document.querySelector('#err_cred');
const error_email = document.querySelector('#err_email');
const error_username = document.querySelector('#err_username');
const iscr_succ = document.querySelector('#succ_iscr');

//Aggiunge gli event listener per il form di login e di iscrizione
login_form.addEventListener('submit', checkLogin);
iscr_form.addEventListener('submit', checkIscr);

//Funzione chiamata sul click di "Iscriviti"
function iscrform(event){
    iscr.removeEventListener('click', iscrform);
    login.addEventListener('click', loginform);

    iscr_form.classList.remove('hidden');
    login_form.classList.add('hidden');

    //Nasconde tutti gli errori
    error_campi.classList.add('hidden');
    error_pwd.classList.add('hidden');
    error_pwd_sc.classList.add('hidden');
    error_pwd_len.classList.add('hidden');
    error_cell.classList.add('hidden');
    error_cred.classList.add('hidden');
    error_email.classList.add('hidden');
    error_username.classList.add('hidden');
    iscr_succ.classList.add('hidden');

    const input_error = document.querySelectorAll("input");
    for(i = 0; i < input_error.length; i++){
        input_error[i].classList.remove('in_error');
    }
}

//Funzione chiamata sul click di "Login"
function loginform(event){
    login.removeEventListener('click', loginform);
    iscr.addEventListener('click', iscrform);

    login_form.classList.remove('hidden');
    iscr_form.classList.add('hidden');

    //Nasconde tutti gli errori
    error_campi.classList.add('hidden');
    error_pwd.classList.add('hidden');
    error_pwd_len.classList.add('hidden');
    error_pwd_sc.classList.add('hidden');
    error_cell.classList.add('hidden');
    error_cred.classList.add('hidden');
    error_email.classList.add('hidden');
    error_username.classList.add('hidden');
    iscr_succ.classList.add('hidden');

    const input_error = document.querySelectorAll("input");
    for(i = 0; i < input_error.length; i++){
        input_error[i].classList.remove('in_error');
    }
}

//Controlla il form di login
function checkLogin(event) {    
    //Nasconde gli errori
    error_cred.classList.add('hidden');
    iscr_succ.classList.add('hidden');

    const input_error = document.querySelectorAll("input");
    for(i = 0; i < input_error.length; i++){
        input_error[i].classList.remove('in_error');
    }

    //Se i campi non sono tutti compilati mostra l'errore e non invia il form
    if(login_form.username.value.length==0 || login_form.password.value.length==0) {
        error_campi.classList.remove('hidden');
        
        event.preventDefault();
    }
}

//Controlla il form di iscrizione
function checkIscr(event) {
    //Nasconde gli errori
    error_campi.classList.add('hidden');
    error_pwd.classList.add('hidden');
    error_pwd_len.classList.add('hidden');
    error_pwd_sc.classList.add('hidden');
    error_cell.classList.add('hidden');
    error_email.classList.add('hidden');
    error_username.classList.add('hidden');
    iscr_succ.classList.add('hidden');

    const input_error = document.querySelectorAll("input");
    for(i = 0; i < input_error.length; i++){
        input_error[i].classList.remove('in_error');
    }
    
    //Se i campi non sono tutti compilati mostra l'errore
    if(iscr_form.nome.value.length==0 ||
         iscr_form.cognome.value.length==0 ||
         iscr_form.email.value.length==0 ||
         iscr_form.username.value.length==0 ||
         iscr_form.password.value.length==0 ||
         iscr_form.conf_password.value.length==0 ||
         iscr_form.indirizzo.value.length==0 ||
         iscr_form.cellulare.value.length==0) {
        
        error_campi.classList.remove('hidden');

        event.preventDefault();
    }

    //Se le password non coincidono mostra l'errore
    if(iscr_form.password.value !== iscr_form.conf_password.value) {
        error_pwd.classList.remove('hidden');
        const pwd = document.querySelector("input[name=conf_password]");
        pwd.classList.add('in_error');

        event.preventDefault();
    }

    //Se la password non rientra nella lunghezza corretta mostra l'errore
    if(iscr_form.password.value.length != 0){
        if(iscr_form.password.value.length < 8 || iscr_form.password.value.length > 20) {
            error_pwd_len.classList.remove('hidden');
            const pwd = document.querySelector("#iscrizione input[name=password]");
            pwd.classList.add('in_error');
    
            event.preventDefault();
        }
    }

    //Se la password non contiene caratteri speciali mostra l'errore
    if(iscr_form.password.value.length != 0){
        const special_characters = /[@#$%&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(!special_characters.test(iscr_form.password.value) || !/[a-z]/.test(iscr_form.password.value) ||
         !/[A-Z]/.test(iscr_form.password.value) || !/[1-9]/.test(iscr_form.password.value)) {
            error_pwd_sc.classList.remove('hidden');
            const pwd = document.querySelector("#iscrizione input[name=password]");
            pwd.classList.add('in_error');
    
            event.preventDefault();
        }
    }

    //Controlla che il cellulare sia fatto da soli numeri e sia lungo 10
    if(iscr_form.cellulare.value.length != 0) {
        if(!/^\d+$/.test(iscr_form.cellulare.value) || iscr_form.cellulare.value.length != 10) {
            error_cell.classList.remove('hidden');
            const pwd = document.querySelector("input[name=cellulare]");
            pwd.classList.add('in_error');
    
            event.preventDefault();
        }
    }
}