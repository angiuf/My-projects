<?php
    //Avvia la sessione
    session_start();

    //Ci connettiamo al DB
    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

    //Prendiamo la tabella di tutte le pizze
    $query = "SELECT * FROM Pizza";
    $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    $pizze = array();

    while($row = mysqli_fetch_assoc($res)){
        //Per ogni pizza prendiamo pizzeria, ingredienti, prezzo
        $query =  "SELECT Nome FROM Composizione C JOIN Ingrediente I ON C.Ingrediente=I.Codice WHERE C.Pizza=".$row['ID'];
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

        $subquery = "SELECT * FROM Possiede M JOIN Pizzeria P ON M.Menu=P.Menu WHERE M.Pizza=".$row["ID"];
        $subres = mysqli_query($conn, $subquery) or die("Errore: ".mysqli_error($conn));

        while($subrow = mysqli_fetch_assoc($subres)){
            $row["Pizzerie"][] = $subrow;
        }

        $pizze[] = $row;
    }

    echo json_encode($pizze);
?>