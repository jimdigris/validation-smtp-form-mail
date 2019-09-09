<?php
// Файлы phpmailer
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';
// Переменные, которые отправляет пользователь
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];
$identifier = $_POST['identifier'];
$link_page = $_POST['link-page'];
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $msg = "ok";
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";                                          
    $mail->SMTPAuth   = true;
    // Настройки вашей почты
    $mail->Host       = 'smtp.yandex.ru'; // SMTP сервера
    $mail->Username   = 'ii@web-vluki.ru'; // Логин на почте
    $mail->Password   = 'yvecjdrenfzqbnbv'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom('ii@web-vluki.ru', 'web-vluki'); // Адрес самой почты и имя отправителя
    // Получатель письма
    $mail->addAddress('jimdigris@mail.ru');  
    $mail->addAddress('it@kurs60.ru'); // Ещё один, если нужен
    // Прикрипление файлов к письму
    if (!empty($_FILES['myfile']['name'][0])) {
        for ($ct = 0; $ct < count($_FILES['myfile']['tmp_name']); $ct++) {
            $uploadfile = tempnam(sys_get_temp_dir(), sha1($_FILES['myfile']['name'][$ct]));
            $filename = $_FILES['myfile']['name'][$ct];
            if (move_uploaded_file($_FILES['myfile']['tmp_name'][$ct], $uploadfile)) {
                $mail->addAttachment($uploadfile, $filename);
            } else {
                $msg .= 'Неудалось прикрепить файл ' . $uploadfile;
            }
        }   
    }
        // -----------------------
        // Само письмо
        // -----------------------
        $mail->isHTML(true);
    
        $mail->Subject = 'Сообщение с сайта';
        $mail->Body    = "
        <b>Идентификатор: </b> <span style='color: #ec0c0c;'>$identifier</span> <br>
        <b>Страница с которой пришел запрос: </b> <a href='$link_page' target='_blank'>$link_page</a><br>
        ---------------- ---------------- ---------------- <br><br>
        <b>Имя:</b> $name <br>
        <b>Почта: </b> $email <br>
        <b>Телефон: </b> $phone <br><br>
        <b>Сообщение: </b><br> $message <br><br>
        ";
    // Проверяем отравленность сообщения
    if ($mail->send()) {
        echo "$msg";
    } else {
    echo "Сообщение не было отправлено. Неверно указаны настройки вашей почты";
    }
} catch (Exception $e) {
    echo "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}