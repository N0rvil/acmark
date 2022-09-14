<?php include 'headers.php'; ?>  
<?php include 'database.php'; ?>  

<?php
    // Access data from axios
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    // Filter variables
    $ico = filter_var($data['ico'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $companyName = filter_var($data['companyName'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $address = filter_var($data['address'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $date = date("Y-m-d");

    if(!empty($ico) && !empty($companyName) && !empty($address)) {
        $sql = "INSERT INTO companies (ico, company_name, address, date) VALUE ('$ico', '$companyName', '$address', '$date')";
      
        if(mysqli_query($conn, $sql)) {
          // Success
          echo json_encode('Success');
        } else {
          // Error
          echo json_encode('Error');
        }
    } else {
        // Empty inputs
        echo json_encode('Empty inputs');
    }
?>