<?php
    //Codici per l'accesso all'API
    $app_id = "9eade77e";
    $app_key = "e09342358eaa3454f6f4cab68199a5b3";
    $max_count = 10;
    $ricetta = $_GET["q"];

    //Codifica il parametro passato dal js
    $ricetta = urlencode($ricetta);
    $url = "https://api.edamam.com/search?q=".$ricetta."&app_id=".$app_id."&app_key=".$app_key."&to=".$max_count;

    //Setta il curl
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, "$url");
    $res = curl_exec($curl);
    curl_close($curl);
    
    return $res;
?>