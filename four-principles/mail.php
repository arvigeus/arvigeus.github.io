<?php
	$to = "varna@studentlife.com";
	$name = $_POST["title"];
	if(empty($name)) $name = "(неизвестен)";
	$subject = $name . ": " . $_POST["title"];
	$message = $_POST["text"];
	$from = $_POST["email"];
	$headers = "From:" . $from;
	if(mail($to,$subject,$message,$headers))
		echo "ok";
	else
		echo "fail";
?>