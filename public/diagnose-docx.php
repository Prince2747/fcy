<?php

$zip = new ZipArchive;
$zip->open(__DIR__.'/help.docx');

$xml = $zip->getFromName('word/document.xml');

// Find lines with raw ampersands that aren't valid entities
$lines = explode("\n", $xml);

foreach ($lines as $i => $line) {
    // Look for '&' not followed by a valid entity
    if (preg_match('/&(?!(amp|lt|gt|quot|apos|#\d+);)/', $line)) {
        echo 'Line '.($i + 1).' has raw ampersand:'.PHP_EOL;
        echo substr($line, 0, 400).PHP_EOL;
        echo '----------------------------------------'.PHP_EOL;
    }
}

$zip->close();
