<?php

require_once __DIR__.'/../vendor/autoload.php';

use PhpOffice\PhpWord\IOFactory;

$file = __DIR__.'/help.docx';

echo 'Validating: '.$file.PHP_EOL;

if (! file_exists($file)) {
    exit('File does not exist'.PHP_EOL);
}

// Test 1: Open with PhpWord (validates it can be read back)
try {
    $document = IOFactory::load($file);
    echo 'PASS: PhpWord can read the document'.PHP_EOL;
    echo '  Sections: '.count($document->getSections()).PHP_EOL;
} catch (Exception $e) {
    exit('FAIL: PhpWord cannot read the document: '.$e->getMessage().PHP_EOL);
}

// Test 2: Validate all XML parts inside the docx
$zip = new ZipArchive;
if ($zip->open($file) !== true) {
    exit('FAIL: Cannot open file as ZIP'.PHP_EOL);
}

echo 'PASS: File is a valid ZIP archive'.PHP_EOL;

$xmlFiles = 0;
$failed = false;

for ($i = 0; $i < $zip->numFiles; $i++) {
    $name = $zip->getNameIndex($i);

    if (substr($name, -4) === '.xml' || substr($name, -5) === '.rels') {
        $xmlFiles++;
        $content = $zip->getFromIndex($i);
        $dom = new DOMDocument;

        // Suppress libxml warnings, check if XML is well-formed
        $previous = libxml_use_internal_errors(true);
        $loaded = $dom->loadXML($content);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $loaded) {
            echo 'FAIL: Malformed XML in: '.$name.PHP_EOL;
            $failed = true;
        }
    }
}

if (! $failed) {
    echo 'PASS: All '.$xmlFiles.' XML parts are well-formed'.PHP_EOL;
}

// Test 3: Check that [Content_Types].xml exists and is valid
$contentTypes = $zip->getFromName('[Content_Types].xml');
if ($contentTypes !== false) {
    echo 'PASS: [Content_Types].xml present'.PHP_EOL;
} else {
    echo 'FAIL: Missing [Content_Types].xml'.PHP_EOL;
    $failed = true;
}

$zip->close();

if ($failed) {
    exit('VALIDATION FAILED'.PHP_EOL);
}

echo 'VALIDATION PASSED - document should open in Word'.PHP_EOL;
