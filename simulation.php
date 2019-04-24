<?php
header( 'Content-Type: text/event-stream' );
header( 'Cache-Control: no-cache' );
$opts = array(
	'http' => array(
		'method' => "GET",
		'header' => "Authorization: ApiKey xx79vpXsz39k3uaexLbZb6CYsxhARBdawhWBxwRvRFepepe6UNg4rLExExsQsVXTE2KuMQhZBpeuBvjqceLABzyjbGdwMUKkK5v6Ntw5mwrK2RsWpbKYcHEHHkBPccAK\r\n"
	)
);

$context = stream_context_create( $opts );
if ( ! empty( $_GET ) ) {
	$url = 'https://bp.paclick-bp.oneguard.solutions:4416/api/experiment/2/simulate?led=' . $_GET['led_input'] . "&fan=" . $_GET['rpm'];
	// Open the file using the HTTP headers set above
	$file = file_get_contents( $url, false, $context );
	$data = json_decode( $file, true );
	$i    = 0;
	while ( true ) {
		$rpm            = $data[ $i ]['values']['RPM'];
		$lightIntensity = $data[ $i ]['values']['LightIntensity'];
		$temperature    = $data[ $i ]['values']['Temperature'];

		$dataArray = array(
			"fan" => round( $rpm ),
			"led" => round( $lightIntensity )
		);
		echo "data: " . json_encode( $dataArray ) . "\n\n";
		$i ++;
		flush();
		ob_flush();
		sleep( 2 );
	}
}