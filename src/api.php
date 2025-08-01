<?php
header('Content-Type: application/json');

// プロジェクトのルートディレクトリ
define('ROOT_PATH', __DIR__ . '/..');

// リクエストメソッドを取得
$method = $_SERVER['REQUEST_METHOD'];
// リクエストURIを取得
$uri = $_SERVER['REQUEST_URI'];

// APIエンドポイントごとの処理
switch ($method) {
    case 'POST':
        if (strpos($uri, '/api/upload-image') !== false) {
            handleUploadImage();
        } else if (strpos($uri, '/api/save-json') !== false) {
            handleSaveJson();
        }
        break;

    case 'DELETE':
        if (strpos($uri, '/api/delete-file') !== false) {
            handleDeleteFile();
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}

// 画像アップロードの処理
function handleUploadImage() {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => '画像ファイルがアップロードされていません。']);
        return;
    }
    
    $file = $_FILES['image'];
    $uniqueName = 'image-' . time() . '-' . uniqid() . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
    $uploadPath = ROOT_PATH . '/public/image/' . $uniqueName;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $imageUrl = '/image/' . $uniqueName;
        echo json_encode(['imageUrl' => $imageUrl]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => '画像の保存に失敗しました。']);
    }
}

// JSONファイル保存の処理
function handleSaveJson() {
    $data = json_decode(file_get_contents('php://input'), true);
    $jsonPath = $data['path'] ?? null;
    $jsonData = $data['data'] ?? null;

    if (!$jsonPath || !$jsonData) {
        http_response_code(400);
        echo json_encode(['error' => 'パスまたはデータが指定されていません。']);
        return;
    }

    $fullPath = ROOT_PATH . '/public/json/' . $jsonPath;
    $jsonDir = dirname($fullPath);
    if (!is_dir($jsonDir)) {
        mkdir($jsonDir, 0777, true);
    }
    
    if (file_put_contents($fullPath, json_encode($jsonData, JSON_PRETTY_PRINT)) !== false) {
        echo json_encode(['message' => 'OK']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'ファイルの保存に失敗しました。']);
    }
}

// ファイル削除の処理
function handleDeleteFile() {
    $data = json_decode(file_get_contents('php://input'), true);
    $filePath = $data['path'] ?? null;

    if (!$filePath) {
        http_response_code(400);
        echo json_encode(['error' => 'パスが指定されていません。']);
        return;
    }

    $fullPath = ROOT_PATH . '/public/' . $filePath;

    if (file_exists($fullPath)) {
        if (unlink($fullPath)) {
            echo json_encode(['message' => 'OK']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'ファイルの削除に失敗しました。']);
        }
    } else {
        echo json_encode(['message' => 'ファイルは存在しませんでした。']);
    }
}