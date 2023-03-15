<?php
    //Funzione per controllare che l'username sia unico
    
    function checkUsername($conn, $username){
        $query = "SELECT * FROM cliente WHERE Username='".$username."'";

        $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

        if(mysqli_num_rows($res) > 0) {
            return false;
        }else{
            return true;
        }
    }
?>