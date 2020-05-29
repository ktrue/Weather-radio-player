<?php
#
# a simple proxy program to get/return the https://www.weather.gov/nwr/Maps/GIF/{radio}.gif
# so the radios.php/wxradio.php can use HTTPS even while www.nws.noaa.gov is HTTP only
#
# Author: Ken True https://saratoga-weather.org/
#
# Version 1.00 - 06-Aug-2018 - initial release with wxradio V2.00
# Version 2.00 - 08-Dec-2019 - repurposed for proxy access to radio coverage shapefiles
# Version 3.03 - 28-May-2020 - corrected cache location if used in Saratoga template
// Settings (not normally needing change as Saratoga template overrides will work)
//
  $cacheFileDir = './';   // default cache file directory
  $cacheName = "NWR-radios-data.js";  // used to store the file so we don't have to
//
// end of settings -------------------------------------------------------------

// overrides from Settings.php if available
if(file_exists("Settings.php")) {include_once("Settings.php");}
global $SITE;
if (isset($SITE['cacheFileDir']))    {$cacheFileDir = $SITE['cacheFileDir']; }
// end of overrides from Settings.php

$cacheName = $cacheFileDir.$cacheName;

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


$JSON = array();

if(file_exists($cacheName)) {
	$html = file_get_contents($cacheName);
  $i = strpos($html,"var data = ");
  $headers = substr($html,0,$i);
  $content = substr($html,$i);
	// have to convert from JavaScript to pure JSON format:
	$content = str_replace('var data = ','',$content);
	$content = str_replace('};','}',$content);
//	header("Content-type: text/plain");
//	print $content;
	$JSON = json_decode($content,true);
	switch (json_last_error()) {
	  case JSON_ERROR_NONE:           $error = 'No JSON error';                                                break;
	  case JSON_ERROR_DEPTH:          $error = '- Maximum stack depth exceeded';                             break;
	  case JSON_ERROR_STATE_MISMATCH: $error = '- Underflow or the modes mismatch';                          break;
	  case JSON_ERROR_CTRL_CHAR:      $error = '- Unexpected control character found';                       break;
	  case JSON_ERROR_SYNTAX:         $error = '- Syntax error, malformed JSON';                             break;
	  case JSON_ERROR_UTF8:           $error = '- Malformed UTF-8 characters, possibly incorrectly encoded'; break;
	  default:                        $error = '- Unknown error';                                            break;
	}
//  print  "JSON decode $error\n";
//	print var_export($JSON);
}
	

$RADIO = '';

if(isset($_GET['prop'])) {
	$RADIO = preg_replace('/[^A-Z0-9]/','',$_GET['prop']); //
  $NWRURL = 'https://www.weather.gov/source/nwr/shape/%s.zip';
	$radioZIP = $RADIO.".zip";
}

if(isset($_GET['cover'])) {
	$RADIO = preg_replace('/[^A-Z0-9]/','',$_GET['cover']); //
  $NWRURL = 'https://www.weather.gov/source/nwr/same/%s_same.zip';
	$radioZIP = $RADIO."_same.zip";
}
$RC = '(not run)';
if(strlen($RADIO) <= 6 and strlen($RADIO) > 3 and 
    isset($JSON[$RADIO]) and !empty($JSON[$RADIO]['mapurl']) ) {
		$URL = sprintf($NWRURL,$RADIO);
		list($headers,$content,$RC) = NWR_fetchUrlWithoutHanging($URL,false);
		if(preg_match('|\nLast-Modified: (.*)\r\n|Uis',$headers,$M)) {
			$lastModified = "Last-Modified: ".$M[1];
		} else {
			$lastModified = '';
		}
		//file_put_contents($radioZIP.'headers.txt',$headers);
		if(strlen($content) > 10) {
			header("Content-type: application/zip");
			header("Content-Length: " . strlen($content));
			if(strlen($lastModified) > 0) {
				header($lastModified);
			}
			print $content;
			return;
		}
}
	
header("HTTP/1.1 404 Not Found");
if(isset($_REQUEST['debug'])) {
	$URL = sprintf($NWRURL,$RADIO);
	print "<pre>\n";
	print "RADIO='$RADIO'\n";
	print "NWRURL='$NWRURL'\n";
	print "URL='$URL'\n";
	print "radioZIP='$radioZIP'\n";
	print "Headers:\n".$headers."\n";
	print "JSON error: $error\n";
	print "curl RC='$RC'\n";
	if(strlen($error)>0) {
		print "----------raw JSON string----------------\n";
		print $content;
		print "\n---------------------------------------\n";
	}
}
# -------------------functions -------------------------------
function NWR_fetchUrlWithoutHanging($url,$useFopen) {
// get contents from one URL and return as string 
  global $Status, $needCookie;
  
  $overall_start = time();
  if (! $useFopen) {
   // Set maximum number of seconds (can have floating-point) to wait for feed before displaying page without feed
   $numberOfSeconds=6;   

// Thanks to Curly from ricksturf.com for the cURL fetch functions

  $data = '';
  $domain = parse_url($url,PHP_URL_HOST);
  $theURL = str_replace('nocache','?'.$overall_start,$url);        // add cache-buster to URL if needed
  $Status .= "<!-- curl fetching '$theURL' -->\n";
  $ch = curl_init();                                           // initialize a cURL session
  curl_setopt($ch, CURLOPT_URL, $theURL);                         // connect to provided URL
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);                 // don't verify peer certificate
  curl_setopt($ch, CURLOPT_USERAGENT, 
    'Mozilla/5.0 (NWR-coverage.php - saratoga-weather.org)');

  curl_setopt($ch,CURLOPT_HTTPHEADER,                          // request LD-JSON format
     array (
         "Accept: application/zip"
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
    $Status .=  "<!-- cookie used '" . $needCookie[$domain] . "' for GET to $domain -->\n";
  }

  $data = curl_exec($ch);                                      // execute session

  if(curl_error($ch) <> '') {                                  // IF there is an error
   $Status .= "<!-- curl Error: ". curl_error($ch) ." -->\n";        //  display error notice
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
  $Status .= "<!-- HTTP stats: " .
    " RC=".$cinfo['http_code'];
	if(isset($cinfo['primary_ip'])) {
		$Status .= " dest=".$cinfo['primary_ip'] ;
	}
	if(isset($cinfo['primary_port'])) { 
	  $Status .= " port=".$cinfo['primary_port'] ;
	}
	if(isset($cinfo['local_ip'])) {
	  $Status .= " (from sce=" . $cinfo['local_ip'] . ")";
	}
	$Status .= 
	"\n      Times:" .
    " dns=".sprintf("%01.3f",round($cinfo['namelookup_time'],3)).
    " conn=".sprintf("%01.3f",round($cinfo['connect_time'],3)).
    " pxfer=".sprintf("%01.3f",round($cinfo['pretransfer_time'],3));
	if($cinfo['total_time'] - $cinfo['pretransfer_time'] > 0.0000) {
	  $Status .=
	  " get=". sprintf("%01.3f",round($cinfo['total_time'] - $cinfo['pretransfer_time'],3));
	}
    $Status .= " total=".sprintf("%01.3f",round($cinfo['total_time'],3)) .
    " secs -->\n";

  //$Status .= "<!-- curl info\n".print_r($cinfo,true)." -->\n";
  curl_close($ch);                                              // close the cURL session
  //$Status .= "<!-- raw data\n".$data."\n -->\n"; 
  $i = strpos($data,"\r\n\r\n");
  $headers = substr($data,0,$i);
  $content = substr($data,$i+4);
  if($cinfo['http_code'] <> '200') {
    $Status .= "<!-- headers returned:\n".$headers."\n -->\n"; 
  }
	if(isset($_REQUEST['debug'])) {
		print $Status;
	}
  return array($headers,$content,$cinfo['http_code']);                                                 // return headers+contents

 } else {
//   print "<!-- using file_get_contents function -->\n";
   $STRopts = array(
	  'http'=>array(
	  'method'=>"GET",
	  'protocol_version' => 1.1,
	  'header'=>"Cache-Control: no-cache, must-revalidate\r\n" .
				"Cache-control: max-age=0\r\n" .
				"Connection: close\r\n" .
				"User-agent: Mozilla/5.0 (NWR-coverage.php - saratoga-weather.org)\r\n" .
				"Accept: text/html,text/plain\r\n"
	  ),
	  'https'=>array(
	  'method'=>"GET",
	  'protocol_version' => 1.1,
	  'header'=>"Cache-Control: no-cache, must-revalidate\r\n" .
				"Cache-control: max-age=0\r\n" .
				"Connection: close\r\n" .
				"User-agent: Mozilla/5.0 (NWR-coverage.php - saratoga-weather.org)\r\n" .
				"Accept: text/html,text/plain\r\n"
	  )
	);
	
   $STRcontext = stream_context_create($STRopts);

   $T_start = NWR_fetch_microtime();
   $xml = file_get_contents($url,false,$STRcontext);
   $T_close = NWR_fetch_microtime();
   #$headerarray = get_headers($url,0);
   #$theaders = join("\r\n",$headerarray);
   #$xml = $theaders . "\r\n\r\n" . $xml;

   $ms_total = sprintf("%01.3f",round($T_close - $T_start,3)); 
   $Status .= "<!-- file_get_contents() stats: total=$ms_total secs -->\n";
   $Status .= "<-- get_headers returns\n".$theaders."\n -->\n";
//   print " file() stats: total=$ms_total secs.\n";
   $overall_end = time();
   $overall_elapsed =   $overall_end - $overall_start;
   $Status .= "<!-- fetch function elapsed= $overall_elapsed secs. -->\n"; 
//   print "fetch function elapsed= $overall_elapsed secs.\n"; 
   return($xml);
 }

}    // end NWR_fetchUrlWithoutHanging
// ------------------------------------------------------------------

function NWR_fetch_microtime()
{
   list($usec, $sec) = explode(" ", microtime());
   return ((float)$usec + (float)$sec);
}
   
// ----------------------------------------------------------
// end of NWR-coverage.php