<?php
// this file should be included by radios.php/wxradio.php and contains the bulk of the formatting code
// No settings needed in this file.
//
// Version 1.00 - 28-Mar-2017 - initial release
// Version 1.04 - 05-Jul-2017 - corrected attributions, added Saratoga Template awareness
// Version 2.00 - 06-Aug-2018 - update to use Leaflet/OpenStreetMaps instead of Google map
// Version 2.01 - 15-Sep-2018 - support for HTTPS for noaaweatherradio.org accesses
// Version 3.00 - 08-Dec-2019 - support for new NWS NWR site at weather.gov
// Version 3.01 - 25-May-2020 - added SSL/padlock indicator for SSL streams
// Version 3.04 - 15-Sep-2020 - fixed SAME code display due to changed NWS shapefile contents

if(file_exists("Settings.php")) {include_once("Settings.php"); }
global $SITE;
$setCols = '12'; // default width for narrow template

if (isset($SITE['CSSscreen']) and
   stripos($SITE['CSSscreen'],'wide') !== false) {
	$setCols = '8';
}

//
if(isset($SITE['WXRstartup']))    { $startup = $SITE['WXRstartup']; }
if(isset($SITE['WXRmapprovider']))    { $mapProvider = $SITE['WXRmapprovider']; }
if(isset($SITE['WXRprovider']))   { $streamprovider = $SITE['WXRprovider']; }
if(isset($SITE['WXRautoplay']))   { $autoplaystartup = $SITE['WXRautoplay']; }
if(isset($SITE['WXRbackground'])) { $backgroundColor = $SITE['WXRbackground']; }
if(isset($SITE['mapboxAPIkey']))  { $mapboxAPIkey = $SITE['mapboxAPIkey'];}

// table of available map tile providers
$mapTileProviders = array(
  'OSM' => array(
	   'name' => 'Street',
	   'URL' =>'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		 'attrib' => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ',
		 'maxzoom' => 18
		  ),
  'Wikimedia' => array(
	  'name' => 'Street2',
    'URL' =>'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
	  'attrib' =>  '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
	  'maxzoom' =>  18
    ),
  'Esri_WorldTopoMap' =>  array(
	  'name' => 'Terrain',
    'URL' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
	  'attrib' =>  'Tiles &copy; <a href="https://www.esri.com/en-us/home" title="Sources: Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community">Esri</a>',
	  'maxzoom' =>  18
    ),
	'Terrain' => array(
	   'name' => 'Terrain2',
		 'URL' =>'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
		 'attrib' => '<a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> <a href="https://stamen.com">Stamen.com</a> | Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
		 'maxzoom' => 14
		  ),
	'NatGeo' => array(
	   'name' => 'NatGeo',
		 'URL' =>'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
		 'attrib' => 'Tiles &copy; <a href="https://www.esri.com/en-us/home" title="Sources: Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community">Esri NatGeo</a>',
		 'maxzoom' => 16
		  ),
	'OpenTopo' => array(
	   'name' => 'Topo',
		 'URL' =>'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
		 'attrib' => ' &copy; <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>) | Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
		 'maxzoom' => 15
		  ),
	'MapboxTer' => array(
	   'name' => 'Terrain3',
		 'URL' =>'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token='.
		 $mapboxAPIkey,
		 'attrib' => '&copy; <a href="https://mapbox.com">MapBox.com</a> | Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
		 'maxzoom' => 18
		  ),
	'MapboxSat' => array(
	   'name' => 'Satellite',
		 'URL' =>'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token='.
		 $mapboxAPIkey,
		 'attrib' => '&copy; <a href="https://mapbox.com">MapBox.com</a> | Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
		 'maxzoom' => 18
		  ),

	);
  if(isset($mapTileProviders[$mapProvider]) ) {
		$sct = "// using \$mapProvider = '$mapProvider' as default map tiles. \n";
	} else {
		$sct = "// invalid \$mapProvider = '$mapProvider' - using OSM for map tiles instead. \n";
		$mapProvider = 'OSM';
  }

	// Generate map options
	$mOpts = array();
	$mList = '';
	$mFirstMap = '';
	$mSelMap = '';
	$swxAttrib = ' | Script by <a href="https://chappelleweather.com">Chappelleweather.com</a> &amp; ' .
	             '<a href="https://saratoga-weather.org/">Saratoga-Weather.org</a>';
	$mScheme = $_SERVER['SERVER_PORT']==443?'https':'http';
	foreach ($mapTileProviders as $n => $M ) {
		$name = $M['name'];
		$vname = 'M'.strtolower($name);
		if(empty($mFirstMap)) {$mFirstMap = $vname; }  // default map is first in list
		if(strpos($n,'Mapbox') !== false and
		   strpos($mapboxAPIkey,'-API-key-') !== false) {
			 $mList .= "\n".'// skipping Mapbox - '.$name.' since $mapboxAPIkey is not set'."\n\n";
			 continue;
		}
		if($mScheme == 'https' and parse_url($M['URL'],PHP_URL_SCHEME) == 'http') {
			$mList .= "\n".'// skipping '.$name.' due to http only map tile link while our page is https'."\n\n";
			continue;
		}
		if($mapProvider == $n) {$mSelMap = $vname;}
		$mList .= 'var '.$vname.' = L.tileLayer(\''.$M['URL'].'\', {
			maxZoom: '.$M['maxzoom'].',
			attribution: \''.$M['attrib'].$swxAttrib.'\'
			});
';
		$mOpts[$name] = $vname;

	}

	$sct .= "// Map tile providers:\n";
    $sct .= $mList;
	$sct .= "// end of map tile providers\n\n";
	$sct .= "var baseLayers = {\n";
  $mtemp = '';
	foreach ($mOpts as $n => $v) {
		$mtemp .= '  "'.$n.'": '.$v.",\n";
	}
	$mtemp = substr($mtemp,0,strlen($mtemp)-2)."\n";
	$sct .= $mtemp;
	$sct .= "};	\n";
	if(empty($mSelMap)) {$mSelMap = $mFirstMap;}
    $sct .= "var mapProvider = ".$mSelMap."\n";
	// end Generate map tile options


//

// pass needed settings to JavaScript:
  print "<script>\n";
	print "  var startup = \"$startup\"; // station selection\n";
	$s = ($streamprovider)?'true':'false';
	print "  var streamprovider = $s; // site provides one/more streams\n";
	print "  var mapType = '$mapProvider'; // Map Provider\n";
	$s = ($autoplaystartup)?'true':'false';
	print "  var autoplaystartup = $s; // =true; audio plays at page load, =false; no auto play at page load\n";
	print "</script>\n";
?>
<script src="NWR-radios.js"></script>
  <!-- NWR-radios-inc.php - Version 3.04 - 15-Sep-2020 -->
  <div class="container-fluid">
      <div class="row">
        <div class="col-sm-<?php print $setCols; ?>" style="background-color:<?php print $backgroundColor; ?>; text-align: center; border: solid 2px black; border-radius: 10px">
          <h2><span id="logo"></span>&nbsp;&nbsp;NOAA/EC&nbsp;All Hazards Radio<br/><span id="stationcount"></span></h2>
          <div>Select Weather Radio Station Below</div>
          <noscript><strong>Note: JavaScript must be enabled to select audio streams and to display the Google map.</strong></noscript>
          <div id="dropdown"></div>
          <br />
          <div id="radio"></div>
          <div>Station: <span id="station" style="color:green" ></span></div>
          <div>Frequency: <span id="freq" style="color:green"></span></div>
          <div><span id="locate" style="color:green"></span></div>
          <div>Transmitter location: <span id="xmloc" style="color:green"></span></div>
          <div>Stream Provided By: <span id="provide" style="color:green"></span></div>
          <p><small>Radio transmission courtesy of <a href="https://www.weather.gov/nwr/">NOAA</a> or <a href="https://www.ec.gc.ca/meteo-weather/default.asp?lang=En&amp;n=792F2D20-1">Environment Canada.</a></small></p>
          <p><b>This Audio Stream Player is not to be used for protection of life or property.</b><br/>
          Streams with &#128274; are provided with SSL (https:) streaming.<br/>
          Your browser may not support playing non-SSL streams if you are viewing this site with https:// (secure).<br/>
          These audio streams are graciously provided by personal weather website owners and others through <a href="https://noaaweatherradio.org/" target="_blank">NOAAWEATHERRADIO.org</a>.</p> 
          <div id="provider"></div>
          <div id="map_container" style="border: solid 2px black; border-radius: 10px; height:500px; background-color: white ">
              <div class="row">
                  <div class="col-sm-12">
                      <div id="map" style="z-index: 0;width: 90%; height: 495px; padding: 10px"> Loading Map</div>
                  </div>
              </div>
          </div>
          <div style="border: solid 2px black; border-radius: 10px">
              <h3 id="maphead">LOADING&nbsp;DATA - PLEASE&nbsp;STANDBY</h3>
              <div id="cmap" class="img-responsive"></div>
              <div id="samecodes" style="text-align:center"></div>
          </div>
          <div style="text-align:left">
              <b>This Audio Stream Player is not to be used for protection of life or property.</b> Please remember that you should NOT rely on this Internet audio to receive watches or warnings. Instead, you should have your own dedicated <a href="https://www.weather.gov/nwr/" target="_blank">NOAA</a> or <a href="https://www.ec.gc.ca/meteo-weather/default.asp?lang=En&amp;n=792F2D20-1" target="_blank">Environment Canada</a> Weather Radio receiver which will alert you 24 hours a day to hazards in your area.  This stream player is provided as a convenience and is not an authoritative source for official watches, warnings or advisories -- those should be obtained directly using your own NOAA or EC Weather Radio receiver.  Please do not rely on this page as your only source to hear NOAA/EC radio. When you need it most, storms may cause power outages at this end. It is a good idea to mainly rely on a separate NOAA/EC radio with battery back-up. <br/><br/>
              <b>Note:</b> Due to streaming software delays, this audio may be behind the NOAA/EC radio broadcast.
            <br/><br/>
              If you are interested in providing a stream for a NOAA/EC weather radio in your area, please
              see <a href="https://noaaweatherradio.org/" target="_blank">noaaweatherradio.org</a> website "How To?" page for details to submit an audio stream.
              
              <br/><br/>
              Stream data last updated: <span id="update"></span>
            <br/><br/>
<small>The NOAA/EC Radio player script set was developed by:<br/>
<a href="https://chappelleweather.com/" target="_blank">Chappelleweather.com</a> with mods by  
<a href="https://cliftonvaweather.com/" target="_blank">Clifton Virginia Weather</a>, 
<a href="https://www.gwwilkins.org/" target="_blank">SE Lincoln Weather</a>, and 
<a href="https://saratoga-weather.org/" target="_blank">Saratoga-weather.org</a></small>
          </div>
      </div>
      </div> <!-- end row -->
  </div> <!-- end container -->
  <script>
    <?php echo $sct; ?>
  </script>
