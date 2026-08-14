<?php

require_once __DIR__.'/../vendor/autoload.php';

use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\Shared\Converter;
use PhpOffice\PhpWord\SimpleType\Jc;
use PhpOffice\PhpWord\SimpleType\TblWidth;

// =========================================================
// PHPWORD SETUP
// =========================================================

$phpWord = new PhpWord;

// Ensure all text content is XML-escaped when written to the document.
// This prevents characters like "<" (e.g. the "Draft <- Rejected..." workflow
// arrows) from breaking word/document.xml and making Word refuse to open the file.
Settings::setOutputEscapingEnabled(true);

$properties = $phpWord->getDocInfo();
$properties->setCreator('Gadaa Bank S.C.');
$properties->setTitle('FCY Operations Portal - User Manual');
$properties->setDescription('User Manual for Foreign Currency (FCY) Operations Portal');
$properties->setCategory('User Manual');
$properties->setLastModifiedBy('Gadaa Bank S.C.');

$phpWord->setDefaultFontName('Helvetica');
$phpWord->setDefaultFontSize(11);

// =========================================================
// STYLE DEFINITIONS
// =========================================================

$phpWord->addTitleStyle(1, [
    'size' => 18,
    'bold' => true,
    'color' => '1a1a1a',
], [
    'spaceBefore' => 450,
    'spaceAfter' => 300,
    'borderBottom' => [
        'size' => 12,
        'color' => 'c0392b',
    ],
]);

$phpWord->addTitleStyle(2, [
    'size' => 14,
    'bold' => true,
    'color' => '2c3e50',
], [
    'spaceBefore' => 375,
    'spaceAfter' => 150,
]);

$phpWord->addTitleStyle(3, [
    'size' => 12,
    'bold' => true,
    'color' => '34495e',
], [
    'spaceBefore' => 270,
    'spaceAfter' => 120,
]);

$phpWord->addNumberingStyle('bulletList', [
    'type' => 'multilevel',
    'levels' => [
        ['format' => 'bullet', 'text' => '•', 'alignment' => 'left'],
    ],
]);
$phpWord->addNumberingStyle('numberedList', [
    'type' => 'multilevel',
    'levels' => [
        ['format' => 'decimal', 'text' => '%1.', 'alignment' => 'left'],
    ],
]);

// =========================================================
// HELPER FUNCTIONS
// =========================================================

function addNote($section, $boldPrefix, $text)
{
    $table = $section->addTable([
        'width' => 100,
        'unit' => TblWidth::PERCENT,
        'borderSize' => 0,
        'borderColor' => 'FFFFFF',
    ]);
    $cell = $table->addRow()->addCell(Converter::cmToTwip(16), [
        'bgColor' => 'fef9e7',
        'borderLeft' => ['size' => 24, 'color' => 'f1c40f'],
        'valign' => 'top',
    ]);
    $textRun = $cell->addTextRun(['spaceAfter' => 0]);
    $textRun->addText($boldPrefix.' ', ['bold' => true, 'color' => '7d6608']);
    $textRun->addText($text);
    $section->addTextBreak(1);
}

function addInfoBox($section, $boldPrefix, $text)
{
    $table = $section->addTable([
        'width' => 100,
        'unit' => TblWidth::PERCENT,
        'borderSize' => 0,
        'borderColor' => 'FFFFFF',
    ]);
    $cell = $table->addRow()->addCell(Converter::cmToTwip(16), [
        'bgColor' => 'eaf2f8',
        'borderLeft' => ['size' => 24, 'color' => '2980b9'],
        'valign' => 'top',
    ]);
    $textRun = $cell->addTextRun(['spaceAfter' => 0]);
    $textRun->addText($boldPrefix.' ', ['bold' => true]);
    $textRun->addText($text);
    $section->addTextBreak(1);
}

function addScreenshot($section, $imagePath, $caption)
{
    if (! file_exists($imagePath)) {
        return;
    }

    [$imgWidth, $imgHeight] = getimagesize($imagePath);

    // Scale the screenshot to fit within the page width (max ~14.5cm at 96dpi)
    $maxWidth = 550;
    $maxHeight = 350;

    $ratio = min($maxWidth / $imgWidth, $maxHeight / $imgHeight, 1);

    $width = (int) ($imgWidth * $ratio);
    $height = (int) ($imgHeight * $ratio);

    $section->addImage($imagePath, [
        'width' => $width,
        'height' => $height,
        'alignment' => Jc::CENTER,
        'spaceBefore' => 240,
        'spaceAfter' => 60,
    ]);

    $section->addText($caption, ['size' => 9, 'italic' => true, 'color' => '666666'], ['alignment' => Jc::CENTER, 'spaceAfter' => 240]);
}

// =========================================================
// LOGO
// =========================================================

$logoPath = __DIR__.'/mainlogo.png';

if (! file_exists($logoPath)) {
    exit('Error: Logo file not found at: '.$logoPath);
}

[$imgWidth, $imgHeight] = getimagesize($logoPath);
$logoHeight = 68;
$logoWidth = (int) (($imgWidth / $imgHeight) * $logoHeight);

// =========================================================
// CREATE SECTION
// =========================================================

$section = $phpWord->addSection([
    'paperSize' => 'A4',
    'marginTop' => 1587,
    'marginBottom' => 1247,
    'marginLeft' => 1417,
    'marginRight' => 1417,
]);

// =========================================================
// COVER PAGE
// =========================================================

$section->addImage($logoPath, [
    'width' => $logoWidth,
    'height' => $logoHeight,
    'alignment' => Jc::CENTER,
]);

$section->addTextBreak(4);

$section->addText('USER MANUAL', ['size' => 10, 'color' => '666666'], ['alignment' => Jc::CENTER, 'spaceAfter' => 600]);

$section->addText('Foreign Currency (FCY)', ['size' => 26, 'bold' => true, 'color' => '1a1a1a'], ['alignment' => Jc::CENTER, 'spaceAfter' => 0]);
$section->addText('Operations Portal', ['size' => 26, 'bold' => true, 'color' => '1a1a1a'], ['alignment' => Jc::CENTER, 'spaceAfter' => 400]);

$section->addText('Version 1.0.0', ['size' => 12, 'color' => '555555'], ['alignment' => Jc::CENTER, 'spaceAfter' => 100]);
$section->addText('July, 2026', ['size' => 11, 'color' => '777777'], ['alignment' => Jc::CENTER, 'spaceAfter' => 800]);
$section->addText('Gadaa Bank S.C.', ['size' => 13, 'bold' => true, 'color' => '333333'], ['alignment' => Jc::CENTER, 'spaceAfter' => 60]);
$section->addText('Ethiopia, Addis Ababa', ['size' => 11, 'color' => '555555'], ['alignment' => Jc::CENTER]);

// =========================================================
// TABLE OF CONTENTS
// =========================================================

$section->addPageBreak();
$section->addText('Contents', ['size' => 18, 'bold' => true, 'color' => '1a1a1a'], ['alignment' => Jc::CENTER, 'spaceAfter' => 600]);

$tocItems = [
    ['1. Objectives of FCY', '3'],
    ['2. Scope of The Document', '3'],
    ['3. Pre-conditions', '3'],
    ['4. Main System Features', '3'],
    ['   4.1. Login functionality', '3'],
    ['   4.2. General Dashboard Statistics', '3'],
    ['   4.3. Add/Edit/View/Deactivate/Activate Customers', '3'],
    ['   4.4. Create/View/Edit FCY Requests', '3'],
    ['   4.5. FCY Request Workflow (Submit, Check, Approve, Reject)', '3'],
    ['   4.6. Manage Currencies', '3'],
    ['   4.7. Manage Payment Methods', '3'],
    ['   4.8. Generate Reports and Export', '3'],
    ['   4.9. Notifications System', '3'],
    ['5. Screen Flow', '3'],
    ['   5.1. System Login Screen', '3'],
    ['   5.2. General Dashboard Statistics', '4'],
    ['   5.3. Customer Registration', '4'],
    ['   5.4. FCY Request List', '5'],
    ['   5.5. Create FCY Request', '5'],
    ['   5.6. View FCY Request Details', '6'],
    ['   5.7. FCY Request Workflow', '6'],
    ['   5.8. Edit FCY Request', '7'],
    ['   5.9. Currency Management', '7'],
    ['   5.10. Payment Method Management', '7'],
    ['   5.11. Reports and Export', '7'],
    ['   5.12. Notifications', '8'],
];

foreach ($tocItems as $tocItem) {
    $isSub = str_starts_with($tocItem[0], '   ');
    $title = trim($tocItem[0]);
    $tocStyle = $isSub ? ['size' => 10.5, 'color' => '333333'] : ['size' => 11, 'bold' => true, 'color' => '1a1a1a'];
    $tocTable = $section->addTable([
        'width' => 100,
        'unit' => TblWidth::PERCENT,
        'borderSize' => 0,
    ]);
    $tocRow = $tocTable->addRow();
    $tocRow->addCell(Converter::cmToTwip(12.5))->addText($title, $tocStyle, ['spaceAfter' => 0]);
    $tocRow->addCell(Converter::cmToTwip(1.5), ['alignment' => Jc::RIGHT])->addText($tocItem[1], $tocStyle, ['spaceAfter' => 0]);
}

// =========================================================
// SECTION 1: OBJECTIVES
// =========================================================

$section->addPageBreak();
$section->addTitle('1. Objectives of FCY', 1);
$section->addText('The primary goal of this system is to digitize and streamline the foreign currency request management process at Gadaa Bank S.C. The FCY Operations Portal enables the bank to manage customer registrations, process foreign currency requests from importers, and facilitate a structured Maker-Checker-Approver workflow for efficient request handling and approval.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

// =========================================================
// SECTION 2: SCOPE
// =========================================================

$section->addTitle('2. Scope of The Document', 1);
$section->addText('The key jobs that a user may perform on the system are illustrated in this document, along with the processes needed to complete each activity. This manual covers the main features available to users with different roles within the FCY Operations Portal.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

// =========================================================
// SECTION 3: PRE-CONDITIONS
// =========================================================

$section->addTitle('3. Pre-conditions', 1);
$section->addListItem('For access to the system, a user must have an account.', 0, null, null, 'numberedList');
$section->addListItem('To access system functionality, a user must be granted a privilege (FCY role: Maker, Checker, or Approver).', 0, null, null, 'numberedList');
$section->addListItem('A user must have an active account to log in.', 0, null, null, 'numberedList');

// =========================================================
// SECTION 4: MAIN SYSTEM FEATURES
// =========================================================

$section->addTitle('4. Main System Features', 1);

$features = [
    '4.1. Login functionality',
    '4.2. General Dashboard Statistics',
    '4.3. Add/Edit/View/Deactivate/Activate Customers',
    '4.4. Create/View/Edit FCY Requests',
    '4.5. FCY Request Workflow',
    '4.6. Manage Currencies',
    '4.7. Manage Payment Methods',
    '4.8. Generate Reports and Export',
    '4.9. Notifications System',
];

foreach ($features as $feature) {
    $section->addListItem($feature, 0, null, null, 'bulletList');
}

// =========================================================
// SECTION 5: SCREEN FLOW
// =========================================================

$section->addTitle('5. Screen Flow', 1);

// --- 5.1 LOGIN ---
$section->addTitle('5.1. System Login Screen', 2);
$section->addText('Simply enter your username and password to log in to the system if you already have an account and it is enabled. If not, or if you do not have an account, contact the system administrator to get one set up or have your account activated.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

addNote($section, 'Note:', 'As a result of the multiple responsibilities on this system, each user will be directed to a different page depending on their function and privilege. The system uses role-based access control to determine which features are available to each user.');

$section->addText('User Roles:', ['bold' => true], ['spaceBefore' => 120, 'spaceAfter' => 60]);

$roleTable = $section->addTable([
    'width' => 100,
    'unit' => TblWidth::PERCENT,
    'borderSize' => 1,
    'borderColor' => 'dddddd',
]);

$roleTable->addRow();
$roleTable->addCell(Converter::cmToTwip(5), ['bgColor' => 'c0392b', 'valign' => 'center'])->addText('Role', ['bold' => true, 'color' => 'FFFFFF']);
$roleTable->addCell(Converter::cmToTwip(11), ['bgColor' => 'c0392b', 'valign' => 'center'])->addText('Capabilities', ['bold' => true, 'color' => 'FFFFFF']);

$roles = [
    ['FCY Maker', 'Register customers, create/edit/submit FCY requests, view reports'],
    ['FCY Checker', 'Review requests, approve and forward to approver, or reject back to maker'],
    ['FCY Approver', 'Final approval or rejection of requests, view reports'],
    ['Admin', 'Manage currencies, payment methods, and all system settings'],
];

foreach ($roles as $i => $role) {
    $bgColor = ($i % 2 === 0) ? 'f8f9fa' : 'FFFFFF';
    $roleTable->addRow();
    $roleTable->addCell(Converter::cmToTwip(5), ['bgColor' => $bgColor])->addText($role[0]);
    $roleTable->addCell(Converter::cmToTwip(11), ['bgColor' => $bgColor])->addText($role[1]);
}

addScreenshot($section, __DIR__.'/screenshots/login.PNG', 'Figure 5.1: System Login Screen');

// --- 5.2 DASHBOARD ---
$section->addPageBreak();
$section->addTitle('5.2. General Dashboard Statistics', 2);
$section->addText('Upon logging in, the user is presented with a dashboard showing:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$dashboardItems = [
    'Total Importers - The total number of registered customers in the system.',
    'Total Requests - The total number of FCY requests created.',
    'New This Month - The number of new customers registered in the current month.',
    'Recent Registrations - A list of the most recently registered customers.',
    'Recent FCY Requests - A list of the most recent FCY requests with their statuses.',
    'Quick Actions - Shortcut buttons to register a customer, view FCY requests, or create a new request.',
];

foreach ($dashboardItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

addInfoBox($section, 'Tip:', 'The dashboard provides a quick overview of the system activity. Use the "View all" links to navigate to the full lists.');

addScreenshot($section, __DIR__.'/screenshots/dashboard.PNG', 'Figure 5.2: General Dashboard Statistics');

// --- 5.3 CUSTOMER REGISTRATION ---
$section->addTitle('5.3. Customer Registration', 2);
$section->addText('To register a new customer, click the "Register New Customer" button on the Customer Registry page. A dialog form will appear with the following fields:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$registrationFields = [
    'Branch of the Customer - Select the branch from the dropdown list.',
    'Name of the Customer (Importer) - Enter the official registered name of the importer.',
    'NBE ACC. NO - Enter the National Bank of Ethiopia account number.',
    'TIN Number - Enter the Tax Identification Number.',
];

foreach ($registrationFields as $field) {
    $section->addListItem($field, 0, null, null, 'numberedList');
}

$section->addText('To view a customer\'s details, click the "View" (eye icon) button. To edit a customer\'s information, click the "Edit" (pencil icon) button. To deactivate a customer, click the "Deactivate" button. An inactive customer can be reactivated by clicking the "Activate" (power icon) button.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

addNote($section, 'Note:', 'The system checks for duplicate NBE account numbers and TIN numbers. If a duplicate is detected, a warning message will be displayed.');

$section->addText('Customers can be filtered by:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 60]);

$filterItems = [
    'Search by importer name, NBE account number, or TIN number',
    'Filter by branch',
    'Filter by status (Active / Inactive)',
];

foreach ($filterItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

addScreenshot($section, __DIR__.'/screenshots/customers.PNG', 'Figure 5.3: Customer Registration');

// --- 5.4 FCY REQUEST LIST ---
$section->addPageBreak();
$section->addTitle('5.4. FCY Request List', 2);
$section->addText('Select "FCY Requests" from the navigation menu to access the list of all foreign currency requests. The page displays:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$requestListItems = [
    'Statistics Cards - Total requests, pending checker, pending approver, and approved counts.',
    'Search and Filter - Search by request number, customer name, or amount. Filter by request status.',
    'Requests Table - Displays request number, customer name, currency, amount, status badge, date, and a "View" action button.',
];

foreach ($requestListItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

$section->addText('Click the "New Request" button to create a new FCY request.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

addInfoBox($section, 'Tip:', 'Use the status filter to quickly find requests that need your attention. The statistics cards at the top provide a quick summary of the current workload.');

addScreenshot($section, __DIR__.'/screenshots/requests-lists.PNG', 'Figure 5.4: FCY Request List');

// --- 5.5 CREATE FCY REQUEST ---
$section->addTitle('5.5. Create FCY Request', 2);
$section->addText('Click the "New Request" button to open the FCY request creation form. The form is organized into sections:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$section->addTitle('Customer Information', 3);
$section->addListItem('Select a customer from the dropdown (shows importer name and NBE account number).', 0, null, null, 'bulletList');
$section->addListItem('If the customer is not yet registered, click "New" to open an inline customer registration form.', 0, null, null, 'bulletList');
$section->addListItem('Select the supplier country from the dropdown.', 0, null, null, 'bulletList');

$section->addTitle('Proforma Invoice', 3);
$section->addListItem('Enter the proforma invoice number.', 0, null, null, 'bulletList');
$section->addListItem('Select the proforma invoice date.', 0, null, null, 'bulletList');

$section->addTitle('Payment and Currency Details', 3);
$section->addListItem('Select the method of payment (e.g., Letter of Credit, Telegraphic Transfer, etc.).', 0, null, null, 'bulletList');
$section->addListItem('Select the FCY currency (e.g., USD, EUR, GBP).', 0, null, null, 'bulletList');
$section->addListItem('Enter the FCY amount requested.', 0, null, null, 'bulletList');
$section->addListItem('Enter the total amount in USD.', 0, null, null, 'bulletList');

$section->addTitle('Import Details', 3);
$section->addListItem('Describe the items being imported.', 0, null, null, 'bulletList');
$section->addListItem('Add any optional notes.', 0, null, null, 'bulletList');

$section->addText('Click "Save as Draft" to save the request. The request will be created in "Draft" status and can be submitted later.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

addScreenshot($section, __DIR__.'/screenshots/request-create.PNG', 'Figure 5.5: Create FCY Request');

// --- 5.6 VIEW REQUEST DETAILS ---
$section->addPageBreak();
$section->addTitle('5.6. View FCY Request Details', 2);
$section->addText('Click the "View" button on any request in the list to see the full details. The detail page shows:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$detailItems = [
    'Request Number - The unique identifier (e.g., GDA-FCY-0000000001).',
    'Status Badge - The current status of the request.',
    'Customer Information - Importer name, branch, NBE account number, supplier country.',
    'Proforma Invoice - Invoice number, invoice date, payment method.',
    'Currency and Amount - Currency code, FCY amount requested, total amount in USD.',
    'Import Items - Description of the items being imported.',
    'Activity and Notes - Maker notes, checker notes, and approver notes with timestamps.',
    'Actions - Workflow action buttons based on the user\'s role and the request status.',
];

foreach ($detailItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

addScreenshot($section, __DIR__.'/screenshots/request-detail.PNG', 'Figure 5.6: View FCY Request Details');

// --- 5.7 WORKFLOW ---
$section->addTitle('5.7. FCY Request Workflow', 2);
$section->addText('The FCY system follows a three-stage approval workflow:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$flowTable = $section->addTable([
    'width' => 100,
    'unit' => TblWidth::PERCENT,
    'borderSize' => 0,
    'borderColor' => 'FFFFFF',
]);
$flowCell = $flowTable->addRow()->addCell(Converter::cmToTwip(16), [
    'bgColor' => 'f0f0f0',
    'valign' => 'top',
]);
$flowCell->addText('Draft -> Pending Checker -> Pending Approver -> Approved', ['size' => 10], ['alignment' => Jc::CENTER, 'spaceAfter' => 100]);
$flowCell->addText('Draft <- Rejected by Checker', ['size' => 10], ['alignment' => Jc::CENTER, 'spaceAfter' => 100]);
$flowCell->addText('Pending Checker -> Rejected by Checker -> Draft (Re-editable)', ['size' => 10], ['alignment' => Jc::CENTER, 'spaceAfter' => 100]);
$flowCell->addText('Pending Approver -> Rejected by Approver (Final)', ['size' => 10], ['alignment' => Jc::CENTER]);

$section->addTextBreak(1);
$section->addText('Workflow Steps:', ['bold' => true], ['spaceBefore' => 200, 'spaceAfter' => 60]);

$section->addListItem('Maker creates a request (status: Draft) and submits it for checking (status: Pending Checker).', 0, null, null, 'numberedList');
$section->addListItem('Checker reviews the request. They can either:', 0, null, null, 'numberedList');
$section->addListItem('Approve and forward to the approver (status: Pending Approver).', 1, null, null, 'numberedList');
$section->addListItem('Reject and send back to the maker for corrections (status: Rejected by Checker).', 1, null, null, 'numberedList');
$section->addListItem('Approver performs the final review. They can either:', 0, null, null, 'numberedList');
$section->addListItem('Approve the request (status: Approved).', 1, null, null, 'numberedList');
$section->addListItem('Reject the request (status: Rejected by Approver - final).', 1, null, null, 'numberedList');

addNote($section, 'Note:', 'If a request is rejected by the checker, the maker can edit and resubmit it. If rejected by the approver, the request is final and cannot be resubmitted.');

addScreenshot($section, __DIR__.'/screenshots/request-workflow.PNG', 'Figure 5.7: FCY Request Workflow');

// --- 5.8 EDIT REQUEST ---
$section->addPageBreak();
$section->addTitle('5.8. Edit FCY Request', 2);
$section->addText('A maker can edit a request only when it is in "Draft" or "Rejected by Checker" status. To edit, navigate to the request detail page and click the "Edit Request" button. The edit form is pre-populated with the existing data. Make the necessary changes and click "Update Request" to save.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

addScreenshot($section, __DIR__.'/screenshots/request-edit.jpg', 'Figure 5.8: Edit FCY Request');

// --- 5.9 CURRENCY MANAGEMENT ---
$section->addTitle('5.9. Currency Management', 2);
$section->addText('To manage currencies, go to the "Settings" section and select "Currencies". From this page, you can:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$currencyItems = [
    'Add a Currency - Click "Add Currency" and enter the currency code (3-letter ISO code, e.g., USD), currency name (e.g., US Dollar), and optional symbol (e.g., $).',
    'Edit a Currency - Click the "Edit" (pencil icon) button next to any currency to modify its details.',
    'Search - Search currencies by code, name, or symbol.',
];

foreach ($currencyItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

addInfoBox($section, 'Tip:', 'Currency codes must be unique and follow the ISO 4217 standard (3-letter codes).');

addScreenshot($section, __DIR__.'/screenshots/currencies.PNG', 'Figure 5.9: Currency Management');

// --- 5.10 PAYMENT METHOD MANAGEMENT ---
$section->addTitle('5.10. Payment Method Management', 2);
$section->addText('To manage payment methods, go to the "Settings" section and select "Payment Methods". From this page, you can:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$paymentItems = [
    'Add a Payment Method - Click "Add Payment Method" and enter the name (e.g., Letter of Credit) and an optional code (e.g., LC).',
    'Edit a Payment Method - Click the "Edit" (pencil icon) button next to any payment method to modify its details.',
    'Search - Search payment methods by name or code.',
];

foreach ($paymentItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

addScreenshot($section, __DIR__.'/screenshots/payment-methods.PNG', 'Figure 5.10: Payment Method Management');

// --- 5.11 REPORTS ---
$section->addTitle('5.11. Reports and Export', 2);
$section->addText('Go to the "Reports" section to view and export FCY request data. The reports page provides:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$reportItems = [
    'Filters - Filter by status, customer, currency, payment method, and date range (from/to).',
    'Export Options - Export the filtered data as CSV or Excel files.',
    'Results Table - Displays the filtered requests with request number, customer, currency, amount, status, and date.',
];

foreach ($reportItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

$section->addText('To export, click "Export CSV" or "Export Excel". The exported file will include all columns: serial number, request number, financial year, application date, branch, importer name, NBE account number, TIN number, proforma invoice number and date, payment method, currency, FCY amount, total amount in USD, importing items, supplier country, and approval date.', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

addScreenshot($section, __DIR__.'/screenshots/reports.PNG', 'Figure 5.11: Reports and Export');

// --- 5.12 NOTIFICATIONS ---
$section->addPageBreak();
$section->addTitle('5.12. Notifications', 2);
$section->addText('The notification system keeps users informed about important events in the FCY request workflow. Notifications are generated when:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$notificationItems = [
    'A new FCY request is submitted for checking.',
    'A request is checked and forwarded to the approver.',
    'A request is approved.',
    'A request is rejected (by checker or approver).',
];

foreach ($notificationItems as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

$section->addText('To view notifications, go to the "Notifications" page. From this page, you can:', null, ['alignment' => Jc::BOTH, 'spaceAfter' => 120]);

$notificationActions = [
    'Filter - View "All" notifications or only "Unread" notifications.',
    'Mark as Read - Click "Mark as read" on individual notifications.',
    'Mark All as Read - Click the "Mark all as read" button to clear all unread notifications at once.',
];

foreach ($notificationActions as $item) {
    $section->addListItem($item, 0, null, null, 'bulletList');
}

addInfoBox($section, 'Tip:', 'The notification bell icon in the top navigation bar shows the count of unread notifications. Click it to quickly view recent notifications.');

addScreenshot($section, __DIR__.'/screenshots/notifications.PNG', 'Figure 5.12: Notifications');

// =========================================================
// SAVE DOCUMENT
// =========================================================

$objWriter = IOFactory::createWriter($phpWord, 'Word2007');

$filePath = __DIR__.'/help.docx';

$objWriter->save($filePath);

if (! file_exists($filePath)) {
    exit('Error: Failed to save Word document to: '.$filePath);
}

echo 'Word document generated successfully at: '.$filePath.PHP_EOL;
echo 'File size: '.filesize($filePath).' bytes'.PHP_EOL;
