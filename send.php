<?php 
    /* 
    * Данная реализация написана в 2019 году по фриланс-заказу
    * Вся чувствительная информация заменена заглушкой [REPLACED]
    */

	// отправка сообщения в vk
	$VK_TOKEN = '[REPLACED]';
	$OWNER_VK_ID = "[REPLACED]";

	function send_vk($vk_id, $text_source){
		$url = "https://api.vk.com/method/messages.send?user_id=" .  $OWNER_VK_ID . "&v=5.76&access_token=" . $VK_TOKEN;
		$text = rawurlencode($text_source);
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10); 
		curl_setopt($ch, CURLOPT_POST, 1);	 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,false);
		curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);				
		curl_setopt($ch, CURLOPT_URL,$url);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "&message=".$text);
		$hh=curl_exec($ch);

		// если отправка не удалась
		if (!strpos(" ".$hh,'{"response":')) {		
			
			// если нет сообщения об ошибке, отправляем повторно
			if (!strpos(" ".$hh,'error')) {$hh=curl_exec($ch);}
		}
		
		$html=$hh;				
		
		curl_close($ch);		
		return $html;
	}
?>