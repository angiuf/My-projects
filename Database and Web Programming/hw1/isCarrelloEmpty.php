<?php
//Pagina per controllare se il carrello è vuoto. Altrimenti aggiorna la quantità e il prezzo totale dell'ordine
    //Avvia la sessione
    session_start();

    //Crea il JSON da restituire
    $c = array();
    $c["Empty"] = true;
    //Se il carrello non è vuoto restituisce false e la quantità e il prezzo totale dell'ordine. Altrimenti ritorna true
    if(isset($_SESSION["carrello"])){
        if(count($_SESSION["carrello"]["Pizze"]) !== 0){
            $c["Empty"] = false;
            $tot = 0;
            $el = 0;
            foreach($_SESSION["carrello"]["Pizze"] as $pizza){
                $tot += $pizza["Prezzo"];
                $el += $pizza["Quantita"];
            }
            $c["Totale"] = $tot;
            $c["N_el"] = $el;
            echo json_encode($c);
        }else{
            echo json_encode($c);
        }
    }else{
        echo json_encode($c);
    }

?>