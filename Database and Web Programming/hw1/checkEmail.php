<?php
    //Funzione per controllare che l'email sia unica

    function checkEmail($conn, $email){
        $query = "SELECT * FROM cliente WHERE Email='".$email."'";

        $res = mysqli_query($conn, $query) or die("Errore: ".mysqli_error($conn));

        if(mysqli_num_rows($res) > 0) {
            return false;
        }else{
            return true;
        }
    }
?>
