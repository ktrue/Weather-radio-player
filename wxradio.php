<?php
############################################################################
# A Project of TNET Services, Inc. and Saratoga-Weather.org (Canada/World-ML template set)
############################################################################
#
#   Project:    Sample Included Website Design
#   Module:     sample.php
#   Purpose:    Sample Page
#   Authors:    Kevin W. Reed <kreed@tnet.com>
#               TNET Services, Inc.
#
# 	Copyright:	(c) 1992-2007 Copyright TNET Services, Inc.
############################################################################
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
############################################################################
#	This document uses Tab 4 Settings
############################################################################
// Version 1.00 - 28-Jun-2017 - initial release
// Version 1.01 - 29-Jun-2017 - add local (fixed) bootstrap.3.3.7-mod.min.css for dark templatesz+autoplay
// Version 1.04 - 05-Jul-2017 - corrected attributions, added more Saratoga template awareness
// Version 2.00 - 06-Aug-2018 - update to use Leaflet/OpenStreetMaps instead of Google map
require_once("Settings.php");
require_once("common.php");
############################################################################
$TITLE = langtransstr($SITE['organ']) . " - " .langtransstr('Weather Radio');
$showGizmo = true;  // set to false to exclude the gizmo
$useHTML5 = true;   // set to HTML5 for page
$useUTF8  = true;   // to make the validator happy
include("top.php");
############################################################################
# wxradio settings
# note: you can also use the following in Settings.php to override the below settings:
/*

$SITE['WXRstartup'] = 'KEC49';   // override $startup in wxradio.php
$SITE['WXRprovider'] = true;     // override $streamprovider in wxradio.php
$SITE['WXRmapprovider'] = 'Esri_WorldTopoMap'; // override $mapProvider in wxradio.php
$SITE['WXRautoplay'] = true;     // override $autoplaystartup in wxradio.php
$SITE['WXRbackground'] = 'lightcyan'; // override $backgroundColor in wxradio.php
// see https://www.w3schools.com/cssref/css_colors.asp for color names
// OPTIONAL: to enable additional maps using MapBox tiles (requires an Access Token)
$SITE['mapboxAPIkey'] = '--mapbox-API-key--';  // use this for the Access Token (API key) to MapBox


*/
############################################################################
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
$streamprovider = false; // =true if you provide a stream, =false if you don't provide a stream
//
$autoplaystartup = true; // =true; start audio when page loads, =false; no autoplay on page load
#
$backgroundColor = 'lightcyan'; // CSS color name or #rrggbb hex format style for overall player
# see https://www.w3schools.com/cssref/css_colors.asp for color names and hex codes
$mapProvider = 'Esri_WorldTopoMap'; // ESRI topo map - no key needed
//$mapProvider = 'OSM';     // OpenStreetMap - no key needed
//$mapProvider = 'Terrain'; // Terrain map by stamen.com - no key needed
//$mapProvider = 'OpenTopo'; // OpenTopoMap.com - no key needed
//mapProvider = 'Wikimedia'; // Wikimedia map - no key needed
//
//$mapProvider = 'MapboxSat';  // Maps by Mapbox.com - API KEY needed in $mapboxAPIkey
//$mapProvider = 'MapboxTer';  // Maps by Mapbox.com - API KEY needed in $mapboxAPIkey

$mapboxAPIkey = '--mapbox-API-key--';  // use this for the Access Token (API key) to MapBox
//
############################################################################
#
############################################################################
?>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="bootstrap.3.3.7-mod.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
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
  height: 50%;
  width: 100% !important;
}
.container-fluid {
  width: 100% !important;
}
</style>

</head>
<body>
<?php
############################################################################
include("header.php");
############################################################################
include("menubar.php");
############################################################################

?>
<div id="main-copy">
  
 <?php include_once("NWR-radios-inc.php") ?>
     
</div><!-- end main-copy -->
<?php
############################################################################
include("footer.php");
############################################################################
# End of Page
############################################################################
?>