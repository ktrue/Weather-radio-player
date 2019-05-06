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

*/
// note: all the data will come from NWR-radio-data.js JSON loaded by the HTML page
var selectedstation = '';
var mymap;
var lastCall;
var mapTileObj;
function loadDropdown(data,findstation) {
	// generate the option/select box HTML from the JSON file
/*
    "KEC49": {
        "call": "KEC49",
        "alt": "N",
        "loc": "Monterey, CA",
        "freq": "162.550 MHz",
        "who": "Saratoga-Weather.org",
        "type": "PWS",
        "wxurl": "http:\/\/saratoga-weather.org",
        "lat": 37.155,
        "long": -121.897222,
        "watts": "330",
        "xmloc": "Mt. Umunhum,CA",
        "wfo": "Monterey",
        "wxown": "KEC49",
        "radiourl": "http:\/\/saratogawx.dyndns.org:88\/broadwave.mp3",
        "mapurl": "http:\/\/www.nws.noaa.gov\/nwr\/Maps\/GIF\/KEC49.gif",
        "logo": "http:\/\/noaaweatherradio.org\/content\/thumbnails\/NWR150.png",
        "state": "California",
        "stateabbr": "CA"
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
		out += "<option value=\""+call+"\""+sel+">"+callx;
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
    if(data[call].wxurl == "") {
        var txt = data[call].who;
    } else {
        var txt = '<a href="' + data[call].wxurl + '" target="_blank">' + data[call].who + '</a>';
    }
    $('#provide').html(txt);
    var txt = '<img src="' + data[call].logo + '" height="50 width="50" alt="" />'
    $('#logo').html(txt);
		//var nwrcallsign = data[call].mapurl;
		//nwrcallsign = nwrcallsign.replace('http://www.nws.noaa.gov/nwr/Maps/GIF/','');
		//nwrcallsign = nwrcallsign.replace('.gif','');
    //var txt = '<img src="NWR-coverage.php?map=' + nwrcallsign + '" class="img-responsive" style="padding:5%;width:95%" alt="Coverage Map - ' + data[call].loc + ' Not Available" />'
		
    var txt = '<img src="' + data[call].mapurl + '" class="img-responsive" style="padding:5%;width:95%" alt="Coverage Map - ' + data[call].loc + ' Not Available" />'
    $('#cmap').html(txt);
    var txt = data[call].loc + ' Radio ' + data[call].call + ' Coverage Area';
    $('#maphead').html(txt);
    lastCall = call;
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
        '<tr><td><b>Latitude:</b></td><td>' + data[call].lat + '</td></tr>\n'+
        '<tr><td><b>Longitude:</b></td><td>' + data[call].long + '</td></tr>\n'+
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
		zoom: 11,
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

    L.control.layers(baseLayers).addTo(mymap);

    // add the animated marker
    var animatedMarker = L.animatedMarker(line.getLatLngs(), {
        icon: xmitr,
        interval: 50,
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