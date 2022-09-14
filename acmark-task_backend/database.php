<?php
    define('DB_HOST', 'localhost');
    define('DB_USER', 'host');
    define('DB_PASS', 'hosthost');
    define('DB_NAME', 'acmark-task');

    // Create connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    //Check connection
    if($conn->connect_error) {
        die('Connection Failed ' . $conn->connect_error);
    }
?>