<?php
    //Avvio la sessione
    session_start();

    //Mi connetto al database
    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

    $query = "SELECT * FROM Ordine_info WHERE Cliente=".$_SESSION["userid"]." AND Totale IS NOT NULL";

    $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    //Crea l'array per gli ordini
    $ordini = array();

    while($row = mysqli_fetch_assoc($res)){
        $row["Pizze_ordinate"] = array();

        //Per ogni ordine prende le pizze ordinate
        $sub_query = "SELECT O.ID AS ID, O.Pizzeria AS Pizzeria_id,
                 O.Pizza AS Pizza_id, O.Prezzo AS Prezzo, O.Quantita AS Quantita,
                  PP.Nome AS Pizzeria_nome, PP.Apertura AS Pizzeria_apertura, 
                  PP.Indirizzo AS Pizzeria_indirizzo, PP.Eta AS Pizzeria_eta, PP.Sconto AS Pizzeria_sconto,
                   P.ID AS Pizza_id, P.Nome AS Pizza_nome
                    FROM Ordine O JOIN Pizzeria PP ON O.Pizzeria=PP.ID JOIN Pizza P ON O.Pizza=P.ID WHERE O.ID=".$row["ID"];
        $sub_res = mysqli_query($conn, $sub_query) or die("Errore: ".mysqli_error($conn));

        while($sub_row = mysqli_fetch_assoc($sub_res)){
            //Aggiunge le pizze all'array
            $row["Pizze_ordinate"][] = $sub_row;
        }
        $ordini[] = $row;
    }

    echo json_encode($ordini);
?>