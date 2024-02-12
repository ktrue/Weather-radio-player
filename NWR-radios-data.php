<?php
// PHP script by Ken True, webmaster@saratoga-weather.org
// NWR-radio-data.php
// Purpose: fetch and cache the http://noaaweatherradio.org/java/NWR-radio-data.js file
//   for use with the wxradio.php (and standalone) scripts
//
// Version 1.00 - 26-Jun-2017 - initial release
// Version 1.01 - 02-Aug-2017 - added header type text/javascript to fix 'nosniff' issue
// Version 1.02 - 15-Sep-2018 - support for HTTPS for noaaweatherradio.org accesses
// Version 3.00 - 08-Dec-2019 - support for moved NWR site to weather.gov
// Version 3.01 - 12-Feb-2024 - fix file save issue
//
// Settings (not normally needing change as Saratoga template overrides will work)
//
  $imagesDir    = './ajax-images/';  // default images directory
  $cacheFileDir = './';   // default cache file directory
  $cacheName = "NWR-radios-data.js";  // used to store the file so we don't have to
//
  $refreshTime = 3600; // fetch new file every hour if needed
//
// end of settings -------------------------------------------------------------

if (isset($_REQUEST['sce']) && strtolower($_REQUEST['sce']) == 'view' ) {
   //--self downloader --
   $filenameReal = __FILE__;
   $download_size = filesize($filenameReal);
   header('Pragma: public');
   header('Cache-Control: private');
   header('Cache-Control: no-cache, must-revalidate');
   header("Content-type: text/plain");
   header("Accept-Ranges: bytes");
   header("Content-Length: $download_size");
   header('Connection: close');
   
   readfile($filenameReal);
   exit;
}
// Constants
// don't change $fileName or script may break ;-)
  $fileName = "https://noaaweatherradio.org/java/NWR-radios-data.js";
// end of constants

// overrides from Settings.php if available
if(file_exists("Settings.php")) {include_once("Settings.php");}
global $SITE,$missingTrans;
if (isset($SITE['imagesDir']))       {$imagesDir = $SITE['imagesDir']; }
if (isset($SITE['cacheFileDir']))    {$cacheFileDir = $SITE['cacheFileDir']; }
// end of overrides from Settings.php

$cacheName = $cacheFileDir.$cacheName;
global $Status;
$Status = '';
$html = '';

if(isset($_REQUEST['cache'])) {$Force = 1; } else {$Force = 0;}

if ($Force==1 or !file_exists($cacheName) or
   (file_exists($cacheName) and filemtime($cacheName) + $refreshTime < time()) ) {
    
		$html = fetchUrlWithoutHanging($fileName,$cacheName);
	  preg_match('/HTTP\/\S+ (\d+)/',$html,$m);
		if(isset($m[1]) and $m[1] == '200') {
			$fSize = strlen($html);
			$Status .= "// loaded $fileName - $fSize bytes\n";
			if(strpos($html,'{') !== false) { // got a file.. save it
				$fp = fopen($cacheName, "w");
				if ($fp) {
					$write = fputs($fp, $html);
					fclose($fp);
					$Status .= "// wrote cache file $cacheName \n";
				} else {
					$Status .= "// unable to write cache file $cacheName \n";
				}
			}
		}
}

if (strlen($html) < 50) { // haven't loaded it by fetch.. load from cache
    $html = file_get_contents($cacheName);
	  $fSize = strlen($html);
    $Status .= "// loaded cache file $cacheName - $fSize bytes\n";
}

$i = strpos($html,"\r\n\r\n");
$headers = substr($html,0,$i);
$content = substr($html,$i+4);

if(strlen($content) > 100) {
	$content = str_replace('http:\\/\\/noaaweatherradio.org\\/content\\/thumbnails\\/',$imagesDir,$content);
	$content = str_replace('https:\\/\\/noaaweatherradio.org\\/content\\/thumbnails\\/',$imagesDir,$content);
  header('Content-type: text/javascript,charset=UTF-8');
	print $content;
	print $Status;
} else {
	print $Status;
}

//------------------------------------------------------------------------------------------
function fetchUrlWithoutHanging($url,$cacheurl) {
// get contents from one URL and return as string 
  global $Status, $needCookie;
  $useFopen = false;
  $overall_start = time();
  if (! $useFopen) {
   // Set maximum number of seconds (can have floating-point) to wait for feed before displaying page without feed
   $numberOfSeconds=6;   

// Thanks to Curly from ricksturf.com for the cURL fetch functions

  $data = '';
  $domain = parse_url($url,PHP_URL_HOST);
  $theURL = str_replace('nocache','?'.$overall_start,$url);        // add cache-buster to URL if needed
  $Status .= "//  curl fetching '$theURL'  \n";
  $ch = curl_init();                                           // initialize a cURL session
  curl_setopt($ch, CURLOPT_URL, $theURL);                         // connect to provided URL
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);                 // don't verify peer certificate
  curl_setopt($ch, CURLOPT_USERAGENT, 
    'Mozilla/5.0 (NWR-radio-data - saratoga-weather.org)');

  curl_setopt($ch,CURLOPT_HTTPHEADER,                          // request LD-JSON format
     array (
         "Accept: text/plain,text/html"
     ));

  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $numberOfSeconds);  //  connection timeout
  curl_setopt($ch, CURLOPT_TIMEOUT, $numberOfSeconds);         //  data timeout
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);              // return the data transfer
  curl_setopt($ch, CURLOPT_NOBODY, false);                     // set nobody
  curl_setopt($ch, CURLOPT_HEADER, true);                      // include header information
//  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);              // follow Location: redirect
//  curl_setopt($ch, CURLOPT_MAXREDIRS, 1);                      //   but only one time
  if (isset($needCookie[$domain])) {
    curl_setopt($ch, $needCookie[$domain]);                    // set the cookie for this request
    curl_setopt($ch, CURLOPT_COOKIESESSION, true);             // and ignore prior cookies
    $Status .=  "//  cookie used '" . $needCookie[$domain] . "' for GET to $domain  \n";
  }

  $data = curl_exec($ch);                                      // execute session

  if(curl_error($ch) <> '') {                                  // IF there is an error
   $Status .= "//  curl Error: ". curl_error($ch) ."  \n";        //  display error notice
  }
  $cinfo = curl_getinfo($ch);                                  // get info on curl exec.
/*
curl info sample
Array
(
[url] => http://saratoga-weather.net/clientraw.txt
[content_type] => text/plain
[http_code] => 200
[header_size] => 266
[request_size] => 141
[filetime] => -1
[ssl_verify_result] => 0
[redirect_count] => 0
  [total_time] => 0.125
  [namelookup_time] => 0.016
  [connect_time] => 0.063
[pretransfer_time] => 0.063
[size_upload] => 0
[size_download] => 758
[speed_download] => 6064
[speed_upload] => 0
[download_content_length] => 758
[upload_content_length] => -1
  [starttransfer_time] => 0.125
[redirect_time] => 0
[redirect_url] =>
[primary_ip] => 74.208.149.102
[certinfo] => Array
(
)

[primary_port] => 80
[local_ip] => 192.168.1.104
[local_port] => 54156
)
*/
  $Status .= "//  HTTP stats: " .
    " RC=".$cinfo['http_code'] .
    " dest=".$cinfo['primary_ip'] ;
	if(isset($cinfo['primary_port'])) { 
	  $Status .= " port=".$cinfo['primary_port'] ;
	}
	if(isset($cinfo['local_ip'])) {
	  $Status .= " (from sce=" . $cinfo['local_ip'] . ")";
	}
	$Status .= 
	"\n//      Times:" .
    " dns=".sprintf("%01.3f",round($cinfo['namelookup_time'],3)).
    " conn=".sprintf("%01.3f",round($cinfo['connect_time'],3)).
    " pxfer=".sprintf("%01.3f",round($cinfo['pretransfer_time'],3));
	if($cinfo['total_time'] - $cinfo['pretransfer_time'] > 0.0000) {
	  $Status .=
	  " get=". sprintf("%01.3f",round($cinfo['total_time'] - $cinfo['pretransfer_time'],3));
	}
    $Status .= " total=".sprintf("%01.3f",round($cinfo['total_time'],3)) .

    " secs  \n";

  //$Status .= "//  curl info\n".print_r($cinfo,true)."  \n";
  curl_close($ch);                                              // close the cURL session
  //$Status .= "//  raw data\n".$data."\n  \n"; 
  $i = strpos($data,"\r\n\r\n");
  $headers = substr($data,0,$i);
  $content = substr($data,$i+4);
  if($cinfo['http_code'] <> '200') {
    $Status .= "//  headers returned:\n".$headers."\n  \n"; 
  }
  return $data;                                                 // return headers+contents

 } else {
//   print "//  using file_get_contents function  \n";
   $STRopts = array(
	  'http'=>array(
	  'method'=>"GET",
	  'protocol_version' => 1.1,
	  'header'=>"Cache-Control: no-cache, must-revalidate\r\n" .
				"Cache-control: max-age=0\r\n" .
				"Connection: close\r\n" .
				"User-agent: Mozilla/5.0 (NWR-radio-data.php - saratoga-weather.org)\r\n" .
				"Accept: text/plain,text/html\r\n"
	  ),
	  'https'=>array(
	  'method'=>"GET",
	  'protocol_version' => 1.1,
	  'header'=>"Cache-Control: no-cache, must-revalidate\r\n" .
				"Cache-control: max-age=0\r\n" .
				"Connection: close\r\n" .
				"User-agent: Mozilla/5.0 (NWR-radio-data.php - saratoga-weather.org)\r\n" .
				"Accept: text/plain,text/html\r\n"
	  )
	);
	
   $STRcontext = stream_context_create($STRopts);

   $T_start = ADV_fetch_microtime();
   $xml = file_get_contents($url,false,$STRcontext);
   $T_close = ADV_fetch_microtime();
   $headerarray = get_headers($url,0);
   $theaders = join("\r\n",$headerarray);
   $xml = $theaders . "\r\n\r\n" . $xml;

   $ms_total = sprintf("%01.3f",round($T_close - $T_start,3)); 
   $Status .= "//  file_get_contents() stats: total=$ms_total secs  \n";
   $Status .= "/* get_headers returns\n".$theaders."\n*/\n";
//   print " file() stats: total=$ms_total secs.\n";
   $overall_end = time();
   $overall_elapsed =   $overall_end - $overall_start;
   $Status .= "//  fetch function elapsed= $overall_elapsed secs.  \n"; 
//   print "fetch function elapsed= $overall_elapsed secs.\n"; 
   return($xml);
 }

}    // end ECF_fetch_URL

// ------------------------------------------------------------------

function ADV_fetch_microtime()
{
   list($usec, $sec) = explode(" ", microtime());
   return ((float)$usec + (float)$sec);
}

?>