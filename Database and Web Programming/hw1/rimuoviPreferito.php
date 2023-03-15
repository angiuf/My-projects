<?php
     //Avviamo la sessione
     session_start();
    
     //Mi connetto al database
     require_once "dbinfo.php";
     $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());
 
     //Impostiamo la query
     $query = "DELETE FROM Preferiti WHERE Cliente=".$_SESSION['userid']." AND Pizzeria=".$_POST['id'];

     //Eseguo la query
     $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));
     
     mysqli_close($conn);
?>