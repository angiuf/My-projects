<?php
    //Avvio la sessione
    session_start();

    //Mi connetto al database
    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

    //Eseguiamo l'operazione 1
    $query = "CALL op1(".$_SESSION["userid"].")";

    $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    //Restituiamo i risultati
    $query = "SELECT * FROM Pizze_pref";
    $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    $pizze_pref = array();

    while($row = mysqli_fetch_assoc($res)){
        //Prendiamo le informazioni della pizza
        $query = "SELECT * FROM Pizza WHERE ID=".$row["ID_Pizza"];
        $res_pizza = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

        if(mysqli_num_rows($res_pizza) > 0){
            $r = mysqli_fetch_assoc($res_pizza);
            $row["Nome"] = $r["Nome"];
            $row["Immagine"] = $r["Immagine"];
        }
        
        //Per ogni pizza prendiamo gli ingredienti
        $query =  "SELECT Nome FROM Composizione C JOIN Ingrediente I ON C.Ingrediente=I.Codice WHERE C.Pizza=".$row['ID_Pizza'];
        $res_ingr = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));
        $row["Ingredienti"] = "";
        $n_ingr = mysqli_num_rows($res_ingr);
        if($n_ingr > 0){
            for($i = 0; $i < ($n_ingr - 1); $i++){
                $ingr = mysqli_fetch_row($res_ingr);
                $row["Ingredienti"] .= "$ingr[0]".", ";
            }
            //Aggiunge l'ingrediente senza la virgola
            $ingr = mysqli_fetch_row($res_ingr);
            $row["Ingredienti"] .= "$ingr[0]";
        }

        $pizze_pref[] = $row;
    }

    echo json_encode($pizze_pref);
?>