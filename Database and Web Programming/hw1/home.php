<?php
    //Avvia sessione
    session_start();
    
    //Verifica se la sessione è attiva
    if(!isset($_COOKIE['username'])){
        //Reindirizza al login
        header('Location: login.php');
        exit;
    }else{
        //Salva i cookie nelle variabili di sessione
        $_SESSION["username"] = $_COOKIE["username"];
        $_SESSION["userid"] = $_COOKIE["userid"];
    }
?>

<html>
    <head>
        <title>PizzaLivery</title>
        <link rel="stylesheet" href="home.css">
        <link rel="stylesheet" href="modale.css">
        <meta name="viewport"content="width=device-width, initial-scale=1"> 
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">     
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"> 
        <script src="home.js" defer charset="UTF-8"></script> 
        <script src="birre_API.js" defer charset="UTF-8"></script>
        <script src="edamam_API.js" defer charset="UTF-8"></script>
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
                <h3><?php 
                    //Stampa lo username
                    echo $_SESSION["username"]
                    ?>
                </h3>
                <h6><a href='i_miei_ordini.php'>I miei ordini</a></h6>
                <h6><a href='pizze_preferite.php'>Pizze preferite</a></h6>
                <h6><a href='logout.php'>Logout</a></h6>
            </div>
        </nav>

        

        <header>
            <div id='header_center'>
                <h1>Cerca qui pizze e pizzerie</h1>
                <input type='text' id='search_box' placeholder="Cerca">
                    
            </div>
              
            <div class='overlay'></div>
        </header>
        <article>
            <section id="lista_preferiti" class="hidden">
                <h1>Pizzerie preferite</h1>
                <div></div>
            </section>
            <h1>Tutte le pizzerie</h1>
            <section id="lista_pizzerie">
                
            </section> 

            <h1>Birre da accompagnare alla pizza consigliate da PunkAPI</h1>
            <section id='birre'>
               
            </section>
            
            <section id='val_nutr'>
                <form>
                    <span id='val_nutr_tit'>Cerca i valori nutrizionali e gli ingredienti</span>
                    <div>
                        <input type='text' id='cerca_val_nutr' placeholder="Inserisci una pizza">
                        <input type='submit' id='submit' value='Cerca'>
                    </div>
                </form>

                <div id='nutr_cont'>
                    
                </div>


            </section>
            <a href="carrello.php" id="vai_a_carrello"></a>
        </article>

        <div id="modale" class='hidden' tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> 
            <div id='menu_block'></div>
        </div>

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