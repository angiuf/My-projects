<?php
    //Avvia la sessione
    session_start();

    //Distrugge la sessione
    session_destroy();
    //Svuota i cookie, anche per il ricordami
    setcookie("username", "");
    setcookie("userid", "");

    //Reindirizza al login
    header("Location: login.php");
    exit;
?>