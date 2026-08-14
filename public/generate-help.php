<?php

require_once __DIR__.'/../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

// =========================================================
// DOMPDF CONFIGURATION
// =========================================================

$options = new Options;

$options->set('defaultFont', 'Helvetica');
$options->set('isRemoteEnabled', false);
$options->set('isHtml5ParserEnabled', true);

$dompdf = new Dompdf($options);

// =========================================================
// LOGO
// =========================================================

$logoPath = __DIR__.'/mainlogo.png';

if (! file_exists($logoPath)) {
    exit('Error: Logo file not found at: '.$logoPath);
}

$logoData = base64_encode(file_get_contents($logoPath));

$logoSrc = 'data:image/png;base64,'.$logoData;

// =========================================================
// SCREENSHOTS
// =========================================================

$screenshotsDir = __DIR__.'/screenshots';

function screenshotSrc($path)
{
    if (! file_exists($path)) {
        return null;
    }

    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $mime = ($ext === 'jpg' || $ext === 'jpeg') ? 'image/jpeg' : 'image/png';

    return 'data:'.$mime.';base64,'.base64_encode(file_get_contents($path));
}

$screenshotLogin = screenshotSrc($screenshotsDir.'/login.PNG');
$screenshotDashboard = screenshotSrc($screenshotsDir.'/dashboard.PNG');
$screenshotCustomers = screenshotSrc($screenshotsDir.'/customers.PNG');
$screenshotRequestsLists = screenshotSrc($screenshotsDir.'/requests-lists.PNG');
$screenshotRequestCreate = screenshotSrc($screenshotsDir.'/request-create.PNG');
$screenshotRequestDetail = screenshotSrc($screenshotsDir.'/request-detail.PNG');
$screenshotRequestWorkflow = screenshotSrc($screenshotsDir.'/request-workflow.PNG');
$screenshotRequestEdit = screenshotSrc($screenshotsDir.'/request-edit.jpg');
$screenshotCurrencies = screenshotSrc($screenshotsDir.'/currencies.PNG');
$screenshotPaymentMethods = screenshotSrc($screenshotsDir.'/payment-methods.PNG');
$screenshotReports = screenshotSrc($screenshotsDir.'/reports.PNG');
$screenshotNotifications = screenshotSrc($screenshotsDir.'/notifications.PNG');

// =========================================================
// HTML DOCUMENT
//
// Heredoc is used instead of a single-quoted PHP string.
// This prevents apostrophes such as:
// customer\'s
// user's
// system's
//
// from causing PHP parse errors.
// =========================================================

$html = <<<HTML
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<style>

/* =========================================================
   PAGE SETTINGS
========================================================= */

@page {
    margin: 28mm 25mm 22mm 25mm;
}

body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
}


/* =========================================================
   FIXED HEADER
========================================================= */

.page-header {
    position: fixed;
    top: -22mm;
    left: 0;
    right: 0;
    height: 20mm;
    text-align: center;
    padding: 4mm 0;
    border-bottom: 2px solid #c0392b;
    background: white;
}

/*
 * Original logo height: 12mm
 * New logo height:      18mm
 *
 * Increase = 50%
 */

.page-header img {
    height: 18mm;
    max-width: 100%;
}


/* =========================================================
   COVER PAGE
========================================================= */

.cover-page {
    text-align: center;
    padding-top: 120px;
    page-break-after: always;
}

.cover-page .page-header {
    display: none;
}

.cover-page .label {
    font-size: 10pt;
    color: #666;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 40px;
}

.cover-page h1 {
    font-size: 26pt;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 8px;
    line-height: 1.3;
}

.cover-page .version {
    font-size: 12pt;
    color: #555;
    margin-top: 30px;
    margin-bottom: 5px;
}

.cover-page .date {
    font-size: 11pt;
    color: #777;
    margin-bottom: 50px;
}

.cover-page .org-name {
    font-size: 13pt;
    color: #333;
    margin-top: 60px;
    font-weight: bold;
}

.cover-page .location {
    font-size: 11pt;
    color: #555;
    margin-top: 4px;
}


/* =========================================================
   PAGE BREAK
========================================================= */

.page-break {
    page-break-before: always;
}


/* =========================================================
   HEADINGS
========================================================= */

h1 {
    font-size: 18pt;
    font-weight: bold;
    color: #1a1a1a;
    margin-top: 30px;
    margin-bottom: 15px;
    padding-bottom: 6px;
    border-bottom: 2px solid #c0392b;
}

h2 {
    font-size: 14pt;
    font-weight: bold;
    color: #2c3e50;
    margin-top: 25px;
    margin-bottom: 10px;
}

h3 {
    font-size: 12pt;
    font-weight: bold;
    color: #34495e;
    margin-top: 18px;
    margin-bottom: 8px;
}


/* =========================================================
   GENERAL CONTENT
========================================================= */

p {
    margin-bottom: 8px;
    text-align: justify;
}

ul,
ol {
    margin-bottom: 10px;
    padding-left: 25px;
}

li {
    margin-bottom: 4px;
}


/* =========================================================
   TABLE OF CONTENTS
========================================================= */

.toc {
    page-break-after: always;
}

.toc h1 {
    text-align: center;
    border-bottom: none;
    margin-bottom: 30px;
}

.toc-item {
    display: table;
    width: 100%;
    padding: 4px 0;
    border-bottom: 1px dotted #ccc;
    font-size: 11pt;
    line-height: 1.5;
}

.toc-title {
    display: table-cell;
    width: 90%;
    text-align: left;
}

.toc-page {
    display: table-cell;
    width: 10%;
    text-align: right;
    font-weight: normal;
}

.toc-item.main {
    font-weight: bold;
    margin-top: 8px;
}

.toc-item.main .toc-page {
    font-weight: bold;
}

.toc-item.sub {
    padding-left: 20px;
    font-size: 10.5pt;
}


/* =========================================================
   NOTES
========================================================= */

.note {
    background-color: #fef9e7;
    border-left: 4px solid #f1c40f;
    padding: 10px 14px;
    margin: 12px 0;
    font-size: 10pt;
    border-radius: 3px;
}

.note strong {
    color: #7d6608;
}


/* =========================================================
   INFORMATION BOX
========================================================= */

.info-box {
    background-color: #eaf2f8;
    border-left: 4px solid #2980b9;
    padding: 10px 14px;
    margin: 12px 0;
    font-size: 10pt;
    border-radius: 3px;
}


/* =========================================================
   FEATURE LIST
========================================================= */

.feature-list {
    columns: 2;
    column-gap: 30px;
    margin: 10px 0;
}

.feature-list li {
    break-inside: avoid;
    margin-bottom: 3px;
}


/* =========================================================
   ROLE TABLE
========================================================= */

.role-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
}

.role-table th {
    background-color: #c0392b;
    color: white;
    padding: 8px 12px;
    text-align: left;
    font-weight: bold;
}

.role-table td {
    padding: 7px 12px;
    border-bottom: 1px solid #ddd;
}

.role-table tr:nth-child(even) td {
    background-color: #f8f9fa;
}


/* =========================================================
   STATUS FLOW
========================================================= */

.status-flow {
    text-align: center;
    font-size: 10pt;
    background-color: #f0f0f0;
    padding: 12px;
    border-radius: 5px;
    margin: 12px 0;
}

.status-flow .arrow {
    color: #c0392b;
    font-weight: bold;
    margin: 0 5px;
}

.status-flow .status {
    display: inline-block;
    background-color: white;
    border: 1px solid #ccc;
    padding: 4px 10px;
    border-radius: 3px;
    margin: 2px;
}


/* =========================================================
   SCREENSHOTS
========================================================= */

.screenshot {
    text-align: center;
    margin: 16px 0;
    page-break-inside: avoid;
}

.screenshot img {
    max-width: 100%;
    max-height: 180mm;
    border: 1px solid #ddd;
    border-radius: 3px;
}

.screenshot .caption {
    font-size: 9pt;
    font-style: italic;
    color: #666;
    margin-top: 6px;
}

</style>

</head>

<body>


<!-- =========================================================
     FIXED HEADER
========================================================= -->

<div class="page-header">

    <img
        src="$logoSrc"
        alt="Gadaa Bank Logo"
    >

</div>


<!-- =========================================================
     COVER PAGE
========================================================= -->

<div class="cover-page">

    <div class="label">
        User Manual
    </div>

    <h1>
        Foreign Currency (FCY)<br>
        Operations Portal
    </h1>

    <div class="version">
        Version 1.0.0
    </div>

    <div class="date">
        July, 2026
    </div>

    <div class="org-name">
        Gadaa Bank S.C.
    </div>

    <div class="location">
        Ethiopia, Addis Ababa
    </div>

</div>


<!-- =========================================================
     TABLE OF CONTENTS
========================================================= -->

<div class="toc">

    <h1>Contents</h1>

    <div class="toc-item main">
        <span class="toc-title">1. Objectives of FCY</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item main">
        <span class="toc-title">2. Scope of The Document</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item main">
        <span class="toc-title">3. Pre-conditions</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item main">
        <span class="toc-title">4. Main System Features</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.1. Login functionality</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.2. General Dashboard Statistics</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.3. Add/Edit/View/Deactivate/Activate Customers</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.4. Create/View/Edit FCY Requests</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.5. FCY Request Workflow (Submit, Check, Approve, Reject)</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.6. Manage Currencies</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.7. Manage Payment Methods</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.8. Generate Reports &amp; Export</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">4.9. Notifications System</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item main">
        <span class="toc-title">5. Screen Flow</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.1. System Login Screen</span>
        <span class="toc-page">3</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.2. General Dashboard Statistics</span>
        <span class="toc-page">4</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.3. Customer Registration</span>
        <span class="toc-page">4</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.4. FCY Request List</span>
        <span class="toc-page">5</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.5. Create FCY Request</span>
        <span class="toc-page">5</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.6. View FCY Request Details</span>
        <span class="toc-page">6</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.7. FCY Request Workflow</span>
        <span class="toc-page">6</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.8. Edit FCY Request</span>
        <span class="toc-page">7</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.9. Currency Management</span>
        <span class="toc-page">7</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.10. Payment Method Management</span>
        <span class="toc-page">7</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.11. Reports &amp; Export</span>
        <span class="toc-page">7</span>
    </div>

    <div class="toc-item sub">
        <span class="toc-title">5.12. Notifications</span>
        <span class="toc-page">8</span>
    </div>

</div>


<!-- =========================================================
     SECTION 1
========================================================= -->

<div class="page-break"></div>

<h1>1. Objectives of FCY</h1>

<p>
The primary goal of this system is to digitize and streamline the foreign currency request management process at Gadaa Bank S.C. The FCY Operations Portal enables the bank to manage customer registrations, process foreign currency requests from importers, and facilitate a structured Maker-Checker-Approver workflow for efficient request handling and approval.
</p>


<h1>2. Scope of The Document</h1>

<p>
The key jobs that a user may perform on the system are illustrated in this document, along with the processes needed to complete each activity. This manual covers the main features available to users with different roles within the FCY Operations Portal.
</p>


<h1>3. Pre-conditions</h1>

<ol>

    <li>
        For access to the system, a user must have an account.
    </li>

    <li>
        To access system functionality, a user must be granted a privilege (FCY role: Maker, Checker, or Approver).
    </li>

    <li>
        A user must have an active account to log in.
    </li>

</ol>


<h1>4. Main System Features</h1>

<div class="feature-list">

<ul>

    <li>4.1. Login functionality</li>

    <li>4.2. General Dashboard Statistics</li>

    <li>4.3. Add/Edit/View/Deactivate/Activate Customers</li>

    <li>4.4. Create/View/Edit FCY Requests</li>

    <li>4.5. FCY Request Workflow</li>

    <li>4.6. Manage Currencies</li>

    <li>4.7. Manage Payment Methods</li>

    <li>4.8. Generate Reports &amp; Export</li>

    <li>4.9. Notifications System</li>

</ul>

</div>


<h1>5. Screen Flow</h1>


<!-- =========================================================
     5.1 LOGIN
========================================================= -->

<h2>5.1. System Login Screen</h2>

<p>
Simply enter your username and password to log in to the system if you already have an account and it is enabled. If not, or if you do not have an account, contact the system administrator to get one set up or have your account activated.
</p>

<div class="note">

    <strong>Note:</strong>

    As a result of the multiple responsibilities on this system, each user will be directed to a different page depending on their function and privilege. The system uses role-based access control to determine which features are available to each user.

</div>

<p>
<strong>User Roles:</strong>
</p>

<table class="role-table">

    <tr>
        <th>Role</th>
        <th>Capabilities</th>
    </tr>

    <tr>
        <td>FCY Maker</td>
        <td>Register customers, create/edit/submit FCY requests, view reports</td>
    </tr>

    <tr>
        <td>FCY Checker</td>
        <td>Review requests, approve and forward to approver, or reject back to maker</td>
    </tr>

    <tr>
        <td>FCY Approver</td>
        <td>Final approval or rejection of requests, view reports</td>
    </tr>

    <tr>
        <td>Admin</td>
        <td>Manage currencies, payment methods, and all system settings</td>
    </tr>

</table>

<div class="screenshot">
    <img src="$screenshotLogin" alt="System Login Screen">
    <div class="caption">Figure 5.1: System Login Screen</div>
</div>


<!-- =========================================================
     5.2 DASHBOARD
========================================================= -->

<div class="page-break"></div>

<h2>5.2. General Dashboard Statistics</h2>

<p>
Upon logging in, the user is presented with a dashboard showing:
</p>

<ul>

    <li>
        <strong>Total Importers</strong> — The total number of registered customers in the system.
    </li>

    <li>
        <strong>Total Requests</strong> — The total number of FCY requests created.
    </li>

    <li>
        <strong>New This Month</strong> — The number of new customers registered in the current month.
    </li>

    <li>
        <strong>Recent Registrations</strong> — A list of the most recently registered customers.
    </li>

    <li>
        <strong>Recent FCY Requests</strong> — A list of the most recent FCY requests with their statuses.
    </li>

    <li>
        <strong>Quick Actions</strong> — Shortcut buttons to register a customer, view FCY requests, or create a new request.
    </li>

</ul>

<div class="info-box">

    <strong>Tip:</strong>

    The dashboard provides a quick overview of the system activity. Use the "View all" links to navigate to the full lists.

</div>

<div class="screenshot">
    <img src="$screenshotDashboard" alt="General Dashboard Statistics">
    <div class="caption">Figure 5.2: General Dashboard Statistics</div>
</div>


<!-- =========================================================
     5.3 CUSTOMER REGISTRATION
========================================================= -->

<h2>5.3. Customer Registration</h2>

<p>
To register a new customer, click the "Register New Customer" button on the Customer Registry page. A dialog form will appear with the following fields:
</p>

<ol>

    <li>
        <strong>Branch of the Customer</strong> — Select the branch from the dropdown list.
    </li>

    <li>
        <strong>Name of the Customer (Importer)</strong> — Enter the official registered name of the importer.
    </li>

    <li>
        <strong>NBE ACC. NO</strong> — Enter the National Bank of Ethiopia account number.
    </li>

    <li>
        <strong>TIN Number</strong> — Enter the Tax Identification Number.
    </li>

</ol>

<p>
To view a customer's details, click the "View" (eye icon) button. To edit a customer's information, click the "Edit" (pencil icon) button. To deactivate a customer, click the "Deactivate" button. An inactive customer can be reactivated by clicking the "Activate" (power icon) button.
</p>

<div class="note">

    <strong>Note:</strong>

    The system checks for duplicate NBE account numbers and TIN numbers. If a duplicate is detected, a warning message will be displayed.

</div>

<p>
Customers can be filtered by:
</p>

<ul>

    <li>
        Search by importer name, NBE account number, or TIN number
    </li>

    <li>
        Filter by branch
    </li>

    <li>
        Filter by status (Active / Inactive)
    </li>

</ul>

<div class="screenshot">
    <img src="$screenshotCustomers" alt="Customer Registration">
    <div class="caption">Figure 5.3: Customer Registration</div>
</div>


<!-- =========================================================
     5.4 FCY REQUEST LIST
========================================================= -->

<div class="page-break"></div>

<h2>5.4. FCY Request List</h2>

<p>
Select "FCY Requests" from the navigation menu to access the list of all foreign currency requests. The page displays:
</p>

<ul>

    <li>
        <strong>Statistics Cards</strong> — Total requests, pending checker, pending approver, and approved counts.
    </li>

    <li>
        <strong>Search &amp; Filter</strong> — Search by request number, customer name, or amount. Filter by request status.
    </li>

    <li>
        <strong>Requests Table</strong> — Displays request number, customer name, currency, amount, status badge, date, and a "View" action button.
    </li>

</ul>

<p>
Click the "New Request" button to create a new FCY request.
</p>

<div class="info-box">

    <strong>Tip:</strong>

    Use the status filter to quickly find requests that need your attention. The statistics cards at the top provide a quick summary of the current workload.

</div>

<div class="screenshot">
    <img src="$screenshotRequestsLists" alt="FCY Request List">
    <div class="caption">Figure 5.4: FCY Request List</div>
</div>


<!-- =========================================================
     5.5 CREATE FCY REQUEST
========================================================= -->

<h2>5.5. Create FCY Request</h2>

<p>
Click the "New Request" button to open the FCY request creation form. The form is organized into sections:
</p>

<h3>Customer Information</h3>

<ul>

    <li>
        Select a customer from the dropdown (shows importer name and NBE account number).
    </li>

    <li>
        If the customer is not yet registered, click "New" to open an inline customer registration form.
    </li>

    <li>
        Select the supplier country from the dropdown.
    </li>

</ul>

<h3>Proforma Invoice</h3>

<ul>

    <li>
        Enter the proforma invoice number.
    </li>

    <li>
        Select the proforma invoice date.
    </li>

</ul>

<h3>Payment &amp; Currency Details</h3>

<ul>

    <li>
        Select the method of payment (e.g., Letter of Credit, Telegraphic Transfer, etc.).
    </li>

    <li>
        Select the FCY currency (e.g., USD, EUR, GBP).
    </li>

    <li>
        Enter the FCY amount requested.
    </li>

    <li>
        Enter the total amount in USD.
    </li>

</ul>

<h3>Import Details</h3>

<ul>

    <li>
        Describe the items being imported.
    </li>

    <li>
        Add any optional notes.
    </li>

</ul>

<p>
Click "Save as Draft" to save the request. The request will be created in "Draft" status and can be submitted later.
</p>

<div class="screenshot">
    <img src="$screenshotRequestCreate" alt="Create FCY Request">
    <div class="caption">Figure 5.5: Create FCY Request</div>
</div>


<!-- =========================================================
     5.6 VIEW REQUEST
========================================================= -->

<div class="page-break"></div>

<h2>5.6. View FCY Request Details</h2>

<p>
Click the "View" button on any request in the list to see the full details. The detail page shows:
</p>

<ul>

    <li>
        <strong>Request Number</strong> — The unique identifier (e.g., GDA-FCY-0000000001).
    </li>

    <li>
        <strong>Status Badge</strong> — The current status of the request.
    </li>

    <li>
        <strong>Customer Information</strong> — Importer name, branch, NBE account number, supplier country.
    </li>

    <li>
        <strong>Proforma Invoice</strong> — Invoice number, invoice date, payment method.
    </li>

    <li>
        <strong>Currency &amp; Amount</strong> — Currency code, FCY amount requested, total amount in USD.
    </li>

    <li>
        <strong>Import Items</strong> — Description of the items being imported.
    </li>

    <li>
        <strong>Activity &amp; Notes</strong> — Maker notes, checker notes, and approver notes with timestamps.
    </li>

    <li>
        <strong>Actions</strong> — Workflow action buttons based on the user's role and the request status.
    </li>

</ul>

<div class="screenshot">
    <img src="$screenshotRequestDetail" alt="View FCY Request Details">
    <div class="caption">Figure 5.6: View FCY Request Details</div>
</div>


<!-- =========================================================
     5.7 WORKFLOW
========================================================= -->

<h2>5.7. FCY Request Workflow</h2>

<p>
The FCY system follows a three-stage approval workflow:
</p>

<div class="status-flow">

    <span class="status">Draft</span>

    <span class="arrow">&rarr;</span>

    <span class="status">Pending Checker</span>

    <span class="arrow">&rarr;</span>

    <span class="status">Pending Approver</span>

    <span class="arrow">&rarr;</span>

    <span class="status">Approved</span>

    <br><br>

    <span class="status">Draft</span>

    <span class="arrow">&larr;</span>

    <span class="status">Rejected by Checker</span>

    <br>

    <span class="status">Pending Checker</span>

    <span class="arrow">&rarr;</span>

    <span class="status">Rejected by Checker</span>

    <span class="arrow">&rarr;</span>

    <span class="status">Draft (Re-editable)</span>

    <br>

    <span class="status">Pending Approver</span>

    <span class="arrow">&rarr;</span>

    <span class="status">Rejected by Approver (Final)</span>

</div>

<h3>Workflow Steps:</h3>

<ol>

    <li>
        <strong>Maker</strong> creates a request (status: Draft) and submits it for checking (status: Pending Checker).
    </li>

    <li>
        <strong>Checker</strong> reviews the request. They can either:

        <ul>

            <li>
                Approve and forward to the approver (status: Pending Approver).
            </li>

            <li>
                Reject and send back to the maker for corrections (status: Rejected by Checker).
            </li>

        </ul>

    </li>

    <li>
        <strong>Approver</strong> performs the final review. They can either:

        <ul>

            <li>
                Approve the request (status: Approved).
            </li>

            <li>
                Reject the request (status: Rejected by Approver — final).
            </li>

        </ul>

    </li>

</ol>

<div class="note">

    <strong>Note:</strong>

    If a request is rejected by the checker, the maker can edit and resubmit it. If rejected by the approver, the request is final and cannot be resubmitted.

</div>

<div class="screenshot">
    <img src="$screenshotRequestWorkflow" alt="FCY Request Workflow">
    <div class="caption">Figure 5.7: FCY Request Workflow</div>
</div>


<!-- =========================================================
     5.8 EDIT REQUEST
========================================================= -->

<div class="page-break"></div>

<h2>5.8. Edit FCY Request</h2>

<p>
A maker can edit a request only when it is in "Draft" or "Rejected by Checker" status. To edit, navigate to the request detail page and click the "Edit Request" button. The edit form is pre-populated with the existing data. Make the necessary changes and click "Update Request" to save.
</p>

<div class="screenshot">
    <img src="$screenshotRequestEdit" alt="Edit FCY Request">
    <div class="caption">Figure 5.8: Edit FCY Request</div>
</div>


<!-- =========================================================
     5.9 CURRENCY MANAGEMENT
========================================================= -->

<h2>5.9. Currency Management</h2>

<p>
To manage currencies, go to the "Settings" section and select "Currencies". From this page, you can:
</p>

<ul>

    <li>
        <strong>Add a Currency</strong> — Click "Add Currency" and enter the currency code (3-letter ISO code, e.g., USD), currency name (e.g., US Dollar), and optional symbol (e.g., $).
    </li>

    <li>
        <strong>Edit a Currency</strong> — Click the "Edit" (pencil icon) button next to any currency to modify its details.
    </li>

    <li>
        <strong>Search</strong> — Search currencies by code, name, or symbol.
    </li>

</ul>

<div class="info-box">

    <strong>Tip:</strong>

    Currency codes must be unique and follow the ISO 4217 standard (3-letter codes).

</div>

<div class="screenshot">
    <img src="$screenshotCurrencies" alt="Currency Management">
    <div class="caption">Figure 5.9: Currency Management</div>
</div>


<!-- =========================================================
     5.10 PAYMENT METHOD MANAGEMENT
========================================================= -->

<h2>5.10. Payment Method Management</h2>

<p>
To manage payment methods, go to the "Settings" section and select "Payment Methods". From this page, you can:
</p>

<ul>

    <li>
        <strong>Add a Payment Method</strong> — Click "Add Payment Method" and enter the name (e.g., Letter of Credit) and an optional code (e.g., LC).
    </li>

    <li>
        <strong>Edit a Payment Method</strong> — Click the "Edit" (pencil icon) button next to any payment method to modify its details.
    </li>

    <li>
        <strong>Search</strong> — Search payment methods by name or code.
    </li>

</ul>

<div class="screenshot">
    <img src="$screenshotPaymentMethods" alt="Payment Method Management">
    <div class="caption">Figure 5.10: Payment Method Management</div>
</div>


<!-- =========================================================
     5.11 REPORTS
========================================================= -->

<h2>5.11. Reports &amp; Export</h2>

<p>
Go to the "Reports" section to view and export FCY request data. The reports page provides:
</p>

<ul>

    <li>
        <strong>Filters</strong> — Filter by status, customer, currency, payment method, and date range (from/to).
    </li>

    <li>
        <strong>Export Options</strong> — Export the filtered data as CSV or Excel files.
    </li>

    <li>
        <strong>Results Table</strong> — Displays the filtered requests with request number, customer, currency, amount, status, and date.
    </li>

</ul>

<p>
To export, click "Export CSV" or "Export Excel". The exported file will include all columns: serial number, request number, financial year, application date, branch, importer name, NBE account number, TIN number, proforma invoice number and date, payment method, currency, FCY amount, total amount in USD, importing items, supplier country, and approval date.
</p>

<div class="screenshot">
    <img src="$screenshotReports" alt="Reports and Export">
    <div class="caption">Figure 5.11: Reports and Export</div>
</div>


<!-- =========================================================
     5.12 NOTIFICATIONS
========================================================= -->

<div class="page-break"></div>

<h2>5.12. Notifications</h2>

<p>
The notification system keeps users informed about important events in the FCY request workflow. Notifications are generated when:
</p>

<ul>

    <li>
        A new FCY request is submitted for checking.
    </li>

    <li>
        A request is checked and forwarded to the approver.
    </li>

    <li>
        A request is approved.
    </li>

    <li>
        A request is rejected (by checker or approver).
    </li>

</ul>

<p>
To view notifications, go to the "Notifications" page. From this page, you can:
</p>

<ul>

    <li>
        <strong>Filter</strong> — View "All" notifications or only "Unread" notifications.
    </li>

    <li>
        <strong>Mark as Read</strong> — Click "Mark as read" on individual notifications.
    </li>

    <li>
        <strong>Mark All as Read</strong> — Click the "Mark all as read" button to clear all unread notifications at once.
    </li>

</ul>

<div class="info-box">

    <strong>Tip:</strong>

    The notification bell icon in the top navigation bar shows the count of unread notifications. Click it to quickly view recent notifications.

</div>

<div class="screenshot">
    <img src="$screenshotNotifications" alt="Notifications">
    <div class="caption">Figure 5.12: Notifications</div>
</div>


</body>

</html>
HTML;

// =========================================================
// LOAD HTML
// =========================================================

$dompdf->loadHtml($html);

// =========================================================
// SET PAPER
// =========================================================

$dompdf->setPaper('A4', 'portrait');

// =========================================================
// RENDER PDF
// =========================================================

$dompdf->render();

// =========================================================
// ADD PAGE NUMBERS
// =========================================================

$canvas = $dompdf->getCanvas();

$fontMetrics = $dompdf->getFontMetrics();

$font = $fontMetrics->getFont(
    'Helvetica',
    'normal'
);

$pageCount = $canvas->get_page_count();

// =========================================================
// FOOTER PAGE NUMBER
//
// Cover page (PDF page 1) has no page number.
//
// Other pages show:
// Page 2 of X
// Page 3 of X
// etc.
// =========================================================

for ($pageNumber = 2; $pageNumber <= $pageCount; $pageNumber++) {

    $canvas->page_text(
        0,
        815,
        'Page '.$pageNumber.' of '.$pageCount,
        $font,
        9,
        [0.4, 0.4, 0.4]
    );

}

// =========================================================
// SAVE PDF
// =========================================================

$output = $dompdf->output();

$filePath = __DIR__.'/help.pdf';

$result = file_put_contents(
    $filePath,
    $output
);

// =========================================================
// VERIFY FILE
// =========================================================

if ($result === false) {

    exit(
        'Error: Failed to save PDF to: '.
        $filePath
    );

}

// =========================================================
// SUCCESS MESSAGE
// =========================================================

echo 'PDF generated successfully at: '.$filePath.PHP_EOL;
echo 'File size: '.filesize($filePath).' bytes'.PHP_EOL;
echo 'Total PDF pages: '.$pageCount.PHP_EOL;
