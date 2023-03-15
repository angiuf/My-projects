<?php
    //Avviamo la sessione
    session_start();

    //Verifica se la sessione è attiva
    if(!isset($_COOKIE['username'])){
        //Reindirizza al login
        header('Location: login.php');
        exit;
    }
?>

<html>
    <head>
        <title>PizzaLivery</title>
        <link rel="stylesheet" href="home.css">
        <link rel="stylesheet" href="pizze_preferite.css">
        <meta name="viewport"content="width=device-width, initial-scale=1"> 
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">     
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"> 
        <script src="pizze_preferite.js" defer charset="UTF-8"></script>
    </head>
    <body>
        <nav>
            <div class='left'>
                <h1 class='logo' id='logo_1'>PizzaLivery</h1>
                <h1 class='logo' id='logo_2'>PL</h1>
                <div id='links'>
                    <a href="home.php">Home</a>
                    <a href="pizze.php">Pizze</a>                                                                  
                </div>
            </div>
            <div class='right'>
                <a href="carrello.php"><img src="images/cart_white.png"></a>
                <img src="images/account_logo_white.png" alt="logo" id='profile_pic'>
            </div>
            
            <div class='hidden' id='profile_block'>
                <h3><?php echo $_SESSION["username"]?></h3>
                <h6><a href='i_miei_ordini.php'>I miei ordini</a></h6>
                <h6><a href='pizze_preferite.php'>Pizze preferite</a></h6>
                <h6><a href='logout.php'>Logout</a></h6>
            </div>

        </nav>

        <article>
            <div id="pizze_pref"></div>
        </article>

        <footer>
                <div class='footer_info'>
                    Andrea Giuffrida<br>
                    o46002237
                </div>
                <div class='footer_social'>
                    <img src='images/facebook.png'>
                    <img src='images/twitter.png'>
                    <img src='images/instagram.png'>
                </div>
        </footer>
    </body>
</html>
