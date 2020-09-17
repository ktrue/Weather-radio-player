/*
Script: NWR-radios.js
Purpose: handle page formatting for the NWR-radios selection/display
Author: Ken True - Saratoga-weather.org

This script is based on scripts orginally developed by
Chappellweather.com - http://chappellweather.com/
with mods by:
Clifton Virginia Weather - http://cliftonvaweather.com/
and by SE Lincoln Weather - http://www.gwwilkins.org/
Thanks to Doug at Chappellweather.com for the initial Leaflet conversion

Major changes from the Chappell/Clifton/Lincoln versions include:
- using NWR-radios-data.js from noaaweatherradio.org for data
- using the data feed to generate the dropdown station selector HTML
- eliminating the AJAX fetching of data/dropdown files
- adding a generalized selection of default station based on call/location/attribution/website

// Version 1.00 - 26-Jun-2017 - initial release
// Version 1.01 - 29-Jun-2017 - added autoplaystartup flag
// Version 1.04 - 05-Jul-2017 - corrected attributions
// Version 2.00 - 06-Aug-2018 - rewrite to use Leaflet/OpenStreetMaps+others for map display
// Version 2.02 - 11-Feb-2019 - use direct https link for NWR coverage graphic map
// Version 3.00 - 08-Dec-2019 - modified to use www.weather.gov/nwr sources for data as www.nws.noaa.gov/nwr is deprecated
// Version 3.01 - 25-May-2020 - added SSL/padlock indicators for SSL streams
// Versopm 3.04 - 15-Sep-2020 - fixed SAME code display due to changed NWS shapefile contents
*/
// note: all the data will come from NWR-radio-data.js JSON loaded by the HTML page
var selectedstation = '';
var mymap;
var lastCall;
var mapTileObj;
var	SC = Array();
/* V3.00 added functions */
function initSC () {
	SC.length=0;
	//console.log('initSC length='+SC.length);
}

function addSC (text) {
	//console.log('addSC="'+text+'"');
	SC.push(text);
	//console.log(SC);
	//console.log('addSC length='+SC.length);
}

function getSC () {
  //console.log('getSC length='+SC.length);
  SC.sort();
	//console.log('getSC sorted');
	//console.log(SC);
	var text = SC.join(', ');
	//console.log('getSC text="'+text+'"');
	return text;
}
/* end V3.00 added functions (*/

function getSAMEtext(call,county) {
	// console.log('getSAMEtext call='+call+' county="'+county+'");
	if(typeof data[call].samecode[county] != undefined) {
		var sctext = data[call].samecode[county];
		var t = sctext.split("(");
		sctext = "<b>"+t[0]+"</b>("+t[1];
	} else {
		var sctext = county;
	}
	return sctext;
}
function loadDropdown(data,findstation) {
	// generate the option/select box HTML from the JSON file
/*
    "KEC49": {
        "call": "KEC49",
        "alt": "N",
        "loc": "Monterey, CA",
        "freq": "162.550 MHz",
        "who": " Saratoga-Weather.org",
        "type": "COM",
        "wxurl": "https:\/\/saratoga-weather.org",
        "lat": "37.155000",
        "long": "-121.897222",
        "watts": "330",
        "xmloc": "Mt. Umunhum,CA",
        "wfo": "Monterey",
        "wxown": "<small title=\"Great Quality\" style=\"color:yellow;display:inline;font-size:150%\">&starf;<\/small>KEC49",
        "radiourl": "https:\/\/video1.getstreamhosting.com:8746\/KEC49.mp3",
        "mapurl": "https:\/\/www.nws.noaa.gov\/nwr\/Maps\/GIF\/KEC49.gif",
        "logo": "https:\/\/noaaweatherradio.org\/content\/thumbnails\/NWR150.png",
        "state": "California",
        "stateabbr": "CA",
        "goldstar": "<small title=\"Great Quality\" style=\"color:yellow;display:inline;font-size:150%\">&starf;<\/small>",
        "samecode": {
            "Alameda": "Alameda, CA(SAME 006001)",
            "Contra Costa": "Contra Costa, CA(SAME 006013 for VALLEYS)",
            "Monterey": "Monterey, CA(SAME 006053)",
            "Napa": "Napa, CA(SAME 006055 for SOUTH)",
            "San Benito": "San Benito, CA(SAME 006069 for NORTH)",
            "San Francisco": "San Francisco, CA(SAME 006075)",
            "San Mateo": "San Mateo, CA(SAME 006081)",
            "Santa Clara": "Santa Clara, CA(SAME 006085)",
            "Santa Cruz": "Santa Cruz, CA(SAME 006087)"
        }
    },
*/
	var keylist = Object;
	var out = '<p>No List Available</p>';
	var re = RegExp(findstation,'i');

	for (var call in data) {

		var nkey = data[call].state+'|'+data[call].loc+'|'+data[call].call;
		keylist[nkey] = call;
	}

	var skeys = Object.keys(keylist).sort();

  var laststate = '';
	var firstcall = '';
	out = "<select id=\"mainDropdown\">\n";
	for (var i = 0; i < skeys.length; i++) {
//			console.log('i='+i+' skeys="'+skeys[i]+'"');
			var key = skeys[i];
			var kp = key.split("|");
//      console.log('kp="'+kp+'"');

	  var state = kp[0];
		var city  = kp[1];
		var call  = kp[2];
		if( typeof data[call] == "undefined" ) { break; }
		var callx = data[call].wxown;
		var sabbr = data[call].stateabbr;
		if(firstcall.length == 0) {firstcall = call;}

		if(sabbr == "na") {
			city = data[call].who;
			data[call].loc = '';
			callx = '';
		}

		if( laststate !== state) {
			if(laststate.length > 0) {
				out += "</optgroup>\n";
			}
			out += '<optgroup label="'+state+"\">\n";
			laststate = state;
		}
		var sel = '';
		if(selectedstation.length == 0) {
			if(re.test(call) ||
			   re.test(city) ||
			   re.test(data[call].who) ||
				 re.test(data[call].wxurl) ) { // is this the one we're looking for?
			     //console.log('selectedstation="'+selectedstation+'" length='+
			     //  selectedstation.length+' call="'+call+'"');
			     sel = " selected=\"selected\"";
			     selectedstation = call;
			 }
		}
		var ssl = '';
		if(data[call].radiourl.includes('https://')) {
			ssl = '&nbsp;&#128274;&nbsp;';
		}
		out += "<option value=\""+call+"\""+sel+">"+callx+ssl;
//		if(call !== data[call].wxown) {
	  if(data[call].alt == 'Y') {
			out += " Alternate";
		}
		out += " - "+city+"</option>\n";

	}
	out += "<optgroup>\n</select>\n";

	if(selectedstation.length == 0) {
		selectedstation = firstcall;
		console.log('Note: startup="'+startup+
		  '" not found in call/loc/website, first station "'+selectedstation+'" used.');
	}

  return out;
}

function loadInfo(callback) {

	$("#stationcount").html('(' + data['radiocount'] + ' Stations, ' + data['stationcount'] + ' Streams)');
	$("#update").html(data['datadate']);
	var ddlist = loadDropdown(data,startup);
	$('#dropdown').html(ddlist);
	if(streamprovider) {
		$('#provider').html('We are pleased to provide streaming audio for our area from our systems.');
	}
    if (typeof callback === "function") {
        callback();
    }
}

function showStation(call, auto) {
    var rl = data[call].radiourl;
    if(auto) {
        var txt = '<audio id="aud" controls autoplay src="' + rl + '" type="audio/mpeg">\n' +
        'Your browser does not support the audio tag.\n</audio>';
    } else {
        var txt = '<audio id="aud" controls src="' + rl + '" type="audio/mpeg" >\n' +
        'Your browser does not support the audio tag.\n</audio>';
    }
    $('#radio').html(txt);
    $('#station').html(data[call].call);
    $('#freq').html(data[call].freq);
    $('#locate').html(data[call].loc);
		$('#xmloc').html(data[call].xmloc);
		var ssl = '';
		var who = data[call].who;
		if(data[call].radiourl.includes('https://')) {
			ssl = '&nbsp;&#128274;&nbsp;';
			who = who.replace(/#ffff00/,'#4caf50');
		}
    if(data[call].wxurl == "") {
        var txt = ssl+who;
    } else {
        var txt = '<a href="' + data[call].wxurl + '" target="_blank">' + ssl+who + '</a>';
    }
    $('#provide').html(txt);
    var txt = '<img src="' + data[call].logo + '" height="50 width="50" alt="" />'
    $('#logo').html(txt);
    var mapurl = data[call].mapurl;
		
    if(mapurl !== '' && !mapurl.match(/WNWS/)) {
    var txt = '<a href="https://www.weather.gov/nwr/sites?site=' + call + '"  style="text-align:center" alt="Coverage Map - ' + data[call].loc + ' Available" target="_blank">NWS NWR Transmitter Coverage Map/Details for '+call+'</a>'
		} else if(mapurl == '') {
			var txt = 'Canada transmitter coverage maps are not available.';
		} else {
			txt = '';
		}
    $('#cmap').html(txt);
    var txt = data[call].loc + ' Radio ' + data[call].call + ' Coverage Area';
    $('#maphead').html(txt);
    lastCall = call;
    initSC();
		$('#samecodes').html('');
    showmap(call);
 
    setTimeout(function(){checkNetwork();},10000);
}

function loadPointer() {
    $("#mainDropdown").change(function () {
        var call = $(this).val();
        lastCall = call;
        showStation(call, true);
    });
}

function checkNetwork() {
    var x =$('audio')[0];
    var e = x.networkState;
    if(e != null && e == 3){
        var txt = '<img src="redx.png" height="20 width="20" alt="" />&nbsp;&nbsp;Failed To Load Audio Stream';
        $('#radio').html(txt);
    }
}

function showmap(call) {
    if(call.indexOf('-') > -1) {
        call = call.split('-')[0];
    }
    if(data[call] == null) {
        $('#map_container').css('height', '75px');
        var txt = '<h2 style="color: red">Transmiter Location Map Unavailable For: ' + call + '</h2>';
        $('#map').html(txt);
        return;
    } else {
        $('#map_container').css('height', '500px');
    }
    var content = '';
    content = '<div id="content">\n'+
        '<div id="siteNotice">\n'+
        '</div>\n'+
        '<h3 id="firstHeading" class="firstHeading">NWR Station: '+ call +'</h3>\n'+
        '<h4>' + data[call].loc +  '</h4>\n'+
        '<h4>Sited at ' + data[call].xmloc +  '</h4>\n'+
        '<div id="bodyContent">\n'+
        '<table>\n' +
        '<tr><td>Latitude:</td><td><b>' + data[call].lat + '</b></td></tr>\n'+
        '<tr><td>Longitude:</td><td><b>' + data[call].long + '</b></td></tr>\n'+
        '<tr><td>Power:</td><td><b>' + data[call].watts + '</b> Watts</td></tr>\n'+
        '<tr><td>Frequency:</td><td><b>' + data[call].freq + '</b></td></tr>\n'+
        '</table>\n' +
        '</div>\n'+
        '</div>\n';


    if(mymap != null) {
        mymap.remove();
    }

    var xmitr = L.icon({
        iconUrl: 'xmit2.gif',
        iconSize: [22, 22],
        popupAnchor: [-3, -25],
    });


    mymap = L.map('map', {
		center: new L.latLng(data[call].lat, data[call].long),
		zoom: 8,
		minZoom: 2,
		layers: [mapProvider],
		scrollWheelZoom: false
	});

    // layer for animated marker  path
    var bounds = mymap.getBounds();
    var top = bounds['_northEast']['lat'];
    var center = mymap.getCenter();
    var mid = top + ((center['lat'] - top)/2);
    var lineData = [[top, center['lng']],[mid, center['lng']],[center['lat'], center['lng']]];
    var line = L.polyline(lineData, {stroke: false});
    mymap.addLayer(line);

//* V3.00 additions
	initSC();
  var NWSinfo = new Object;
  if(data[call].mapurl !== '' && ! data[call].mapurl.match(/WNWS.gif/)) { // do only for NWS stations
    var shpfile = new L.Shapefile('NWR-coverage.php?prop='+ call + '&type=.zip', {
			  crossOrigin: 'anonymous',
				useCors: false,
        style: function(feature) {
            return {
                color: "Black",
                opacity: 0.4,
                weight: 1,
                fillColor: "#36FF36",
                fillOpacity: 0.45
            }
        },
				onEachFeature: function(feature, layer){
          layer.bindPopup("<strong>Transmitter Information</strong><br />Call Sign: <b>" + feature.properties.NWR_ID
					+ "</b><br>Type: <b>"+feature.properties.MANUFACTUR + " " +feature.properties.TRANS_TYPE
					+ "</b><br>Installed <b>"+feature.properties.DATES + "</b> by <b>" + feature.properties.FUNDING+"</b>");
					NWSinfo['call'] = feature.properties.NWR_ID;
					NWSinfo['radio'] = feature.properties.MANUFACTUR + " " +feature.properties.TRANS_TYPE;
					NWSinfo['install'] = feature.properties.DATES + " by " + feature.properties.FUNDING;
					//console.log(NWSinfo);
          layer.on('mouseover', function() { layer.openPopup(); });
          layer.on('mouseout', function() { layer.closePopup(); });
        }

    });
/* sample properties in .zip file
NWR_ID: KEC49
ST: CA
FISC_YEAR: 1984
YEARS: 1984
DATES: 7/1/1984
FUNDING: NWS
FREQUENCY: 162.55
TRANS_TYPE: B252
MANUFACTUR: ARMSTRONG
SITE_NAME: Monterey

*/


//    shpfile.addTo(mymap);
          
    // Custom Stripes
 
    var stripes = new L.StripePattern({
        angle: 40,
        color: "Green",
        weight: 2.1
    }).addTo(mymap);
/*
    SC = ["Alameda (SAME 006001)",
"San Mateo (SAME 006081)",
"Santa Clara (SAME 006085)",
"San Benito (SAME 006069)",
"Monterey (SAME 006053)",
"Contra Costa (SAME 006013)",
"San Francisco (SAME 006075)",
"Santa Cruz (SAME 006087)",
"Napa (SAME 006055)"];
//*/
		
    // LOAD COUNTY ALERTING AREA SHAPE FILES
    var cntyfile = new L.Shapefile('NWR-coverage.php?cover=' + call + '&type=_same.zip', { 
			  crossOrigin: 'anonymous',
				useCors: false,
        style: function(feature) {
            return {
                color: "Blue",
                opacity: 1,
                weight: 2,
                fillPattern: stripes,
            }
        },
        onEachFeature: function(feature, layer){
		      //var samecodes = data[call][samecode];
					var sctext = getSAMEtext(call,feature.properties.NAME);
          layer.bindPopup("<strong>COUNTY</strong><br /><b>" + sctext
					+ "</b>");
					addSC(sctext);
					// console.log(SC);
          layer.on('mouseover', function() { layer.openPopup(); });
          layer.on('mouseout', function() { layer.closePopup(); });
        }
    }).on('layeradd',function(ev) {
				var text = getSC();
		    $('#samecodes').html(text);

		});
		

/* sample properties in _same.zip file:
STATEFP: 06
COUNTYFP: 085
GEOID: 06085
NAME: Santa Clara
OBJECTID_1: 540
Name_1: Santa Clara
*/

//    cntyfile.addTo(map);
    var overlayMap = {
        "Propagation": shpfile,
        "Alerting Area": cntyfile
    };

    L.control.layers(baseLayers,overlayMap,{collapsed:false}).addTo(mymap);
	} else { // not an NWS station
    L.control.layers(baseLayers,{},{collapsed:false}).addTo(mymap);
	} // end extra V3.00 shapefile handling

		
//* end V3.00 addition */

//    L.control.layers(baseLayers).addTo(mymap);

    // add the animated marker
    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
        icon: xmitr,
        interval: 5,
        distance: 500
    }).bindTooltip(call + ' - Click for details').bindPopup(content);
    mymap.addLayer(animatedMarker);

}

$(document).ready(function () {
    loadInfo(function() {
        loadPointer();
        showStation(selectedstation, autoplaystartup);
    });

})
// end of NWR-radios.js script