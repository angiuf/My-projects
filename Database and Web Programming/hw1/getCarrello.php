<?php
    //Avviamo la sessione
    session_start();

    //Se il carrello non è vuoto lo restituisce altrimenti da null
    if(isset($_SESSION["carrello"])){
        echo json_encode($_SESSION["carrello"]["Pizze"]);   
    }else{
        echo json_encode(null);
    }
?>