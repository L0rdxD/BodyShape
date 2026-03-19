<?php
// Обработчик формы контактов BodyShape
// Защита от прямого доступа
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Настройки БД (из переменных окружения Docker)
$db_host = getenv('DB_HOST');
$db_port = getenv('DB_PORT');
$db_name = getenv('DB_NAME');
$db_user = getenv('DB_USER');
$db_password = getenv('DB_PASSWORD');

// Функция для очистки данных
function cleanInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Функция для валидации email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Функция для валидации телефона (российский формат)
function validatePhone($phone) {
    // Удаляем все символы кроме цифр и +
    $cleaned = preg_replace('/[^0-9+]/', '', $phone);
    // Проверяем, что номер начинается с +7 или 8 и содержит 10-11 цифр
    return preg_match('/^(\+7|8)[0-9]{10,11}$/', $cleaned);
}

// Получаем и очищаем данные из формы
$name = isset($_POST['name']) ? cleanInput($_POST['name']) : '';
$phone = isset($_POST['phone']) ? cleanInput($_POST['phone']) : '';
$email = isset($_POST['email']) ? cleanInput($_POST['email']) : '';
$message = isset($_POST['message']) ? cleanInput($_POST['message']) : '';

// Массив для ошибок
$errors = [];

// Валидация имени
if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
} elseif (strlen($name) < 2) {
    $errors[] = 'Имя должно содержать минимум 2 символа';
} elseif (strlen($name) > 100) {
    $errors[] = 'Имя слишком длинное (максимум 100 символов)';
}

// Валидация телефона
if (empty($phone)) {
    $errors[] = 'Телефон обязателен для заполнения';
} elseif (!validatePhone($phone)) {
    $errors[] = 'Некорректный формат телефона';
}

// Валидация email
if (empty($email)) {
    $errors[] = 'Email обязателен для заполнения';
} elseif (!validateEmail($email)) {
    $errors[] = 'Некорректный формат email';
}

// Валидация сообщения
if (empty($message)) {
    $errors[] = 'Сообщение обязательно для заполнения';
} elseif (strlen($message) < 10) {
    $errors[] = 'Сообщение должно содержать минимум 10 символов';
} elseif (strlen($message) > 1000) {
    $errors[] = 'Сообщение слишком длинное (максимум 1000 символов)';
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'errors' => $errors
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Сохранение в PostgreSQL
$dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $db_host, $db_port, $db_name);

try {
    $pdo = new PDO($dsn, $db_user, $db_password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $stmt = $pdo->prepare(
        'INSERT INTO submissions (name, phone, email, message, ip_address)
         VALUES (:name, :phone, :email, :message, :ip_address)'
    );

    $stmt->execute([
        ':name'       => $name,
        ':phone'      => $phone,
        ':email'      => $email,
        ':message'    => $message,
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => 'Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.'
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());

    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'errors' => ['Произошла ошибка при сохранении сообщения. Пожалуйста, попробуйте позже.']
    ], JSON_UNESCAPED_UNICODE);
}
?>

