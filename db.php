<?php
$servername = "localhost";
$username   = "u988676778_shivam_user";
$password   = "Shivam@Taxi#2025";
$dbname     = "u988676778_shivam_tours";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed");
}
?>
