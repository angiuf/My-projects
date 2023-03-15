<?php
    //Mi connetto al database
    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

    //Imposto la query
    $query = "SELECT * FROM Pizzeria";

    //Eseguo la query
    $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    //Array dove verranno inseriti risultati
    $pizzerie = array();

    //Aggiunge ogni risultato all'array
    while($row = mysqli_fetch_assoc($res)){

        $query = "SELECT Pizza, Prezzo, ID FROM Pizzeria Pizz JOIN Possiede M ON Pizz.Menu=M.Menu WHERE ID=".$row["Menu"];
        $res_menu = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

        //Array dove verranno inseriti risultati
        $menu = array();

        //Aggiunge ogni risultato all'array
        while($row_menu = mysqli_fetch_assoc($res_menu)){
            //Settiamo l'id della pizza
            $pizza["Id"] = $row_menu["Pizza"];
            //Prendiamo il nome della pizza
            $query = "SELECT Nome FROM Pizza WHERE ID=".$pizza["Id"];
            $res_nome = mysqli_query($conn, $query);
            $nome = mysqli_fetch_row($res_nome);
            $pizza["Nome"] = $nome[0];
            //Aggiungiamo gli ingredienti
            $query =  "SELECT Nome FROM Composizione C JOIN Ingrediente I ON C.Ingrediente=I.Codice WHERE C.Pizza=".$pizza['Id'];
            $res_ingr = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));
            $pizza["Ingredienti"] = "";
            $n_ingr = mysqli_num_rows($res_ingr);
            if($n_ingr > 0){
                for($i = 0; $i < ($n_ingr - 1); $i++){
                    $ingr = mysqli_fetch_row($res_ingr);
                    $pizza["Ingredienti"] .= "$ingr[0]".", ";
                }
                //Aggiunge l'ingrediente senza la virgola
                $ingr = mysqli_fetch_row($res_ingr);
                $pizza["Ingredienti"] .= "$ingr[0]";
            }
            //Aggiungiuamo il prezzo
            $pizza["Prezzo"] = $row_menu["Prezzo"];
            $pizza["Pizzeria"] = $row_menu["ID"];
            $menu[] = $pizza;
        }
        $row["Pizze_menu"] = $menu;
        $pizzerie[] = $row;
    }

    mysqli_free_result($res);
    mysqli_close($conn);

    //Crea e ritorna il JSON
    echo json_encode($pizzerie);
?>