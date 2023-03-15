<?php
    //Avvia la sessione
    session_start();
    
    //Cerca la pizza nel carrello e la rimuove
    $carrello = $_SESSION['carrello']['Pizze'];
    //Variabile per contare l'offset dell'array
    $i = 0;
    foreach($carrello as $pizza){
        if($pizza['Pizza_id'] === $_GET['pizza'] && $pizza['Pizzeria_id'] === $_GET['pizzeria']){
            \array_splice($carrello, $i, 1);
        }
        $i++;
    }

    $_SESSION['carrello']['Pizze'] = $carrello;
    echo print_r($_SESSION['carrello']);
?>