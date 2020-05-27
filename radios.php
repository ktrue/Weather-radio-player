<?php
if (isset($_REQUEST['sce']) && ( strtolower($_REQUEST['sce']) == 'view' or
    strtolower($_REQUEST['sce']) == 'show') ) {
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
// Version 1.01 - 29-Jun-2017 - added autoplaystartup + map selection
// Version 1.04 - 05-Jul-2017 - corrected attributions for script, added backgroundcolor option
// Version 2.00 - 06-Aug-2018 - update to use Leaflet/OpenStreetMaps instead of Google map
// Version 3.00 - 08-Dec-2019 - support for NWS NWR site at weather.gov
// Version 3.02 - 26-May-2020 - updated settings area with additional map choices
############################################################################
# wxradio settings
#
$startup = 'KEC49'; // Radio for first display, if 'alternate' include the -[char] in the name
//                     like 'KEC49-A'.  That value is displayed on the page after Station:
//                     when the station is selected in the dropdown list.
// Note that specific stream calls for alternate streams may change so it's best to use a
//   different search (such as the below) to select a specific stream for initial display.
//
//You can also use the City, provider name or website name to match.
// $startup = 'Monterey Marine';
// $startup = 'saratoga-weather.org';
// $startup = 'mikev';
$streamprovider = true; // =true if you provide a stream, =false if you don't provide a stream
//
$autoplaystartup = false; // =true; start audio when page loads, =false; no autoplay on page load
#
$setCols = '6'; // number of columns (6 ... 12) to set overall width of display
#
$backgroundColor = '#F0F8FF'; // CSS color name or #rrggbb hex format style for overall player
# see https://www.w3schools.com/cssref/css_colors.asp for color names and hex codes
#
$showMapSelector = true; // Shows open source map selection drop down above the map.  Change to false to exclude it
#
// see: http://leaflet-extras.github.io/leaflet-providers/preview/ for additional maps
// select ONE map tile provider by uncommenting the values below.

$mapProvider = 'Esri_WorldTopoMap'; // ESRI topo map - no key needed
//$mapProvider = 'OSM';     // OpenStreetMap - no key needed
//$mapProvider = 'Terrain'; // Terrain map by stamen.com - no key needed (HTTP Sites only)
//$mapProvider = 'OpenTopo'; // OpenTopoMap.com - no key needed
//$mapProvider = 'Wikimedia'; // Wikimedia map - no key needed
//$mapProvider = 'NatGeo'; // National Geographic Topo map - no key needed

// Get a Mapbox API key at: https://www.mapbox.com/signin/
//$mapProvider = 'MapboxSat';  // Maps by Mapbox.com - API KEY needed in $mapboxAPIkey
//$mapProvider = 'MapboxTer';  // Maps by Mapbox.com - API KEY needed in $mapboxAPIkey
$mapboxAPIkey = '--mapbox-API-key--';  // use this for the API key to MapBox

############################################################################
header('Content-type: text/html; charset=UTF-8');
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
  <title>NOAA/EC Weather Radio</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="bootstrap.3.3.7-mod.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="NWR-radios-data.php"></script>
<!-- Added to use Leaflet/OpenStreetMaps+others for map display -->
<link rel="stylesheet" href="NWR-radios-leaflet.css">
<script src="NWR-radios-leaflet.js"></script>
<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.3.0/respond.js"></script>
<![endif]-->
<style>
html, body {
  height: 100%;
}

#map{
  margin: 0;
  padding: 0;
  height: auto;
  width: auto !important;
}
.container-fluid {
  width: 100% !important;
}
a {
  color: navy; 
  font-weight: bold;
  font-style: italic;
}
</style>

</head>
<body>
 <?php include_once("NWR-radios-inc.php") ?>
</body>
</html>