<?php
    //Avviamo la sessione
    session_start();
    
    //Mi connetto al database
    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());


    //Impostiamo la query
    $id = $_COOKIE["userid"];
    $query = "SELECT Pizzeria FROM Preferiti WHERE Cliente='".$id."'";

    //Eseguo la query
    $ids = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

    if(mysqli_num_rows($ids) > 0){
        //Array dove verranno inseriti risultati
        $preferiti = array();

        //Aggiunge ogni risultato all'array
        while($id = mysqli_fetch_row($ids)){
            $query = "SELECT ID, Nome, Immagine FROM Pizzeria WHERE ID=$id[0]";
            $pizz = mysqli_query($conn, $query);
            $row = mysqli_fetch_assoc($pizz);

            $preferiti[] = $row;
        }

        mysqli_free_result($ids);
        mysqli_free_result($pizz);
        mysqli_close($conn);

        //Crea e ritorna il JSON
        echo json_encode($preferiti);
    }else{
        echo json_encode(null);
    }
?>