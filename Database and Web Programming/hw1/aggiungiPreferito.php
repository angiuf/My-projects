<?php
     //Avviamo la sessione
     session_start();
    
     //Mi connetto al database
     require_once "dbinfo.php";
     $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());
 
     //Impostiamo la query
     $query = "INSERT INTO Preferiti(Cliente, Pizzeria) VALUES (".$_SESSION['userid'].", ".$_POST['id'].")";
 
     //Eseguo la query
     $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));
     
     mysqli_free_result($res);
     mysqli_close($conn);
?>