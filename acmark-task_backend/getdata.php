<?php include 'headers.php'; ?>  
<?php include 'database.php'; ?>

<?php
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    $ico = filter_var($data['ico'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $companyName = filter_var($data['companyName'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    if ($ico) {
        $sqlQuery = "SELECT ico, company_name, address, date
                    FROM companies
                    WHERE ico = '$ico'
                    AND date > DATE_ADD(NOW(), INTERVAL -1 MONTH)
                    ORDER BY Date";
        $result = mysqli_query($conn, $sqlQuery);
        $company = mysqli_fetch_all($result, MYSQLI_ASSOC);
        if (count($company) > 0) {
            echo json_encode($company);
        } else {
            $aresData = file_get_contents('http://wwwinfo.mfcr.cz/cgi-bin/ares/darv_bas.cgi?ico=' . $ico);

            $xml_str = str_replace(PHP_EOL, '', $aresData);
            $xml = simplexml_load_string($xml_str,'SimpleXMLElement', LIBXML_NOCDATA);
            $ns = $xml->getDocNamespaces(true);
            foreach ( $ns as $prefix => $URI )   {
                $xml->registerXPathNamespace($prefix, $URI);
            }
            $basicInfo = json_encode($xml->xpath('///D:VBAS/*'));
            $address = json_encode($xml->xpath('///D:AD/*'));
            $responseData = json_encode(array_merge(json_decode($address, true),json_decode($basicInfo, true)));
            echo $responseData;
        }
  
    } else {
        $aresData = file_get_contents('http://wwwinfo.mfcr.cz/cgi-bin/ares/ares_es.cgi?obch_jm=' . $companyName);

        $xml_str = str_replace(PHP_EOL, '', $aresData);
        $xml = simplexml_load_string($xml_str,'SimpleXMLElement', LIBXML_NOCDATA);
        $ns = $xml->getDocNamespaces(true);
        foreach ( $ns as $prefix => $URI )   {
            $xml->registerXPathNamespace($prefix, $URI);
        }
        $responseData = json_encode($xml->xpath('//dtt:S/*'));
        echo $responseData;
    }

?>