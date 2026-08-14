<?php

$dir = __DIR__.'/screenshots';
$files = glob($dir.'/*');

foreach ($files as $file) {
    $h = file_get_contents($file, false, null, 0, 8);
    $hex = strtoupper(bin2hex($h));
    $name = basename($file);
    $size = filesize($file);

    if (str_starts_with($hex, '89504E470D0A1A0A')) {
        $type = 'PNG';
    } elseif (str_starts_with($hex, 'FFD8FF')) {
        $type = 'JPEG';
    } elseif (str_starts_with($hex, '47494638')) {
        $type = 'GIF';
    } elseif (str_starts_with($hex, '424D')) {
        $type = 'BMP';
    } else {
        $type = 'UNKNOWN';
    }

    // Compare detection with extension
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $match = ($type === 'PNG' && $ext === 'png') || ($type === 'JPEG' && in_array($ext, ['jpg', 'jpeg'])) ? 'OK' : 'MISMATCH';

    echo str_pad($name, 28).str_pad($type, 8).'ext='.str_pad($ext, 5).'size='.str_pad($size, 8).$match.PHP_EOL;
}
