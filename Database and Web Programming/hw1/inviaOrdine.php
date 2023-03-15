<?php
    //Funzione per completare l'ordine e inserirlo nel database
    //Avvia la sessione
    session_start();

    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

    //Crea la query con tutte le pizze presenti nel carrello
    $query = "INSERT INTO Ordine(ID, Pizzeria, Pizza, Prezzo, Quantita) VALUES ";
    $i = 0;
    $q = null;
    foreach($_SESSION["carrello"]["Pizze"] as $pizza){
        if($i != 0){
            $q = ", ";
        }
        $q .= "(".$_SESSION["carrello"]["Id"].", ".$pizza["Pizzeria_id"].", ".$pizza["Pizza_id"].", "
        .$pizza["Prezzo"].", ".$pizza["Quantita"].")";

        $query .= $q;
        $i++;
    }

    //Esegue la query
    mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    //Ed aggiorna il prezzo totale di ordine_info
    $query = "UPDATE Ordine_info SET Totale=".$_POST["Totale"]." WHERE ID=".$_SESSION["carrello"]["Id"];
    mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));
    
    mysqli_close($conn);

    //Svuota il carrello
    $_SESSION["carrello"] = null;    
?>