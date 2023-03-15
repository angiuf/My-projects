<?php
    //Avviamo la sessione
    session_start();

    //Ci connettiamo al db
    require_once "dbinfo.php";
    $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

    //Impostiamo la query
    //Se è la prima pizza che inseriamo nel carrello crea un nuovo ordine
    if(!$_SESSION["carrello"]){
        $_SESSION["carrello"] = array();

        //Crea la query; inserisci un nuovo ordine
        $query = "INSERT INTO Ordine_info(Cliente, Data) VALUES (".$_SESSION['userid'].", CURDATE())";
        $res = mysqli_query($conn, $query) or die("Errore: " + mysqli_error($conn));
        
        //Prende l'id dell'ordine
        $query = "SELECT MAX(ID) FROM Ordine_info";
        $res = mysqli_query($conn, $query);
        $id = mysqli_fetch_row($res)[0];

        //Aggiorna le variabili di sessione
        $_SESSION["carrello"] = array("Id" => "$id", "Pizze" => array());
    }

    $key = null;
    $i = 0;
    foreach($_SESSION["carrello"]["Pizze"] as $p){
        //Controlla se la pizza di qualla pizzeria è già stata ordinara
        if($p["Pizza_id"] === $_POST["pizza_id"] && $p["Pizzeria_id"] === $_POST["pizzeria_id"]){
            $key = $i;
            break;
        }
        $i++;
    }

    //Se la pizza era già nel carrello aggiorna solamente la quantità
    if($key !== null){
        $_SESSION["carrello"]["Pizze"][$key]["Quantita"] += $_POST["quantita"];
        $_SESSION["carrello"]["Pizze"][$key]["Prezzo"] += (float)$_POST['prezzo']*(int)$_POST['quantita'];
    }
    //Senno aggiunge la pizza all'ordine
    else{
        $pizza = array("Pizza_id" => $_POST['pizza_id'], "Nome_pizza" => $_POST['nome_pizza'], "Pizzeria_id" => $_POST['pizzeria_id'],
        "Nome_pizzeria" => $_POST['nome_pizzeria'], "Quantita" => $_POST['quantita'], "Prezzo" => (float)$_POST['prezzo']*(int)$_POST['quantita']);
        array_push($_SESSION["carrello"]["Pizze"], $pizza);
    }

    mysqli_free_result($res);
    mysqli_close($conn);

    echo print_r($_SESSION["carrello"]);
?>