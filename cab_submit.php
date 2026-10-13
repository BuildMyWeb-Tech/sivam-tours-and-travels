<?php
require __DIR__ . '/db.php';

use PHPMailer\PHPMailer\PHPMailer;
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

date_default_timezone_set('Asia/Kolkata');

/* 🧰 Honeypot */
if (!empty($_POST['website'])) exit;

/* ⏱ Time-based spam check */
$load = intval($_POST['form_load_time'] ?? 0);
if (round(microtime(true) * 1000) - $load < 3000) exit;

/* Clean input */
function clean($d) {
    return htmlspecialchars(trim($d), ENT_QUOTES, 'UTF-8');
}

$name   = clean($_POST['name'] ?? '');
$phone  = clean($_POST['phone'] ?? '');
$pickup = clean($_POST['pickup'] ?? '');
$drop   = clean($_POST['drop_location'] ?? '');
$date   = clean($_POST['travel_date'] ?? '');
$pass   = clean($_POST['passengers'] ?? '');
$msg    = clean($_POST['message'] ?? '');

/* Validation */
if ($name === '' || !preg_match('/^[6-9]\d{9}$/', $phone)) {
    exit;
}

/* DB insert */
$stmt = $conn->prepare("
    INSERT INTO cab_bookings
    (name, phone, pickup, drop_location, travel_date, passengers, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "sssssis",
    $name,
    $phone,
    $pickup,
    $drop,
    $date,
    $pass,
    $msg
);
$stmt->execute();

/* Email config */
$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host       = 'smtp.hostinger.com';
$mail->SMTPAuth   = true;
$mail->Username   = 'contact@shivamtourstravels.in';
$mail->Password   = 'Shivam@Taxi#2025';
$mail->SMTPSecure = 'ssl';
$mail->Port       = 465;

/* Admin email */
$mail->setFrom(
    'contact@shivamtourstravels.in',
    'Shivam Tours & Travels'
);
$mail->addAddress('contact@shivamtourstravels.in');

$mail->isHTML(true);
$mail->Subject = '🚖 New Cab Booking Enquiry';
$mail->Body = "
    <b>Name:</b> $name<br>
    <b>Phone:</b> $phone<br>
    <b>Pickup:</b> $pickup<br>
    <b>Drop:</b> $drop<br>
    <b>Travel Date:</b> $date<br>
    <b>Passengers:</b> $pass<br>
    <b>Message:</b> $msg<br>
    <br>
    <b>Submitted on:</b> " . date('d M Y, h:i A') . "
";

$mail->send();

/* Success response for AJAX */
echo "SUCCESS";
