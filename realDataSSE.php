<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');


$data = json_decode(file_get_contents('realData.json'))->data;
$i=0;
while ( true ) {
	/*$rpm            = end($data[13]);
	$lightIntensity = end($data[9]);
	*/
	$rpm = $data[13][$i];
	$lightIntensity = $data[9][$i];
	$dataArray = array(
		"fan" => round( $rpm ),
		"led" => $lightIntensity
	);
	echo "data: " . json_encode( $dataArray ) . "\n\n";
	$i ++;
	flush();
	ob_flush();
	sleep( 2 );
}

?>