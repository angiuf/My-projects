<?php
    $emailCheck = true;
    $usernameCheck = true;
    $errore_iscr = false;
    $iscr_succ = false;
    $errore_login = false;

    //Avvia la sessione
    session_start();
    //Verifica se la sessione è attiva
    if(isset($_COOKIE["username"])){
        //Reindirizza alla home
        header('Location: home.php');
        exit;
    }
    
    //Verifica che username e password sono stati inseriti
    if(isset($_POST['username']) && isset($_POST['password'])){
        //Se abbiamo mandato le credenziali di login
        if($_POST['tipo'] == 'login'){
            //Si connette al database
            require 'dbinfo.php';
            $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']) or die("Errore: ".mysqli_connect_error());

            //Esegue l'escape delle stringhe
            $username = mysqli_real_escape_string($conn, $_POST["username"]);
            $password = mysqli_real_escape_string($conn, $_POST["password"]);

            //Prende l'utente e verifica la password
            $query = "SELECT * FROM cliente WHERE Username = '".$username."'";
            $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error());
            if(isset($res)){
                if(mysqli_num_rows($res) > 0){
                    $row = mysqli_fetch_assoc($res);
                    $hash = $row["Password"];
                    
                    //Confronta la password inserita con quella nel db
                    if(!password_verify($password, $hash)){
                        //Se abbiamo inserito l'opzione ricordami imposta un cookie di 30 giorni
                        if($_POST["ricordami"] == 'ricordami'){
                            setcookie("username", "$username", time()+60*60*24*30);
                            setcookie("userid", $row["ID"], time()+60*60*24*30);
                        }else{
                            setcookie("username", "$username");
                            setcookie("userid", $row["ID"]);
                        }
                        //Reindirizza alla home
                        header('Location: home.php');
                        exit;
                    }else{
                        //Altrimenti da l'errore nelle credenziali
                        $errore_login = true;
                    }                
                //Se non trova l'username da errore nelle credenziali 
                }else{
                    $errore_login = true;
                }
            }
            mysqli_free_result($res);
            mysqli_close($conn);
        }     
    }

    //Se i campi del form iscrizione sono presenti
    if(isset($_POST['nome']) && isset($_POST['cognome']) &&
    isset($_POST['email']) && isset($_POST['username']) &&
    isset($_POST['password']) && isset($_POST['conf_password']) &&
    isset($_POST['indirizzo']) && isset($_POST['cellulare'])) {
        
        if($_POST['tipo'] == 'iscrizione') {
            //Ci connettiamo al db
            require 'dbinfo.php';
            $conn = mysqli_connect($db['host'], $db['user'], $db['password'], $db['db']);

            //Effettuamo l'escape delle stringhe
            $nome = mysqli_real_escape_string($conn, $_POST["nome"]);
            $cognome = mysqli_real_escape_string($conn, $_POST["cognome"]);
            $email = mysqli_real_escape_string($conn, $_POST["email"]);
            $username = mysqli_real_escape_string($conn, $_POST["username"]);
            $password = mysqli_real_escape_string($conn, $_POST["password"]);
            $conf_password = mysqli_real_escape_string($conn, $_POST["conf_password"]);
            $indirizzo = mysqli_real_escape_string($conn, $_POST["indirizzo"]);
            $cellulare = mysqli_real_escape_string($conn, $_POST["cellulare"]);

            //Verifichiamo che l'email e l'username non siano già presenti nel db
            require_once "checkEmail.php";
            require_once "checkUsername.php";

            $emailCheck = checkEmail($conn, $email);
            $usernameCheck = checkUsername($conn, $username);

            //Fa l'hash della password da inserire nel db
            $hash = password_hash($password, PASSWORD_DEFAULT);

            //Se tutto è ok inserisce il nuovo utente nel db, altrimenti da errore
            if($emailCheck && $usernameCheck) {
                $query = "INSERT INTO cliente (Nome, Cognome, Email, Username, Password, Indirizzo, Cellulare) VALUES (
                    '".$nome."', '".$cognome."', '".$email."', '".$username."', '".$hash."', '".$indirizzo."', '".$cellulare."')";
                    
                $res = mysqli_query($conn, $query);
                $iscr_succ = true;
            }else{
                $errore_iscr = true;
            }

            mysqli_close($conn);
        }     
    }
?>


<html>
    <head>
        <title>PizzaLivery login</title>
        <meta name="viewport"content="width=device-width, initial-scale=1"> 
        <link rel="stylesheet" href="login.css">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet">     
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400&display=swap" rel="stylesheet">
        <script src="login.js" defer charset="UTF-8"></script> 
    </head>

    <body>
        <h1 id='logo'>PizzaLivery</h1>

        <div>
            <div id='block'>
                <div id='form_block'>
                    <h3>
                        <span id='login_button'>Log in</span><span>|</span><span id='iscriviti_button'>Iscriviti</span>
                    </h3>

                    <div class='form'>
                        <form name='login' method='post' id='login' class='<?php if($errore_iscr) echo 'hidden' ?>'>
                            <p>
                                <label>Username<br>
                                <input type='text' name='username' <?php 
                                    if(isset($username) && $_POST['tipo'] == 'login') echo "value='".$username."'"; 
                                ?> class=<?php
                                if($errore_login) echo ' in_error';
                                ?>></label>
                            </p>
                            <p>
                                <label>Password<br>
                                <input type='password' name='password' <?php 
                                    if(isset($password) && $_POST['tipo'] == 'login') echo "value='".$password."'"; 
                                ?>
                                class=<?php
                                if($errore_login) echo ' in_error';
                                ?>></label>
                            </p>
                            <p>
                                <label class='Ricordami'><input type='checkbox' name='ricordami' value='ricordami'>Ricordami</label>
                            </p>
                            <p>
                                <label class='invia'>&nbsp;<input type='submit'></label>
                            </p>
                            <input type='hidden' name='tipo' value='login'>

                        </form>

                        <form name='iscrizione' method='post' id='iscrizione' class='<?php if(!$errore_iscr) echo 'hidden' ?>'>
                            <p>
                                <label>Nome<br>
                                <input type='text' name='nome' <?php 
                                    if(isset($nome)) echo "value='".$nome."'"; 
                                ?>></label>
                            </p>
                            <p>
                                <label>Cognome<br>
                                <input type='text' name='cognome' <?php 
                                    if(isset($cognome)) echo "value='".$cognome."'"; 
                                ?>></label>
                            </p>
                            <p>
                                <label>Indirizzo email<br>
                                <input type='text' name='email' <?php 
                                    if(isset($email)) echo "value='".$email."'"; 
                                ?>
                                class=<?php
                                    if(!$emailCheck) echo ' in_error';
                                ?>></label>
                            </p>
                            <p>
                                <label>Username<br>
                                <input type='text' name='username' <?php 
                                    if(isset($username) && $_POST['tipo'] == 'iscrizione') echo "value='".$username."'";
                                ?>
                                class=<?php
                                    if(!$usernameCheck) echo ' in_error';
                                ?>></label>
                            </p>
                            <p>
                                <label>Password<br>
                                <input type='password' name='password' <?php 
                                    if(isset($password) && $_POST['tipo'] == 'iscrizione') echo "value='".$password."'";
                                ?>></label>
                            </p>
                            <p>
                                <label>Conferma password<br>
                                <input type='password' name='conf_password' <?php 
                                    if(isset($conf_password)) echo "value='".$conf_password."'"; 
                                ?>></label><br>
                            </p><p>
                                <label>Indirizzo<br>
                                <input type='text' name='indirizzo' <?php 
                                    if(isset($indirizzo)) echo "value='".$indirizzo."'"; 
                                ?>></label>
                            </p>
                            <p>
                                <label>Cellulare<br>
                                <input type='text' name='cellulare' <?php 
                                    if(isset($cellulare)) echo "value='".$cellulare."'"; 
                                ?>></label>
                            </p>
                            <p class='invia'>
                                <label class='invia'>&nbsp;<input type='submit'></label>
                            </p>
                            <input type='hidden' name='tipo' value='iscrizione'>
                        </form>
                    </div>   
                    <h5 class='error<?php if(!$errore_login) echo ' hidden'; ?>' id='err_cred'>Credenziali errate</h5>

                    <h5 class='error hidden' id='err_campi'>Compila tutti i campi</h5>
                    <h5 class='error hidden' id='err_pwd'>Le password non coincidono</h5>
                    <h5 class='error hidden' id='err_pwd_len'>La password deve essere tra 8 e 20 caratteri</h5>
                    <h5 class='error hidden' id='err_pwd_sc'>La password deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale</h5>
                    <h5 class='error hidden' id='err_cell'>Inserisci un cellulare valido</h5>
                            
                    <h5 class='error<?php if($emailCheck) echo ' hidden'; ?>' id='err_email'>Email già in uso</h5>
                    <h5 class='error<?php if($usernameCheck) echo ' hidden'; ?>' id='err_username'>Username già in uso</h5>                  
                    
                    <h4 <?php if(!$iscr_succ) echo "class='hidden'"; ?> id='succ_iscr'>Iscrizione avvenuta<br> con successo</h4>
                    
                </div>
            </div>
        </div>
    </body>

</html>