<?php 
$arr = array("Ane","Ancient","Arch","Aventine","Baths","Beth","Boih","Campidoglio","Capella","Castel","Hadrian","Hotel");
$queryText = trim($_POST['query']);

if($queryText == ""){
	echo "";
}else{
	$result = hint($queryText,$arr);
	echo implode(",",$result);
}

function hint($queryText,$arr){//截取数组里的每个字符串的前查询字符串的长度与查询字符串比较
	$temp = array();
	$strLen = strlen($queryText);
	for($i=0;$i<count($arr);$i++){
		if(strtolower(substr($arr[$i],0,$strLen)) === strtolower($queryText)){
			array_push($temp,$arr[$i]);
		}
	}
	return $temp;
}
?>