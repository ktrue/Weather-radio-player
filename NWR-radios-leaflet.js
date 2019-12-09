//<![CDATA[
/*
This is the collection of scripts to support the wxradio.php

// Version 2.00 - 06-Aug-2018 - rewrite to use Leaflet/OpenStreetMaps+others for map display
// Version 3.00 - 04-Dec-2019 - additional scripts for updated display - NWR site at weather.gov

Note: no customization of this file is required.

/*
 Leaflet 1.0.3, a JS library for interactive maps. http://leafletjs.com
 (c) 2010-2016 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 JSMin from leaflet-src.js
 Version 2.00 - 10-May-2018 - initial release with leaflet.js maps
*/
(function(window,document,undefined){var L={version:"1.0.3"};function expose(){var oldL=window.L;L.noConflict=function(){window.L=oldL;return this;};window.L=L;}
if(typeof module==='object'&&typeof module.exports==='object'){module.exports=L;}else if(typeof define==='function'&&define.amd){define(L);}
if(typeof window!=='undefined'){expose();}
L.Util={extend:function(dest){var i,j,len,src;for(j=1,len=arguments.length;j<len;j++){src=arguments[j];for(i in src){dest[i]=src[i];}}
return dest;},create:Object.create||(function(){function F(){}
return function(proto){F.prototype=proto;return new F();};})(),bind:function(fn,obj){var slice=Array.prototype.slice;if(fn.bind){return fn.bind.apply(fn,slice.call(arguments,1));}
var args=slice.call(arguments,2);return function(){return fn.apply(obj,args.length?args.concat(slice.call(arguments)):arguments);};},stamp:function(obj){obj._leaflet_id=obj._leaflet_id||++L.Util.lastId;return obj._leaflet_id;},lastId:0,throttle:function(fn,time,context){var lock,args,wrapperFn,later;later=function(){lock=false;if(args){wrapperFn.apply(context,args);args=false;}};wrapperFn=function(){if(lock){args=arguments;}else{fn.apply(context,arguments);setTimeout(later,time);lock=true;}};return wrapperFn;},wrapNum:function(x,range,includeMax){var max=range[1],min=range[0],d=max-min;return x===max&&includeMax?x:((x-min)%d+d)%d+min;},falseFn:function(){return false;},formatNum:function(num,digits){var pow=Math.pow(10,digits||5);return Math.round(num*pow)/pow;},trim:function(str){return str.trim?str.trim():str.replace(/^\s+|\s+$/g,'');},splitWords:function(str){return L.Util.trim(str).split(/\s+/);},setOptions:function(obj,options){if(!obj.hasOwnProperty('options')){obj.options=obj.options?L.Util.create(obj.options):{};}
for(var i in options){obj.options[i]=options[i];}
return obj.options;},getParamString:function(obj,existingUrl,uppercase){var params=[];for(var i in obj){params.push(encodeURIComponent(uppercase?i.toUpperCase():i)+'='+encodeURIComponent(obj[i]));}
return((!existingUrl||existingUrl.indexOf('?')===-1)?'?':'&')+params.join('&');},template:function(str,data){return str.replace(L.Util.templateRe,function(str,key){var value=data[key];if(value===undefined){throw new Error('No value provided for variable '+str);}else if(typeof value==='function'){value=value(data);}
return value;});},templateRe:/\{ *([\w_\-]+) *\}/g,isArray:Array.isArray||function(obj){return(Object.prototype.toString.call(obj)==='[object Array]');},indexOf:function(array,el){for(var i=0;i<array.length;i++){if(array[i]===el){return i;}}
return-1;},emptyImageUrl:'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='};(function(){function getPrefixed(name){return window['webkit'+name]||window['moz'+name]||window['ms'+name];}
var lastTime=0;function timeoutDefer(fn){var time=+new Date(),timeToCall=Math.max(0,16-(time-lastTime));lastTime=time+timeToCall;return window.setTimeout(fn,timeToCall);}
var requestFn=window.requestAnimationFrame||getPrefixed('RequestAnimationFrame')||timeoutDefer,cancelFn=window.cancelAnimationFrame||getPrefixed('CancelAnimationFrame')||getPrefixed('CancelRequestAnimationFrame')||function(id){window.clearTimeout(id);};L.Util.requestAnimFrame=function(fn,context,immediate){if(immediate&&requestFn===timeoutDefer){fn.call(context);}else{return requestFn.call(window,L.bind(fn,context));}};L.Util.cancelAnimFrame=function(id){if(id){cancelFn.call(window,id);}};})();L.extend=L.Util.extend;L.bind=L.Util.bind;L.stamp=L.Util.stamp;L.setOptions=L.Util.setOptions;L.Class=function(){};L.Class.extend=function(props){var NewClass=function(){if(this.initialize){this.initialize.apply(this,arguments);}
this.callInitHooks();};var parentProto=NewClass.__super__=this.prototype;var proto=L.Util.create(parentProto);proto.constructor=NewClass;NewClass.prototype=proto;for(var i in this){if(this.hasOwnProperty(i)&&i!=='prototype'){NewClass[i]=this[i];}}
if(props.statics){L.extend(NewClass,props.statics);delete props.statics;}
if(props.includes){L.Util.extend.apply(null,[proto].concat(props.includes));delete props.includes;}
if(proto.options){props.options=L.Util.extend(L.Util.create(proto.options),props.options);}
L.extend(proto,props);proto._initHooks=[];proto.callInitHooks=function(){if(this._initHooksCalled){return;}
if(parentProto.callInitHooks){parentProto.callInitHooks.call(this);}
this._initHooksCalled=true;for(var i=0,len=proto._initHooks.length;i<len;i++){proto._initHooks[i].call(this);}};return NewClass;};L.Class.include=function(props){L.extend(this.prototype,props);return this;};L.Class.mergeOptions=function(options){L.extend(this.prototype.options,options);return this;};L.Class.addInitHook=function(fn){var args=Array.prototype.slice.call(arguments,1);var init=typeof fn==='function'?fn:function(){this[fn].apply(this,args);};this.prototype._initHooks=this.prototype._initHooks||[];this.prototype._initHooks.push(init);return this;};L.Evented=L.Class.extend({on:function(types,fn,context){if(typeof types==='object'){for(var type in types){this._on(type,types[type],fn);}}else{types=L.Util.splitWords(types);for(var i=0,len=types.length;i<len;i++){this._on(types[i],fn,context);}}
return this;},off:function(types,fn,context){if(!types){delete this._events;}else if(typeof types==='object'){for(var type in types){this._off(type,types[type],fn);}}else{types=L.Util.splitWords(types);for(var i=0,len=types.length;i<len;i++){this._off(types[i],fn,context);}}
return this;},_on:function(type,fn,context){this._events=this._events||{};var typeListeners=this._events[type];if(!typeListeners){typeListeners=[];this._events[type]=typeListeners;}
if(context===this){context=undefined;}
var newListener={fn:fn,ctx:context},listeners=typeListeners;for(var i=0,len=listeners.length;i<len;i++){if(listeners[i].fn===fn&&listeners[i].ctx===context){return;}}
listeners.push(newListener);},_off:function(type,fn,context){var listeners,i,len;if(!this._events){return;}
listeners=this._events[type];if(!listeners){return;}
if(!fn){for(i=0,len=listeners.length;i<len;i++){listeners[i].fn=L.Util.falseFn;}
delete this._events[type];return;}
if(context===this){context=undefined;}
if(listeners){for(i=0,len=listeners.length;i<len;i++){var l=listeners[i];if(l.ctx!==context){continue;}
if(l.fn===fn){l.fn=L.Util.falseFn;if(this._firingCount){this._events[type]=listeners=listeners.slice();}
listeners.splice(i,1);return;}}}},fire:function(type,data,propagate){if(!this.listens(type,propagate)){return this;}
var event=L.Util.extend({},data,{type:type,target:this});if(this._events){var listeners=this._events[type];if(listeners){this._firingCount=(this._firingCount+1)||1;for(var i=0,len=listeners.length;i<len;i++){var l=listeners[i];l.fn.call(l.ctx||this,event);}
this._firingCount--;}}
if(propagate){this._propagateEvent(event);}
return this;},listens:function(type,propagate){var listeners=this._events&&this._events[type];if(listeners&&listeners.length){return true;}
if(propagate){for(var id in this._eventParents){if(this._eventParents[id].listens(type,propagate)){return true;}}}
return false;},once:function(types,fn,context){if(typeof types==='object'){for(var type in types){this.once(type,types[type],fn);}
return this;}
var handler=L.bind(function(){this.off(types,fn,context).off(types,handler,context);},this);return this.on(types,fn,context).on(types,handler,context);},addEventParent:function(obj){this._eventParents=this._eventParents||{};this._eventParents[L.stamp(obj)]=obj;return this;},removeEventParent:function(obj){if(this._eventParents){delete this._eventParents[L.stamp(obj)];}
return this;},_propagateEvent:function(e){for(var id in this._eventParents){this._eventParents[id].fire(e.type,L.extend({layer:e.target},e),true);}}});var proto=L.Evented.prototype;proto.addEventListener=proto.on;proto.removeEventListener=proto.clearAllEventListeners=proto.off;proto.addOneTimeEventListener=proto.once;proto.fireEvent=proto.fire;proto.hasEventListeners=proto.listens;L.Mixin={Events:proto};(function(){var ua=navigator.userAgent.toLowerCase(),doc=document.documentElement,ie='ActiveXObject'in window,webkit=ua.indexOf('webkit')!==-1,phantomjs=ua.indexOf('phantom')!==-1,android23=ua.search('android [23]')!==-1,chrome=ua.indexOf('chrome')!==-1,gecko=ua.indexOf('gecko')!==-1&&!webkit&&!window.opera&&!ie,win=navigator.platform.indexOf('Win')===0,mobile=typeof orientation!=='undefined'||ua.indexOf('mobile')!==-1,msPointer=!window.PointerEvent&&window.MSPointerEvent,pointer=window.PointerEvent||msPointer,ie3d=ie&&('transition'in doc.style),webkit3d=('WebKitCSSMatrix'in window)&&('m11'in new window.WebKitCSSMatrix())&&!android23,gecko3d='MozPerspective'in doc.style,opera12='OTransition'in doc.style;var touch=!window.L_NO_TOUCH&&(pointer||'ontouchstart'in window||(window.DocumentTouch&&document instanceof window.DocumentTouch));L.Browser={ie:ie,ielt9:ie&&!document.addEventListener,edge:'msLaunchUri'in navigator&&!('documentMode'in document),webkit:webkit,gecko:gecko,android:ua.indexOf('android')!==-1,android23:android23,chrome:chrome,safari:!chrome&&ua.indexOf('safari')!==-1,win:win,ie3d:ie3d,webkit3d:webkit3d,gecko3d:gecko3d,opera12:opera12,any3d:!window.L_DISABLE_3D&&(ie3d||webkit3d||gecko3d)&&!opera12&&!phantomjs,mobile:mobile,mobileWebkit:mobile&&webkit,mobileWebkit3d:mobile&&webkit3d,mobileOpera:mobile&&window.opera,mobileGecko:mobile&&gecko,touch:!!touch,msPointer:!!msPointer,pointer:!!pointer,retina:(window.devicePixelRatio||(window.screen.deviceXDPI/window.screen.logicalXDPI))>1};}());L.Point=function(x,y,round){this.x=(round?Math.round(x):x);this.y=(round?Math.round(y):y);};L.Point.prototype={clone:function(){return new L.Point(this.x,this.y);},add:function(point){return this.clone()._add(L.point(point));},_add:function(point){this.x+=point.x;this.y+=point.y;return this;},subtract:function(point){return this.clone()._subtract(L.point(point));},_subtract:function(point){this.x-=point.x;this.y-=point.y;return this;},divideBy:function(num){return this.clone()._divideBy(num);},_divideBy:function(num){this.x/=num;this.y/=num;return this;},multiplyBy:function(num){return this.clone()._multiplyBy(num);},_multiplyBy:function(num){this.x*=num;this.y*=num;return this;},scaleBy:function(point){return new L.Point(this.x*point.x,this.y*point.y);},unscaleBy:function(point){return new L.Point(this.x/point.x,this.y/point.y);},round:function(){return this.clone()._round();},_round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this;},floor:function(){return this.clone()._floor();},_floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this;},ceil:function(){return this.clone()._ceil();},_ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this;},distanceTo:function(point){point=L.point(point);var x=point.x-this.x,y=point.y-this.y;return Math.sqrt(x*x+y*y);},equals:function(point){point=L.point(point);return point.x===this.x&&point.y===this.y;},contains:function(point){point=L.point(point);return Math.abs(point.x)<=Math.abs(this.x)&&Math.abs(point.y)<=Math.abs(this.y);},toString:function(){return'Point('+
L.Util.formatNum(this.x)+', '+
L.Util.formatNum(this.y)+')';}};L.point=function(x,y,round){if(x instanceof L.Point){return x;}
if(L.Util.isArray(x)){return new L.Point(x[0],x[1]);}
if(x===undefined||x===null){return x;}
if(typeof x==='object'&&'x'in x&&'y'in x){return new L.Point(x.x,x.y);}
return new L.Point(x,y,round);};L.Bounds=function(a,b){if(!a){return;}
var points=b?[a,b]:a;for(var i=0,len=points.length;i<len;i++){this.extend(points[i]);}};L.Bounds.prototype={extend:function(point){point=L.point(point);if(!this.min&&!this.max){this.min=point.clone();this.max=point.clone();}else{this.min.x=Math.min(point.x,this.min.x);this.max.x=Math.max(point.x,this.max.x);this.min.y=Math.min(point.y,this.min.y);this.max.y=Math.max(point.y,this.max.y);}
return this;},getCenter:function(round){return new L.Point((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,round);},getBottomLeft:function(){return new L.Point(this.min.x,this.max.y);},getTopRight:function(){return new L.Point(this.max.x,this.min.y);},getSize:function(){return this.max.subtract(this.min);},contains:function(obj){var min,max;if(typeof obj[0]==='number'||obj instanceof L.Point){obj=L.point(obj);}else{obj=L.bounds(obj);}
if(obj instanceof L.Bounds){min=obj.min;max=obj.max;}else{min=max=obj;}
return(min.x>=this.min.x)&&(max.x<=this.max.x)&&(min.y>=this.min.y)&&(max.y<=this.max.y);},intersects:function(bounds){bounds=L.bounds(bounds);var min=this.min,max=this.max,min2=bounds.min,max2=bounds.max,xIntersects=(max2.x>=min.x)&&(min2.x<=max.x),yIntersects=(max2.y>=min.y)&&(min2.y<=max.y);return xIntersects&&yIntersects;},overlaps:function(bounds){bounds=L.bounds(bounds);var min=this.min,max=this.max,min2=bounds.min,max2=bounds.max,xOverlaps=(max2.x>min.x)&&(min2.x<max.x),yOverlaps=(max2.y>min.y)&&(min2.y<max.y);return xOverlaps&&yOverlaps;},isValid:function(){return!!(this.min&&this.max);}};L.bounds=function(a,b){if(!a||a instanceof L.Bounds){return a;}
return new L.Bounds(a,b);};L.Transformation=function(a,b,c,d){this._a=a;this._b=b;this._c=c;this._d=d;};L.Transformation.prototype={transform:function(point,scale){return this._transform(point.clone(),scale);},_transform:function(point,scale){scale=scale||1;point.x=scale*(this._a*point.x+this._b);point.y=scale*(this._c*point.y+this._d);return point;},untransform:function(point,scale){scale=scale||1;return new L.Point((point.x/scale-this._b)/this._a,(point.y/scale-this._d)/this._c);}};L.DomUtil={get:function(id){return typeof id==='string'?document.getElementById(id):id;},getStyle:function(el,style){var value=el.style[style]||(el.currentStyle&&el.currentStyle[style]);if((!value||value==='auto')&&document.defaultView){var css=document.defaultView.getComputedStyle(el,null);value=css?css[style]:null;}
return value==='auto'?null:value;},create:function(tagName,className,container){var el=document.createElement(tagName);el.className=className||'';if(container){container.appendChild(el);}
return el;},remove:function(el){var parent=el.parentNode;if(parent){parent.removeChild(el);}},empty:function(el){while(el.firstChild){el.removeChild(el.firstChild);}},toFront:function(el){el.parentNode.appendChild(el);},toBack:function(el){var parent=el.parentNode;parent.insertBefore(el,parent.firstChild);},hasClass:function(el,name){if(el.classList!==undefined){return el.classList.contains(name);}
var className=L.DomUtil.getClass(el);return className.length>0&&new RegExp('(^|\\s)'+name+'(\\s|$)').test(className);},addClass:function(el,name){if(el.classList!==undefined){var classes=L.Util.splitWords(name);for(var i=0,len=classes.length;i<len;i++){el.classList.add(classes[i]);}}else if(!L.DomUtil.hasClass(el,name)){var className=L.DomUtil.getClass(el);L.DomUtil.setClass(el,(className?className+' ':'')+name);}},removeClass:function(el,name){if(el.classList!==undefined){el.classList.remove(name);}else{L.DomUtil.setClass(el,L.Util.trim((' '+L.DomUtil.getClass(el)+' ').replace(' '+name+' ',' ')));}},setClass:function(el,name){if(el.className.baseVal===undefined){el.className=name;}else{el.className.baseVal=name;}},getClass:function(el){return el.className.baseVal===undefined?el.className:el.className.baseVal;},setOpacity:function(el,value){if('opacity'in el.style){el.style.opacity=value;}else if('filter'in el.style){L.DomUtil._setOpacityIE(el,value);}},_setOpacityIE:function(el,value){var filter=false,filterName='DXImageTransform.Microsoft.Alpha';try{filter=el.filters.item(filterName);}catch(e){if(value===1){return;}}
value=Math.round(value*100);if(filter){filter.Enabled=(value!==100);filter.Opacity=value;}else{el.style.filter+=' progid:'+filterName+'(opacity='+value+')';}},testProp:function(props){var style=document.documentElement.style;for(var i=0;i<props.length;i++){if(props[i]in style){return props[i];}}
return false;},setTransform:function(el,offset,scale){var pos=offset||new L.Point(0,0);el.style[L.DomUtil.TRANSFORM]=(L.Browser.ie3d?'translate('+pos.x+'px,'+pos.y+'px)':'translate3d('+pos.x+'px,'+pos.y+'px,0)')+
(scale?' scale('+scale+')':'');},setPosition:function(el,point){el._leaflet_pos=point;if(L.Browser.any3d){L.DomUtil.setTransform(el,point);}else{el.style.left=point.x+'px';el.style.top=point.y+'px';}},getPosition:function(el){return el._leaflet_pos||new L.Point(0,0);}};(function(){L.DomUtil.TRANSFORM=L.DomUtil.testProp(['transform','WebkitTransform','OTransform','MozTransform','msTransform']);var transition=L.DomUtil.TRANSITION=L.DomUtil.testProp(['webkitTransition','transition','OTransition','MozTransition','msTransition']);L.DomUtil.TRANSITION_END=transition==='webkitTransition'||transition==='OTransition'?transition+'End':'transitionend';if('onselectstart'in document){L.DomUtil.disableTextSelection=function(){L.DomEvent.on(window,'selectstart',L.DomEvent.preventDefault);};L.DomUtil.enableTextSelection=function(){L.DomEvent.off(window,'selectstart',L.DomEvent.preventDefault);};}else{var userSelectProperty=L.DomUtil.testProp(['userSelect','WebkitUserSelect','OUserSelect','MozUserSelect','msUserSelect']);L.DomUtil.disableTextSelection=function(){if(userSelectProperty){var style=document.documentElement.style;this._userSelect=style[userSelectProperty];style[userSelectProperty]='none';}};L.DomUtil.enableTextSelection=function(){if(userSelectProperty){document.documentElement.style[userSelectProperty]=this._userSelect;delete this._userSelect;}};}
L.DomUtil.disableImageDrag=function(){L.DomEvent.on(window,'dragstart',L.DomEvent.preventDefault);};L.DomUtil.enableImageDrag=function(){L.DomEvent.off(window,'dragstart',L.DomEvent.preventDefault);};L.DomUtil.preventOutline=function(element){while(element.tabIndex===-1){element=element.parentNode;}
if(!element||!element.style){return;}
L.DomUtil.restoreOutline();this._outlineElement=element;this._outlineStyle=element.style.outline;element.style.outline='none';L.DomEvent.on(window,'keydown',L.DomUtil.restoreOutline,this);};L.DomUtil.restoreOutline=function(){if(!this._outlineElement){return;}
this._outlineElement.style.outline=this._outlineStyle;delete this._outlineElement;delete this._outlineStyle;L.DomEvent.off(window,'keydown',L.DomUtil.restoreOutline,this);};})();L.LatLng=function(lat,lng,alt){if(isNaN(lat)||isNaN(lng)){throw new Error('Invalid LatLng object: ('+lat+', '+lng+')');}
this.lat=+lat;this.lng=+lng;if(alt!==undefined){this.alt=+alt;}};L.LatLng.prototype={equals:function(obj,maxMargin){if(!obj){return false;}
obj=L.latLng(obj);var margin=Math.max(Math.abs(this.lat-obj.lat),Math.abs(this.lng-obj.lng));return margin<=(maxMargin===undefined?1.0E-9:maxMargin);},toString:function(precision){return'LatLng('+
L.Util.formatNum(this.lat,precision)+', '+
L.Util.formatNum(this.lng,precision)+')';},distanceTo:function(other){return L.CRS.Earth.distance(this,L.latLng(other));},wrap:function(){return L.CRS.Earth.wrapLatLng(this);},toBounds:function(sizeInMeters){var latAccuracy=180*sizeInMeters/40075017,lngAccuracy=latAccuracy/Math.cos((Math.PI/180)*this.lat);return L.latLngBounds([this.lat-latAccuracy,this.lng-lngAccuracy],[this.lat+latAccuracy,this.lng+lngAccuracy]);},clone:function(){return new L.LatLng(this.lat,this.lng,this.alt);}};L.latLng=function(a,b,c){if(a instanceof L.LatLng){return a;}
if(L.Util.isArray(a)&&typeof a[0]!=='object'){if(a.length===3){return new L.LatLng(a[0],a[1],a[2]);}
if(a.length===2){return new L.LatLng(a[0],a[1]);}
return null;}
if(a===undefined||a===null){return a;}
if(typeof a==='object'&&'lat'in a){return new L.LatLng(a.lat,'lng'in a?a.lng:a.lon,a.alt);}
if(b===undefined){return null;}
return new L.LatLng(a,b,c);};L.LatLngBounds=function(corner1,corner2){if(!corner1){return;}
var latlngs=corner2?[corner1,corner2]:corner1;for(var i=0,len=latlngs.length;i<len;i++){this.extend(latlngs[i]);}};L.LatLngBounds.prototype={extend:function(obj){var sw=this._southWest,ne=this._northEast,sw2,ne2;if(obj instanceof L.LatLng){sw2=obj;ne2=obj;}else if(obj instanceof L.LatLngBounds){sw2=obj._southWest;ne2=obj._northEast;if(!sw2||!ne2){return this;}}else{return obj?this.extend(L.latLng(obj)||L.latLngBounds(obj)):this;}
if(!sw&&!ne){this._southWest=new L.LatLng(sw2.lat,sw2.lng);this._northEast=new L.LatLng(ne2.lat,ne2.lng);}else{sw.lat=Math.min(sw2.lat,sw.lat);sw.lng=Math.min(sw2.lng,sw.lng);ne.lat=Math.max(ne2.lat,ne.lat);ne.lng=Math.max(ne2.lng,ne.lng);}
return this;},pad:function(bufferRatio){var sw=this._southWest,ne=this._northEast,heightBuffer=Math.abs(sw.lat-ne.lat)*bufferRatio,widthBuffer=Math.abs(sw.lng-ne.lng)*bufferRatio;return new L.LatLngBounds(new L.LatLng(sw.lat-heightBuffer,sw.lng-widthBuffer),new L.LatLng(ne.lat+heightBuffer,ne.lng+widthBuffer));},getCenter:function(){return new L.LatLng((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2);},getSouthWest:function(){return this._southWest;},getNorthEast:function(){return this._northEast;},getNorthWest:function(){return new L.LatLng(this.getNorth(),this.getWest());},getSouthEast:function(){return new L.LatLng(this.getSouth(),this.getEast());},getWest:function(){return this._southWest.lng;},getSouth:function(){return this._southWest.lat;},getEast:function(){return this._northEast.lng;},getNorth:function(){return this._northEast.lat;},contains:function(obj){if(typeof obj[0]==='number'||obj instanceof L.LatLng||'lat'in obj){obj=L.latLng(obj);}else{obj=L.latLngBounds(obj);}
var sw=this._southWest,ne=this._northEast,sw2,ne2;if(obj instanceof L.LatLngBounds){sw2=obj.getSouthWest();ne2=obj.getNorthEast();}else{sw2=ne2=obj;}
return(sw2.lat>=sw.lat)&&(ne2.lat<=ne.lat)&&(sw2.lng>=sw.lng)&&(ne2.lng<=ne.lng);},intersects:function(bounds){bounds=L.latLngBounds(bounds);var sw=this._southWest,ne=this._northEast,sw2=bounds.getSouthWest(),ne2=bounds.getNorthEast(),latIntersects=(ne2.lat>=sw.lat)&&(sw2.lat<=ne.lat),lngIntersects=(ne2.lng>=sw.lng)&&(sw2.lng<=ne.lng);return latIntersects&&lngIntersects;},overlaps:function(bounds){bounds=L.latLngBounds(bounds);var sw=this._southWest,ne=this._northEast,sw2=bounds.getSouthWest(),ne2=bounds.getNorthEast(),latOverlaps=(ne2.lat>sw.lat)&&(sw2.lat<ne.lat),lngOverlaps=(ne2.lng>sw.lng)&&(sw2.lng<ne.lng);return latOverlaps&&lngOverlaps;},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(',');},equals:function(bounds){if(!bounds){return false;}
bounds=L.latLngBounds(bounds);return this._southWest.equals(bounds.getSouthWest())&&this._northEast.equals(bounds.getNorthEast());},isValid:function(){return!!(this._southWest&&this._northEast);}};L.latLngBounds=function(a,b){if(a instanceof L.LatLngBounds){return a;}
return new L.LatLngBounds(a,b);};L.Projection={};L.Projection.LonLat={project:function(latlng){return new L.Point(latlng.lng,latlng.lat);},unproject:function(point){return new L.LatLng(point.y,point.x);},bounds:L.bounds([-180,-90],[180,90])};L.Projection.SphericalMercator={R:6378137,MAX_LATITUDE:85.0511287798,project:function(latlng){var d=Math.PI/180,max=this.MAX_LATITUDE,lat=Math.max(Math.min(max,latlng.lat),-max),sin=Math.sin(lat*d);return new L.Point(this.R*latlng.lng*d,this.R*Math.log((1+sin)/(1-sin))/2);},unproject:function(point){var d=180/Math.PI;return new L.LatLng((2*Math.atan(Math.exp(point.y/this.R))-(Math.PI/2))*d,point.x*d/this.R);},bounds:(function(){var d=6378137*Math.PI;return L.bounds([-d,-d],[d,d]);})()};L.CRS={latLngToPoint:function(latlng,zoom){var projectedPoint=this.projection.project(latlng),scale=this.scale(zoom);return this.transformation._transform(projectedPoint,scale);},pointToLatLng:function(point,zoom){var scale=this.scale(zoom),untransformedPoint=this.transformation.untransform(point,scale);return this.projection.unproject(untransformedPoint);},project:function(latlng){return this.projection.project(latlng);},unproject:function(point){return this.projection.unproject(point);},scale:function(zoom){return 256*Math.pow(2,zoom);},zoom:function(scale){return Math.log(scale/256)/Math.LN2;},getProjectedBounds:function(zoom){if(this.infinite){return null;}
var b=this.projection.bounds,s=this.scale(zoom),min=this.transformation.transform(b.min,s),max=this.transformation.transform(b.max,s);return L.bounds(min,max);},infinite:false,wrapLatLng:function(latlng){var lng=this.wrapLng?L.Util.wrapNum(latlng.lng,this.wrapLng,true):latlng.lng,lat=this.wrapLat?L.Util.wrapNum(latlng.lat,this.wrapLat,true):latlng.lat,alt=latlng.alt;return L.latLng(lat,lng,alt);},wrapLatLngBounds:function(bounds){var center=bounds.getCenter(),newCenter=this.wrapLatLng(center),latShift=center.lat-newCenter.lat,lngShift=center.lng-newCenter.lng;if(latShift===0&&lngShift===0){return bounds;}
var sw=bounds.getSouthWest(),ne=bounds.getNorthEast(),newSw=L.latLng({lat:sw.lat-latShift,lng:sw.lng-lngShift}),newNe=L.latLng({lat:ne.lat-latShift,lng:ne.lng-lngShift});return new L.LatLngBounds(newSw,newNe);}};L.CRS.Simple=L.extend({},L.CRS,{projection:L.Projection.LonLat,transformation:new L.Transformation(1,0,-1,0),scale:function(zoom){return Math.pow(2,zoom);},zoom:function(scale){return Math.log(scale)/Math.LN2;},distance:function(latlng1,latlng2){var dx=latlng2.lng-latlng1.lng,dy=latlng2.lat-latlng1.lat;return Math.sqrt(dx*dx+dy*dy);},infinite:true});L.CRS.Earth=L.extend({},L.CRS,{wrapLng:[-180,180],R:6371000,distance:function(latlng1,latlng2){var rad=Math.PI/180,lat1=latlng1.lat*rad,lat2=latlng2.lat*rad,a=Math.sin(lat1)*Math.sin(lat2)+
Math.cos(lat1)*Math.cos(lat2)*Math.cos((latlng2.lng-latlng1.lng)*rad);return this.R*Math.acos(Math.min(a,1));}});L.CRS.EPSG3857=L.extend({},L.CRS.Earth,{code:'EPSG:3857',projection:L.Projection.SphericalMercator,transformation:(function(){var scale=0.5/(Math.PI*L.Projection.SphericalMercator.R);return new L.Transformation(scale,0.5,-scale,0.5);}())});L.CRS.EPSG900913=L.extend({},L.CRS.EPSG3857,{code:'EPSG:900913'});L.CRS.EPSG4326=L.extend({},L.CRS.Earth,{code:'EPSG:4326',projection:L.Projection.LonLat,transformation:new L.Transformation(1/180,1,-1/180,0.5)});L.Map=L.Evented.extend({options:{crs:L.CRS.EPSG3857,center:undefined,zoom:undefined,minZoom:undefined,maxZoom:undefined,layers:[],maxBounds:undefined,renderer:undefined,zoomAnimation:true,zoomAnimationThreshold:4,fadeAnimation:true,markerZoomAnimation:true,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:true},initialize:function(id,options){options=L.setOptions(this,options);this._initContainer(id);this._initLayout();this._onResize=L.bind(this._onResize,this);this._initEvents();if(options.maxBounds){this.setMaxBounds(options.maxBounds);}
if(options.zoom!==undefined){this._zoom=this._limitZoom(options.zoom);}
if(options.center&&options.zoom!==undefined){this.setView(L.latLng(options.center),options.zoom,{reset:true});}
this._handlers=[];this._layers={};this._zoomBoundLayers={};this._sizeChanged=true;this.callInitHooks();this._zoomAnimated=L.DomUtil.TRANSITION&&L.Browser.any3d&&!L.Browser.mobileOpera&&this.options.zoomAnimation;if(this._zoomAnimated){this._createAnimProxy();L.DomEvent.on(this._proxy,L.DomUtil.TRANSITION_END,this._catchTransitionEnd,this);}
this._addLayers(this.options.layers);},setView:function(center,zoom,options){zoom=zoom===undefined?this._zoom:this._limitZoom(zoom);center=this._limitCenter(L.latLng(center),zoom,this.options.maxBounds);options=options||{};this._stop();if(this._loaded&&!options.reset&&options!==true){if(options.animate!==undefined){options.zoom=L.extend({animate:options.animate},options.zoom);options.pan=L.extend({animate:options.animate,duration:options.duration},options.pan);}
var moved=(this._zoom!==zoom)?this._tryAnimatedZoom&&this._tryAnimatedZoom(center,zoom,options.zoom):this._tryAnimatedPan(center,options.pan);if(moved){clearTimeout(this._sizeTimer);return this;}}
this._resetView(center,zoom);return this;},setZoom:function(zoom,options){if(!this._loaded){this._zoom=zoom;return this;}
return this.setView(this.getCenter(),zoom,{zoom:options});},zoomIn:function(delta,options){delta=delta||(L.Browser.any3d?this.options.zoomDelta:1);return this.setZoom(this._zoom+delta,options);},zoomOut:function(delta,options){delta=delta||(L.Browser.any3d?this.options.zoomDelta:1);return this.setZoom(this._zoom-delta,options);},setZoomAround:function(latlng,zoom,options){var scale=this.getZoomScale(zoom),viewHalf=this.getSize().divideBy(2),containerPoint=latlng instanceof L.Point?latlng:this.latLngToContainerPoint(latlng),centerOffset=containerPoint.subtract(viewHalf).multiplyBy(1-1/scale),newCenter=this.containerPointToLatLng(viewHalf.add(centerOffset));return this.setView(newCenter,zoom,{zoom:options});},_getBoundsCenterZoom:function(bounds,options){options=options||{};bounds=bounds.getBounds?bounds.getBounds():L.latLngBounds(bounds);var paddingTL=L.point(options.paddingTopLeft||options.padding||[0,0]),paddingBR=L.point(options.paddingBottomRight||options.padding||[0,0]),zoom=this.getBoundsZoom(bounds,false,paddingTL.add(paddingBR));zoom=(typeof options.maxZoom==='number')?Math.min(options.maxZoom,zoom):zoom;var paddingOffset=paddingBR.subtract(paddingTL).divideBy(2),swPoint=this.project(bounds.getSouthWest(),zoom),nePoint=this.project(bounds.getNorthEast(),zoom),center=this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset),zoom);return{center:center,zoom:zoom};},fitBounds:function(bounds,options){bounds=L.latLngBounds(bounds);if(!bounds.isValid()){throw new Error('Bounds are not valid.');}
var target=this._getBoundsCenterZoom(bounds,options);return this.setView(target.center,target.zoom,options);},fitWorld:function(options){return this.fitBounds([[-90,-180],[90,180]],options);},panTo:function(center,options){return this.setView(center,this._zoom,{pan:options});},panBy:function(offset,options){offset=L.point(offset).round();options=options||{};if(!offset.x&&!offset.y){return this.fire('moveend');}
if(options.animate!==true&&!this.getSize().contains(offset)){this._resetView(this.unproject(this.project(this.getCenter()).add(offset)),this.getZoom());return this;}
if(!this._panAnim){this._panAnim=new L.PosAnimation();this._panAnim.on({'step':this._onPanTransitionStep,'end':this._onPanTransitionEnd},this);}
if(!options.noMoveStart){this.fire('movestart');}
if(options.animate!==false){L.DomUtil.addClass(this._mapPane,'leaflet-pan-anim');var newPos=this._getMapPanePos().subtract(offset).round();this._panAnim.run(this._mapPane,newPos,options.duration||0.25,options.easeLinearity);}else{this._rawPanBy(offset);this.fire('move').fire('moveend');}
return this;},flyTo:function(targetCenter,targetZoom,options){options=options||{};if(options.animate===false||!L.Browser.any3d){return this.setView(targetCenter,targetZoom,options);}
this._stop();var from=this.project(this.getCenter()),to=this.project(targetCenter),size=this.getSize(),startZoom=this._zoom;targetCenter=L.latLng(targetCenter);targetZoom=targetZoom===undefined?startZoom:targetZoom;var w0=Math.max(size.x,size.y),w1=w0*this.getZoomScale(startZoom,targetZoom),u1=(to.distanceTo(from))||1,rho=1.42,rho2=rho*rho;function r(i){var s1=i?-1:1,s2=i?w1:w0,t1=w1*w1-w0*w0+s1*rho2*rho2*u1*u1,b1=2*s2*rho2*u1,b=t1/b1,sq=Math.sqrt(b*b+1)-b;var log=sq<0.000000001?-18:Math.log(sq);return log;}
function sinh(n){return(Math.exp(n)-Math.exp(-n))/2;}
function cosh(n){return(Math.exp(n)+Math.exp(-n))/2;}
function tanh(n){return sinh(n)/cosh(n);}
var r0=r(0);function w(s){return w0*(cosh(r0)/cosh(r0+rho*s));}
function u(s){return w0*(cosh(r0)*tanh(r0+rho*s)-sinh(r0))/rho2;}
function easeOut(t){return 1-Math.pow(1-t,1.5);}
var start=Date.now(),S=(r(1)-r0)/rho,duration=options.duration?1000*options.duration:1000*S*0.8;function frame(){var t=(Date.now()-start)/duration,s=easeOut(t)*S;if(t<=1){this._flyToFrame=L.Util.requestAnimFrame(frame,this);this._move(this.unproject(from.add(to.subtract(from).multiplyBy(u(s)/u1)),startZoom),this.getScaleZoom(w0/w(s),startZoom),{flyTo:true});}else{this._move(targetCenter,targetZoom)._moveEnd(true);}}
this._moveStart(true);frame.call(this);return this;},flyToBounds:function(bounds,options){var target=this._getBoundsCenterZoom(bounds,options);return this.flyTo(target.center,target.zoom,options);},setMaxBounds:function(bounds){bounds=L.latLngBounds(bounds);if(!bounds.isValid()){this.options.maxBounds=null;return this.off('moveend',this._panInsideMaxBounds);}else if(this.options.maxBounds){this.off('moveend',this._panInsideMaxBounds);}
this.options.maxBounds=bounds;if(this._loaded){this._panInsideMaxBounds();}
return this.on('moveend',this._panInsideMaxBounds);},setMinZoom:function(zoom){this.options.minZoom=zoom;if(this._loaded&&this.getZoom()<this.options.minZoom){return this.setZoom(zoom);}
return this;},setMaxZoom:function(zoom){this.options.maxZoom=zoom;if(this._loaded&&(this.getZoom()>this.options.maxZoom)){return this.setZoom(zoom);}
return this;},panInsideBounds:function(bounds,options){this._enforcingBounds=true;var center=this.getCenter(),newCenter=this._limitCenter(center,this._zoom,L.latLngBounds(bounds));if(!center.equals(newCenter)){this.panTo(newCenter,options);}
this._enforcingBounds=false;return this;},invalidateSize:function(options){if(!this._loaded){return this;}
options=L.extend({animate:false,pan:true},options===true?{animate:true}:options);var oldSize=this.getSize();this._sizeChanged=true;this._lastCenter=null;var newSize=this.getSize(),oldCenter=oldSize.divideBy(2).round(),newCenter=newSize.divideBy(2).round(),offset=oldCenter.subtract(newCenter);if(!offset.x&&!offset.y){return this;}
if(options.animate&&options.pan){this.panBy(offset);}else{if(options.pan){this._rawPanBy(offset);}
this.fire('move');if(options.debounceMoveend){clearTimeout(this._sizeTimer);this._sizeTimer=setTimeout(L.bind(this.fire,this,'moveend'),200);}else{this.fire('moveend');}}
return this.fire('resize',{oldSize:oldSize,newSize:newSize});},stop:function(){this.setZoom(this._limitZoom(this._zoom));if(!this.options.zoomSnap){this.fire('viewreset');}
return this._stop();},locate:function(options){options=this._locateOptions=L.extend({timeout:10000,watch:false},options);if(!('geolocation'in navigator)){this._handleGeolocationError({code:0,message:'Geolocation not supported.'});return this;}
var onResponse=L.bind(this._handleGeolocationResponse,this),onError=L.bind(this._handleGeolocationError,this);if(options.watch){this._locationWatchId=navigator.geolocation.watchPosition(onResponse,onError,options);}else{navigator.geolocation.getCurrentPosition(onResponse,onError,options);}
return this;},stopLocate:function(){if(navigator.geolocation&&navigator.geolocation.clearWatch){navigator.geolocation.clearWatch(this._locationWatchId);}
if(this._locateOptions){this._locateOptions.setView=false;}
return this;},_handleGeolocationError:function(error){var c=error.code,message=error.message||(c===1?'permission denied':(c===2?'position unavailable':'timeout'));if(this._locateOptions.setView&&!this._loaded){this.fitWorld();}
this.fire('locationerror',{code:c,message:'Geolocation error: '+message+'.'});},_handleGeolocationResponse:function(pos){var lat=pos.coords.latitude,lng=pos.coords.longitude,latlng=new L.LatLng(lat,lng),bounds=latlng.toBounds(pos.coords.accuracy),options=this._locateOptions;if(options.setView){var zoom=this.getBoundsZoom(bounds);this.setView(latlng,options.maxZoom?Math.min(zoom,options.maxZoom):zoom);}
var data={latlng:latlng,bounds:bounds,timestamp:pos.timestamp};for(var i in pos.coords){if(typeof pos.coords[i]==='number'){data[i]=pos.coords[i];}}
this.fire('locationfound',data);},addHandler:function(name,HandlerClass){if(!HandlerClass){return this;}
var handler=this[name]=new HandlerClass(this);this._handlers.push(handler);if(this.options[name]){handler.enable();}
return this;},remove:function(){this._initEvents(true);if(this._containerId!==this._container._leaflet_id){throw new Error('Map container is being reused by another instance');}
try{delete this._container._leaflet_id;delete this._containerId;}catch(e){this._container._leaflet_id=undefined;this._containerId=undefined;}
L.DomUtil.remove(this._mapPane);if(this._clearControlPos){this._clearControlPos();}
this._clearHandlers();if(this._loaded){this.fire('unload');}
for(var i in this._layers){this._layers[i].remove();}
return this;},createPane:function(name,container){var className='leaflet-pane'+(name?' leaflet-'+name.replace('Pane','')+'-pane':''),pane=L.DomUtil.create('div',className,container||this._mapPane);if(name){this._panes[name]=pane;}
return pane;},getCenter:function(){this._checkIfLoaded();if(this._lastCenter&&!this._moved()){return this._lastCenter;}
return this.layerPointToLatLng(this._getCenterLayerPoint());},getZoom:function(){return this._zoom;},getBounds:function(){var bounds=this.getPixelBounds(),sw=this.unproject(bounds.getBottomLeft()),ne=this.unproject(bounds.getTopRight());return new L.LatLngBounds(sw,ne);},getMinZoom:function(){return this.options.minZoom===undefined?this._layersMinZoom||0:this.options.minZoom;},getMaxZoom:function(){return this.options.maxZoom===undefined?(this._layersMaxZoom===undefined?Infinity:this._layersMaxZoom):this.options.maxZoom;},getBoundsZoom:function(bounds,inside,padding){bounds=L.latLngBounds(bounds);padding=L.point(padding||[0,0]);var zoom=this.getZoom()||0,min=this.getMinZoom(),max=this.getMaxZoom(),nw=bounds.getNorthWest(),se=bounds.getSouthEast(),size=this.getSize().subtract(padding),boundsSize=L.bounds(this.project(se,zoom),this.project(nw,zoom)).getSize(),snap=L.Browser.any3d?this.options.zoomSnap:1;var scale=Math.min(size.x/boundsSize.x,size.y/boundsSize.y);zoom=this.getScaleZoom(scale,zoom);if(snap){zoom=Math.round(zoom/(snap/100))*(snap/100);zoom=inside?Math.ceil(zoom/snap)*snap:Math.floor(zoom/snap)*snap;}
return Math.max(min,Math.min(max,zoom));},getSize:function(){if(!this._size||this._sizeChanged){this._size=new L.Point(this._container.clientWidth||0,this._container.clientHeight||0);this._sizeChanged=false;}
return this._size.clone();},getPixelBounds:function(center,zoom){var topLeftPoint=this._getTopLeftPoint(center,zoom);return new L.Bounds(topLeftPoint,topLeftPoint.add(this.getSize()));},getPixelOrigin:function(){this._checkIfLoaded();return this._pixelOrigin;},getPixelWorldBounds:function(zoom){return this.options.crs.getProjectedBounds(zoom===undefined?this.getZoom():zoom);},getPane:function(pane){return typeof pane==='string'?this._panes[pane]:pane;},getPanes:function(){return this._panes;},getContainer:function(){return this._container;},getZoomScale:function(toZoom,fromZoom){var crs=this.options.crs;fromZoom=fromZoom===undefined?this._zoom:fromZoom;return crs.scale(toZoom)/crs.scale(fromZoom);},getScaleZoom:function(scale,fromZoom){var crs=this.options.crs;fromZoom=fromZoom===undefined?this._zoom:fromZoom;var zoom=crs.zoom(scale*crs.scale(fromZoom));return isNaN(zoom)?Infinity:zoom;},project:function(latlng,zoom){zoom=zoom===undefined?this._zoom:zoom;return this.options.crs.latLngToPoint(L.latLng(latlng),zoom);},unproject:function(point,zoom){zoom=zoom===undefined?this._zoom:zoom;return this.options.crs.pointToLatLng(L.point(point),zoom);},layerPointToLatLng:function(point){var projectedPoint=L.point(point).add(this.getPixelOrigin());return this.unproject(projectedPoint);},latLngToLayerPoint:function(latlng){var projectedPoint=this.project(L.latLng(latlng))._round();return projectedPoint._subtract(this.getPixelOrigin());},wrapLatLng:function(latlng){return this.options.crs.wrapLatLng(L.latLng(latlng));},wrapLatLngBounds:function(latlng){return this.options.crs.wrapLatLngBounds(L.latLngBounds(latlng));},distance:function(latlng1,latlng2){return this.options.crs.distance(L.latLng(latlng1),L.latLng(latlng2));},containerPointToLayerPoint:function(point){return L.point(point).subtract(this._getMapPanePos());},layerPointToContainerPoint:function(point){return L.point(point).add(this._getMapPanePos());},containerPointToLatLng:function(point){var layerPoint=this.containerPointToLayerPoint(L.point(point));return this.layerPointToLatLng(layerPoint);},latLngToContainerPoint:function(latlng){return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));},mouseEventToContainerPoint:function(e){return L.DomEvent.getMousePosition(e,this._container);},mouseEventToLayerPoint:function(e){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));},mouseEventToLatLng:function(e){return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));},_initContainer:function(id){var container=this._container=L.DomUtil.get(id);if(!container){throw new Error('Map container not found.');}else if(container._leaflet_id){throw new Error('Map container is already initialized.');}
L.DomEvent.addListener(container,'scroll',this._onScroll,this);this._containerId=L.Util.stamp(container);},_initLayout:function(){var container=this._container;this._fadeAnimated=this.options.fadeAnimation&&L.Browser.any3d;L.DomUtil.addClass(container,'leaflet-container'+
(L.Browser.touch?' leaflet-touch':'')+
(L.Browser.retina?' leaflet-retina':'')+
(L.Browser.ielt9?' leaflet-oldie':'')+
(L.Browser.safari?' leaflet-safari':'')+
(this._fadeAnimated?' leaflet-fade-anim':''));var position=L.DomUtil.getStyle(container,'position');if(position!=='absolute'&&position!=='relative'&&position!=='fixed'){container.style.position='relative';}
this._initPanes();if(this._initControlPos){this._initControlPos();}},_initPanes:function(){var panes=this._panes={};this._paneRenderers={};this._mapPane=this.createPane('mapPane',this._container);L.DomUtil.setPosition(this._mapPane,new L.Point(0,0));this.createPane('tilePane');this.createPane('shadowPane');this.createPane('overlayPane');this.createPane('markerPane');this.createPane('tooltipPane');this.createPane('popupPane');if(!this.options.markerZoomAnimation){L.DomUtil.addClass(panes.markerPane,'leaflet-zoom-hide');L.DomUtil.addClass(panes.shadowPane,'leaflet-zoom-hide');}},_resetView:function(center,zoom){L.DomUtil.setPosition(this._mapPane,new L.Point(0,0));var loading=!this._loaded;this._loaded=true;zoom=this._limitZoom(zoom);this.fire('viewprereset');var zoomChanged=this._zoom!==zoom;this._moveStart(zoomChanged)._move(center,zoom)._moveEnd(zoomChanged);this.fire('viewreset');if(loading){this.fire('load');}},_moveStart:function(zoomChanged){if(zoomChanged){this.fire('zoomstart');}
return this.fire('movestart');},_move:function(center,zoom,data){if(zoom===undefined){zoom=this._zoom;}
var zoomChanged=this._zoom!==zoom;this._zoom=zoom;this._lastCenter=center;this._pixelOrigin=this._getNewPixelOrigin(center);if(zoomChanged||(data&&data.pinch)){this.fire('zoom',data);}
return this.fire('move',data);},_moveEnd:function(zoomChanged){if(zoomChanged){this.fire('zoomend');}
return this.fire('moveend');},_stop:function(){L.Util.cancelAnimFrame(this._flyToFrame);if(this._panAnim){this._panAnim.stop();}
return this;},_rawPanBy:function(offset){L.DomUtil.setPosition(this._mapPane,this._getMapPanePos().subtract(offset));},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom();},_panInsideMaxBounds:function(){if(!this._enforcingBounds){this.panInsideBounds(this.options.maxBounds);}},_checkIfLoaded:function(){if(!this._loaded){throw new Error('Set map center and zoom first.');}},_initEvents:function(remove){if(!L.DomEvent){return;}
this._targets={};this._targets[L.stamp(this._container)]=this;var onOff=remove?'off':'on';L.DomEvent[onOff](this._container,'click dblclick mousedown mouseup '+'mouseover mouseout mousemove contextmenu keypress',this._handleDOMEvent,this);if(this.options.trackResize){L.DomEvent[onOff](window,'resize',this._onResize,this);}
if(L.Browser.any3d&&this.options.transform3DLimit){this[onOff]('moveend',this._onMoveEnd);}},_onResize:function(){L.Util.cancelAnimFrame(this._resizeRequest);this._resizeRequest=L.Util.requestAnimFrame(function(){this.invalidateSize({debounceMoveend:true});},this);},_onScroll:function(){this._container.scrollTop=0;this._container.scrollLeft=0;},_onMoveEnd:function(){var pos=this._getMapPanePos();if(Math.max(Math.abs(pos.x),Math.abs(pos.y))>=this.options.transform3DLimit){this._resetView(this.getCenter(),this.getZoom());}},_findEventTargets:function(e,type){var targets=[],target,isHover=type==='mouseout'||type==='mouseover',src=e.target||e.srcElement,dragging=false;while(src){target=this._targets[L.stamp(src)];if(target&&(type==='click'||type==='preclick')&&!e._simulated&&this._draggableMoved(target)){dragging=true;break;}
if(target&&target.listens(type,true)){if(isHover&&!L.DomEvent._isExternalTarget(src,e)){break;}
targets.push(target);if(isHover){break;}}
if(src===this._container){break;}
src=src.parentNode;}
if(!targets.length&&!dragging&&!isHover&&L.DomEvent._isExternalTarget(src,e)){targets=[this];}
return targets;},_handleDOMEvent:function(e){if(!this._loaded||L.DomEvent._skipped(e)){return;}
var type=e.type==='keypress'&&e.keyCode===13?'click':e.type;if(type==='mousedown'){L.DomUtil.preventOutline(e.target||e.srcElement);}
this._fireDOMEvent(e,type);},_fireDOMEvent:function(e,type,targets){if(e.type==='click'){var synth=L.Util.extend({},e);synth.type='preclick';this._fireDOMEvent(synth,synth.type,targets);}
if(e._stopped){return;}
targets=(targets||[]).concat(this._findEventTargets(e,type));if(!targets.length){return;}
var target=targets[0];if(type==='contextmenu'&&target.listens(type,true)){L.DomEvent.preventDefault(e);}
var data={originalEvent:e};if(e.type!=='keypress'){var isMarker=target instanceof L.Marker;data.containerPoint=isMarker?this.latLngToContainerPoint(target.getLatLng()):this.mouseEventToContainerPoint(e);data.layerPoint=this.containerPointToLayerPoint(data.containerPoint);data.latlng=isMarker?target.getLatLng():this.layerPointToLatLng(data.layerPoint);}
for(var i=0;i<targets.length;i++){targets[i].fire(type,data,true);if(data.originalEvent._stopped||(targets[i].options.nonBubblingEvents&&L.Util.indexOf(targets[i].options.nonBubblingEvents,type)!==-1)){return;}}},_draggableMoved:function(obj){obj=obj.dragging&&obj.dragging.enabled()?obj:this;return(obj.dragging&&obj.dragging.moved())||(this.boxZoom&&this.boxZoom.moved());},_clearHandlers:function(){for(var i=0,len=this._handlers.length;i<len;i++){this._handlers[i].disable();}},whenReady:function(callback,context){if(this._loaded){callback.call(context||this,{target:this});}else{this.on('load',callback,context);}
return this;},_getMapPanePos:function(){return L.DomUtil.getPosition(this._mapPane)||new L.Point(0,0);},_moved:function(){var pos=this._getMapPanePos();return pos&&!pos.equals([0,0]);},_getTopLeftPoint:function(center,zoom){var pixelOrigin=center&&zoom!==undefined?this._getNewPixelOrigin(center,zoom):this.getPixelOrigin();return pixelOrigin.subtract(this._getMapPanePos());},_getNewPixelOrigin:function(center,zoom){var viewHalf=this.getSize()._divideBy(2);return this.project(center,zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();},_latLngToNewLayerPoint:function(latlng,zoom,center){var topLeft=this._getNewPixelOrigin(center,zoom);return this.project(latlng,zoom)._subtract(topLeft);},_latLngBoundsToNewLayerBounds:function(latLngBounds,zoom,center){var topLeft=this._getNewPixelOrigin(center,zoom);return L.bounds([this.project(latLngBounds.getSouthWest(),zoom)._subtract(topLeft),this.project(latLngBounds.getNorthWest(),zoom)._subtract(topLeft),this.project(latLngBounds.getSouthEast(),zoom)._subtract(topLeft),this.project(latLngBounds.getNorthEast(),zoom)._subtract(topLeft)]);},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2));},_getCenterOffset:function(latlng){return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());},_limitCenter:function(center,zoom,bounds){if(!bounds){return center;}
var centerPoint=this.project(center,zoom),viewHalf=this.getSize().divideBy(2),viewBounds=new L.Bounds(centerPoint.subtract(viewHalf),centerPoint.add(viewHalf)),offset=this._getBoundsOffset(viewBounds,bounds,zoom);if(offset.round().equals([0,0])){return center;}
return this.unproject(centerPoint.add(offset),zoom);},_limitOffset:function(offset,bounds){if(!bounds){return offset;}
var viewBounds=this.getPixelBounds(),newBounds=new L.Bounds(viewBounds.min.add(offset),viewBounds.max.add(offset));return offset.add(this._getBoundsOffset(newBounds,bounds));},_getBoundsOffset:function(pxBounds,maxBounds,zoom){var projectedMaxBounds=L.bounds(this.project(maxBounds.getNorthEast(),zoom),this.project(maxBounds.getSouthWest(),zoom)),minOffset=projectedMaxBounds.min.subtract(pxBounds.min),maxOffset=projectedMaxBounds.max.subtract(pxBounds.max),dx=this._rebound(minOffset.x,-maxOffset.x),dy=this._rebound(minOffset.y,-maxOffset.y);return new L.Point(dx,dy);},_rebound:function(left,right){return left+right>0?Math.round(left-right)/2:Math.max(0,Math.ceil(left))-Math.max(0,Math.floor(right));},_limitZoom:function(zoom){var min=this.getMinZoom(),max=this.getMaxZoom(),snap=L.Browser.any3d?this.options.zoomSnap:1;if(snap){zoom=Math.round(zoom/snap)*snap;}
return Math.max(min,Math.min(max,zoom));},_onPanTransitionStep:function(){this.fire('move');},_onPanTransitionEnd:function(){L.DomUtil.removeClass(this._mapPane,'leaflet-pan-anim');this.fire('moveend');},_tryAnimatedPan:function(center,options){var offset=this._getCenterOffset(center)._floor();if((options&&options.animate)!==true&&!this.getSize().contains(offset)){return false;}
this.panBy(offset,options);return true;},_createAnimProxy:function(){var proxy=this._proxy=L.DomUtil.create('div','leaflet-proxy leaflet-zoom-animated');this._panes.mapPane.appendChild(proxy);this.on('zoomanim',function(e){var prop=L.DomUtil.TRANSFORM,transform=proxy.style[prop];L.DomUtil.setTransform(proxy,this.project(e.center,e.zoom),this.getZoomScale(e.zoom,1));if(transform===proxy.style[prop]&&this._animatingZoom){this._onZoomTransitionEnd();}},this);this.on('load moveend',function(){var c=this.getCenter(),z=this.getZoom();L.DomUtil.setTransform(proxy,this.project(c,z),this.getZoomScale(z,1));},this);},_catchTransitionEnd:function(e){if(this._animatingZoom&&e.propertyName.indexOf('transform')>=0){this._onZoomTransitionEnd();}},_nothingToAnimate:function(){return!this._container.getElementsByClassName('leaflet-zoom-animated').length;},_tryAnimatedZoom:function(center,zoom,options){if(this._animatingZoom){return true;}
options=options||{};if(!this._zoomAnimated||options.animate===false||this._nothingToAnimate()||Math.abs(zoom-this._zoom)>this.options.zoomAnimationThreshold){return false;}
var scale=this.getZoomScale(zoom),offset=this._getCenterOffset(center)._divideBy(1-1/scale);if(options.animate!==true&&!this.getSize().contains(offset)){return false;}
L.Util.requestAnimFrame(function(){this._moveStart(true)._animateZoom(center,zoom,true);},this);return true;},_animateZoom:function(center,zoom,startAnim,noUpdate){if(startAnim){this._animatingZoom=true;this._animateToCenter=center;this._animateToZoom=zoom;L.DomUtil.addClass(this._mapPane,'leaflet-zoom-anim');}
this.fire('zoomanim',{center:center,zoom:zoom,noUpdate:noUpdate});setTimeout(L.bind(this._onZoomTransitionEnd,this),250);},_onZoomTransitionEnd:function(){if(!this._animatingZoom){return;}
L.DomUtil.removeClass(this._mapPane,'leaflet-zoom-anim');this._animatingZoom=false;this._move(this._animateToCenter,this._animateToZoom);L.Util.requestAnimFrame(function(){this._moveEnd(true);},this);}});L.map=function(id,options){return new L.Map(id,options);};L.Layer=L.Evented.extend({options:{pane:'overlayPane',nonBubblingEvents:[],attribution:null},addTo:function(map){map.addLayer(this);return this;},remove:function(){return this.removeFrom(this._map||this._mapToAdd);},removeFrom:function(obj){if(obj){obj.removeLayer(this);}
return this;},getPane:function(name){return this._map.getPane(name?(this.options[name]||name):this.options.pane);},addInteractiveTarget:function(targetEl){this._map._targets[L.stamp(targetEl)]=this;return this;},removeInteractiveTarget:function(targetEl){delete this._map._targets[L.stamp(targetEl)];return this;},getAttribution:function(){return this.options.attribution;},_layerAdd:function(e){var map=e.target;if(!map.hasLayer(this)){return;}
this._map=map;this._zoomAnimated=map._zoomAnimated;if(this.getEvents){var events=this.getEvents();map.on(events,this);this.once('remove',function(){map.off(events,this);},this);}
this.onAdd(map);if(this.getAttribution&&map.attributionControl){map.attributionControl.addAttribution(this.getAttribution());}
this.fire('add');map.fire('layeradd',{layer:this});}});L.Map.include({addLayer:function(layer){var id=L.stamp(layer);if(this._layers[id]){return this;}
this._layers[id]=layer;layer._mapToAdd=this;if(layer.beforeAdd){layer.beforeAdd(this);}
this.whenReady(layer._layerAdd,layer);return this;},removeLayer:function(layer){var id=L.stamp(layer);if(!this._layers[id]){return this;}
if(this._loaded){layer.onRemove(this);}
if(layer.getAttribution&&this.attributionControl){this.attributionControl.removeAttribution(layer.getAttribution());}
delete this._layers[id];if(this._loaded){this.fire('layerremove',{layer:layer});layer.fire('remove');}
layer._map=layer._mapToAdd=null;return this;},hasLayer:function(layer){return!!layer&&(L.stamp(layer)in this._layers);},eachLayer:function(method,context){for(var i in this._layers){method.call(context,this._layers[i]);}
return this;},_addLayers:function(layers){layers=layers?(L.Util.isArray(layers)?layers:[layers]):[];for(var i=0,len=layers.length;i<len;i++){this.addLayer(layers[i]);}},_addZoomLimit:function(layer){if(isNaN(layer.options.maxZoom)||!isNaN(layer.options.minZoom)){this._zoomBoundLayers[L.stamp(layer)]=layer;this._updateZoomLevels();}},_removeZoomLimit:function(layer){var id=L.stamp(layer);if(this._zoomBoundLayers[id]){delete this._zoomBoundLayers[id];this._updateZoomLevels();}},_updateZoomLevels:function(){var minZoom=Infinity,maxZoom=-Infinity,oldZoomSpan=this._getZoomSpan();for(var i in this._zoomBoundLayers){var options=this._zoomBoundLayers[i].options;minZoom=options.minZoom===undefined?minZoom:Math.min(minZoom,options.minZoom);maxZoom=options.maxZoom===undefined?maxZoom:Math.max(maxZoom,options.maxZoom);}
this._layersMaxZoom=maxZoom===-Infinity?undefined:maxZoom;this._layersMinZoom=minZoom===Infinity?undefined:minZoom;if(oldZoomSpan!==this._getZoomSpan()){this.fire('zoomlevelschange');}
if(this.options.maxZoom===undefined&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom){this.setZoom(this._layersMaxZoom);}
if(this.options.minZoom===undefined&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom){this.setZoom(this._layersMinZoom);}}});var eventsKey='_leaflet_events';L.DomEvent={on:function(obj,types,fn,context){if(typeof types==='object'){for(var type in types){this._on(obj,type,types[type],fn);}}else{types=L.Util.splitWords(types);for(var i=0,len=types.length;i<len;i++){this._on(obj,types[i],fn,context);}}
return this;},off:function(obj,types,fn,context){if(typeof types==='object'){for(var type in types){this._off(obj,type,types[type],fn);}}else{types=L.Util.splitWords(types);for(var i=0,len=types.length;i<len;i++){this._off(obj,types[i],fn,context);}}
return this;},_on:function(obj,type,fn,context){var id=type+L.stamp(fn)+(context?'_'+L.stamp(context):'');if(obj[eventsKey]&&obj[eventsKey][id]){return this;}
var handler=function(e){return fn.call(context||obj,e||window.event);};var originalHandler=handler;if(L.Browser.pointer&&type.indexOf('touch')===0){this.addPointerListener(obj,type,handler,id);}else if(L.Browser.touch&&(type==='dblclick')&&this.addDoubleTapListener&&!(L.Browser.pointer&&L.Browser.chrome)){this.addDoubleTapListener(obj,handler,id);}else if('addEventListener'in obj){if(type==='mousewheel'){obj.addEventListener('onwheel'in obj?'wheel':'mousewheel',handler,false);}else if((type==='mouseenter')||(type==='mouseleave')){handler=function(e){e=e||window.event;if(L.DomEvent._isExternalTarget(obj,e)){originalHandler(e);}};obj.addEventListener(type==='mouseenter'?'mouseover':'mouseout',handler,false);}else{if(type==='click'&&L.Browser.android){handler=function(e){return L.DomEvent._filterClick(e,originalHandler);};}
obj.addEventListener(type,handler,false);}}else if('attachEvent'in obj){obj.attachEvent('on'+type,handler);}
obj[eventsKey]=obj[eventsKey]||{};obj[eventsKey][id]=handler;return this;},_off:function(obj,type,fn,context){var id=type+L.stamp(fn)+(context?'_'+L.stamp(context):''),handler=obj[eventsKey]&&obj[eventsKey][id];if(!handler){return this;}
if(L.Browser.pointer&&type.indexOf('touch')===0){this.removePointerListener(obj,type,id);}else if(L.Browser.touch&&(type==='dblclick')&&this.removeDoubleTapListener){this.removeDoubleTapListener(obj,id);}else if('removeEventListener'in obj){if(type==='mousewheel'){obj.removeEventListener('onwheel'in obj?'wheel':'mousewheel',handler,false);}else{obj.removeEventListener(type==='mouseenter'?'mouseover':type==='mouseleave'?'mouseout':type,handler,false);}}else if('detachEvent'in obj){obj.detachEvent('on'+type,handler);}
obj[eventsKey][id]=null;return this;},stopPropagation:function(e){if(e.stopPropagation){e.stopPropagation();}else if(e.originalEvent){e.originalEvent._stopped=true;}else{e.cancelBubble=true;}
L.DomEvent._skipped(e);return this;},disableScrollPropagation:function(el){return L.DomEvent.on(el,'mousewheel',L.DomEvent.stopPropagation);},disableClickPropagation:function(el){var stop=L.DomEvent.stopPropagation;L.DomEvent.on(el,L.Draggable.START.join(' '),stop);return L.DomEvent.on(el,{click:L.DomEvent._fakeStop,dblclick:stop});},preventDefault:function(e){if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;}
return this;},stop:function(e){return L.DomEvent.preventDefault(e).stopPropagation(e);},getMousePosition:function(e,container){if(!container){return new L.Point(e.clientX,e.clientY);}
var rect=container.getBoundingClientRect();return new L.Point(e.clientX-rect.left-container.clientLeft,e.clientY-rect.top-container.clientTop);},_wheelPxFactor:(L.Browser.win&&L.Browser.chrome)?2:L.Browser.gecko?window.devicePixelRatio:1,getWheelDelta:function(e){return(L.Browser.edge)?e.wheelDeltaY/2:(e.deltaY&&e.deltaMode===0)?-e.deltaY/L.DomEvent._wheelPxFactor:(e.deltaY&&e.deltaMode===1)?-e.deltaY*20:(e.deltaY&&e.deltaMode===2)?-e.deltaY*60:(e.deltaX||e.deltaZ)?0:e.wheelDelta?(e.wheelDeltaY||e.wheelDelta)/2:(e.detail&&Math.abs(e.detail)<32765)?-e.detail*20:e.detail?e.detail/ -32765*60:0;},_skipEvents:{},_fakeStop:function(e){L.DomEvent._skipEvents[e.type]=true;},_skipped:function(e){var skipped=this._skipEvents[e.type];this._skipEvents[e.type]=false;return skipped;},_isExternalTarget:function(el,e){var related=e.relatedTarget;if(!related){return true;}
try{while(related&&(related!==el)){related=related.parentNode;}}catch(err){return false;}
return(related!==el);},_filterClick:function(e,handler){var timeStamp=(e.timeStamp||(e.originalEvent&&e.originalEvent.timeStamp)),elapsed=L.DomEvent._lastClick&&(timeStamp-L.DomEvent._lastClick);if((elapsed&&elapsed>100&&elapsed<500)||(e.target._simulatedClick&&!e._simulated)){L.DomEvent.stop(e);return;}
L.DomEvent._lastClick=timeStamp;handler(e);}};L.DomEvent.addListener=L.DomEvent.on;L.DomEvent.removeListener=L.DomEvent.off;L.PosAnimation=L.Evented.extend({run:function(el,newPos,duration,easeLinearity){this.stop();this._el=el;this._inProgress=true;this._duration=duration||0.25;this._easeOutPower=1/Math.max(easeLinearity||0.5,0.2);this._startPos=L.DomUtil.getPosition(el);this._offset=newPos.subtract(this._startPos);this._startTime=+new Date();this.fire('start');this._animate();},stop:function(){if(!this._inProgress){return;}
this._step(true);this._complete();},_animate:function(){this._animId=L.Util.requestAnimFrame(this._animate,this);this._step();},_step:function(round){var elapsed=(+new Date())-this._startTime,duration=this._duration*1000;if(elapsed<duration){this._runFrame(this._easeOut(elapsed/duration),round);}else{this._runFrame(1);this._complete();}},_runFrame:function(progress,round){var pos=this._startPos.add(this._offset.multiplyBy(progress));if(round){pos._round();}
L.DomUtil.setPosition(this._el,pos);this.fire('step');},_complete:function(){L.Util.cancelAnimFrame(this._animId);this._inProgress=false;this.fire('end');},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower);}});L.Projection.Mercator={R:6378137,R_MINOR:6356752.314245179,bounds:L.bounds([-20037508.34279,-15496570.73972],[20037508.34279,18764656.23138]),project:function(latlng){var d=Math.PI/180,r=this.R,y=latlng.lat*d,tmp=this.R_MINOR/r,e=Math.sqrt(1-tmp*tmp),con=e*Math.sin(y);var ts=Math.tan(Math.PI/4-y/2)/Math.pow((1-con)/(1+con),e/2);y=-r*Math.log(Math.max(ts,1E-10));return new L.Point(latlng.lng*d*r,y);},unproject:function(point){var d=180/Math.PI,r=this.R,tmp=this.R_MINOR/r,e=Math.sqrt(1-tmp*tmp),ts=Math.exp(-point.y/r),phi=Math.PI/2-2*Math.atan(ts);for(var i=0,dphi=0.1,con;i<15&&Math.abs(dphi)>1e-7;i++){con=e*Math.sin(phi);con=Math.pow((1-con)/(1+con),e/2);dphi=Math.PI/2-2*Math.atan(ts*con)-phi;phi+=dphi;}
return new L.LatLng(phi*d,point.x*d/r);}};L.CRS.EPSG3395=L.extend({},L.CRS.Earth,{code:'EPSG:3395',projection:L.Projection.Mercator,transformation:(function(){var scale=0.5/(Math.PI*L.Projection.Mercator.R);return new L.Transformation(scale,0.5,-scale,0.5);}())});L.GridLayer=L.Layer.extend({options:{tileSize:256,opacity:1,updateWhenIdle:L.Browser.mobile,updateWhenZooming:true,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:undefined,noWrap:false,pane:'tilePane',className:'',keepBuffer:2},initialize:function(options){L.setOptions(this,options);},onAdd:function(){this._initContainer();this._levels={};this._tiles={};this._resetView();this._update();},beforeAdd:function(map){map._addZoomLimit(this);},onRemove:function(map){this._removeAllTiles();L.DomUtil.remove(this._container);map._removeZoomLimit(this);this._container=null;this._tileZoom=null;},bringToFront:function(){if(this._map){L.DomUtil.toFront(this._container);this._setAutoZIndex(Math.max);}
return this;},bringToBack:function(){if(this._map){L.DomUtil.toBack(this._container);this._setAutoZIndex(Math.min);}
return this;},getContainer:function(){return this._container;},setOpacity:function(opacity){this.options.opacity=opacity;this._updateOpacity();return this;},setZIndex:function(zIndex){this.options.zIndex=zIndex;this._updateZIndex();return this;},isLoading:function(){return this._loading;},redraw:function(){if(this._map){this._removeAllTiles();this._update();}
return this;},getEvents:function(){var events={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};if(!this.options.updateWhenIdle){if(!this._onMove){this._onMove=L.Util.throttle(this._onMoveEnd,this.options.updateInterval,this);}
events.move=this._onMove;}
if(this._zoomAnimated){events.zoomanim=this._animateZoom;}
return events;},createTile:function(){return document.createElement('div');},getTileSize:function(){var s=this.options.tileSize;return s instanceof L.Point?s:new L.Point(s,s);},_updateZIndex:function(){if(this._container&&this.options.zIndex!==undefined&&this.options.zIndex!==null){this._container.style.zIndex=this.options.zIndex;}},_setAutoZIndex:function(compare){var layers=this.getPane().children,edgeZIndex=-compare(-Infinity,Infinity);for(var i=0,len=layers.length,zIndex;i<len;i++){zIndex=layers[i].style.zIndex;if(layers[i]!==this._container&&zIndex){edgeZIndex=compare(edgeZIndex,+zIndex);}}
if(isFinite(edgeZIndex)){this.options.zIndex=edgeZIndex+compare(-1,1);this._updateZIndex();}},_updateOpacity:function(){if(!this._map){return;}
if(L.Browser.ielt9){return;}
L.DomUtil.setOpacity(this._container,this.options.opacity);var now=+new Date(),nextFrame=false,willPrune=false;for(var key in this._tiles){var tile=this._tiles[key];if(!tile.current||!tile.loaded){continue;}
var fade=Math.min(1,(now-tile.loaded)/200);L.DomUtil.setOpacity(tile.el,fade);if(fade<1){nextFrame=true;}else{if(tile.active){willPrune=true;}
tile.active=true;}}
if(willPrune&&!this._noPrune){this._pruneTiles();}
if(nextFrame){L.Util.cancelAnimFrame(this._fadeFrame);this._fadeFrame=L.Util.requestAnimFrame(this._updateOpacity,this);}},_initContainer:function(){if(this._container){return;}
this._container=L.DomUtil.create('div','leaflet-layer '+(this.options.className||''));this._updateZIndex();if(this.options.opacity<1){this._updateOpacity();}
this.getPane().appendChild(this._container);},_updateLevels:function(){var zoom=this._tileZoom,maxZoom=this.options.maxZoom;if(zoom===undefined){return undefined;}
for(var z in this._levels){if(this._levels[z].el.children.length||z===zoom){this._levels[z].el.style.zIndex=maxZoom-Math.abs(zoom-z);}else{L.DomUtil.remove(this._levels[z].el);this._removeTilesAtZoom(z);delete this._levels[z];}}
var level=this._levels[zoom],map=this._map;if(!level){level=this._levels[zoom]={};level.el=L.DomUtil.create('div','leaflet-tile-container leaflet-zoom-animated',this._container);level.el.style.zIndex=maxZoom;level.origin=map.project(map.unproject(map.getPixelOrigin()),zoom).round();level.zoom=zoom;this._setZoomTransform(level,map.getCenter(),map.getZoom());L.Util.falseFn(level.el.offsetWidth);}
this._level=level;return level;},_pruneTiles:function(){if(!this._map){return;}
var key,tile;var zoom=this._map.getZoom();if(zoom>this.options.maxZoom||zoom<this.options.minZoom){this._removeAllTiles();return;}
for(key in this._tiles){tile=this._tiles[key];tile.retain=tile.current;}
for(key in this._tiles){tile=this._tiles[key];if(tile.current&&!tile.active){var coords=tile.coords;if(!this._retainParent(coords.x,coords.y,coords.z,coords.z-5)){this._retainChildren(coords.x,coords.y,coords.z,coords.z+2);}}}
for(key in this._tiles){if(!this._tiles[key].retain){this._removeTile(key);}}},_removeTilesAtZoom:function(zoom){for(var key in this._tiles){if(this._tiles[key].coords.z!==zoom){continue;}
this._removeTile(key);}},_removeAllTiles:function(){for(var key in this._tiles){this._removeTile(key);}},_invalidateAll:function(){for(var z in this._levels){L.DomUtil.remove(this._levels[z].el);delete this._levels[z];}
this._removeAllTiles();this._tileZoom=null;},_retainParent:function(x,y,z,minZoom){var x2=Math.floor(x/2),y2=Math.floor(y/2),z2=z-1,coords2=new L.Point(+x2,+y2);coords2.z=+z2;var key=this._tileCoordsToKey(coords2),tile=this._tiles[key];if(tile&&tile.active){tile.retain=true;return true;}else if(tile&&tile.loaded){tile.retain=true;}
if(z2>minZoom){return this._retainParent(x2,y2,z2,minZoom);}
return false;},_retainChildren:function(x,y,z,maxZoom){for(var i=2*x;i<2*x+2;i++){for(var j=2*y;j<2*y+2;j++){var coords=new L.Point(i,j);coords.z=z+1;var key=this._tileCoordsToKey(coords),tile=this._tiles[key];if(tile&&tile.active){tile.retain=true;continue;}else if(tile&&tile.loaded){tile.retain=true;}
if(z+1<maxZoom){this._retainChildren(i,j,z+1,maxZoom);}}}},_resetView:function(e){var animating=e&&(e.pinch||e.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),animating,animating);},_animateZoom:function(e){this._setView(e.center,e.zoom,true,e.noUpdate);},_setView:function(center,zoom,noPrune,noUpdate){var tileZoom=Math.round(zoom);if((this.options.maxZoom!==undefined&&tileZoom>this.options.maxZoom)||(this.options.minZoom!==undefined&&tileZoom<this.options.minZoom)){tileZoom=undefined;}
var tileZoomChanged=this.options.updateWhenZooming&&(tileZoom!==this._tileZoom);if(!noUpdate||tileZoomChanged){this._tileZoom=tileZoom;if(this._abortLoading){this._abortLoading();}
this._updateLevels();this._resetGrid();if(tileZoom!==undefined){this._update(center);}
if(!noPrune){this._pruneTiles();}
this._noPrune=!!noPrune;}
this._setZoomTransforms(center,zoom);},_setZoomTransforms:function(center,zoom){for(var i in this._levels){this._setZoomTransform(this._levels[i],center,zoom);}},_setZoomTransform:function(level,center,zoom){var scale=this._map.getZoomScale(zoom,level.zoom),translate=level.origin.multiplyBy(scale).subtract(this._map._getNewPixelOrigin(center,zoom)).round();if(L.Browser.any3d){L.DomUtil.setTransform(level.el,translate,scale);}else{L.DomUtil.setPosition(level.el,translate);}},_resetGrid:function(){var map=this._map,crs=map.options.crs,tileSize=this._tileSize=this.getTileSize(),tileZoom=this._tileZoom;var bounds=this._map.getPixelWorldBounds(this._tileZoom);if(bounds){this._globalTileRange=this._pxBoundsToTileRange(bounds);}
this._wrapX=crs.wrapLng&&!this.options.noWrap&&[Math.floor(map.project([0,crs.wrapLng[0]],tileZoom).x/tileSize.x),Math.ceil(map.project([0,crs.wrapLng[1]],tileZoom).x/tileSize.y)];this._wrapY=crs.wrapLat&&!this.options.noWrap&&[Math.floor(map.project([crs.wrapLat[0],0],tileZoom).y/tileSize.x),Math.ceil(map.project([crs.wrapLat[1],0],tileZoom).y/tileSize.y)];},_onMoveEnd:function(){if(!this._map||this._map._animatingZoom){return;}
this._update();},_getTiledPixelBounds:function(center){var map=this._map,mapZoom=map._animatingZoom?Math.max(map._animateToZoom,map.getZoom()):map.getZoom(),scale=map.getZoomScale(mapZoom,this._tileZoom),pixelCenter=map.project(center,this._tileZoom).floor(),halfSize=map.getSize().divideBy(scale*2);return new L.Bounds(pixelCenter.subtract(halfSize),pixelCenter.add(halfSize));},_update:function(center){var map=this._map;if(!map){return;}
var zoom=map.getZoom();if(center===undefined){center=map.getCenter();}
if(this._tileZoom===undefined){return;}
var pixelBounds=this._getTiledPixelBounds(center),tileRange=this._pxBoundsToTileRange(pixelBounds),tileCenter=tileRange.getCenter(),queue=[],margin=this.options.keepBuffer,noPruneRange=new L.Bounds(tileRange.getBottomLeft().subtract([margin,-margin]),tileRange.getTopRight().add([margin,-margin]));for(var key in this._tiles){var c=this._tiles[key].coords;if(c.z!==this._tileZoom||!noPruneRange.contains(L.point(c.x,c.y))){this._tiles[key].current=false;}}
if(Math.abs(zoom-this._tileZoom)>1){this._setView(center,zoom);return;}
for(var j=tileRange.min.y;j<=tileRange.max.y;j++){for(var i=tileRange.min.x;i<=tileRange.max.x;i++){var coords=new L.Point(i,j);coords.z=this._tileZoom;if(!this._isValidTile(coords)){continue;}
var tile=this._tiles[this._tileCoordsToKey(coords)];if(tile){tile.current=true;}else{queue.push(coords);}}}
queue.sort(function(a,b){return a.distanceTo(tileCenter)-b.distanceTo(tileCenter);});if(queue.length!==0){if(!this._loading){this._loading=true;this.fire('loading');}
var fragment=document.createDocumentFragment();for(i=0;i<queue.length;i++){this._addTile(queue[i],fragment);}
this._level.el.appendChild(fragment);}},_isValidTile:function(coords){var crs=this._map.options.crs;if(!crs.infinite){var bounds=this._globalTileRange;if((!crs.wrapLng&&(coords.x<bounds.min.x||coords.x>bounds.max.x))||(!crs.wrapLat&&(coords.y<bounds.min.y||coords.y>bounds.max.y))){return false;}}
if(!this.options.bounds){return true;}
var tileBounds=this._tileCoordsToBounds(coords);return L.latLngBounds(this.options.bounds).overlaps(tileBounds);},_keyToBounds:function(key){return this._tileCoordsToBounds(this._keyToTileCoords(key));},_tileCoordsToBounds:function(coords){var map=this._map,tileSize=this.getTileSize(),nwPoint=coords.scaleBy(tileSize),sePoint=nwPoint.add(tileSize),nw=map.unproject(nwPoint,coords.z),se=map.unproject(sePoint,coords.z),bounds=new L.LatLngBounds(nw,se);if(!this.options.noWrap){map.wrapLatLngBounds(bounds);}
return bounds;},_tileCoordsToKey:function(coords){return coords.x+':'+coords.y+':'+coords.z;},_keyToTileCoords:function(key){var k=key.split(':'),coords=new L.Point(+k[0],+k[1]);coords.z=+k[2];return coords;},_removeTile:function(key){var tile=this._tiles[key];if(!tile){return;}
L.DomUtil.remove(tile.el);delete this._tiles[key];this.fire('tileunload',{tile:tile.el,coords:this._keyToTileCoords(key)});},_initTile:function(tile){L.DomUtil.addClass(tile,'leaflet-tile');var tileSize=this.getTileSize();tile.style.width=tileSize.x+'px';tile.style.height=tileSize.y+'px';tile.onselectstart=L.Util.falseFn;tile.onmousemove=L.Util.falseFn;if(L.Browser.ielt9&&this.options.opacity<1){L.DomUtil.setOpacity(tile,this.options.opacity);}
if(L.Browser.android&&!L.Browser.android23){tile.style.WebkitBackfaceVisibility='hidden';}},_addTile:function(coords,container){var tilePos=this._getTilePos(coords),key=this._tileCoordsToKey(coords);var tile=this.createTile(this._wrapCoords(coords),L.bind(this._tileReady,this,coords));this._initTile(tile);if(this.createTile.length<2){L.Util.requestAnimFrame(L.bind(this._tileReady,this,coords,null,tile));}
L.DomUtil.setPosition(tile,tilePos);this._tiles[key]={el:tile,coords:coords,current:true};container.appendChild(tile);this.fire('tileloadstart',{tile:tile,coords:coords});},_tileReady:function(coords,err,tile){if(!this._map){return;}
if(err){this.fire('tileerror',{error:err,tile:tile,coords:coords});}
var key=this._tileCoordsToKey(coords);tile=this._tiles[key];if(!tile){return;}
tile.loaded=+new Date();if(this._map._fadeAnimated){L.DomUtil.setOpacity(tile.el,0);L.Util.cancelAnimFrame(this._fadeFrame);this._fadeFrame=L.Util.requestAnimFrame(this._updateOpacity,this);}else{tile.active=true;this._pruneTiles();}
if(!err){L.DomUtil.addClass(tile.el,'leaflet-tile-loaded');this.fire('tileload',{tile:tile.el,coords:coords});}
if(this._noTilesToLoad()){this._loading=false;this.fire('load');if(L.Browser.ielt9||!this._map._fadeAnimated){L.Util.requestAnimFrame(this._pruneTiles,this);}else{setTimeout(L.bind(this._pruneTiles,this),250);}}},_getTilePos:function(coords){return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);},_wrapCoords:function(coords){var newCoords=new L.Point(this._wrapX?L.Util.wrapNum(coords.x,this._wrapX):coords.x,this._wrapY?L.Util.wrapNum(coords.y,this._wrapY):coords.y);newCoords.z=coords.z;return newCoords;},_pxBoundsToTileRange:function(bounds){var tileSize=this.getTileSize();return new L.Bounds(bounds.min.unscaleBy(tileSize).floor(),bounds.max.unscaleBy(tileSize).ceil().subtract([1,1]));},_noTilesToLoad:function(){for(var key in this._tiles){if(!this._tiles[key].loaded){return false;}}
return true;}});L.gridLayer=function(options){return new L.GridLayer(options);};L.TileLayer=L.GridLayer.extend({options:{minZoom:0,maxZoom:18,maxNativeZoom:null,minNativeZoom:null,subdomains:'abc',errorTileUrl:'',zoomOffset:0,tms:false,zoomReverse:false,detectRetina:false,crossOrigin:false},initialize:function(url,options){this._url=url;options=L.setOptions(this,options);if(options.detectRetina&&L.Browser.retina&&options.maxZoom>0){options.tileSize=Math.floor(options.tileSize/2);if(!options.zoomReverse){options.zoomOffset++;options.maxZoom--;}else{options.zoomOffset--;options.minZoom++;}
options.minZoom=Math.max(0,options.minZoom);}
if(typeof options.subdomains==='string'){options.subdomains=options.subdomains.split('');}
if(!L.Browser.android){this.on('tileunload',this._onTileRemove);}},setUrl:function(url,noRedraw){this._url=url;if(!noRedraw){this.redraw();}
return this;},createTile:function(coords,done){var tile=document.createElement('img');L.DomEvent.on(tile,'load',L.bind(this._tileOnLoad,this,done,tile));L.DomEvent.on(tile,'error',L.bind(this._tileOnError,this,done,tile));if(this.options.crossOrigin){tile.crossOrigin='';}
tile.alt='';tile.setAttribute('role','presentation');tile.src=this.getTileUrl(coords);return tile;},getTileUrl:function(coords){var data={r:L.Browser.retina?'@2x':'',s:this._getSubdomain(coords),x:coords.x,y:coords.y,z:this._getZoomForUrl()};if(this._map&&!this._map.options.crs.infinite){var invertedY=this._globalTileRange.max.y-coords.y;if(this.options.tms){data['y']=invertedY;}
data['-y']=invertedY;}
return L.Util.template(this._url,L.extend(data,this.options));},_tileOnLoad:function(done,tile){if(L.Browser.ielt9){setTimeout(L.bind(done,this,null,tile),0);}else{done(null,tile);}},_tileOnError:function(done,tile,e){var errorUrl=this.options.errorTileUrl;if(errorUrl&&tile.src!==errorUrl){tile.src=errorUrl;}
done(e,tile);},getTileSize:function(){var map=this._map,tileSize=L.GridLayer.prototype.getTileSize.call(this),zoom=this._tileZoom+this.options.zoomOffset,minNativeZoom=this.options.minNativeZoom,maxNativeZoom=this.options.maxNativeZoom;if(minNativeZoom!==null&&zoom<minNativeZoom){return tileSize.divideBy(map.getZoomScale(minNativeZoom,zoom)).round();}
if(maxNativeZoom!==null&&zoom>maxNativeZoom){return tileSize.divideBy(map.getZoomScale(maxNativeZoom,zoom)).round();}
return tileSize;},_onTileRemove:function(e){e.tile.onload=null;},_getZoomForUrl:function(){var zoom=this._tileZoom,maxZoom=this.options.maxZoom,zoomReverse=this.options.zoomReverse,zoomOffset=this.options.zoomOffset,minNativeZoom=this.options.minNativeZoom,maxNativeZoom=this.options.maxNativeZoom;if(zoomReverse){zoom=maxZoom-zoom;}
zoom+=zoomOffset;if(minNativeZoom!==null&&zoom<minNativeZoom){return minNativeZoom;}
if(maxNativeZoom!==null&&zoom>maxNativeZoom){return maxNativeZoom;}
return zoom;},_getSubdomain:function(tilePoint){var index=Math.abs(tilePoint.x+tilePoint.y)%this.options.subdomains.length;return this.options.subdomains[index];},_abortLoading:function(){var i,tile;for(i in this._tiles){if(this._tiles[i].coords.z!==this._tileZoom){tile=this._tiles[i].el;tile.onload=L.Util.falseFn;tile.onerror=L.Util.falseFn;if(!tile.complete){tile.src=L.Util.emptyImageUrl;L.DomUtil.remove(tile);}}}}});L.tileLayer=function(url,options){return new L.TileLayer(url,options);};L.TileLayer.WMS=L.TileLayer.extend({defaultWmsParams:{service:'WMS',request:'GetMap',layers:'',styles:'',format:'image/jpeg',transparent:false,version:'1.1.1'},options:{crs:null,uppercase:false},initialize:function(url,options){this._url=url;var wmsParams=L.extend({},this.defaultWmsParams);for(var i in options){if(!(i in this.options)){wmsParams[i]=options[i];}}
options=L.setOptions(this,options);wmsParams.width=wmsParams.height=options.tileSize*(options.detectRetina&&L.Browser.retina?2:1);this.wmsParams=wmsParams;},onAdd:function(map){this._crs=this.options.crs||map.options.crs;this._wmsVersion=parseFloat(this.wmsParams.version);var projectionKey=this._wmsVersion>=1.3?'crs':'srs';this.wmsParams[projectionKey]=this._crs.code;L.TileLayer.prototype.onAdd.call(this,map);},getTileUrl:function(coords){var tileBounds=this._tileCoordsToBounds(coords),nw=this._crs.project(tileBounds.getNorthWest()),se=this._crs.project(tileBounds.getSouthEast()),bbox=(this._wmsVersion>=1.3&&this._crs===L.CRS.EPSG4326?[se.y,nw.x,nw.y,se.x]:[nw.x,se.y,se.x,nw.y]).join(','),url=L.TileLayer.prototype.getTileUrl.call(this,coords);return url+
L.Util.getParamString(this.wmsParams,url,this.options.uppercase)+
(this.options.uppercase?'&BBOX=':'&bbox=')+bbox;},setParams:function(params,noRedraw){L.extend(this.wmsParams,params);if(!noRedraw){this.redraw();}
return this;}});L.tileLayer.wms=function(url,options){return new L.TileLayer.WMS(url,options);};L.ImageOverlay=L.Layer.extend({options:{opacity:1,alt:'',interactive:false,crossOrigin:false},initialize:function(url,bounds,options){this._url=url;this._bounds=L.latLngBounds(bounds);L.setOptions(this,options);},onAdd:function(){if(!this._image){this._initImage();if(this.options.opacity<1){this._updateOpacity();}}
if(this.options.interactive){L.DomUtil.addClass(this._image,'leaflet-interactive');this.addInteractiveTarget(this._image);}
this.getPane().appendChild(this._image);this._reset();},onRemove:function(){L.DomUtil.remove(this._image);if(this.options.interactive){this.removeInteractiveTarget(this._image);}},setOpacity:function(opacity){this.options.opacity=opacity;if(this._image){this._updateOpacity();}
return this;},setStyle:function(styleOpts){if(styleOpts.opacity){this.setOpacity(styleOpts.opacity);}
return this;},bringToFront:function(){if(this._map){L.DomUtil.toFront(this._image);}
return this;},bringToBack:function(){if(this._map){L.DomUtil.toBack(this._image);}
return this;},setUrl:function(url){this._url=url;if(this._image){this._image.src=url;}
return this;},setBounds:function(bounds){this._bounds=bounds;if(this._map){this._reset();}
return this;},getEvents:function(){var events={zoom:this._reset,viewreset:this._reset};if(this._zoomAnimated){events.zoomanim=this._animateZoom;}
return events;},getBounds:function(){return this._bounds;},getElement:function(){return this._image;},_initImage:function(){var img=this._image=L.DomUtil.create('img','leaflet-image-layer '+(this._zoomAnimated?'leaflet-zoom-animated':''));img.onselectstart=L.Util.falseFn;img.onmousemove=L.Util.falseFn;img.onload=L.bind(this.fire,this,'load');if(this.options.crossOrigin){img.crossOrigin='';}
img.src=this._url;img.alt=this.options.alt;},_animateZoom:function(e){var scale=this._map.getZoomScale(e.zoom),offset=this._map._latLngBoundsToNewLayerBounds(this._bounds,e.zoom,e.center).min;L.DomUtil.setTransform(this._image,offset,scale);},_reset:function(){var image=this._image,bounds=new L.Bounds(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),size=bounds.getSize();L.DomUtil.setPosition(image,bounds.min);image.style.width=size.x+'px';image.style.height=size.y+'px';},_updateOpacity:function(){L.DomUtil.setOpacity(this._image,this.options.opacity);}});L.imageOverlay=function(url,bounds,options){return new L.ImageOverlay(url,bounds,options);};L.Icon=L.Class.extend({initialize:function(options){L.setOptions(this,options);},createIcon:function(oldIcon){return this._createIcon('icon',oldIcon);},createShadow:function(oldIcon){return this._createIcon('shadow',oldIcon);},_createIcon:function(name,oldIcon){var src=this._getIconUrl(name);if(!src){if(name==='icon'){throw new Error('iconUrl not set in Icon options (see the docs).');}
return null;}
var img=this._createImg(src,oldIcon&&oldIcon.tagName==='IMG'?oldIcon:null);this._setIconStyles(img,name);return img;},_setIconStyles:function(img,name){var options=this.options;var sizeOption=options[name+'Size'];if(typeof sizeOption==='number'){sizeOption=[sizeOption,sizeOption];}
var size=L.point(sizeOption),anchor=L.point(name==='shadow'&&options.shadowAnchor||options.iconAnchor||size&&size.divideBy(2,true));img.className='leaflet-marker-'+name+' '+(options.className||'');if(anchor){img.style.marginLeft=(-anchor.x)+'px';img.style.marginTop=(-anchor.y)+'px';}
if(size){img.style.width=size.x+'px';img.style.height=size.y+'px';}},_createImg:function(src,el){el=el||document.createElement('img');el.src=src;return el;},_getIconUrl:function(name){return L.Browser.retina&&this.options[name+'RetinaUrl']||this.options[name+'Url'];}});L.icon=function(options){return new L.Icon(options);};L.Icon.Default=L.Icon.extend({options:{iconUrl:'marker-icon.png',iconRetinaUrl:'marker-icon-2x.png',shadowUrl:'marker-shadow.png',iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(name){if(!L.Icon.Default.imagePath){L.Icon.Default.imagePath=this._detectIconPath();}
return(this.options.imagePath||L.Icon.Default.imagePath)+L.Icon.prototype._getIconUrl.call(this,name);},_detectIconPath:function(){var el=L.DomUtil.create('div','leaflet-default-icon-path',document.body);var path=L.DomUtil.getStyle(el,'background-image')||L.DomUtil.getStyle(el,'backgroundImage');document.body.removeChild(el);return path.indexOf('url')===0?path.replace(/^url\([\"\']?/,'').replace(/marker-icon\.png[\"\']?\)$/,''):'';}});L.Marker=L.Layer.extend({options:{icon:new L.Icon.Default(),interactive:true,draggable:false,keyboard:true,title:'',alt:'',zIndexOffset:0,opacity:1,riseOnHover:false,riseOffset:250,pane:'markerPane',nonBubblingEvents:['click','dblclick','mouseover','mouseout','contextmenu']},initialize:function(latlng,options){L.setOptions(this,options);this._latlng=L.latLng(latlng);},onAdd:function(map){this._zoomAnimated=this._zoomAnimated&&map.options.markerZoomAnimation;if(this._zoomAnimated){map.on('zoomanim',this._animateZoom,this);}
this._initIcon();this.update();},onRemove:function(map){if(this.dragging&&this.dragging.enabled()){this.options.draggable=true;this.dragging.removeHooks();}
if(this._zoomAnimated){map.off('zoomanim',this._animateZoom,this);}
this._removeIcon();this._removeShadow();},getEvents:function(){return{zoom:this.update,viewreset:this.update};},getLatLng:function(){return this._latlng;},setLatLng:function(latlng){var oldLatLng=this._latlng;this._latlng=L.latLng(latlng);this.update();return this.fire('move',{oldLatLng:oldLatLng,latlng:this._latlng});},setZIndexOffset:function(offset){this.options.zIndexOffset=offset;return this.update();},setIcon:function(icon){this.options.icon=icon;if(this._map){this._initIcon();this.update();}
if(this._popup){this.bindPopup(this._popup,this._popup.options);}
return this;},getElement:function(){return this._icon;},update:function(){if(this._icon){var pos=this._map.latLngToLayerPoint(this._latlng).round();this._setPos(pos);}
return this;},_initIcon:function(){var options=this.options,classToAdd='leaflet-zoom-'+(this._zoomAnimated?'animated':'hide');var icon=options.icon.createIcon(this._icon),addIcon=false;if(icon!==this._icon){if(this._icon){this._removeIcon();}
addIcon=true;if(options.title){icon.title=options.title;}
if(options.alt){icon.alt=options.alt;}}
L.DomUtil.addClass(icon,classToAdd);if(options.keyboard){icon.tabIndex='0';}
this._icon=icon;if(options.riseOnHover){this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex});}
var newShadow=options.icon.createShadow(this._shadow),addShadow=false;if(newShadow!==this._shadow){this._removeShadow();addShadow=true;}
if(newShadow){L.DomUtil.addClass(newShadow,classToAdd);newShadow.alt='';}
this._shadow=newShadow;if(options.opacity<1){this._updateOpacity();}
if(addIcon){this.getPane().appendChild(this._icon);}
this._initInteraction();if(newShadow&&addShadow){this.getPane('shadowPane').appendChild(this._shadow);}},_removeIcon:function(){if(this.options.riseOnHover){this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex});}
L.DomUtil.remove(this._icon);this.removeInteractiveTarget(this._icon);this._icon=null;},_removeShadow:function(){if(this._shadow){L.DomUtil.remove(this._shadow);}
this._shadow=null;},_setPos:function(pos){L.DomUtil.setPosition(this._icon,pos);if(this._shadow){L.DomUtil.setPosition(this._shadow,pos);}
this._zIndex=pos.y+this.options.zIndexOffset;this._resetZIndex();},_updateZIndex:function(offset){this._icon.style.zIndex=this._zIndex+offset;},_animateZoom:function(opt){var pos=this._map._latLngToNewLayerPoint(this._latlng,opt.zoom,opt.center).round();this._setPos(pos);},_initInteraction:function(){if(!this.options.interactive){return;}
L.DomUtil.addClass(this._icon,'leaflet-interactive');this.addInteractiveTarget(this._icon);if(L.Handler.MarkerDrag){var draggable=this.options.draggable;if(this.dragging){draggable=this.dragging.enabled();this.dragging.disable();}
this.dragging=new L.Handler.MarkerDrag(this);if(draggable){this.dragging.enable();}}},setOpacity:function(opacity){this.options.opacity=opacity;if(this._map){this._updateOpacity();}
return this;},_updateOpacity:function(){var opacity=this.options.opacity;L.DomUtil.setOpacity(this._icon,opacity);if(this._shadow){L.DomUtil.setOpacity(this._shadow,opacity);}},_bringToFront:function(){this._updateZIndex(this.options.riseOffset);},_resetZIndex:function(){this._updateZIndex(0);},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor||[0,0];},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor||[0,0];}});L.marker=function(latlng,options){return new L.Marker(latlng,options);};L.DivIcon=L.Icon.extend({options:{iconSize:[12,12],html:false,bgPos:null,className:'leaflet-div-icon'},createIcon:function(oldIcon){var div=(oldIcon&&oldIcon.tagName==='DIV')?oldIcon:document.createElement('div'),options=this.options;div.innerHTML=options.html!==false?options.html:'';if(options.bgPos){var bgPos=L.point(options.bgPos);div.style.backgroundPosition=(-bgPos.x)+'px '+(-bgPos.y)+'px';}
this._setIconStyles(div,'icon');return div;},createShadow:function(){return null;}});L.divIcon=function(options){return new L.DivIcon(options);};L.DivOverlay=L.Layer.extend({options:{offset:[0,7],className:'',pane:'popupPane'},initialize:function(options,source){L.setOptions(this,options);this._source=source;},onAdd:function(map){this._zoomAnimated=map._zoomAnimated;if(!this._container){this._initLayout();}
if(map._fadeAnimated){L.DomUtil.setOpacity(this._container,0);}
clearTimeout(this._removeTimeout);this.getPane().appendChild(this._container);this.update();if(map._fadeAnimated){L.DomUtil.setOpacity(this._container,1);}
this.bringToFront();},onRemove:function(map){if(map._fadeAnimated){L.DomUtil.setOpacity(this._container,0);this._removeTimeout=setTimeout(L.bind(L.DomUtil.remove,L.DomUtil,this._container),200);}else{L.DomUtil.remove(this._container);}},getLatLng:function(){return this._latlng;},setLatLng:function(latlng){this._latlng=L.latLng(latlng);if(this._map){this._updatePosition();this._adjustPan();}
return this;},getContent:function(){return this._content;},setContent:function(content){this._content=content;this.update();return this;},getElement:function(){return this._container;},update:function(){if(!this._map){return;}
this._container.style.visibility='hidden';this._updateContent();this._updateLayout();this._updatePosition();this._container.style.visibility='';this._adjustPan();},getEvents:function(){var events={zoom:this._updatePosition,viewreset:this._updatePosition};if(this._zoomAnimated){events.zoomanim=this._animateZoom;}
return events;},isOpen:function(){return!!this._map&&this._map.hasLayer(this);},bringToFront:function(){if(this._map){L.DomUtil.toFront(this._container);}
return this;},bringToBack:function(){if(this._map){L.DomUtil.toBack(this._container);}
return this;},_updateContent:function(){if(!this._content){return;}
var node=this._contentNode;var content=(typeof this._content==='function')?this._content(this._source||this):this._content;if(typeof content==='string'){node.innerHTML=content;}else{while(node.hasChildNodes()){node.removeChild(node.firstChild);}
node.appendChild(content);}
this.fire('contentupdate');},_updatePosition:function(){if(!this._map){return;}
var pos=this._map.latLngToLayerPoint(this._latlng),offset=L.point(this.options.offset),anchor=this._getAnchor();if(this._zoomAnimated){L.DomUtil.setPosition(this._container,pos.add(anchor));}else{offset=offset.add(pos).add(anchor);}
var bottom=this._containerBottom=-offset.y,left=this._containerLeft=-Math.round(this._containerWidth/2)+offset.x;this._container.style.bottom=bottom+'px';this._container.style.left=left+'px';},_getAnchor:function(){return[0,0];}});L.Popup=L.DivOverlay.extend({options:{maxWidth:300,minWidth:50,maxHeight:null,autoPan:true,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:false,closeButton:true,autoClose:true,className:''},openOn:function(map){map.openPopup(this);return this;},onAdd:function(map){L.DivOverlay.prototype.onAdd.call(this,map);map.fire('popupopen',{popup:this});if(this._source){this._source.fire('popupopen',{popup:this},true);if(!(this._source instanceof L.Path)){this._source.on('preclick',L.DomEvent.stopPropagation);}}},onRemove:function(map){L.DivOverlay.prototype.onRemove.call(this,map);map.fire('popupclose',{popup:this});if(this._source){this._source.fire('popupclose',{popup:this},true);if(!(this._source instanceof L.Path)){this._source.off('preclick',L.DomEvent.stopPropagation);}}},getEvents:function(){var events=L.DivOverlay.prototype.getEvents.call(this);if('closeOnClick'in this.options?this.options.closeOnClick:this._map.options.closePopupOnClick){events.preclick=this._close;}
if(this.options.keepInView){events.moveend=this._adjustPan;}
return events;},_close:function(){if(this._map){this._map.closePopup(this);}},_initLayout:function(){var prefix='leaflet-popup',container=this._container=L.DomUtil.create('div',prefix+' '+(this.options.className||'')+' leaflet-zoom-animated');if(this.options.closeButton){var closeButton=this._closeButton=L.DomUtil.create('a',prefix+'-close-button',container);closeButton.href='#close';closeButton.innerHTML='&#215;';L.DomEvent.on(closeButton,'click',this._onCloseButtonClick,this);}
var wrapper=this._wrapper=L.DomUtil.create('div',prefix+'-content-wrapper',container);this._contentNode=L.DomUtil.create('div',prefix+'-content',wrapper);L.DomEvent.disableClickPropagation(wrapper).disableScrollPropagation(this._contentNode).on(wrapper,'contextmenu',L.DomEvent.stopPropagation);this._tipContainer=L.DomUtil.create('div',prefix+'-tip-container',container);this._tip=L.DomUtil.create('div',prefix+'-tip',this._tipContainer);},_updateLayout:function(){var container=this._contentNode,style=container.style;style.width='';style.whiteSpace='nowrap';var width=container.offsetWidth;width=Math.min(width,this.options.maxWidth);width=Math.max(width,this.options.minWidth);style.width=(width+1)+'px';style.whiteSpace='';style.height='';var height=container.offsetHeight,maxHeight=this.options.maxHeight,scrolledClass='leaflet-popup-scrolled';if(maxHeight&&height>maxHeight){style.height=maxHeight+'px';L.DomUtil.addClass(container,scrolledClass);}else{L.DomUtil.removeClass(container,scrolledClass);}
this._containerWidth=this._container.offsetWidth;},_animateZoom:function(e){var pos=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center),anchor=this._getAnchor();L.DomUtil.setPosition(this._container,pos.add(anchor));},_adjustPan:function(){if(!this.options.autoPan||(this._map._panAnim&&this._map._panAnim._inProgress)){return;}
var map=this._map,marginBottom=parseInt(L.DomUtil.getStyle(this._container,'marginBottom'),10)||0,containerHeight=this._container.offsetHeight+marginBottom,containerWidth=this._containerWidth,layerPos=new L.Point(this._containerLeft,-containerHeight-this._containerBottom);layerPos._add(L.DomUtil.getPosition(this._container));var containerPos=map.layerPointToContainerPoint(layerPos),padding=L.point(this.options.autoPanPadding),paddingTL=L.point(this.options.autoPanPaddingTopLeft||padding),paddingBR=L.point(this.options.autoPanPaddingBottomRight||padding),size=map.getSize(),dx=0,dy=0;if(containerPos.x+containerWidth+paddingBR.x>size.x){dx=containerPos.x+containerWidth-size.x+paddingBR.x;}
if(containerPos.x-dx-paddingTL.x<0){dx=containerPos.x-paddingTL.x;}
if(containerPos.y+containerHeight+paddingBR.y>size.y){dy=containerPos.y+containerHeight-size.y+paddingBR.y;}
if(containerPos.y-dy-paddingTL.y<0){dy=containerPos.y-paddingTL.y;}
if(dx||dy){map.fire('autopanstart').panBy([dx,dy]);}},_onCloseButtonClick:function(e){this._close();L.DomEvent.stop(e);},_getAnchor:function(){return L.point(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0]);}});L.popup=function(options,source){return new L.Popup(options,source);};L.Map.mergeOptions({closePopupOnClick:true});L.Map.include({openPopup:function(popup,latlng,options){if(!(popup instanceof L.Popup)){popup=new L.Popup(options).setContent(popup);}
if(latlng){popup.setLatLng(latlng);}
if(this.hasLayer(popup)){return this;}
if(this._popup&&this._popup.options.autoClose){this.closePopup();}
this._popup=popup;return this.addLayer(popup);},closePopup:function(popup){if(!popup||popup===this._popup){popup=this._popup;this._popup=null;}
if(popup){this.removeLayer(popup);}
return this;}});L.Layer.include({bindPopup:function(content,options){if(content instanceof L.Popup){L.setOptions(content,options);this._popup=content;content._source=this;}else{if(!this._popup||options){this._popup=new L.Popup(options,this);}
this._popup.setContent(content);}
if(!this._popupHandlersAdded){this.on({click:this._openPopup,remove:this.closePopup,move:this._movePopup});this._popupHandlersAdded=true;}
return this;},unbindPopup:function(){if(this._popup){this.off({click:this._openPopup,remove:this.closePopup,move:this._movePopup});this._popupHandlersAdded=false;this._popup=null;}
return this;},openPopup:function(layer,latlng){if(!(layer instanceof L.Layer)){latlng=layer;layer=this;}
if(layer instanceof L.FeatureGroup){for(var id in this._layers){layer=this._layers[id];break;}}
if(!latlng){latlng=layer.getCenter?layer.getCenter():layer.getLatLng();}
if(this._popup&&this._map){this._popup._source=layer;this._popup.update();this._map.openPopup(this._popup,latlng);}
return this;},closePopup:function(){if(this._popup){this._popup._close();}
return this;},togglePopup:function(target){if(this._popup){if(this._popup._map){this.closePopup();}else{this.openPopup(target);}}
return this;},isPopupOpen:function(){return(this._popup?this._popup.isOpen():false);},setPopupContent:function(content){if(this._popup){this._popup.setContent(content);}
return this;},getPopup:function(){return this._popup;},_openPopup:function(e){var layer=e.layer||e.target;if(!this._popup){return;}
if(!this._map){return;}
L.DomEvent.stop(e);if(layer instanceof L.Path){this.openPopup(e.layer||e.target,e.latlng);return;}
if(this._map.hasLayer(this._popup)&&this._popup._source===layer){this.closePopup();}else{this.openPopup(layer,e.latlng);}},_movePopup:function(e){this._popup.setLatLng(e.latlng);}});L.Tooltip=L.DivOverlay.extend({options:{pane:'tooltipPane',offset:[0,0],direction:'auto',permanent:false,sticky:false,interactive:false,opacity:0.9},onAdd:function(map){L.DivOverlay.prototype.onAdd.call(this,map);this.setOpacity(this.options.opacity);map.fire('tooltipopen',{tooltip:this});if(this._source){this._source.fire('tooltipopen',{tooltip:this},true);}},onRemove:function(map){L.DivOverlay.prototype.onRemove.call(this,map);map.fire('tooltipclose',{tooltip:this});if(this._source){this._source.fire('tooltipclose',{tooltip:this},true);}},getEvents:function(){var events=L.DivOverlay.prototype.getEvents.call(this);if(L.Browser.touch&&!this.options.permanent){events.preclick=this._close;}
return events;},_close:function(){if(this._map){this._map.closeTooltip(this);}},_initLayout:function(){var prefix='leaflet-tooltip',className=prefix+' '+(this.options.className||'')+' leaflet-zoom-'+(this._zoomAnimated?'animated':'hide');this._contentNode=this._container=L.DomUtil.create('div',className);},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(pos){var map=this._map,container=this._container,centerPoint=map.latLngToContainerPoint(map.getCenter()),tooltipPoint=map.layerPointToContainerPoint(pos),direction=this.options.direction,tooltipWidth=container.offsetWidth,tooltipHeight=container.offsetHeight,offset=L.point(this.options.offset),anchor=this._getAnchor();if(direction==='top'){pos=pos.add(L.point(-tooltipWidth/2+offset.x,-tooltipHeight+offset.y+anchor.y,true));}else if(direction==='bottom'){pos=pos.subtract(L.point(tooltipWidth/2-offset.x,-offset.y,true));}else if(direction==='center'){pos=pos.subtract(L.point(tooltipWidth/2+offset.x,tooltipHeight/2-anchor.y+offset.y,true));}else if(direction==='right'||direction==='auto'&&tooltipPoint.x<centerPoint.x){direction='right';pos=pos.add(L.point(offset.x+anchor.x,anchor.y-tooltipHeight/2+offset.y,true));}else{direction='left';pos=pos.subtract(L.point(tooltipWidth+anchor.x-offset.x,tooltipHeight/2-anchor.y-offset.y,true));}
L.DomUtil.removeClass(container,'leaflet-tooltip-right');L.DomUtil.removeClass(container,'leaflet-tooltip-left');L.DomUtil.removeClass(container,'leaflet-tooltip-top');L.DomUtil.removeClass(container,'leaflet-tooltip-bottom');L.DomUtil.addClass(container,'leaflet-tooltip-'+direction);L.DomUtil.setPosition(container,pos);},_updatePosition:function(){var pos=this._map.latLngToLayerPoint(this._latlng);this._setPosition(pos);},setOpacity:function(opacity){this.options.opacity=opacity;if(this._container){L.DomUtil.setOpacity(this._container,opacity);}},_animateZoom:function(e){var pos=this._map._latLngToNewLayerPoint(this._latlng,e.zoom,e.center);this._setPosition(pos);},_getAnchor:function(){return L.point(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0]);}});L.tooltip=function(options,source){return new L.Tooltip(options,source);};L.Map.include({openTooltip:function(tooltip,latlng,options){if(!(tooltip instanceof L.Tooltip)){tooltip=new L.Tooltip(options).setContent(tooltip);}
if(latlng){tooltip.setLatLng(latlng);}
if(this.hasLayer(tooltip)){return this;}
return this.addLayer(tooltip);},closeTooltip:function(tooltip){if(tooltip){this.removeLayer(tooltip);}
return this;}});L.Layer.include({bindTooltip:function(content,options){if(content instanceof L.Tooltip){L.setOptions(content,options);this._tooltip=content;content._source=this;}else{if(!this._tooltip||options){this._tooltip=L.tooltip(options,this);}
this._tooltip.setContent(content);}
this._initTooltipInteractions();if(this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)){this.openTooltip();}
return this;},unbindTooltip:function(){if(this._tooltip){this._initTooltipInteractions(true);this.closeTooltip();this._tooltip=null;}
return this;},_initTooltipInteractions:function(remove){if(!remove&&this._tooltipHandlersAdded){return;}
var onOff=remove?'off':'on',events={remove:this.closeTooltip,move:this._moveTooltip};if(!this._tooltip.options.permanent){events.mouseover=this._openTooltip;events.mouseout=this.closeTooltip;if(this._tooltip.options.sticky){events.mousemove=this._moveTooltip;}
if(L.Browser.touch){events.click=this._openTooltip;}}else{events.add=this._openTooltip;}
this[onOff](events);this._tooltipHandlersAdded=!remove;},openTooltip:function(layer,latlng){if(!(layer instanceof L.Layer)){latlng=layer;layer=this;}
if(layer instanceof L.FeatureGroup){for(var id in this._layers){layer=this._layers[id];break;}}
if(!latlng){latlng=layer.getCenter?layer.getCenter():layer.getLatLng();}
if(this._tooltip&&this._map){this._tooltip._source=layer;this._tooltip.update();this._map.openTooltip(this._tooltip,latlng);if(this._tooltip.options.interactive&&this._tooltip._container){L.DomUtil.addClass(this._tooltip._container,'leaflet-clickable');this.addInteractiveTarget(this._tooltip._container);}}
return this;},closeTooltip:function(){if(this._tooltip){this._tooltip._close();if(this._tooltip.options.interactive&&this._tooltip._container){L.DomUtil.removeClass(this._tooltip._container,'leaflet-clickable');this.removeInteractiveTarget(this._tooltip._container);}}
return this;},toggleTooltip:function(target){if(this._tooltip){if(this._tooltip._map){this.closeTooltip();}else{this.openTooltip(target);}}
return this;},isTooltipOpen:function(){return this._tooltip.isOpen();},setTooltipContent:function(content){if(this._tooltip){this._tooltip.setContent(content);}
return this;},getTooltip:function(){return this._tooltip;},_openTooltip:function(e){var layer=e.layer||e.target;if(!this._tooltip||!this._map){return;}
this.openTooltip(layer,this._tooltip.options.sticky?e.latlng:undefined);},_moveTooltip:function(e){var latlng=e.latlng,containerPoint,layerPoint;if(this._tooltip.options.sticky&&e.originalEvent){containerPoint=this._map.mouseEventToContainerPoint(e.originalEvent);layerPoint=this._map.containerPointToLayerPoint(containerPoint);latlng=this._map.layerPointToLatLng(layerPoint);}
this._tooltip.setLatLng(latlng);}});L.LayerGroup=L.Layer.extend({initialize:function(layers){this._layers={};var i,len;if(layers){for(i=0,len=layers.length;i<len;i++){this.addLayer(layers[i]);}}},addLayer:function(layer){var id=this.getLayerId(layer);this._layers[id]=layer;if(this._map){this._map.addLayer(layer);}
return this;},removeLayer:function(layer){var id=layer in this._layers?layer:this.getLayerId(layer);if(this._map&&this._layers[id]){this._map.removeLayer(this._layers[id]);}
delete this._layers[id];return this;},hasLayer:function(layer){return!!layer&&(layer in this._layers||this.getLayerId(layer)in this._layers);},clearLayers:function(){for(var i in this._layers){this.removeLayer(this._layers[i]);}
return this;},invoke:function(methodName){var args=Array.prototype.slice.call(arguments,1),i,layer;for(i in this._layers){layer=this._layers[i];if(layer[methodName]){layer[methodName].apply(layer,args);}}
return this;},onAdd:function(map){for(var i in this._layers){map.addLayer(this._layers[i]);}},onRemove:function(map){for(var i in this._layers){map.removeLayer(this._layers[i]);}},eachLayer:function(method,context){for(var i in this._layers){method.call(context,this._layers[i]);}
return this;},getLayer:function(id){return this._layers[id];},getLayers:function(){var layers=[];for(var i in this._layers){layers.push(this._layers[i]);}
return layers;},setZIndex:function(zIndex){return this.invoke('setZIndex',zIndex);},getLayerId:function(layer){return L.stamp(layer);}});L.layerGroup=function(layers){return new L.LayerGroup(layers);};L.FeatureGroup=L.LayerGroup.extend({addLayer:function(layer){if(this.hasLayer(layer)){return this;}
layer.addEventParent(this);L.LayerGroup.prototype.addLayer.call(this,layer);return this.fire('layeradd',{layer:layer});},removeLayer:function(layer){if(!this.hasLayer(layer)){return this;}
if(layer in this._layers){layer=this._layers[layer];}
layer.removeEventParent(this);L.LayerGroup.prototype.removeLayer.call(this,layer);return this.fire('layerremove',{layer:layer});},setStyle:function(style){return this.invoke('setStyle',style);},bringToFront:function(){return this.invoke('bringToFront');},bringToBack:function(){return this.invoke('bringToBack');},getBounds:function(){var bounds=new L.LatLngBounds();for(var id in this._layers){var layer=this._layers[id];bounds.extend(layer.getBounds?layer.getBounds():layer.getLatLng());}
return bounds;}});L.featureGroup=function(layers){return new L.FeatureGroup(layers);};L.Renderer=L.Layer.extend({options:{padding:0.1},initialize:function(options){L.setOptions(this,options);L.stamp(this);this._layers=this._layers||{};},onAdd:function(){if(!this._container){this._initContainer();if(this._zoomAnimated){L.DomUtil.addClass(this._container,'leaflet-zoom-animated');}}
this.getPane().appendChild(this._container);this._update();this.on('update',this._updatePaths,this);},onRemove:function(){L.DomUtil.remove(this._container);this.off('update',this._updatePaths,this);},getEvents:function(){var events={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};if(this._zoomAnimated){events.zoomanim=this._onAnimZoom;}
return events;},_onAnimZoom:function(ev){this._updateTransform(ev.center,ev.zoom);},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom());},_updateTransform:function(center,zoom){var scale=this._map.getZoomScale(zoom,this._zoom),position=L.DomUtil.getPosition(this._container),viewHalf=this._map.getSize().multiplyBy(0.5+this.options.padding),currentCenterPoint=this._map.project(this._center,zoom),destCenterPoint=this._map.project(center,zoom),centerOffset=destCenterPoint.subtract(currentCenterPoint),topLeftOffset=viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);if(L.Browser.any3d){L.DomUtil.setTransform(this._container,topLeftOffset,scale);}else{L.DomUtil.setPosition(this._container,topLeftOffset);}},_reset:function(){this._update();this._updateTransform(this._center,this._zoom);for(var id in this._layers){this._layers[id]._reset();}},_onZoomEnd:function(){for(var id in this._layers){this._layers[id]._project();}},_updatePaths:function(){for(var id in this._layers){this._layers[id]._update();}},_update:function(){var p=this.options.padding,size=this._map.getSize(),min=this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();this._bounds=new L.Bounds(min,min.add(size.multiplyBy(1+p*2)).round());this._center=this._map.getCenter();this._zoom=this._map.getZoom();}});L.Map.include({getRenderer:function(layer){var renderer=layer.options.renderer||this._getPaneRenderer(layer.options.pane)||this.options.renderer||this._renderer;if(!renderer){renderer=this._renderer=(this.options.preferCanvas&&L.canvas())||L.svg();}
if(!this.hasLayer(renderer)){this.addLayer(renderer);}
return renderer;},_getPaneRenderer:function(name){if(name==='overlayPane'||name===undefined){return false;}
var renderer=this._paneRenderers[name];if(renderer===undefined){renderer=(L.SVG&&L.svg({pane:name}))||(L.Canvas&&L.canvas({pane:name}));this._paneRenderers[name]=renderer;}
return renderer;}});L.Path=L.Layer.extend({options:{stroke:true,color:'#3388ff',weight:3,opacity:1,lineCap:'round',lineJoin:'round',dashArray:null,dashOffset:null,fill:false,fillColor:null,fillOpacity:0.2,fillRule:'evenodd',interactive:true},beforeAdd:function(map){this._renderer=map.getRenderer(this);},onAdd:function(){this._renderer._initPath(this);this._reset();this._renderer._addPath(this);},onRemove:function(){this._renderer._removePath(this);},redraw:function(){if(this._map){this._renderer._updatePath(this);}
return this;},setStyle:function(style){L.setOptions(this,style);if(this._renderer){this._renderer._updateStyle(this);}
return this;},bringToFront:function(){if(this._renderer){this._renderer._bringToFront(this);}
return this;},bringToBack:function(){if(this._renderer){this._renderer._bringToBack(this);}
return this;},getElement:function(){return this._path;},_reset:function(){this._project();this._update();},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(L.Browser.touch?10:0);}});L.LineUtil={simplify:function(points,tolerance){if(!tolerance||!points.length){return points.slice();}
var sqTolerance=tolerance*tolerance;points=this._reducePoints(points,sqTolerance);points=this._simplifyDP(points,sqTolerance);return points;},pointToSegmentDistance:function(p,p1,p2){return Math.sqrt(this._sqClosestPointOnSegment(p,p1,p2,true));},closestPointOnSegment:function(p,p1,p2){return this._sqClosestPointOnSegment(p,p1,p2);},_simplifyDP:function(points,sqTolerance){var len=points.length,ArrayConstructor=typeof Uint8Array!==undefined+''?Uint8Array:Array,markers=new ArrayConstructor(len);markers[0]=markers[len-1]=1;this._simplifyDPStep(points,markers,sqTolerance,0,len-1);var i,newPoints=[];for(i=0;i<len;i++){if(markers[i]){newPoints.push(points[i]);}}
return newPoints;},_simplifyDPStep:function(points,markers,sqTolerance,first,last){var maxSqDist=0,index,i,sqDist;for(i=first+1;i<=last-1;i++){sqDist=this._sqClosestPointOnSegment(points[i],points[first],points[last],true);if(sqDist>maxSqDist){index=i;maxSqDist=sqDist;}}
if(maxSqDist>sqTolerance){markers[index]=1;this._simplifyDPStep(points,markers,sqTolerance,first,index);this._simplifyDPStep(points,markers,sqTolerance,index,last);}},_reducePoints:function(points,sqTolerance){var reducedPoints=[points[0]];for(var i=1,prev=0,len=points.length;i<len;i++){if(this._sqDist(points[i],points[prev])>sqTolerance){reducedPoints.push(points[i]);prev=i;}}
if(prev<len-1){reducedPoints.push(points[len-1]);}
return reducedPoints;},clipSegment:function(a,b,bounds,useLastCode,round){var codeA=useLastCode?this._lastCode:this._getBitCode(a,bounds),codeB=this._getBitCode(b,bounds),codeOut,p,newCode;this._lastCode=codeB;while(true){if(!(codeA|codeB)){return[a,b];}
if(codeA&codeB){return false;}
codeOut=codeA||codeB;p=this._getEdgeIntersection(a,b,codeOut,bounds,round);newCode=this._getBitCode(p,bounds);if(codeOut===codeA){a=p;codeA=newCode;}else{b=p;codeB=newCode;}}},_getEdgeIntersection:function(a,b,code,bounds,round){var dx=b.x-a.x,dy=b.y-a.y,min=bounds.min,max=bounds.max,x,y;if(code&8){x=a.x+dx*(max.y-a.y)/dy;y=max.y;}else if(code&4){x=a.x+dx*(min.y-a.y)/dy;y=min.y;}else if(code&2){x=max.x;y=a.y+dy*(max.x-a.x)/dx;}else if(code&1){x=min.x;y=a.y+dy*(min.x-a.x)/dx;}
return new L.Point(x,y,round);},_getBitCode:function(p,bounds){var code=0;if(p.x<bounds.min.x){code|=1;}else if(p.x>bounds.max.x){code|=2;}
if(p.y<bounds.min.y){code|=4;}else if(p.y>bounds.max.y){code|=8;}
return code;},_sqDist:function(p1,p2){var dx=p2.x-p1.x,dy=p2.y-p1.y;return dx*dx+dy*dy;},_sqClosestPointOnSegment:function(p,p1,p2,sqDist){var x=p1.x,y=p1.y,dx=p2.x-x,dy=p2.y-y,dot=dx*dx+dy*dy,t;if(dot>0){t=((p.x-x)*dx+(p.y-y)*dy)/dot;if(t>1){x=p2.x;y=p2.y;}else if(t>0){x+=dx*t;y+=dy*t;}}
dx=p.x-x;dy=p.y-y;return sqDist?dx*dx+dy*dy:new L.Point(x,y);}};L.Polyline=L.Path.extend({options:{smoothFactor:1.0,noClip:false},initialize:function(latlngs,options){L.setOptions(this,options);this._setLatLngs(latlngs);},getLatLngs:function(){return this._latlngs;},setLatLngs:function(latlngs){this._setLatLngs(latlngs);return this.redraw();},isEmpty:function(){return!this._latlngs.length;},closestLayerPoint:function(p){var minDistance=Infinity,minPoint=null,closest=L.LineUtil._sqClosestPointOnSegment,p1,p2;for(var j=0,jLen=this._parts.length;j<jLen;j++){var points=this._parts[j];for(var i=1,len=points.length;i<len;i++){p1=points[i-1];p2=points[i];var sqDist=closest(p,p1,p2,true);if(sqDist<minDistance){minDistance=sqDist;minPoint=closest(p,p1,p2);}}}
if(minPoint){minPoint.distance=Math.sqrt(minDistance);}
return minPoint;},getCenter:function(){if(!this._map){throw new Error('Must add layer to map before using getCenter()');}
var i,halfDist,segDist,dist,p1,p2,ratio,points=this._rings[0],len=points.length;if(!len){return null;}
for(i=0,halfDist=0;i<len-1;i++){halfDist+=points[i].distanceTo(points[i+1])/2;}
if(halfDist===0){return this._map.layerPointToLatLng(points[0]);}
for(i=0,dist=0;i<len-1;i++){p1=points[i];p2=points[i+1];segDist=p1.distanceTo(p2);dist+=segDist;if(dist>halfDist){ratio=(dist-halfDist)/segDist;return this._map.layerPointToLatLng([p2.x-ratio*(p2.x-p1.x),p2.y-ratio*(p2.y-p1.y)]);}}},getBounds:function(){return this._bounds;},addLatLng:function(latlng,latlngs){latlngs=latlngs||this._defaultShape();latlng=L.latLng(latlng);latlngs.push(latlng);this._bounds.extend(latlng);return this.redraw();},_setLatLngs:function(latlngs){this._bounds=new L.LatLngBounds();this._latlngs=this._convertLatLngs(latlngs);},_defaultShape:function(){return L.Polyline._flat(this._latlngs)?this._latlngs:this._latlngs[0];},_convertLatLngs:function(latlngs){var result=[],flat=L.Polyline._flat(latlngs);for(var i=0,len=latlngs.length;i<len;i++){if(flat){result[i]=L.latLng(latlngs[i]);this._bounds.extend(result[i]);}else{result[i]=this._convertLatLngs(latlngs[i]);}}
return result;},_project:function(){var pxBounds=new L.Bounds();this._rings=[];this._projectLatlngs(this._latlngs,this._rings,pxBounds);var w=this._clickTolerance(),p=new L.Point(w,w);if(this._bounds.isValid()&&pxBounds.isValid()){pxBounds.min._subtract(p);pxBounds.max._add(p);this._pxBounds=pxBounds;}},_projectLatlngs:function(latlngs,result,projectedBounds){var flat=latlngs[0]instanceof L.LatLng,len=latlngs.length,i,ring;if(flat){ring=[];for(i=0;i<len;i++){ring[i]=this._map.latLngToLayerPoint(latlngs[i]);projectedBounds.extend(ring[i]);}
result.push(ring);}else{for(i=0;i<len;i++){this._projectLatlngs(latlngs[i],result,projectedBounds);}}},_clipPoints:function(){var bounds=this._renderer._bounds;this._parts=[];if(!this._pxBounds||!this._pxBounds.intersects(bounds)){return;}
if(this.options.noClip){this._parts=this._rings;return;}
var parts=this._parts,i,j,k,len,len2,segment,points;for(i=0,k=0,len=this._rings.length;i<len;i++){points=this._rings[i];for(j=0,len2=points.length;j<len2-1;j++){segment=L.LineUtil.clipSegment(points[j],points[j+1],bounds,j,true);if(!segment){continue;}
parts[k]=parts[k]||[];parts[k].push(segment[0]);if((segment[1]!==points[j+1])||(j===len2-2)){parts[k].push(segment[1]);k++;}}}},_simplifyPoints:function(){var parts=this._parts,tolerance=this.options.smoothFactor;for(var i=0,len=parts.length;i<len;i++){parts[i]=L.LineUtil.simplify(parts[i],tolerance);}},_update:function(){if(!this._map){return;}
this._clipPoints();this._simplifyPoints();this._updatePath();},_updatePath:function(){this._renderer._updatePoly(this);}});L.polyline=function(latlngs,options){return new L.Polyline(latlngs,options);};L.Polyline._flat=function(latlngs){return!L.Util.isArray(latlngs[0])||(typeof latlngs[0][0]!=='object'&&typeof latlngs[0][0]!=='undefined');};L.PolyUtil={};L.PolyUtil.clipPolygon=function(points,bounds,round){var clippedPoints,edges=[1,4,2,8],i,j,k,a,b,len,edge,p,lu=L.LineUtil;for(i=0,len=points.length;i<len;i++){points[i]._code=lu._getBitCode(points[i],bounds);}
for(k=0;k<4;k++){edge=edges[k];clippedPoints=[];for(i=0,len=points.length,j=len-1;i<len;j=i++){a=points[i];b=points[j];if(!(a._code&edge)){if(b._code&edge){p=lu._getEdgeIntersection(b,a,edge,bounds,round);p._code=lu._getBitCode(p,bounds);clippedPoints.push(p);}
clippedPoints.push(a);}else if(!(b._code&edge)){p=lu._getEdgeIntersection(b,a,edge,bounds,round);p._code=lu._getBitCode(p,bounds);clippedPoints.push(p);}}
points=clippedPoints;}
return points;};L.Polygon=L.Polyline.extend({options:{fill:true},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length;},getCenter:function(){if(!this._map){throw new Error('Must add layer to map before using getCenter()');}
var i,j,p1,p2,f,area,x,y,center,points=this._rings[0],len=points.length;if(!len){return null;}
area=x=y=0;for(i=0,j=len-1;i<len;j=i++){p1=points[i];p2=points[j];f=p1.y*p2.x-p2.y*p1.x;x+=(p1.x+p2.x)*f;y+=(p1.y+p2.y)*f;area+=f*3;}
if(area===0){center=points[0];}else{center=[x/area,y/area];}
return this._map.layerPointToLatLng(center);},_convertLatLngs:function(latlngs){var result=L.Polyline.prototype._convertLatLngs.call(this,latlngs),len=result.length;if(len>=2&&result[0]instanceof L.LatLng&&result[0].equals(result[len-1])){result.pop();}
return result;},_setLatLngs:function(latlngs){L.Polyline.prototype._setLatLngs.call(this,latlngs);if(L.Polyline._flat(this._latlngs)){this._latlngs=[this._latlngs];}},_defaultShape:function(){return L.Polyline._flat(this._latlngs[0])?this._latlngs[0]:this._latlngs[0][0];},_clipPoints:function(){var bounds=this._renderer._bounds,w=this.options.weight,p=new L.Point(w,w);bounds=new L.Bounds(bounds.min.subtract(p),bounds.max.add(p));this._parts=[];if(!this._pxBounds||!this._pxBounds.intersects(bounds)){return;}
if(this.options.noClip){this._parts=this._rings;return;}
for(var i=0,len=this._rings.length,clipped;i<len;i++){clipped=L.PolyUtil.clipPolygon(this._rings[i],bounds,true);if(clipped.length){this._parts.push(clipped);}}},_updatePath:function(){this._renderer._updatePoly(this,true);}});L.polygon=function(latlngs,options){return new L.Polygon(latlngs,options);};L.Rectangle=L.Polygon.extend({initialize:function(latLngBounds,options){L.Polygon.prototype.initialize.call(this,this._boundsToLatLngs(latLngBounds),options);},setBounds:function(latLngBounds){return this.setLatLngs(this._boundsToLatLngs(latLngBounds));},_boundsToLatLngs:function(latLngBounds){latLngBounds=L.latLngBounds(latLngBounds);return[latLngBounds.getSouthWest(),latLngBounds.getNorthWest(),latLngBounds.getNorthEast(),latLngBounds.getSouthEast()];}});L.rectangle=function(latLngBounds,options){return new L.Rectangle(latLngBounds,options);};L.CircleMarker=L.Path.extend({options:{fill:true,radius:10},initialize:function(latlng,options){L.setOptions(this,options);this._latlng=L.latLng(latlng);this._radius=this.options.radius;},setLatLng:function(latlng){this._latlng=L.latLng(latlng);this.redraw();return this.fire('move',{latlng:this._latlng});},getLatLng:function(){return this._latlng;},setRadius:function(radius){this.options.radius=this._radius=radius;return this.redraw();},getRadius:function(){return this._radius;},setStyle:function(options){var radius=options&&options.radius||this._radius;L.Path.prototype.setStyle.call(this,options);this.setRadius(radius);return this;},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng);this._updateBounds();},_updateBounds:function(){var r=this._radius,r2=this._radiusY||r,w=this._clickTolerance(),p=[r+w,r2+w];this._pxBounds=new L.Bounds(this._point.subtract(p),this._point.add(p));},_update:function(){if(this._map){this._updatePath();}},_updatePath:function(){this._renderer._updateCircle(this);},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds);}});L.circleMarker=function(latlng,options){return new L.CircleMarker(latlng,options);};L.Circle=L.CircleMarker.extend({initialize:function(latlng,options,legacyOptions){if(typeof options==='number'){options=L.extend({},legacyOptions,{radius:options});}
L.setOptions(this,options);this._latlng=L.latLng(latlng);if(isNaN(this.options.radius)){throw new Error('Circle radius cannot be NaN');}
this._mRadius=this.options.radius;},setRadius:function(radius){this._mRadius=radius;return this.redraw();},getRadius:function(){return this._mRadius;},getBounds:function(){var half=[this._radius,this._radiusY||this._radius];return new L.LatLngBounds(this._map.layerPointToLatLng(this._point.subtract(half)),this._map.layerPointToLatLng(this._point.add(half)));},setStyle:L.Path.prototype.setStyle,_project:function(){var lng=this._latlng.lng,lat=this._latlng.lat,map=this._map,crs=map.options.crs;if(crs.distance===L.CRS.Earth.distance){var d=Math.PI/180,latR=(this._mRadius/L.CRS.Earth.R)/d,top=map.project([lat+latR,lng]),bottom=map.project([lat-latR,lng]),p=top.add(bottom).divideBy(2),lat2=map.unproject(p).lat,lngR=Math.acos((Math.cos(latR*d)-Math.sin(lat*d)*Math.sin(lat2*d))/(Math.cos(lat*d)*Math.cos(lat2*d)))/d;if(isNaN(lngR)||lngR===0){lngR=latR/Math.cos(Math.PI/180*lat);}
this._point=p.subtract(map.getPixelOrigin());this._radius=isNaN(lngR)?0:Math.max(Math.round(p.x-map.project([lat2,lng-lngR]).x),1);this._radiusY=Math.max(Math.round(p.y-top.y),1);}else{var latlng2=crs.unproject(crs.project(this._latlng).subtract([this._mRadius,0]));this._point=map.latLngToLayerPoint(this._latlng);this._radius=this._point.x-map.latLngToLayerPoint(latlng2).x;}
this._updateBounds();}});L.circle=function(latlng,options,legacyOptions){return new L.Circle(latlng,options,legacyOptions);};L.SVG=L.Renderer.extend({getEvents:function(){var events=L.Renderer.prototype.getEvents.call(this);events.zoomstart=this._onZoomStart;return events;},_initContainer:function(){this._container=L.SVG.create('svg');this._container.setAttribute('pointer-events','none');this._rootGroup=L.SVG.create('g');this._container.appendChild(this._rootGroup);},_onZoomStart:function(){this._update();},_update:function(){if(this._map._animatingZoom&&this._bounds){return;}
L.Renderer.prototype._update.call(this);var b=this._bounds,size=b.getSize(),container=this._container;if(!this._svgSize||!this._svgSize.equals(size)){this._svgSize=size;container.setAttribute('width',size.x);container.setAttribute('height',size.y);}
L.DomUtil.setPosition(container,b.min);container.setAttribute('viewBox',[b.min.x,b.min.y,size.x,size.y].join(' '));this.fire('update');},_initPath:function(layer){var path=layer._path=L.SVG.create('path');if(layer.options.className){L.DomUtil.addClass(path,layer.options.className);}
if(layer.options.interactive){L.DomUtil.addClass(path,'leaflet-interactive');}
this._updateStyle(layer);this._layers[L.stamp(layer)]=layer;},_addPath:function(layer){this._rootGroup.appendChild(layer._path);layer.addInteractiveTarget(layer._path);},_removePath:function(layer){L.DomUtil.remove(layer._path);layer.removeInteractiveTarget(layer._path);delete this._layers[L.stamp(layer)];},_updatePath:function(layer){layer._project();layer._update();},_updateStyle:function(layer){var path=layer._path,options=layer.options;if(!path){return;}
if(options.stroke){path.setAttribute('stroke',options.color);path.setAttribute('stroke-opacity',options.opacity);path.setAttribute('stroke-width',options.weight);path.setAttribute('stroke-linecap',options.lineCap);path.setAttribute('stroke-linejoin',options.lineJoin);if(options.dashArray){path.setAttribute('stroke-dasharray',options.dashArray);}else{path.removeAttribute('stroke-dasharray');}
if(options.dashOffset){path.setAttribute('stroke-dashoffset',options.dashOffset);}else{path.removeAttribute('stroke-dashoffset');}}else{path.setAttribute('stroke','none');}
if(options.fill){path.setAttribute('fill',options.fillColor||options.color);path.setAttribute('fill-opacity',options.fillOpacity);path.setAttribute('fill-rule',options.fillRule||'evenodd');}else{path.setAttribute('fill','none');}},_updatePoly:function(layer,closed){this._setPath(layer,L.SVG.pointsToPath(layer._parts,closed));},_updateCircle:function(layer){var p=layer._point,r=layer._radius,r2=layer._radiusY||r,arc='a'+r+','+r2+' 0 1,0 ';var d=layer._empty()?'M0 0':'M'+(p.x-r)+','+p.y+
arc+(r*2)+',0 '+
arc+(-r*2)+',0 ';this._setPath(layer,d);},_setPath:function(layer,path){layer._path.setAttribute('d',path);},_bringToFront:function(layer){L.DomUtil.toFront(layer._path);},_bringToBack:function(layer){L.DomUtil.toBack(layer._path);}});L.extend(L.SVG,{create:function(name){return document.createElementNS('http://www.w3.org/2000/svg',name);},pointsToPath:function(rings,closed){var str='',i,j,len,len2,points,p;for(i=0,len=rings.length;i<len;i++){points=rings[i];for(j=0,len2=points.length;j<len2;j++){p=points[j];str+=(j?'L':'M')+p.x+' '+p.y;}
str+=closed?(L.Browser.svg?'z':'x'):'';}
return str||'M0 0';}});L.Browser.svg=!!(document.createElementNS&&L.SVG.create('svg').createSVGRect);L.svg=function(options){return L.Browser.svg||L.Browser.vml?new L.SVG(options):null;};L.Browser.vml=!L.Browser.svg&&(function(){try{var div=document.createElement('div');div.innerHTML='<v:shape adj="1"/>';var shape=div.firstChild;shape.style.behavior='url(#default#VML)';return shape&&(typeof shape.adj==='object');}catch(e){return false;}}());L.SVG.include(!L.Browser.vml?{}:{_initContainer:function(){this._container=L.DomUtil.create('div','leaflet-vml-container');},_update:function(){if(this._map._animatingZoom){return;}
L.Renderer.prototype._update.call(this);this.fire('update');},_initPath:function(layer){var container=layer._container=L.SVG.create('shape');L.DomUtil.addClass(container,'leaflet-vml-shape '+(this.options.className||''));container.coordsize='1 1';layer._path=L.SVG.create('path');container.appendChild(layer._path);this._updateStyle(layer);this._layers[L.stamp(layer)]=layer;},_addPath:function(layer){var container=layer._container;this._container.appendChild(container);if(layer.options.interactive){layer.addInteractiveTarget(container);}},_removePath:function(layer){var container=layer._container;L.DomUtil.remove(container);layer.removeInteractiveTarget(container);delete this._layers[L.stamp(layer)];},_updateStyle:function(layer){var stroke=layer._stroke,fill=layer._fill,options=layer.options,container=layer._container;container.stroked=!!options.stroke;container.filled=!!options.fill;if(options.stroke){if(!stroke){stroke=layer._stroke=L.SVG.create('stroke');}
container.appendChild(stroke);stroke.weight=options.weight+'px';stroke.color=options.color;stroke.opacity=options.opacity;if(options.dashArray){stroke.dashStyle=L.Util.isArray(options.dashArray)?options.dashArray.join(' '):options.dashArray.replace(/( *, *)/g,' ');}else{stroke.dashStyle='';}
stroke.endcap=options.lineCap.replace('butt','flat');stroke.joinstyle=options.lineJoin;}else if(stroke){container.removeChild(stroke);layer._stroke=null;}
if(options.fill){if(!fill){fill=layer._fill=L.SVG.create('fill');}
container.appendChild(fill);fill.color=options.fillColor||options.color;fill.opacity=options.fillOpacity;}else if(fill){container.removeChild(fill);layer._fill=null;}},_updateCircle:function(layer){var p=layer._point.round(),r=Math.round(layer._radius),r2=Math.round(layer._radiusY||r);this._setPath(layer,layer._empty()?'M0 0':'AL '+p.x+','+p.y+' '+r+','+r2+' 0,'+(65535*360));},_setPath:function(layer,path){layer._path.v=path;},_bringToFront:function(layer){L.DomUtil.toFront(layer._container);},_bringToBack:function(layer){L.DomUtil.toBack(layer._container);}});if(L.Browser.vml){L.SVG.create=(function(){try{document.namespaces.add('lvml','urn:schemas-microsoft-com:vml');return function(name){return document.createElement('<lvml:'+name+' class="lvml">');};}catch(e){return function(name){return document.createElement('<'+name+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');};}})();}
L.Canvas=L.Renderer.extend({getEvents:function(){var events=L.Renderer.prototype.getEvents.call(this);events.viewprereset=this._onViewPreReset;return events;},_onViewPreReset:function(){this._postponeUpdatePaths=true;},onAdd:function(){L.Renderer.prototype.onAdd.call(this);this._draw();},_initContainer:function(){var container=this._container=document.createElement('canvas');L.DomEvent.on(container,'mousemove',L.Util.throttle(this._onMouseMove,32,this),this).on(container,'click dblclick mousedown mouseup contextmenu',this._onClick,this).on(container,'mouseout',this._handleMouseOut,this);this._ctx=container.getContext('2d');},_updatePaths:function(){if(this._postponeUpdatePaths){return;}
var layer;this._redrawBounds=null;for(var id in this._layers){layer=this._layers[id];layer._update();}
this._redraw();},_update:function(){if(this._map._animatingZoom&&this._bounds){return;}
this._drawnLayers={};L.Renderer.prototype._update.call(this);var b=this._bounds,container=this._container,size=b.getSize(),m=L.Browser.retina?2:1;L.DomUtil.setPosition(container,b.min);container.width=m*size.x;container.height=m*size.y;container.style.width=size.x+'px';container.style.height=size.y+'px';if(L.Browser.retina){this._ctx.scale(2,2);}
this._ctx.translate(-b.min.x,-b.min.y);this.fire('update');},_reset:function(){L.Renderer.prototype._reset.call(this);if(this._postponeUpdatePaths){this._postponeUpdatePaths=false;this._updatePaths();}},_initPath:function(layer){this._updateDashArray(layer);this._layers[L.stamp(layer)]=layer;var order=layer._order={layer:layer,prev:this._drawLast,next:null};if(this._drawLast){this._drawLast.next=order;}
this._drawLast=order;this._drawFirst=this._drawFirst||this._drawLast;},_addPath:function(layer){this._requestRedraw(layer);},_removePath:function(layer){var order=layer._order;var next=order.next;var prev=order.prev;if(next){next.prev=prev;}else{this._drawLast=prev;}
if(prev){prev.next=next;}else{this._drawFirst=next;}
delete layer._order;delete this._layers[L.stamp(layer)];this._requestRedraw(layer);},_updatePath:function(layer){this._extendRedrawBounds(layer);layer._project();layer._update();this._requestRedraw(layer);},_updateStyle:function(layer){this._updateDashArray(layer);this._requestRedraw(layer);},_updateDashArray:function(layer){if(layer.options.dashArray){var parts=layer.options.dashArray.split(','),dashArray=[],i;for(i=0;i<parts.length;i++){dashArray.push(Number(parts[i]));}
layer.options._dashArray=dashArray;}},_requestRedraw:function(layer){if(!this._map){return;}
this._extendRedrawBounds(layer);this._redrawRequest=this._redrawRequest||L.Util.requestAnimFrame(this._redraw,this);},_extendRedrawBounds:function(layer){var padding=(layer.options.weight||0)+1;this._redrawBounds=this._redrawBounds||new L.Bounds();this._redrawBounds.extend(layer._pxBounds.min.subtract([padding,padding]));this._redrawBounds.extend(layer._pxBounds.max.add([padding,padding]));},_redraw:function(){this._redrawRequest=null;if(this._redrawBounds){this._redrawBounds.min._floor();this._redrawBounds.max._ceil();}
this._clear();this._draw();this._redrawBounds=null;},_clear:function(){var bounds=this._redrawBounds;if(bounds){var size=bounds.getSize();this._ctx.clearRect(bounds.min.x,bounds.min.y,size.x,size.y);}else{this._ctx.clearRect(0,0,this._container.width,this._container.height);}},_draw:function(){var layer,bounds=this._redrawBounds;this._ctx.save();if(bounds){var size=bounds.getSize();this._ctx.beginPath();this._ctx.rect(bounds.min.x,bounds.min.y,size.x,size.y);this._ctx.clip();}
this._drawing=true;for(var order=this._drawFirst;order;order=order.next){layer=order.layer;if(!bounds||(layer._pxBounds&&layer._pxBounds.intersects(bounds))){layer._updatePath();}}
this._drawing=false;this._ctx.restore();},_updatePoly:function(layer,closed){if(!this._drawing){return;}
var i,j,len2,p,parts=layer._parts,len=parts.length,ctx=this._ctx;if(!len){return;}
this._drawnLayers[layer._leaflet_id]=layer;ctx.beginPath();if(ctx.setLineDash){ctx.setLineDash(layer.options&&layer.options._dashArray||[]);}
for(i=0;i<len;i++){for(j=0,len2=parts[i].length;j<len2;j++){p=parts[i][j];ctx[j?'lineTo':'moveTo'](p.x,p.y);}
if(closed){ctx.closePath();}}
this._fillStroke(ctx,layer);},_updateCircle:function(layer){if(!this._drawing||layer._empty()){return;}
var p=layer._point,ctx=this._ctx,r=layer._radius,s=(layer._radiusY||r)/r;this._drawnLayers[layer._leaflet_id]=layer;if(s!==1){ctx.save();ctx.scale(1,s);}
ctx.beginPath();ctx.arc(p.x,p.y/s,r,0,Math.PI*2,false);if(s!==1){ctx.restore();}
this._fillStroke(ctx,layer);},_fillStroke:function(ctx,layer){var options=layer.options;if(options.fill){ctx.globalAlpha=options.fillOpacity;ctx.fillStyle=options.fillColor||options.color;ctx.fill(options.fillRule||'evenodd');}
if(options.stroke&&options.weight!==0){ctx.globalAlpha=options.opacity;ctx.lineWidth=options.weight;ctx.strokeStyle=options.color;ctx.lineCap=options.lineCap;ctx.lineJoin=options.lineJoin;ctx.stroke();}},_onClick:function(e){var point=this._map.mouseEventToLayerPoint(e),layer,clickedLayer;for(var order=this._drawFirst;order;order=order.next){layer=order.layer;if(layer.options.interactive&&layer._containsPoint(point)&&!this._map._draggableMoved(layer)){clickedLayer=layer;}}
if(clickedLayer){L.DomEvent._fakeStop(e);this._fireEvent([clickedLayer],e);}},_onMouseMove:function(e){if(!this._map||this._map.dragging.moving()||this._map._animatingZoom){return;}
var point=this._map.mouseEventToLayerPoint(e);this._handleMouseHover(e,point);},_handleMouseOut:function(e){var layer=this._hoveredLayer;if(layer){L.DomUtil.removeClass(this._container,'leaflet-interactive');this._fireEvent([layer],e,'mouseout');this._hoveredLayer=null;}},_handleMouseHover:function(e,point){var layer,candidateHoveredLayer;for(var order=this._drawFirst;order;order=order.next){layer=order.layer;if(layer.options.interactive&&layer._containsPoint(point)){candidateHoveredLayer=layer;}}
if(candidateHoveredLayer!==this._hoveredLayer){this._handleMouseOut(e);if(candidateHoveredLayer){L.DomUtil.addClass(this._container,'leaflet-interactive');this._fireEvent([candidateHoveredLayer],e,'mouseover');this._hoveredLayer=candidateHoveredLayer;}}
if(this._hoveredLayer){this._fireEvent([this._hoveredLayer],e);}},_fireEvent:function(layers,e,type){this._map._fireDOMEvent(e,type||e.type,layers);},_bringToFront:function(layer){var order=layer._order;var next=order.next;var prev=order.prev;if(next){next.prev=prev;}else{return;}
if(prev){prev.next=next;}else if(next){this._drawFirst=next;}
order.prev=this._drawLast;this._drawLast.next=order;order.next=null;this._drawLast=order;this._requestRedraw(layer);},_bringToBack:function(layer){var order=layer._order;var next=order.next;var prev=order.prev;if(prev){prev.next=next;}else{return;}
if(next){next.prev=prev;}else if(prev){this._drawLast=prev;}
order.prev=null;order.next=this._drawFirst;this._drawFirst.prev=order;this._drawFirst=order;this._requestRedraw(layer);}});L.Browser.canvas=(function(){return!!document.createElement('canvas').getContext;}());L.canvas=function(options){return L.Browser.canvas?new L.Canvas(options):null;};L.Polyline.prototype._containsPoint=function(p,closed){var i,j,k,len,len2,part,w=this._clickTolerance();if(!this._pxBounds.contains(p)){return false;}
for(i=0,len=this._parts.length;i<len;i++){part=this._parts[i];for(j=0,len2=part.length,k=len2-1;j<len2;k=j++){if(!closed&&(j===0)){continue;}
if(L.LineUtil.pointToSegmentDistance(p,part[k],part[j])<=w){return true;}}}
return false;};L.Polygon.prototype._containsPoint=function(p){var inside=false,part,p1,p2,i,j,k,len,len2;if(!this._pxBounds.contains(p)){return false;}
for(i=0,len=this._parts.length;i<len;i++){part=this._parts[i];for(j=0,len2=part.length,k=len2-1;j<len2;k=j++){p1=part[j];p2=part[k];if(((p1.y>p.y)!==(p2.y>p.y))&&(p.x<(p2.x-p1.x)*(p.y-p1.y)/(p2.y-p1.y)+p1.x)){inside=!inside;}}}
return inside||L.Polyline.prototype._containsPoint.call(this,p,true);};L.CircleMarker.prototype._containsPoint=function(p){return p.distanceTo(this._point)<=this._radius+this._clickTolerance();};L.GeoJSON=L.FeatureGroup.extend({initialize:function(geojson,options){L.setOptions(this,options);this._layers={};if(geojson){this.addData(geojson);}},addData:function(geojson){var features=L.Util.isArray(geojson)?geojson:geojson.features,i,len,feature;if(features){for(i=0,len=features.length;i<len;i++){feature=features[i];if(feature.geometries||feature.geometry||feature.features||feature.coordinates){this.addData(feature);}}
return this;}
var options=this.options;if(options.filter&&!options.filter(geojson)){return this;}
var layer=L.GeoJSON.geometryToLayer(geojson,options);if(!layer){return this;}
layer.feature=L.GeoJSON.asFeature(geojson);layer.defaultOptions=layer.options;this.resetStyle(layer);if(options.onEachFeature){options.onEachFeature(geojson,layer);}
return this.addLayer(layer);},resetStyle:function(layer){layer.options=L.Util.extend({},layer.defaultOptions);this._setLayerStyle(layer,this.options.style);return this;},setStyle:function(style){return this.eachLayer(function(layer){this._setLayerStyle(layer,style);},this);},_setLayerStyle:function(layer,style){if(typeof style==='function'){style=style(layer.feature);}
if(layer.setStyle){layer.setStyle(style);}}});L.extend(L.GeoJSON,{geometryToLayer:function(geojson,options){var geometry=geojson.type==='Feature'?geojson.geometry:geojson,coords=geometry?geometry.coordinates:null,layers=[],pointToLayer=options&&options.pointToLayer,coordsToLatLng=options&&options.coordsToLatLng||this.coordsToLatLng,latlng,latlngs,i,len;if(!coords&&!geometry){return null;}
switch(geometry.type){case'Point':latlng=coordsToLatLng(coords);return pointToLayer?pointToLayer(geojson,latlng):new L.Marker(latlng);case'MultiPoint':for(i=0,len=coords.length;i<len;i++){latlng=coordsToLatLng(coords[i]);layers.push(pointToLayer?pointToLayer(geojson,latlng):new L.Marker(latlng));}
return new L.FeatureGroup(layers);case'LineString':case'MultiLineString':latlngs=this.coordsToLatLngs(coords,geometry.type==='LineString'?0:1,coordsToLatLng);return new L.Polyline(latlngs,options);case'Polygon':case'MultiPolygon':latlngs=this.coordsToLatLngs(coords,geometry.type==='Polygon'?1:2,coordsToLatLng);return new L.Polygon(latlngs,options);case'GeometryCollection':for(i=0,len=geometry.geometries.length;i<len;i++){var layer=this.geometryToLayer({geometry:geometry.geometries[i],type:'Feature',properties:geojson.properties},options);if(layer){layers.push(layer);}}
return new L.FeatureGroup(layers);default:throw new Error('Invalid GeoJSON object.');}},coordsToLatLng:function(coords){return new L.LatLng(coords[1],coords[0],coords[2]);},coordsToLatLngs:function(coords,levelsDeep,coordsToLatLng){var latlngs=[];for(var i=0,len=coords.length,latlng;i<len;i++){latlng=levelsDeep?this.coordsToLatLngs(coords[i],levelsDeep-1,coordsToLatLng):(coordsToLatLng||this.coordsToLatLng)(coords[i]);latlngs.push(latlng);}
return latlngs;},latLngToCoords:function(latlng){return latlng.alt!==undefined?[latlng.lng,latlng.lat,latlng.alt]:[latlng.lng,latlng.lat];},latLngsToCoords:function(latlngs,levelsDeep,closed){var coords=[];for(var i=0,len=latlngs.length;i<len;i++){coords.push(levelsDeep?L.GeoJSON.latLngsToCoords(latlngs[i],levelsDeep-1,closed):L.GeoJSON.latLngToCoords(latlngs[i]));}
if(!levelsDeep&&closed){coords.push(coords[0]);}
return coords;},getFeature:function(layer,newGeometry){return layer.feature?L.extend({},layer.feature,{geometry:newGeometry}):L.GeoJSON.asFeature(newGeometry);},asFeature:function(geojson){if(geojson.type==='Feature'||geojson.type==='FeatureCollection'){return geojson;}
return{type:'Feature',properties:{},geometry:geojson};}});var PointToGeoJSON={toGeoJSON:function(){return L.GeoJSON.getFeature(this,{type:'Point',coordinates:L.GeoJSON.latLngToCoords(this.getLatLng())});}};L.Marker.include(PointToGeoJSON);L.Circle.include(PointToGeoJSON);L.CircleMarker.include(PointToGeoJSON);L.Polyline.prototype.toGeoJSON=function(){var multi=!L.Polyline._flat(this._latlngs);var coords=L.GeoJSON.latLngsToCoords(this._latlngs,multi?1:0);return L.GeoJSON.getFeature(this,{type:(multi?'Multi':'')+'LineString',coordinates:coords});};L.Polygon.prototype.toGeoJSON=function(){var holes=!L.Polyline._flat(this._latlngs),multi=holes&&!L.Polyline._flat(this._latlngs[0]);var coords=L.GeoJSON.latLngsToCoords(this._latlngs,multi?2:holes?1:0,true);if(!holes){coords=[coords];}
return L.GeoJSON.getFeature(this,{type:(multi?'Multi':'')+'Polygon',coordinates:coords});};L.LayerGroup.include({toMultiPoint:function(){var coords=[];this.eachLayer(function(layer){coords.push(layer.toGeoJSON().geometry.coordinates);});return L.GeoJSON.getFeature(this,{type:'MultiPoint',coordinates:coords});},toGeoJSON:function(){var type=this.feature&&this.feature.geometry&&this.feature.geometry.type;if(type==='MultiPoint'){return this.toMultiPoint();}
var isGeometryCollection=type==='GeometryCollection',jsons=[];this.eachLayer(function(layer){if(layer.toGeoJSON){var json=layer.toGeoJSON();jsons.push(isGeometryCollection?json.geometry:L.GeoJSON.asFeature(json));}});if(isGeometryCollection){return L.GeoJSON.getFeature(this,{geometries:jsons,type:'GeometryCollection'});}
return{type:'FeatureCollection',features:jsons};}});L.geoJSON=function(geojson,options){return new L.GeoJSON(geojson,options);};L.geoJson=L.geoJSON;L.Draggable=L.Evented.extend({options:{clickTolerance:3},statics:{START:L.Browser.touch?['touchstart','mousedown']:['mousedown'],END:{mousedown:'mouseup',touchstart:'touchend',pointerdown:'touchend',MSPointerDown:'touchend'},MOVE:{mousedown:'mousemove',touchstart:'touchmove',pointerdown:'touchmove',MSPointerDown:'touchmove'}},initialize:function(element,dragStartTarget,preventOutline){this._element=element;this._dragStartTarget=dragStartTarget||element;this._preventOutline=preventOutline;},enable:function(){if(this._enabled){return;}
L.DomEvent.on(this._dragStartTarget,L.Draggable.START.join(' '),this._onDown,this);this._enabled=true;},disable:function(){if(!this._enabled){return;}
if(L.Draggable._dragging===this){this.finishDrag();}
L.DomEvent.off(this._dragStartTarget,L.Draggable.START.join(' '),this._onDown,this);this._enabled=false;this._moved=false;},_onDown:function(e){if(e._simulated||!this._enabled){return;}
this._moved=false;if(L.DomUtil.hasClass(this._element,'leaflet-zoom-anim')){return;}
if(L.Draggable._dragging||e.shiftKey||((e.which!==1)&&(e.button!==1)&&!e.touches)){return;}
L.Draggable._dragging=this;if(this._preventOutline){L.DomUtil.preventOutline(this._element);}
L.DomUtil.disableImageDrag();L.DomUtil.disableTextSelection();if(this._moving){return;}
this.fire('down');var first=e.touches?e.touches[0]:e;this._startPoint=new L.Point(first.clientX,first.clientY);L.DomEvent.on(document,L.Draggable.MOVE[e.type],this._onMove,this).on(document,L.Draggable.END[e.type],this._onUp,this);},_onMove:function(e){if(e._simulated||!this._enabled){return;}
if(e.touches&&e.touches.length>1){this._moved=true;return;}
var first=(e.touches&&e.touches.length===1?e.touches[0]:e),newPoint=new L.Point(first.clientX,first.clientY),offset=newPoint.subtract(this._startPoint);if(!offset.x&&!offset.y){return;}
if(Math.abs(offset.x)+Math.abs(offset.y)<this.options.clickTolerance){return;}
L.DomEvent.preventDefault(e);if(!this._moved){this.fire('dragstart');this._moved=true;this._startPos=L.DomUtil.getPosition(this._element).subtract(offset);L.DomUtil.addClass(document.body,'leaflet-dragging');this._lastTarget=e.target||e.srcElement;if((window.SVGElementInstance)&&(this._lastTarget instanceof SVGElementInstance)){this._lastTarget=this._lastTarget.correspondingUseElement;}
L.DomUtil.addClass(this._lastTarget,'leaflet-drag-target');}
this._newPos=this._startPos.add(offset);this._moving=true;L.Util.cancelAnimFrame(this._animRequest);this._lastEvent=e;this._animRequest=L.Util.requestAnimFrame(this._updatePosition,this,true);},_updatePosition:function(){var e={originalEvent:this._lastEvent};this.fire('predrag',e);L.DomUtil.setPosition(this._element,this._newPos);this.fire('drag',e);},_onUp:function(e){if(e._simulated||!this._enabled){return;}
this.finishDrag();},finishDrag:function(){L.DomUtil.removeClass(document.body,'leaflet-dragging');if(this._lastTarget){L.DomUtil.removeClass(this._lastTarget,'leaflet-drag-target');this._lastTarget=null;}
for(var i in L.Draggable.MOVE){L.DomEvent.off(document,L.Draggable.MOVE[i],this._onMove,this).off(document,L.Draggable.END[i],this._onUp,this);}
L.DomUtil.enableImageDrag();L.DomUtil.enableTextSelection();if(this._moved&&this._moving){L.Util.cancelAnimFrame(this._animRequest);this.fire('dragend',{distance:this._newPos.distanceTo(this._startPos)});}
this._moving=false;L.Draggable._dragging=false;}});L.Handler=L.Class.extend({initialize:function(map){this._map=map;},enable:function(){if(this._enabled){return this;}
this._enabled=true;this.addHooks();return this;},disable:function(){if(!this._enabled){return this;}
this._enabled=false;this.removeHooks();return this;},enabled:function(){return!!this._enabled;}});L.Map.mergeOptions({dragging:true,inertia:!L.Browser.android23,inertiaDeceleration:3400,inertiaMaxSpeed:Infinity,easeLinearity:0.2,worldCopyJump:false,maxBoundsViscosity:0.0});L.Map.Drag=L.Handler.extend({addHooks:function(){if(!this._draggable){var map=this._map;this._draggable=new L.Draggable(map._mapPane,map._container);this._draggable.on({down:this._onDown,dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this);this._draggable.on('predrag',this._onPreDragLimit,this);if(map.options.worldCopyJump){this._draggable.on('predrag',this._onPreDragWrap,this);map.on('zoomend',this._onZoomEnd,this);map.whenReady(this._onZoomEnd,this);}}
L.DomUtil.addClass(this._map._container,'leaflet-grab leaflet-touch-drag');this._draggable.enable();this._positions=[];this._times=[];},removeHooks:function(){L.DomUtil.removeClass(this._map._container,'leaflet-grab');L.DomUtil.removeClass(this._map._container,'leaflet-touch-drag');this._draggable.disable();},moved:function(){return this._draggable&&this._draggable._moved;},moving:function(){return this._draggable&&this._draggable._moving;},_onDown:function(){this._map._stop();},_onDragStart:function(){var map=this._map;if(this._map.options.maxBounds&&this._map.options.maxBoundsViscosity){var bounds=L.latLngBounds(this._map.options.maxBounds);this._offsetLimit=L.bounds(this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1).add(this._map.getSize()));this._viscosity=Math.min(1.0,Math.max(0.0,this._map.options.maxBoundsViscosity));}else{this._offsetLimit=null;}
map.fire('movestart').fire('dragstart');if(map.options.inertia){this._positions=[];this._times=[];}},_onDrag:function(e){if(this._map.options.inertia){var time=this._lastTime=+new Date(),pos=this._lastPos=this._draggable._absPos||this._draggable._newPos;this._positions.push(pos);this._times.push(time);if(time-this._times[0]>50){this._positions.shift();this._times.shift();}}
this._map.fire('move',e).fire('drag',e);},_onZoomEnd:function(){var pxCenter=this._map.getSize().divideBy(2),pxWorldCenter=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=pxWorldCenter.subtract(pxCenter).x;this._worldWidth=this._map.getPixelWorldBounds().getSize().x;},_viscousLimit:function(value,threshold){return value-(value-threshold)*this._viscosity;},_onPreDragLimit:function(){if(!this._viscosity||!this._offsetLimit){return;}
var offset=this._draggable._newPos.subtract(this._draggable._startPos);var limit=this._offsetLimit;if(offset.x<limit.min.x){offset.x=this._viscousLimit(offset.x,limit.min.x);}
if(offset.y<limit.min.y){offset.y=this._viscousLimit(offset.y,limit.min.y);}
if(offset.x>limit.max.x){offset.x=this._viscousLimit(offset.x,limit.max.x);}
if(offset.y>limit.max.y){offset.y=this._viscousLimit(offset.y,limit.max.y);}
this._draggable._newPos=this._draggable._startPos.add(offset);},_onPreDragWrap:function(){var worldWidth=this._worldWidth,halfWidth=Math.round(worldWidth/2),dx=this._initialWorldOffset,x=this._draggable._newPos.x,newX1=(x-halfWidth+dx)%worldWidth+halfWidth-dx,newX2=(x+halfWidth+dx)%worldWidth-halfWidth-dx,newX=Math.abs(newX1+dx)<Math.abs(newX2+dx)?newX1:newX2;this._draggable._absPos=this._draggable._newPos.clone();this._draggable._newPos.x=newX;},_onDragEnd:function(e){var map=this._map,options=map.options,noInertia=!options.inertia||this._times.length<2;map.fire('dragend',e);if(noInertia){map.fire('moveend');}else{var direction=this._lastPos.subtract(this._positions[0]),duration=(this._lastTime-this._times[0])/1000,ease=options.easeLinearity,speedVector=direction.multiplyBy(ease/duration),speed=speedVector.distanceTo([0,0]),limitedSpeed=Math.min(options.inertiaMaxSpeed,speed),limitedSpeedVector=speedVector.multiplyBy(limitedSpeed/speed),decelerationDuration=limitedSpeed/(options.inertiaDeceleration*ease),offset=limitedSpeedVector.multiplyBy(-decelerationDuration/2).round();if(!offset.x&&!offset.y){map.fire('moveend');}else{offset=map._limitOffset(offset,map.options.maxBounds);L.Util.requestAnimFrame(function(){map.panBy(offset,{duration:decelerationDuration,easeLinearity:ease,noMoveStart:true,animate:true});});}}}});L.Map.addInitHook('addHandler','dragging',L.Map.Drag);L.Map.mergeOptions({doubleClickZoom:true});L.Map.DoubleClickZoom=L.Handler.extend({addHooks:function(){this._map.on('dblclick',this._onDoubleClick,this);},removeHooks:function(){this._map.off('dblclick',this._onDoubleClick,this);},_onDoubleClick:function(e){var map=this._map,oldZoom=map.getZoom(),delta=map.options.zoomDelta,zoom=e.originalEvent.shiftKey?oldZoom-delta:oldZoom+delta;if(map.options.doubleClickZoom==='center'){map.setZoom(zoom);}else{map.setZoomAround(e.containerPoint,zoom);}}});L.Map.addInitHook('addHandler','doubleClickZoom',L.Map.DoubleClickZoom);L.Map.mergeOptions({scrollWheelZoom:true,wheelDebounceTime:40,wheelPxPerZoomLevel:60});L.Map.ScrollWheelZoom=L.Handler.extend({addHooks:function(){L.DomEvent.on(this._map._container,'mousewheel',this._onWheelScroll,this);this._delta=0;},removeHooks:function(){L.DomEvent.off(this._map._container,'mousewheel',this._onWheelScroll,this);},_onWheelScroll:function(e){var delta=L.DomEvent.getWheelDelta(e);var debounce=this._map.options.wheelDebounceTime;this._delta+=delta;this._lastMousePos=this._map.mouseEventToContainerPoint(e);if(!this._startTime){this._startTime=+new Date();}
var left=Math.max(debounce-(+new Date()-this._startTime),0);clearTimeout(this._timer);this._timer=setTimeout(L.bind(this._performZoom,this),left);L.DomEvent.stop(e);},_performZoom:function(){var map=this._map,zoom=map.getZoom(),snap=this._map.options.zoomSnap||0;map._stop();var d2=this._delta/(this._map.options.wheelPxPerZoomLevel*4),d3=4*Math.log(2/(1+Math.exp(-Math.abs(d2))))/Math.LN2,d4=snap?Math.ceil(d3/snap)*snap:d3,delta=map._limitZoom(zoom+(this._delta>0?d4:-d4))-zoom;this._delta=0;this._startTime=null;if(!delta){return;}
if(map.options.scrollWheelZoom==='center'){map.setZoom(zoom+delta);}else{map.setZoomAround(this._lastMousePos,zoom+delta);}}});L.Map.addInitHook('addHandler','scrollWheelZoom',L.Map.ScrollWheelZoom);L.extend(L.DomEvent,{_touchstart:L.Browser.msPointer?'MSPointerDown':L.Browser.pointer?'pointerdown':'touchstart',_touchend:L.Browser.msPointer?'MSPointerUp':L.Browser.pointer?'pointerup':'touchend',addDoubleTapListener:function(obj,handler,id){var last,touch,doubleTap=false,delay=250;function onTouchStart(e){var count;if(L.Browser.pointer){if((!L.Browser.edge)||e.pointerType==='mouse'){return;}
count=L.DomEvent._pointersCount;}else{count=e.touches.length;}
if(count>1){return;}
var now=Date.now(),delta=now-(last||now);touch=e.touches?e.touches[0]:e;doubleTap=(delta>0&&delta<=delay);last=now;}
function onTouchEnd(e){if(doubleTap&&!touch.cancelBubble){if(L.Browser.pointer){if((!L.Browser.edge)||e.pointerType==='mouse'){return;}
var newTouch={},prop,i;for(i in touch){prop=touch[i];newTouch[i]=prop&&prop.bind?prop.bind(touch):prop;}
touch=newTouch;}
touch.type='dblclick';handler(touch);last=null;}}
var pre='_leaflet_',touchstart=this._touchstart,touchend=this._touchend;obj[pre+touchstart+id]=onTouchStart;obj[pre+touchend+id]=onTouchEnd;obj[pre+'dblclick'+id]=handler;obj.addEventListener(touchstart,onTouchStart,false);obj.addEventListener(touchend,onTouchEnd,false);obj.addEventListener('dblclick',handler,false);return this;},removeDoubleTapListener:function(obj,id){var pre='_leaflet_',touchstart=obj[pre+this._touchstart+id],touchend=obj[pre+this._touchend+id],dblclick=obj[pre+'dblclick'+id];obj.removeEventListener(this._touchstart,touchstart,false);obj.removeEventListener(this._touchend,touchend,false);if(!L.Browser.edge){obj.removeEventListener('dblclick',dblclick,false);}
return this;}});L.extend(L.DomEvent,{POINTER_DOWN:L.Browser.msPointer?'MSPointerDown':'pointerdown',POINTER_MOVE:L.Browser.msPointer?'MSPointerMove':'pointermove',POINTER_UP:L.Browser.msPointer?'MSPointerUp':'pointerup',POINTER_CANCEL:L.Browser.msPointer?'MSPointerCancel':'pointercancel',TAG_WHITE_LIST:['INPUT','SELECT','OPTION'],_pointers:{},_pointersCount:0,addPointerListener:function(obj,type,handler,id){if(type==='touchstart'){this._addPointerStart(obj,handler,id);}else if(type==='touchmove'){this._addPointerMove(obj,handler,id);}else if(type==='touchend'){this._addPointerEnd(obj,handler,id);}
return this;},removePointerListener:function(obj,type,id){var handler=obj['_leaflet_'+type+id];if(type==='touchstart'){obj.removeEventListener(this.POINTER_DOWN,handler,false);}else if(type==='touchmove'){obj.removeEventListener(this.POINTER_MOVE,handler,false);}else if(type==='touchend'){obj.removeEventListener(this.POINTER_UP,handler,false);obj.removeEventListener(this.POINTER_CANCEL,handler,false);}
return this;},_addPointerStart:function(obj,handler,id){var onDown=L.bind(function(e){if(e.pointerType!=='mouse'&&e.MSPOINTER_TYPE_MOUSE&&e.pointerType!==e.MSPOINTER_TYPE_MOUSE){if(this.TAG_WHITE_LIST.indexOf(e.target.tagName)<0){L.DomEvent.preventDefault(e);}else{return;}}
this._handlePointer(e,handler);},this);obj['_leaflet_touchstart'+id]=onDown;obj.addEventListener(this.POINTER_DOWN,onDown,false);if(!this._pointerDocListener){var pointerUp=L.bind(this._globalPointerUp,this);document.documentElement.addEventListener(this.POINTER_DOWN,L.bind(this._globalPointerDown,this),true);document.documentElement.addEventListener(this.POINTER_MOVE,L.bind(this._globalPointerMove,this),true);document.documentElement.addEventListener(this.POINTER_UP,pointerUp,true);document.documentElement.addEventListener(this.POINTER_CANCEL,pointerUp,true);this._pointerDocListener=true;}},_globalPointerDown:function(e){this._pointers[e.pointerId]=e;this._pointersCount++;},_globalPointerMove:function(e){if(this._pointers[e.pointerId]){this._pointers[e.pointerId]=e;}},_globalPointerUp:function(e){delete this._pointers[e.pointerId];this._pointersCount--;},_handlePointer:function(e,handler){e.touches=[];for(var i in this._pointers){e.touches.push(this._pointers[i]);}
e.changedTouches=[e];handler(e);},_addPointerMove:function(obj,handler,id){var onMove=L.bind(function(e){if((e.pointerType===e.MSPOINTER_TYPE_MOUSE||e.pointerType==='mouse')&&e.buttons===0){return;}
this._handlePointer(e,handler);},this);obj['_leaflet_touchmove'+id]=onMove;obj.addEventListener(this.POINTER_MOVE,onMove,false);},_addPointerEnd:function(obj,handler,id){var onUp=L.bind(function(e){this._handlePointer(e,handler);},this);obj['_leaflet_touchend'+id]=onUp;obj.addEventListener(this.POINTER_UP,onUp,false);obj.addEventListener(this.POINTER_CANCEL,onUp,false);}});L.Map.mergeOptions({touchZoom:L.Browser.touch&&!L.Browser.android23,bounceAtZoomLimits:true});L.Map.TouchZoom=L.Handler.extend({addHooks:function(){L.DomUtil.addClass(this._map._container,'leaflet-touch-zoom');L.DomEvent.on(this._map._container,'touchstart',this._onTouchStart,this);},removeHooks:function(){L.DomUtil.removeClass(this._map._container,'leaflet-touch-zoom');L.DomEvent.off(this._map._container,'touchstart',this._onTouchStart,this);},_onTouchStart:function(e){var map=this._map;if(!e.touches||e.touches.length!==2||map._animatingZoom||this._zooming){return;}
var p1=map.mouseEventToContainerPoint(e.touches[0]),p2=map.mouseEventToContainerPoint(e.touches[1]);this._centerPoint=map.getSize()._divideBy(2);this._startLatLng=map.containerPointToLatLng(this._centerPoint);if(map.options.touchZoom!=='center'){this._pinchStartLatLng=map.containerPointToLatLng(p1.add(p2)._divideBy(2));}
this._startDist=p1.distanceTo(p2);this._startZoom=map.getZoom();this._moved=false;this._zooming=true;map._stop();L.DomEvent.on(document,'touchmove',this._onTouchMove,this).on(document,'touchend',this._onTouchEnd,this);L.DomEvent.preventDefault(e);},_onTouchMove:function(e){if(!e.touches||e.touches.length!==2||!this._zooming){return;}
var map=this._map,p1=map.mouseEventToContainerPoint(e.touches[0]),p2=map.mouseEventToContainerPoint(e.touches[1]),scale=p1.distanceTo(p2)/this._startDist;this._zoom=map.getScaleZoom(scale,this._startZoom);if(!map.options.bounceAtZoomLimits&&((this._zoom<map.getMinZoom()&&scale<1)||(this._zoom>map.getMaxZoom()&&scale>1))){this._zoom=map._limitZoom(this._zoom);}
if(map.options.touchZoom==='center'){this._center=this._startLatLng;if(scale===1){return;}}else{var delta=p1._add(p2)._divideBy(2)._subtract(this._centerPoint);if(scale===1&&delta.x===0&&delta.y===0){return;}
this._center=map.unproject(map.project(this._pinchStartLatLng,this._zoom).subtract(delta),this._zoom);}
if(!this._moved){map._moveStart(true);this._moved=true;}
L.Util.cancelAnimFrame(this._animRequest);var moveFn=L.bind(map._move,map,this._center,this._zoom,{pinch:true,round:false});this._animRequest=L.Util.requestAnimFrame(moveFn,this,true);L.DomEvent.preventDefault(e);},_onTouchEnd:function(){if(!this._moved||!this._zooming){this._zooming=false;return;}
this._zooming=false;L.Util.cancelAnimFrame(this._animRequest);L.DomEvent.off(document,'touchmove',this._onTouchMove).off(document,'touchend',this._onTouchEnd);if(this._map.options.zoomAnimation){this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),true,this._map.options.zoomSnap);}else{this._map._resetView(this._center,this._map._limitZoom(this._zoom));}}});L.Map.addInitHook('addHandler','touchZoom',L.Map.TouchZoom);L.Map.mergeOptions({tap:true,tapTolerance:15});L.Map.Tap=L.Handler.extend({addHooks:function(){L.DomEvent.on(this._map._container,'touchstart',this._onDown,this);},removeHooks:function(){L.DomEvent.off(this._map._container,'touchstart',this._onDown,this);},_onDown:function(e){if(!e.touches){return;}
L.DomEvent.preventDefault(e);this._fireClick=true;if(e.touches.length>1){this._fireClick=false;clearTimeout(this._holdTimeout);return;}
var first=e.touches[0],el=first.target;this._startPos=this._newPos=new L.Point(first.clientX,first.clientY);if(el.tagName&&el.tagName.toLowerCase()==='a'){L.DomUtil.addClass(el,'leaflet-active');}
this._holdTimeout=setTimeout(L.bind(function(){if(this._isTapValid()){this._fireClick=false;this._onUp();this._simulateEvent('contextmenu',first);}},this),1000);this._simulateEvent('mousedown',first);L.DomEvent.on(document,{touchmove:this._onMove,touchend:this._onUp},this);},_onUp:function(e){clearTimeout(this._holdTimeout);L.DomEvent.off(document,{touchmove:this._onMove,touchend:this._onUp},this);if(this._fireClick&&e&&e.changedTouches){var first=e.changedTouches[0],el=first.target;if(el&&el.tagName&&el.tagName.toLowerCase()==='a'){L.DomUtil.removeClass(el,'leaflet-active');}
this._simulateEvent('mouseup',first);if(this._isTapValid()){this._simulateEvent('click',first);}}},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance;},_onMove:function(e){var first=e.touches[0];this._newPos=new L.Point(first.clientX,first.clientY);this._simulateEvent('mousemove',first);},_simulateEvent:function(type,e){var simulatedEvent=document.createEvent('MouseEvents');simulatedEvent._simulated=true;e.target._simulatedClick=true;simulatedEvent.initMouseEvent(type,true,true,window,1,e.screenX,e.screenY,e.clientX,e.clientY,false,false,false,false,0,null);e.target.dispatchEvent(simulatedEvent);}});if(L.Browser.touch&&!L.Browser.pointer){L.Map.addInitHook('addHandler','tap',L.Map.Tap);}
L.Map.mergeOptions({boxZoom:true});L.Map.BoxZoom=L.Handler.extend({initialize:function(map){this._map=map;this._container=map._container;this._pane=map._panes.overlayPane;},addHooks:function(){L.DomEvent.on(this._container,'mousedown',this._onMouseDown,this);},removeHooks:function(){L.DomEvent.off(this._container,'mousedown',this._onMouseDown,this);},moved:function(){return this._moved;},_resetState:function(){this._moved=false;},_onMouseDown:function(e){if(!e.shiftKey||((e.which!==1)&&(e.button!==1))){return false;}
this._resetState();L.DomUtil.disableTextSelection();L.DomUtil.disableImageDrag();this._startPoint=this._map.mouseEventToContainerPoint(e);L.DomEvent.on(document,{contextmenu:L.DomEvent.stop,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this);},_onMouseMove:function(e){if(!this._moved){this._moved=true;this._box=L.DomUtil.create('div','leaflet-zoom-box',this._container);L.DomUtil.addClass(this._container,'leaflet-crosshair');this._map.fire('boxzoomstart');}
this._point=this._map.mouseEventToContainerPoint(e);var bounds=new L.Bounds(this._point,this._startPoint),size=bounds.getSize();L.DomUtil.setPosition(this._box,bounds.min);this._box.style.width=size.x+'px';this._box.style.height=size.y+'px';},_finish:function(){if(this._moved){L.DomUtil.remove(this._box);L.DomUtil.removeClass(this._container,'leaflet-crosshair');}
L.DomUtil.enableTextSelection();L.DomUtil.enableImageDrag();L.DomEvent.off(document,{contextmenu:L.DomEvent.stop,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this);},_onMouseUp:function(e){if((e.which!==1)&&(e.button!==1)){return;}
this._finish();if(!this._moved){return;}
setTimeout(L.bind(this._resetState,this),0);var bounds=new L.LatLngBounds(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point));this._map.fitBounds(bounds).fire('boxzoomend',{boxZoomBounds:bounds});},_onKeyDown:function(e){if(e.keyCode===27){this._finish();}}});L.Map.addInitHook('addHandler','boxZoom',L.Map.BoxZoom);L.Map.mergeOptions({keyboard:true,keyboardPanDelta:80});L.Map.Keyboard=L.Handler.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(map){this._map=map;this._setPanDelta(map.options.keyboardPanDelta);this._setZoomDelta(map.options.zoomDelta);},addHooks:function(){var container=this._map._container;if(container.tabIndex<=0){container.tabIndex='0';}
L.DomEvent.on(container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this);this._map.on({focus:this._addHooks,blur:this._removeHooks},this);},removeHooks:function(){this._removeHooks();L.DomEvent.off(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this);this._map.off({focus:this._addHooks,blur:this._removeHooks},this);},_onMouseDown:function(){if(this._focused){return;}
var body=document.body,docEl=document.documentElement,top=body.scrollTop||docEl.scrollTop,left=body.scrollLeft||docEl.scrollLeft;this._map._container.focus();window.scrollTo(left,top);},_onFocus:function(){this._focused=true;this._map.fire('focus');},_onBlur:function(){this._focused=false;this._map.fire('blur');},_setPanDelta:function(panDelta){var keys=this._panKeys={},codes=this.keyCodes,i,len;for(i=0,len=codes.left.length;i<len;i++){keys[codes.left[i]]=[-1*panDelta,0];}
for(i=0,len=codes.right.length;i<len;i++){keys[codes.right[i]]=[panDelta,0];}
for(i=0,len=codes.down.length;i<len;i++){keys[codes.down[i]]=[0,panDelta];}
for(i=0,len=codes.up.length;i<len;i++){keys[codes.up[i]]=[0,-1*panDelta];}},_setZoomDelta:function(zoomDelta){var keys=this._zoomKeys={},codes=this.keyCodes,i,len;for(i=0,len=codes.zoomIn.length;i<len;i++){keys[codes.zoomIn[i]]=zoomDelta;}
for(i=0,len=codes.zoomOut.length;i<len;i++){keys[codes.zoomOut[i]]=-zoomDelta;}},_addHooks:function(){L.DomEvent.on(document,'keydown',this._onKeyDown,this);},_removeHooks:function(){L.DomEvent.off(document,'keydown',this._onKeyDown,this);},_onKeyDown:function(e){if(e.altKey||e.ctrlKey||e.metaKey){return;}
var key=e.keyCode,map=this._map,offset;if(key in this._panKeys){if(map._panAnim&&map._panAnim._inProgress){return;}
offset=this._panKeys[key];if(e.shiftKey){offset=L.point(offset).multiplyBy(3);}
map.panBy(offset);if(map.options.maxBounds){map.panInsideBounds(map.options.maxBounds);}}else if(key in this._zoomKeys){map.setZoom(map.getZoom()+(e.shiftKey?3:1)*this._zoomKeys[key]);}else if(key===27){map.closePopup();}else{return;}
L.DomEvent.stop(e);}});L.Map.addInitHook('addHandler','keyboard',L.Map.Keyboard);L.Handler.MarkerDrag=L.Handler.extend({initialize:function(marker){this._marker=marker;},addHooks:function(){var icon=this._marker._icon;if(!this._draggable){this._draggable=new L.Draggable(icon,icon,true);}
this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this).enable();L.DomUtil.addClass(icon,'leaflet-marker-draggable');},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this).disable();if(this._marker._icon){L.DomUtil.removeClass(this._marker._icon,'leaflet-marker-draggable');}},moved:function(){return this._draggable&&this._draggable._moved;},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng();this._marker.closePopup().fire('movestart').fire('dragstart');},_onDrag:function(e){var marker=this._marker,shadow=marker._shadow,iconPos=L.DomUtil.getPosition(marker._icon),latlng=marker._map.layerPointToLatLng(iconPos);if(shadow){L.DomUtil.setPosition(shadow,iconPos);}
marker._latlng=latlng;e.latlng=latlng;e.oldLatLng=this._oldLatLng;marker.fire('move',e).fire('drag',e);},_onDragEnd:function(e){delete this._oldLatLng;this._marker.fire('moveend').fire('dragend',e);}});L.Control=L.Class.extend({options:{position:'topright'},initialize:function(options){L.setOptions(this,options);},getPosition:function(){return this.options.position;},setPosition:function(position){var map=this._map;if(map){map.removeControl(this);}
this.options.position=position;if(map){map.addControl(this);}
return this;},getContainer:function(){return this._container;},addTo:function(map){this.remove();this._map=map;var container=this._container=this.onAdd(map),pos=this.getPosition(),corner=map._controlCorners[pos];L.DomUtil.addClass(container,'leaflet-control');if(pos.indexOf('bottom')!==-1){corner.insertBefore(container,corner.firstChild);}else{corner.appendChild(container);}
return this;},remove:function(){if(!this._map){return this;}
L.DomUtil.remove(this._container);if(this.onRemove){this.onRemove(this._map);}
this._map=null;return this;},_refocusOnMap:function(e){if(this._map&&e&&e.screenX>0&&e.screenY>0){this._map.getContainer().focus();}}});L.control=function(options){return new L.Control(options);};L.Map.include({addControl:function(control){control.addTo(this);return this;},removeControl:function(control){control.remove();return this;},_initControlPos:function(){var corners=this._controlCorners={},l='leaflet-',container=this._controlContainer=L.DomUtil.create('div',l+'control-container',this._container);function createCorner(vSide,hSide){var className=l+vSide+' '+l+hSide;corners[vSide+hSide]=L.DomUtil.create('div',className,container);}
createCorner('top','left');createCorner('top','right');createCorner('bottom','left');createCorner('bottom','right');},_clearControlPos:function(){L.DomUtil.remove(this._controlContainer);}});L.Control.Zoom=L.Control.extend({options:{position:'topleft',zoomInText:'+',zoomInTitle:'Zoom in',zoomOutText:'-',zoomOutTitle:'Zoom out'},onAdd:function(map){var zoomName='leaflet-control-zoom',container=L.DomUtil.create('div',zoomName+' leaflet-bar'),options=this.options;this._zoomInButton=this._createButton(options.zoomInText,options.zoomInTitle,zoomName+'-in',container,this._zoomIn);this._zoomOutButton=this._createButton(options.zoomOutText,options.zoomOutTitle,zoomName+'-out',container,this._zoomOut);this._updateDisabled();map.on('zoomend zoomlevelschange',this._updateDisabled,this);return container;},onRemove:function(map){map.off('zoomend zoomlevelschange',this._updateDisabled,this);},disable:function(){this._disabled=true;this._updateDisabled();return this;},enable:function(){this._disabled=false;this._updateDisabled();return this;},_zoomIn:function(e){if(!this._disabled&&this._map._zoom<this._map.getMaxZoom()){this._map.zoomIn(this._map.options.zoomDelta*(e.shiftKey?3:1));}},_zoomOut:function(e){if(!this._disabled&&this._map._zoom>this._map.getMinZoom()){this._map.zoomOut(this._map.options.zoomDelta*(e.shiftKey?3:1));}},_createButton:function(html,title,className,container,fn){var link=L.DomUtil.create('a',className,container);link.innerHTML=html;link.href='#';link.title=title;link.setAttribute('role','button');link.setAttribute('aria-label',title);L.DomEvent.on(link,'mousedown dblclick',L.DomEvent.stopPropagation).on(link,'click',L.DomEvent.stop).on(link,'click',fn,this).on(link,'click',this._refocusOnMap,this);return link;},_updateDisabled:function(){var map=this._map,className='leaflet-disabled';L.DomUtil.removeClass(this._zoomInButton,className);L.DomUtil.removeClass(this._zoomOutButton,className);if(this._disabled||map._zoom===map.getMinZoom()){L.DomUtil.addClass(this._zoomOutButton,className);}
if(this._disabled||map._zoom===map.getMaxZoom()){L.DomUtil.addClass(this._zoomInButton,className);}}});L.Map.mergeOptions({zoomControl:true});L.Map.addInitHook(function(){if(this.options.zoomControl){this.zoomControl=new L.Control.Zoom();this.addControl(this.zoomControl);}});L.control.zoom=function(options){return new L.Control.Zoom(options);};L.Control.Attribution=L.Control.extend({options:{position:'bottomright',prefix:'<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'},initialize:function(options){L.setOptions(this,options);this._attributions={};},onAdd:function(map){map.attributionControl=this;this._container=L.DomUtil.create('div','leaflet-control-attribution');if(L.DomEvent){L.DomEvent.disableClickPropagation(this._container);}
for(var i in map._layers){if(map._layers[i].getAttribution){this.addAttribution(map._layers[i].getAttribution());}}
this._update();return this._container;},setPrefix:function(prefix){this.options.prefix=prefix;this._update();return this;},addAttribution:function(text){if(!text){return this;}
if(!this._attributions[text]){this._attributions[text]=0;}
this._attributions[text]++;this._update();return this;},removeAttribution:function(text){if(!text){return this;}
if(this._attributions[text]){this._attributions[text]--;this._update();}
return this;},_update:function(){if(!this._map){return;}
var attribs=[];for(var i in this._attributions){if(this._attributions[i]){attribs.push(i);}}
var prefixAndAttribs=[];if(this.options.prefix){prefixAndAttribs.push(this.options.prefix);}
if(attribs.length){prefixAndAttribs.push(attribs.join(', '));}
this._container.innerHTML=prefixAndAttribs.join(' | ');}});L.Map.mergeOptions({attributionControl:true});L.Map.addInitHook(function(){if(this.options.attributionControl){new L.Control.Attribution().addTo(this);}});L.control.attribution=function(options){return new L.Control.Attribution(options);};L.Control.Scale=L.Control.extend({options:{position:'bottomleft',maxWidth:100,metric:true,imperial:true},onAdd:function(map){var className='leaflet-control-scale',container=L.DomUtil.create('div',className),options=this.options;this._addScales(options,className+'-line',container);map.on(options.updateWhenIdle?'moveend':'move',this._update,this);map.whenReady(this._update,this);return container;},onRemove:function(map){map.off(this.options.updateWhenIdle?'moveend':'move',this._update,this);},_addScales:function(options,className,container){if(options.metric){this._mScale=L.DomUtil.create('div',className,container);}
if(options.imperial){this._iScale=L.DomUtil.create('div',className,container);}},_update:function(){var map=this._map,y=map.getSize().y/2;var maxMeters=map.distance(map.containerPointToLatLng([0,y]),map.containerPointToLatLng([this.options.maxWidth,y]));this._updateScales(maxMeters);},_updateScales:function(maxMeters){if(this.options.metric&&maxMeters){this._updateMetric(maxMeters);}
if(this.options.imperial&&maxMeters){this._updateImperial(maxMeters);}},_updateMetric:function(maxMeters){var meters=this._getRoundNum(maxMeters),label=meters<1000?meters+' m':(meters/1000)+' km';this._updateScale(this._mScale,label,meters/maxMeters);},_updateImperial:function(maxMeters){var maxFeet=maxMeters*3.2808399,maxMiles,miles,feet;if(maxFeet>5280){maxMiles=maxFeet/5280;miles=this._getRoundNum(maxMiles);this._updateScale(this._iScale,miles+' mi',miles/maxMiles);}else{feet=this._getRoundNum(maxFeet);this._updateScale(this._iScale,feet+' ft',feet/maxFeet);}},_updateScale:function(scale,text,ratio){scale.style.width=Math.round(this.options.maxWidth*ratio)+'px';scale.innerHTML=text;},_getRoundNum:function(num){var pow10=Math.pow(10,(Math.floor(num)+'').length-1),d=num/pow10;d=d>=10?10:d>=5?5:d>=3?3:d>=2?2:1;return pow10*d;}});L.control.scale=function(options){return new L.Control.Scale(options);};L.Control.Layers=L.Control.extend({options:{collapsed:true,position:'topright',autoZIndex:true,hideSingleBase:false,sortLayers:false,sortFunction:function(layerA,layerB,nameA,nameB){return nameA<nameB?-1:(nameB<nameA?1:0);}},initialize:function(baseLayers,overlays,options){L.setOptions(this,options);this._layers=[];this._lastZIndex=0;this._handlingClick=false;for(var i in baseLayers){this._addLayer(baseLayers[i],i);}
for(i in overlays){this._addLayer(overlays[i],i,true);}},onAdd:function(map){this._initLayout();this._update();this._map=map;map.on('zoomend',this._checkDisabledLayers,this);return this._container;},onRemove:function(){this._map.off('zoomend',this._checkDisabledLayers,this);for(var i=0;i<this._layers.length;i++){this._layers[i].layer.off('add remove',this._onLayerChange,this);}},addBaseLayer:function(layer,name){this._addLayer(layer,name);return(this._map)?this._update():this;},addOverlay:function(layer,name){this._addLayer(layer,name,true);return(this._map)?this._update():this;},removeLayer:function(layer){layer.off('add remove',this._onLayerChange,this);var obj=this._getLayer(L.stamp(layer));if(obj){this._layers.splice(this._layers.indexOf(obj),1);}
return(this._map)?this._update():this;},expand:function(){L.DomUtil.addClass(this._container,'leaflet-control-layers-expanded');this._form.style.height=null;var acceptableHeight=this._map.getSize().y-(this._container.offsetTop+50);if(acceptableHeight<this._form.clientHeight){L.DomUtil.addClass(this._form,'leaflet-control-layers-scrollbar');this._form.style.height=acceptableHeight+'px';}else{L.DomUtil.removeClass(this._form,'leaflet-control-layers-scrollbar');}
this._checkDisabledLayers();return this;},collapse:function(){L.DomUtil.removeClass(this._container,'leaflet-control-layers-expanded');return this;},_initLayout:function(){var className='leaflet-control-layers',container=this._container=L.DomUtil.create('div',className),collapsed=this.options.collapsed;container.setAttribute('aria-haspopup',true);L.DomEvent.disableClickPropagation(container);if(!L.Browser.touch){L.DomEvent.disableScrollPropagation(container);}
var form=this._form=L.DomUtil.create('form',className+'-list');if(collapsed){this._map.on('click',this.collapse,this);if(!L.Browser.android){L.DomEvent.on(container,{mouseenter:this.expand,mouseleave:this.collapse},this);}}
var link=this._layersLink=L.DomUtil.create('a',className+'-toggle',container);link.href='#';link.title='Layers';if(L.Browser.touch){L.DomEvent.on(link,'click',L.DomEvent.stop).on(link,'click',this.expand,this);}else{L.DomEvent.on(link,'focus',this.expand,this);}
L.DomEvent.on(form,'click',function(){setTimeout(L.bind(this._onInputClick,this),0);},this);if(!collapsed){this.expand();}
this._baseLayersList=L.DomUtil.create('div',className+'-base',form);this._separator=L.DomUtil.create('div',className+'-separator',form);this._overlaysList=L.DomUtil.create('div',className+'-overlays',form);container.appendChild(form);},_getLayer:function(id){for(var i=0;i<this._layers.length;i++){if(this._layers[i]&&L.stamp(this._layers[i].layer)===id){return this._layers[i];}}},_addLayer:function(layer,name,overlay){layer.on('add remove',this._onLayerChange,this);this._layers.push({layer:layer,name:name,overlay:overlay});if(this.options.sortLayers){this._layers.sort(L.bind(function(a,b){return this.options.sortFunction(a.layer,b.layer,a.name,b.name);},this));}
if(this.options.autoZIndex&&layer.setZIndex){this._lastZIndex++;layer.setZIndex(this._lastZIndex);}},_update:function(){if(!this._container){return this;}
L.DomUtil.empty(this._baseLayersList);L.DomUtil.empty(this._overlaysList);var baseLayersPresent,overlaysPresent,i,obj,baseLayersCount=0;for(i=0;i<this._layers.length;i++){obj=this._layers[i];this._addItem(obj);overlaysPresent=overlaysPresent||obj.overlay;baseLayersPresent=baseLayersPresent||!obj.overlay;baseLayersCount+=!obj.overlay?1:0;}
if(this.options.hideSingleBase){baseLayersPresent=baseLayersPresent&&baseLayersCount>1;this._baseLayersList.style.display=baseLayersPresent?'':'none';}
this._separator.style.display=overlaysPresent&&baseLayersPresent?'':'none';return this;},_onLayerChange:function(e){if(!this._handlingClick){this._update();}
var obj=this._getLayer(L.stamp(e.target));var type=obj.overlay?(e.type==='add'?'overlayadd':'overlayremove'):(e.type==='add'?'baselayerchange':null);if(type){this._map.fire(type,obj);}},_createRadioElement:function(name,checked){var radioHtml='<input type="radio" class="leaflet-control-layers-selector" name="'+
name+'"'+(checked?' checked="checked"':'')+'/>';var radioFragment=document.createElement('div');radioFragment.innerHTML=radioHtml;return radioFragment.firstChild;},_addItem:function(obj){var label=document.createElement('label'),checked=this._map.hasLayer(obj.layer),input;if(obj.overlay){input=document.createElement('input');input.type='checkbox';input.className='leaflet-control-layers-selector';input.defaultChecked=checked;}else{input=this._createRadioElement('leaflet-base-layers',checked);}
input.layerId=L.stamp(obj.layer);L.DomEvent.on(input,'click',this._onInputClick,this);var name=document.createElement('span');name.innerHTML=' '+obj.name;var holder=document.createElement('div');label.appendChild(holder);holder.appendChild(input);holder.appendChild(name);var container=obj.overlay?this._overlaysList:this._baseLayersList;container.appendChild(label);this._checkDisabledLayers();return label;},_onInputClick:function(){var inputs=this._form.getElementsByTagName('input'),input,layer,hasLayer;var addedLayers=[],removedLayers=[];this._handlingClick=true;for(var i=inputs.length-1;i>=0;i--){input=inputs[i];layer=this._getLayer(input.layerId).layer;hasLayer=this._map.hasLayer(layer);if(input.checked&&!hasLayer){addedLayers.push(layer);}else if(!input.checked&&hasLayer){removedLayers.push(layer);}}
for(i=0;i<removedLayers.length;i++){this._map.removeLayer(removedLayers[i]);}
for(i=0;i<addedLayers.length;i++){this._map.addLayer(addedLayers[i]);}
this._handlingClick=false;this._refocusOnMap();},_checkDisabledLayers:function(){var inputs=this._form.getElementsByTagName('input'),input,layer,zoom=this._map.getZoom();for(var i=inputs.length-1;i>=0;i--){input=inputs[i];layer=this._getLayer(input.layerId).layer;input.disabled=(layer.options.minZoom!==undefined&&zoom<layer.options.minZoom)||(layer.options.maxZoom!==undefined&&zoom>layer.options.maxZoom);}},_expand:function(){return this.expand();},_collapse:function(){return this.collapse();}});L.control.layers=function(baseLayers,overlays,options){return new L.Control.Layers(baseLayers,overlays,options);};}(window,document));

// A Leaflet plugin to animated a Marker along a polyline
// http://openplans.github.com/Leaflet.AnimatedMarker/

L.AnimatedMarker = L.Marker.extend({
    options: {
        // meters
        distance: 200,
        // ms
        interval: 1000,
        // animate on add?
        autoStart: true,
        // callback onend
        onEnd: function(){},
        clickable: false
    },

    initialize: function (latlngs, options) {
        this.setLine(latlngs);
        L.Marker.prototype.initialize.call(this, latlngs[0], options);
    },

    // Breaks the line up into tiny chunks (see options) ONLY if CSS3 animations
    // are not supported.
    _chunk: function(latlngs) {
        var i,
                len = latlngs.length,
                chunkedLatLngs = [];

        for (i=1;i<len;i++) {
            var cur = latlngs[i-1],
                    next = latlngs[i],
                    dist = cur.distanceTo(next),
                    factor = this.options.distance / dist,
                    dLat = factor * (next.lat - cur.lat),
                    dLng = factor * (next.lng - cur.lng);

            if (dist > this.options.distance) {
                while (dist > this.options.distance) {
                    cur = new L.LatLng(cur.lat + dLat, cur.lng + dLng);
                    dist = cur.distanceTo(next);
                    chunkedLatLngs.push(cur);
                }
            } else {
                chunkedLatLngs.push(cur);
            }
        }
        chunkedLatLngs.push(latlngs[len-1]);

        return chunkedLatLngs;
    },

    onAdd: function (map) {
        L.Marker.prototype.onAdd.call(this, map);

        // Start animating when added to the map
        if (this.options.autoStart) {
            this.start();
        }
    },

    animate: function() {
        var self = this,
                len = this._latlngs.length,
                speed = this.options.interval;

        // Normalize the transition speed from vertex to vertex
        if (this._i < len && this._i > 0) {
            speed = this._latlngs[this._i-1].distanceTo(this._latlngs[this._i]) / this.options.distance * this.options.interval;
        }

        // Only if CSS3 transitions are supported
        if (L.DomUtil.TRANSITION) {
            if (this._icon) { this._icon.style[L.DomUtil.TRANSITION] = ('all ' + speed + 'ms linear'); }
            if (this._shadow) { this._shadow.style[L.DomUtil.TRANSITION] = 'all ' + speed + 'ms linear'; }
        }

        // Move to the next vertex
        this.setLatLng(this._latlngs[this._i]);
        this._i++;

        // Queue up the animation to the next next vertex
        this._tid = setTimeout(function(){
            if (self._i === len) {
                self.options.onEnd.apply(self, Array.prototype.slice.call(arguments));
            } else {
                self.animate();
            }
        }, speed);
    },

    // Start the animation
    start: function() {
        this.animate();
    },

    // Stop the animation in place
    stop: function() {
        if (this._tid) {
            clearTimeout(this._tid);
        }
    },

    setLine: function(latlngs){
        if (L.DomUtil.TRANSITION) {
            // No need to to check up the line if we can animate using CSS3
            this._latlngs = latlngs;
        } else {
            // Chunk up the lines into options.distance bits
            this._latlngs = this._chunk(latlngs);
            this.options.distance = 10;
            this.options.interval = 30;
        }
        this._i = 0;
    }

});

L.animatedMarker = function (latlngs, options) {
    return new L.AnimatedMarker(latlngs, options);
};

// end animated marker plugin

L.Control.Zoomslider = (function () {

	var Knob = L.Draggable.extend({
		initialize: function (element, stepHeight, knobHeight) {
			L.Draggable.prototype.initialize.call(this, element, element);
			this._element = element;

			this._stepHeight = stepHeight;
			this._knobHeight = knobHeight;

			this.on('predrag', function () {
				this._newPos.x = 0;
				this._newPos.y = this._adjust(this._newPos.y);
			}, this);
		},

		_adjust: function (y) {
			var value = Math.round(this._toValue(y));
			value = Math.max(0, Math.min(this._maxValue, value));
			return this._toY(value);
		},

		// y = k*v + m
		_toY: function (value) {
			return this._k * value + this._m;
		},
		// v = (y - m) / k
		_toValue: function (y) {
			return (y - this._m) / this._k;
		},

		setSteps: function (steps) {
			var sliderHeight = steps * this._stepHeight;
			this._maxValue = steps - 1;

			// conversion parameters
			// the conversion is just a common linear function.
            this._k = -this._stepHeight;
            this._m = sliderHeight - (this._stepHeight + this._knobHeight) / 2;
		},

		setPosition: function (y) { 
			L.DomUtil.setPosition(this._element,
								  L.point(0, this._adjust(y)));
		},

		setValue: function (v) {
			this.setPosition(this._toY(v));
		},

		getValue: function () {
			return this._toValue(L.DomUtil.getPosition(this._element).y);
		}
	});

	var Zoomslider = L.Control.extend({
		options: {
			position: 'topleft',
			// Height of zoom-slider.png in px
			stepHeight: 8,
			// Height of the knob div in px (including border)
			knobHeight: 6,
			styleNS: 'leaflet-control-zoomslider'
		},

		onAdd: function (map) {
			this._map = map;
			this._ui = this._createUI();
			this._knob = new Knob(this._ui.knob,
								  this.options.stepHeight,
								  this.options.knobHeight);

			map .whenReady(this._initKnob,           this)
				.whenReady(this._initEvents,         this)
				.whenReady(this._updateSize,         this)
				.whenReady(this._updateKnobValue,    this)
				.whenReady(this._updateDisabled,     this);
			return this._ui.bar;
		},

		onRemove: function (map) {
			map .off('zoomlevelschange',         this._updateSize,      this)
				.off('zoomend zoomlevelschange', this._updateKnobValue, this)
				.off('zoomend zoomlevelschange', this._updateDisabled,  this);
		},

		_createUI: function () {
			var ui = {},
				ns = this.options.styleNS;

			ui.bar     = L.DomUtil.create('div', ns + ' leaflet-bar'),
			ui.zoomIn  = this._createZoomBtn('in', 'top', ui.bar),
			ui.wrap    = L.DomUtil.create('div', ns + '-wrap leaflet-bar-part', ui.bar),
			ui.zoomOut = this._createZoomBtn('out', 'bottom', ui.bar),
			ui.body    = L.DomUtil.create('div', ns + '-body', ui.wrap),
			ui.knob    = L.DomUtil.create('div', ns + '-knob');

			L.DomEvent.disableClickPropagation(ui.bar);
			L.DomEvent.disableClickPropagation(ui.knob);

			return ui;
		},
		_createZoomBtn: function (zoomDir, end, container) {
			var classDef = this.options.styleNS + '-' + zoomDir
					+ ' leaflet-bar-part'
					+ ' leaflet-bar-part-' + end,
				link = L.DomUtil.create('a', classDef, container);

			link.href = '#';
			link.title = 'Zoom ' + zoomDir;

			L.DomEvent.on(link, 'click', L.DomEvent.preventDefault);

			return link;
		},

		_initKnob: function () {
			this._knob.enable();
			this._ui.body.appendChild(this._ui.knob);
		},
		_initEvents: function (map) {
			this._map
				.on('zoomlevelschange',         this._updateSize,      this)
				.on('zoomend zoomlevelschange', this._updateKnobValue, this)
				.on('zoomend zoomlevelschange', this._updateDisabled,  this);

			L.DomEvent.on(this._ui.body,    'click', this._onSliderClick, this);
			L.DomEvent.on(this._ui.zoomIn,  'click', this._zoomIn,        this);
			L.DomEvent.on(this._ui.zoomOut, 'click', this._zoomOut,       this);

			this._knob.on('dragend', this._updateMapZoom, this);
		},

		_onSliderClick: function (e) {
			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
				y = L.DomEvent.getMousePosition(first, this._ui.body).y;

			this._knob.setPosition(y);
			this._updateMapZoom();
		},

		_zoomIn: function (e) {
			this._map.zoomIn(e.shiftKey ? 3 : 1);
		},
		_zoomOut: function (e) {
			this._map.zoomOut(e.shiftKey ? 3 : 1);
		},

		_zoomLevels: function () {
			var zoomLevels = this._map.getMaxZoom() - this._map.getMinZoom() + 1;
			return zoomLevels < Infinity ? zoomLevels : 0;
		},
		_toZoomLevel: function (value) {
			return value + this._map.getMinZoom();
		},
		_toValue: function (zoomLevel) {
			return zoomLevel - this._map.getMinZoom();
		},

		_updateSize: function () {
			var steps = this._zoomLevels();

			this._ui.body.style.height = this.options.stepHeight * steps + 'px';
			this._knob.setSteps(steps);
		},
		_updateMapZoom: function () {
			this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
		},
		_updateKnobValue: function () {
			this._knob.setValue(this._toValue(this._map.getZoom()));
		},
		_updateDisabled: function () {
			var zoomLevel = this._map.getZoom(),
				className = this.options.styleNS + '-disabled';

			L.DomUtil.removeClass(this._ui.zoomIn,  className);
			L.DomUtil.removeClass(this._ui.zoomOut, className);

			if (zoomLevel === this._map.getMinZoom()) {
				L.DomUtil.addClass(this._ui.zoomOut, className);
			}
			if (zoomLevel === this._map.getMaxZoom()) {
				L.DomUtil.addClass(this._ui.zoomIn, className);
			}
		}
	});

	return Zoomslider;
})();


L.Map.mergeOptions({
	zoomControl: false,
	zoomsliderControl: true
});

L.Map.addInitHook(function () {
	if (this.options.zoomsliderControl) {
		this.zoomsliderControl = new L.Control.Zoomslider();
		this.addControl(this.zoomsliderControl);
	}
});

L.control.zoomslider = function (options) {
	return new L.Control.Zoomslider(options);
};

/*
 Leaflet.pattern, Provides tools to set the backgrounds of vector shapes in Leaflet to be patterns.
 https://github.com/teastman/Leaflet.pattern
 (c) 2015, Tyler Eastman
*/
!function(t,e){L.Pattern=L.Class.extend({includes:[L.Mixin.Events],options:{x:0,y:0,width:8,height:8,patternUnits:"userSpaceOnUse",patternContentUnits:"userSpaceOnUse"},_addShapes:L.Util.falseFn,_update:L.Util.falseFn,initialize:function(t){this._shapes={},L.setOptions(this,t)},onAdd:function(t){this._map=t.target?t.target:t,this._map._initDefRoot(),this._initDom();for(var e in this._shapes)this._shapes[e].onAdd(this);this._addShapes(),this._addDom(),this.redraw(),this.getEvents&&this._map.on(this.getEvents(),this),this.fire("add"),this._map.fire("patternadd",{pattern:this})},onRemove:function(){this._removeDom()},redraw:function(){if(this._map){this._update();for(var t in this._shapes)this._shapes[t].redraw()}return this},setStyle:function(t){return L.setOptions(this,t),this._map&&(this._updateStyle(),this.redraw()),this},addTo:function(t){return t.addPattern(this),this},remove:function(){return this.removeFrom(this._map)},removeFrom:function(t){return t&&t.removePattern(this),this}}),L.Map.addInitHook(function(){this._patterns={}}),L.Map.include({addPattern:function(t){var e=L.stamp(t);return this._patterns[e]?t:(this._patterns[e]=t,this.whenReady(t.onAdd,t),this)},removePattern:function(t){var e=L.stamp(t);return this._patterns[e]?(this._loaded&&t.onRemove(this),t.getEvents&&this.off(t.getEvents(),t),delete this._patterns[e],this._loaded&&(this.fire("patternremove",{pattern:t}),t.fire("remove")),t._map=null,this):this},hasPattern:function(t){return!!t&&L.stamp(t)in this._patterns}}),L.Pattern.SVG_NS="http://www.w3.org/2000/svg",L.Pattern=L.Pattern.extend({_createElement:function(t){return e.createElementNS(L.Pattern.SVG_NS,t)},_initDom:function(){this._dom=this._createElement("pattern"),this.options.className&&L.DomUtil.addClass(this._dom,this.options.className),this._updateStyle()},_addDom:function(){this._map._defRoot.appendChild(this._dom)},_removeDom:function(){L.DomUtil.remove(this._dom)},_updateStyle:function(){var t=this._dom,e=this.options;if(t){if(t.setAttribute("id",L.stamp(this)),t.setAttribute("x",e.x),t.setAttribute("y",e.y),t.setAttribute("width",e.width),t.setAttribute("height",e.height),t.setAttribute("patternUnits",e.patternUnits),t.setAttribute("patternContentUnits",e.patternContentUnits),e.patternTransform||e.angle){var i=e.patternTransform?e.patternTransform+" ":"";i+=e.angle?"rotate("+e.angle+") ":"",t.setAttribute("patternTransform",i)}else t.removeAttribute("patternTransform");for(var s in this._shapes)this._shapes[s]._updateStyle()}}}),L.Map.include({_initDefRoot:function(){if(!this._defRoot)if("function"==typeof this.getRenderer){var t=this.getRenderer(this);this._defRoot=L.Pattern.prototype._createElement("defs"),t._container.appendChild(this._defRoot)}else this._pathRoot||this._initPathRoot(),this._defRoot=L.Pattern.prototype._createElement("defs"),this._pathRoot.appendChild(this._defRoot)}}),L.SVG?L.SVG.include({_superUpdateStyle:L.SVG.prototype._updateStyle,_updateStyle:function(t){this._superUpdateStyle(t),t.options.fill&&t.options.fillPattern&&t._path.setAttribute("fill","url(#"+L.stamp(t.options.fillPattern)+")")}}):L.Path.include({_superUpdateStyle:L.Path.prototype._updateStyle,_updateStyle:function(){this._superUpdateStyle(),this.options.fill&&this.options.fillPattern&&this._path.setAttribute("fill","url(#"+L.stamp(this.options.fillPattern)+")")}}),L.StripePattern=L.Pattern.extend({options:{weight:4,spaceWeight:4,color:"#000000",spaceColor:"#ffffff",opacity:1,spaceOpacity:0},_addShapes:function(){this._stripe=new L.PatternPath({stroke:!0,weight:this.options.weight,color:this.options.color,opacity:this.options.opacity}),this._space=new L.PatternPath({stroke:!0,weight:this.options.spaceWeight,color:this.options.spaceColor,opacity:this.options.spaceOpacity}),this.addShape(this._stripe),this.addShape(this._space),this._update()},_update:function(){this._stripe.options.d="M0 "+this._stripe.options.weight/2+" H "+this.options.width,this._space.options.d="M0 "+(this._stripe.options.weight+this._space.options.weight/2)+" H "+this.options.width},setStyle:L.Pattern.prototype.setStyle}),L.stripePattern=function(t){return new L.StripePattern(t)},L.PatternShape=L.Class.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",fillOpacity:.2,fillRule:"evenodd"},initialize:function(t){L.setOptions(this,t)},onAdd:function(t){this._pattern=t,this._pattern._dom&&(this._initDom(),this._addDom())},addTo:function(t){return t.addShape(this),this},redraw:function(){return this._pattern&&this._updateShape(),this},setStyle:function(t){return L.setOptions(this,t),this._pattern&&this._updateStyle(),this},setShape:function(t){this.options=L.extend({},this.options,t),this._updateShape()}}),L.Pattern.include({addShape:function(t){var e=L.stamp(t);return this._shapes[e]?t:(this._shapes[e]=t,t.onAdd(this),void 0)}}),L.PatternShape.SVG_NS="http://www.w3.org/2000/svg",L.PatternShape=L.PatternShape.extend({_createElement:function(t){return e.createElementNS(L.PatternShape.SVG_NS,t)},_initDom:L.Util.falseFn,_updateShape:L.Util.falseFn,_initDomElement:function(t){this._dom=this._createElement(t),this.options.className&&L.DomUtil.addClass(this._dom,this.options.className),this._updateStyle()},_addDom:function(){this._pattern._dom.appendChild(this._dom)},_updateStyle:function(){var t=this._dom,e=this.options;t&&(e.stroke?(t.setAttribute("stroke",e.color),t.setAttribute("stroke-opacity",e.opacity),t.setAttribute("stroke-width",e.weight),t.setAttribute("stroke-linecap",e.lineCap),t.setAttribute("stroke-linejoin",e.lineJoin),e.dashArray?t.setAttribute("stroke-dasharray",e.dashArray):t.removeAttribute("stroke-dasharray"),e.dashOffset?t.setAttribute("stroke-dashoffset",e.dashOffset):t.removeAttribute("stroke-dashoffset")):t.setAttribute("stroke","none"),e.fill?(e.fillPattern?t.setAttribute("fill","url(#"+L.stamp(e.fillPattern)+")"):t.setAttribute("fill",e.fillColor||e.color),t.setAttribute("fill-opacity",e.fillOpacity),t.setAttribute("fill-rule",e.fillRule||"evenodd")):t.setAttribute("fill","none"),t.setAttribute("pointer-events",e.pointerEvents||(e.interactive?"visiblePainted":"none")))}}),L.PatternPath=L.PatternShape.extend({_initDom:function(){this._initDomElement("path")},_updateShape:function(){this._dom&&this._dom.setAttribute("d",this.options.d)}}),L.PatternCircle=L.PatternShape.extend({options:{x:0,y:0,radius:0},_initDom:function(){this._initDomElement("circle")},_updateShape:function(){this._dom&&(this._dom.setAttribute("cx",this.options.x),this._dom.setAttribute("cy",this.options.y),this._dom.setAttribute("r",this.options.radius))}}),L.PatternRect=L.PatternShape.extend({options:{x:0,y:0,width:10,height:10},_initDom:function(){this._initDomElement("rect")},_updateShape:function(){this._dom&&(this._dom.setAttribute("x",this.options.x),this._dom.setAttribute("y",this.options.y),this._dom.setAttribute("width",this.options.width),this._dom.setAttribute("height",this.options.height),this.options.rx&&this._dom.setAttribute("rx",this.options.rx),this.options.ry&&this._dom.setAttribute("ry",this.options.ry))}})}(window,document);

/* esri-leaflet - v2.3.1 - Thu Oct 10 2019 14:43:43 GMT-0500 (Central Daylight Time)
 * Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet')) :
	typeof define === 'function' && define.amd ? define(['exports', 'leaflet'], factory) :
	(factory((global.L = global.L || {}, global.L.esri = {}),global.L));
}(this, (function (exports,leaflet) { 'use strict';

var version = "2.3.1";

var cors = ((window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest()));
var pointerEvents = document.documentElement.style.pointerEvents === '';

var Support = {
  cors: cors,
  pointerEvents: pointerEvents
};

var options = {
  attributionWidthOffset: 55
};

var callbacks = 0;

function serialize (params) {
  var data = '';

  params.f = params.f || 'json';

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var param = params[key];
      var type = Object.prototype.toString.call(param);
      var value;

      if (data.length) {
        data += '&';
      }

      if (type === '[object Array]') {
        value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
      } else if (type === '[object Object]') {
        value = JSON.stringify(param);
      } else if (type === '[object Date]') {
        value = param.valueOf();
      } else {
        value = param;
      }

      data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
  }

  return data;
}

function createRequest (callback, context) {
  var httpRequest = new window.XMLHttpRequest();

  httpRequest.onerror = function (e) {
    httpRequest.onreadystatechange = leaflet.Util.falseFn;

    callback.call(context, {
      error: {
        code: 500,
        message: 'XMLHttpRequest error'
      }
    }, null);
  };

  httpRequest.onreadystatechange = function () {
    var response;
    var error;

    if (httpRequest.readyState === 4) {
      try {
        response = JSON.parse(httpRequest.responseText);
      } catch (e) {
        response = null;
        error = {
          code: 500,
          message: 'Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error.'
        };
      }

      if (!error && response.error) {
        error = response.error;
        response = null;
      }

      httpRequest.onerror = leaflet.Util.falseFn;

      callback.call(context, error, response);
    }
  };

  httpRequest.ontimeout = function () {
    this.onerror();
  };

  return httpRequest;
}

function xmlHttpPost (url, params, callback, context) {
  var httpRequest = createRequest(callback, context);
  httpRequest.open('POST', url);

  if (typeof context !== 'undefined' && context !== null) {
    if (typeof context.options !== 'undefined') {
      httpRequest.timeout = context.options.timeout;
    }
  }
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  httpRequest.send(serialize(params));

  return httpRequest;
}

function xmlHttpGet (url, params, callback, context) {
  var httpRequest = createRequest(callback, context);
  httpRequest.open('GET', url + '?' + serialize(params), true);

  if (typeof context !== 'undefined' && context !== null) {
    if (typeof context.options !== 'undefined') {
      httpRequest.timeout = context.options.timeout;
    }
  }
  httpRequest.send(null);

  return httpRequest;
}

// AJAX handlers for CORS (modern browsers) or JSONP (older browsers)
function request (url, params, callback, context) {
  var paramString = serialize(params);
  var httpRequest = createRequest(callback, context);
  var requestLength = (url + '?' + paramString).length;

  // ie10/11 require the request be opened before a timeout is applied
  if (requestLength <= 2000 && Support.cors) {
    httpRequest.open('GET', url + '?' + paramString);
  } else if (requestLength > 2000 && Support.cors) {
    httpRequest.open('POST', url);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  }

  if (typeof context !== 'undefined' && context !== null) {
    if (typeof context.options !== 'undefined') {
      httpRequest.timeout = context.options.timeout;
    }
  }

  // request is less than 2000 characters and the browser supports CORS, make GET request with XMLHttpRequest
  if (requestLength <= 2000 && Support.cors) {
    httpRequest.send(null);

  // request is more than 2000 characters and the browser supports CORS, make POST request with XMLHttpRequest
  } else if (requestLength > 2000 && Support.cors) {
    httpRequest.send(paramString);

  // request is less  than 2000 characters and the browser does not support CORS, make a JSONP request
  } else if (requestLength <= 2000 && !Support.cors) {
    return jsonp(url, params, callback, context);

  // request is longer then 2000 characters and the browser does not support CORS, log a warning
  } else {
    warn('a request to ' + url + ' was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html');
    return;
  }

  return httpRequest;
}

function jsonp (url, params, callback, context) {
  window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
  var callbackId = 'c' + callbacks;
  params.callback = 'window._EsriLeafletCallbacks.' + callbackId;

  window._EsriLeafletCallbacks[callbackId] = function (response) {
    if (window._EsriLeafletCallbacks[callbackId] !== true) {
      var error;
      var responseType = Object.prototype.toString.call(response);

      if (!(responseType === '[object Object]' || responseType === '[object Array]')) {
        error = {
          error: {
            code: 500,
            message: 'Expected array or object as JSONP response'
          }
        };
        response = null;
      }

      if (!error && response.error) {
        error = response;
        response = null;
      }

      callback.call(context, error, response);
      window._EsriLeafletCallbacks[callbackId] = true;
    }
  };

  var script = leaflet.DomUtil.create('script', null, document.body);
  script.type = 'text/javascript';
  script.src = url + '?' + serialize(params);
  script.id = callbackId;
  script.onerror = function (error) {
    if (error && window._EsriLeafletCallbacks[callbackId] !== true) {
      // Can't get true error code: it can be 404, or 401, or 500
      var err = {
        error: {
          code: 500,
          message: 'An unknown error occurred'
        }
      };

      callback.call(context, err);
      window._EsriLeafletCallbacks[callbackId] = true;
    }
  };
  leaflet.DomUtil.addClass(script, 'esri-leaflet-jsonp');

  callbacks++;

  return {
    id: callbackId,
    url: script.src,
    abort: function () {
      window._EsriLeafletCallbacks._callback[callbackId]({
        code: 0,
        message: 'Request aborted.'
      });
    }
  };
}

var get = ((Support.cors) ? xmlHttpGet : jsonp);
get.CORS = xmlHttpGet;
get.JSONP = jsonp;

// export the Request object to call the different handlers for debugging
var Request = {
  request: request,
  get: get,
  post: xmlHttpPost
};

/*
 * Copyright 2017 Esri
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// checks if 2 x,y points are equal
function pointsEqual (a, b) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// checks if the first and last points of a ring are equal and closes the ring
function closeRing (coordinates) {
  if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
    coordinates.push(coordinates[0]);
  }
  return coordinates;
}

// determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
// or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
// points-are-in-clockwise-order
function ringIsClockwise (ringToTest) {
  var total = 0;
  var i = 0;
  var rLength = ringToTest.length;
  var pt1 = ringToTest[i];
  var pt2;
  for (i; i < rLength - 1; i++) {
    pt2 = ringToTest[i + 1];
    total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
    pt1 = pt2;
  }
  return (total >= 0);
}

// ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L504-L519
function vertexIntersectsVertex (a1, a2, b1, b2) {
  var uaT = ((b2[0] - b1[0]) * (a1[1] - b1[1])) - ((b2[1] - b1[1]) * (a1[0] - b1[0]));
  var ubT = ((a2[0] - a1[0]) * (a1[1] - b1[1])) - ((a2[1] - a1[1]) * (a1[0] - b1[0]));
  var uB = ((b2[1] - b1[1]) * (a2[0] - a1[0])) - ((b2[0] - b1[0]) * (a2[1] - a1[1]));

  if (uB !== 0) {
    var ua = uaT / uB;
    var ub = ubT / uB;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      return true;
    }
  }

  return false;
}

// ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L521-L531
function arrayIntersectsArray (a, b) {
  for (var i = 0; i < a.length - 1; i++) {
    for (var j = 0; j < b.length - 1; j++) {
      if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
        return true;
      }
    }
  }

  return false;
}

// ported from terraformer.js https://github.com/Esri/Terraformer/blob/master/terraformer.js#L470-L480
function coordinatesContainPoint (coordinates, point) {
  var contains = false;
  for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
    if (((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1]) ||
         (coordinates[j][1] <= point[1] && point[1] < coordinates[i][1])) &&
        (point[0] < (((coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1])) / (coordinates[j][1] - coordinates[i][1])) + coordinates[i][0])) {
      contains = !contains;
    }
  }
  return contains;
}

// ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L106-L113
function coordinatesContainCoordinates (outer, inner) {
  var intersects = arrayIntersectsArray(outer, inner);
  var contains = coordinatesContainPoint(outer, inner[0]);
  if (!intersects && contains) {
    return true;
  }
  return false;
}

// do any polygons in this array contain any other polygons in this array?
// used for checking for holes in arcgis rings
// ported from terraformer-arcgis-parser.js https://github.com/Esri/terraformer-arcgis-parser/blob/master/terraformer-arcgis-parser.js#L117-L172
function convertRingsToGeoJSON (rings) {
  var outerRings = [];
  var holes = [];
  var x; // iterator
  var outerRing; // current outer ring being evaluated
  var hole; // current hole being evaluated

  // for each ring
  for (var r = 0; r < rings.length; r++) {
    var ring = closeRing(rings[r].slice(0));
    if (ring.length < 4) {
      continue;
    }
    // is this ring an outer ring? is it clockwise?
    if (ringIsClockwise(ring)) {
      var polygon = [ ring.slice().reverse() ]; // wind outer rings counterclockwise for RFC 7946 compliance
      outerRings.push(polygon); // push to outer rings
    } else {
      holes.push(ring.slice().reverse()); // wind inner rings clockwise for RFC 7946 compliance
    }
  }

  var uncontainedHoles = [];

  // while there are holes left...
  while (holes.length) {
    // pop a hole off out stack
    hole = holes.pop();

    // loop over all outer rings and see if they contain our hole.
    var contained = false;
    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0];
      if (coordinatesContainCoordinates(outerRing, hole)) {
        // the hole is contained push it into our polygon
        outerRings[x].push(hole);
        contained = true;
        break;
      }
    }

    // ring is not contained in any outer ring
    // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320
    if (!contained) {
      uncontainedHoles.push(hole);
    }
  }

  // if we couldn't match any holes using contains we can try intersects...
  while (uncontainedHoles.length) {
    // pop a hole off out stack
    hole = uncontainedHoles.pop();

    // loop over all outer rings and see if any intersect our hole.
    var intersects = false;

    for (x = outerRings.length - 1; x >= 0; x--) {
      outerRing = outerRings[x][0];
      if (arrayIntersectsArray(outerRing, hole)) {
        // the hole is contained push it into our polygon
        outerRings[x].push(hole);
        intersects = true;
        break;
      }
    }

    if (!intersects) {
      outerRings.push([hole.reverse()]);
    }
  }

  if (outerRings.length === 1) {
    return {
      type: 'Polygon',
      coordinates: outerRings[0]
    };
  } else {
    return {
      type: 'MultiPolygon',
      coordinates: outerRings
    };
  }
}

// This function ensures that rings are oriented in the right directions
// outer rings are clockwise, holes are counterclockwise
// used for converting GeoJSON Polygons to ArcGIS Polygons
function orientRings (poly) {
  var output = [];
  var polygon = poly.slice(0);
  var outerRing = closeRing(polygon.shift().slice(0));
  if (outerRing.length >= 4) {
    if (!ringIsClockwise(outerRing)) {
      outerRing.reverse();
    }

    output.push(outerRing);

    for (var i = 0; i < polygon.length; i++) {
      var hole = closeRing(polygon[i].slice(0));
      if (hole.length >= 4) {
        if (ringIsClockwise(hole)) {
          hole.reverse();
        }
        output.push(hole);
      }
    }
  }

  return output;
}

// This function flattens holes in multipolygons to one array of polygons
// used for converting GeoJSON Polygons to ArcGIS Polygons
function flattenMultiPolygonRings (rings) {
  var output = [];
  for (var i = 0; i < rings.length; i++) {
    var polygon = orientRings(rings[i]);
    for (var x = polygon.length - 1; x >= 0; x--) {
      var ring = polygon[x].slice(0);
      output.push(ring);
    }
  }
  return output;
}

// shallow object clone for feature properties and attributes
// from http://jsperf.com/cloning-an-object/2
function shallowClone (obj) {
  var target = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      target[i] = obj[i];
    }
  }
  return target;
}

function getId (attributes, idAttribute) {
  var keys = idAttribute ? [idAttribute, 'OBJECTID', 'FID'] : ['OBJECTID', 'FID'];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (
      key in attributes &&
      (typeof attributes[key] === 'string' ||
        typeof attributes[key] === 'number')
    ) {
      return attributes[key];
    }
  }
  throw Error('No valid id attribute found');
}

function arcgisToGeoJSON (arcgis, idAttribute) {
  var geojson = {};

  if (arcgis.features) {
    geojson.type = 'FeatureCollection';
    geojson.features = [];
    for (var i = 0; i < arcgis.features.length; i++) {
      geojson.features.push(arcgisToGeoJSON(arcgis.features[i], idAttribute));
    }
  }

  if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
    geojson.type = 'Point';
    geojson.coordinates = [arcgis.x, arcgis.y];
    if (typeof arcgis.z === 'number') {
      geojson.coordinates.push(arcgis.z);
    }
  }

  if (arcgis.points) {
    geojson.type = 'MultiPoint';
    geojson.coordinates = arcgis.points.slice(0);
  }

  if (arcgis.paths) {
    if (arcgis.paths.length === 1) {
      geojson.type = 'LineString';
      geojson.coordinates = arcgis.paths[0].slice(0);
    } else {
      geojson.type = 'MultiLineString';
      geojson.coordinates = arcgis.paths.slice(0);
    }
  }

  if (arcgis.rings) {
    geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
  }

  if (
    typeof arcgis.xmin === 'number' &&
    typeof arcgis.ymin === 'number' &&
    typeof arcgis.xmax === 'number' &&
    typeof arcgis.ymax === 'number'
  ) {
    geojson.type = 'Polygon';
    geojson.coordinates = [[
      [arcgis.xmax, arcgis.ymax],
      [arcgis.xmin, arcgis.ymax],
      [arcgis.xmin, arcgis.ymin],
      [arcgis.xmax, arcgis.ymin],
      [arcgis.xmax, arcgis.ymax]
    ]];
  }

  if (arcgis.geometry || arcgis.attributes) {
    geojson.type = 'Feature';
    geojson.geometry = (arcgis.geometry) ? arcgisToGeoJSON(arcgis.geometry) : null;
    geojson.properties = (arcgis.attributes) ? shallowClone(arcgis.attributes) : null;
    if (arcgis.attributes) {
      try {
        geojson.id = getId(arcgis.attributes, idAttribute);
      } catch (err) {
        // don't set an id
      }
    }
  }

  // if no valid geometry was encountered
  if (JSON.stringify(geojson.geometry) === JSON.stringify({})) {
    geojson.geometry = null;
  }

  if (
    arcgis.spatialReference &&
    arcgis.spatialReference.wkid &&
    arcgis.spatialReference.wkid !== 4326
  ) {
    console.warn('Object converted in non-standard crs - ' + JSON.stringify(arcgis.spatialReference));
  }

  return geojson;
}

function geojsonToArcGIS (geojson, idAttribute) {
  idAttribute = idAttribute || 'OBJECTID';
  var spatialReference = { wkid: 4326 };
  var result = {};
  var i;

  switch (geojson.type) {
    case 'Point':
      result.x = geojson.coordinates[0];
      result.y = geojson.coordinates[1];
      result.spatialReference = spatialReference;
      break;
    case 'MultiPoint':
      result.points = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case 'LineString':
      result.paths = [geojson.coordinates.slice(0)];
      result.spatialReference = spatialReference;
      break;
    case 'MultiLineString':
      result.paths = geojson.coordinates.slice(0);
      result.spatialReference = spatialReference;
      break;
    case 'Polygon':
      result.rings = orientRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case 'MultiPolygon':
      result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
      result.spatialReference = spatialReference;
      break;
    case 'Feature':
      if (geojson.geometry) {
        result.geometry = geojsonToArcGIS(geojson.geometry, idAttribute);
      }
      result.attributes = (geojson.properties) ? shallowClone(geojson.properties) : {};
      if (geojson.id) {
        result.attributes[idAttribute] = geojson.id;
      }
      break;
    case 'FeatureCollection':
      result = [];
      for (i = 0; i < geojson.features.length; i++) {
        result.push(geojsonToArcGIS(geojson.features[i], idAttribute));
      }
      break;
    case 'GeometryCollection':
      result = [];
      for (i = 0; i < geojson.geometries.length; i++) {
        result.push(geojsonToArcGIS(geojson.geometries[i], idAttribute));
      }
      break;
  }

  return result;
}

function geojsonToArcGIS$1 (geojson, idAttr) {
  return geojsonToArcGIS(geojson, idAttr);
}

function arcgisToGeoJSON$1 (arcgis, idAttr) {
  return arcgisToGeoJSON(arcgis, idAttr);
}

// convert an extent (ArcGIS) to LatLngBounds (Leaflet)
function extentToBounds (extent) {
  // "NaN" coordinates from ArcGIS Server indicate a null geometry
  if (extent.xmin !== 'NaN' && extent.ymin !== 'NaN' && extent.xmax !== 'NaN' && extent.ymax !== 'NaN') {
    var sw = leaflet.latLng(extent.ymin, extent.xmin);
    var ne = leaflet.latLng(extent.ymax, extent.xmax);
    return leaflet.latLngBounds(sw, ne);
  } else {
    return null;
  }
}

// convert an LatLngBounds (Leaflet) to extent (ArcGIS)
function boundsToExtent (bounds) {
  bounds = leaflet.latLngBounds(bounds);
  return {
    'xmin': bounds.getSouthWest().lng,
    'ymin': bounds.getSouthWest().lat,
    'xmax': bounds.getNorthEast().lng,
    'ymax': bounds.getNorthEast().lat,
    'spatialReference': {
      'wkid': 4326
    }
  };
}

var knownFieldNames = /^(OBJECTID|FID|OID|ID)$/i;

// Attempts to find the ID Field from response
function _findIdAttributeFromResponse (response) {
  var result;

  if (response.objectIdFieldName) {
    // Find Id Field directly
    result = response.objectIdFieldName;
  } else if (response.fields) {
    // Find ID Field based on field type
    for (var j = 0; j <= response.fields.length - 1; j++) {
      if (response.fields[j].type === 'esriFieldTypeOID') {
        result = response.fields[j].name;
        break;
      }
    }
    if (!result) {
      // If no field was marked as being the esriFieldTypeOID try well known field names
      for (j = 0; j <= response.fields.length - 1; j++) {
        if (response.fields[j].name.match(knownFieldNames)) {
          result = response.fields[j].name;
          break;
        }
      }
    }
  }
  return result;
}

// This is the 'last' resort, find the Id field from the specified feature
function _findIdAttributeFromFeature (feature) {
  for (var key in feature.attributes) {
    if (key.match(knownFieldNames)) {
      return key;
    }
  }
}

function responseToFeatureCollection (response, idAttribute) {
  var objectIdField;
  var features = response.features || response.results;
  var count = features.length;

  if (idAttribute) {
    objectIdField = idAttribute;
  } else {
    objectIdField = _findIdAttributeFromResponse(response);
  }

  var featureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  if (count) {
    for (var i = features.length - 1; i >= 0; i--) {
      var feature = arcgisToGeoJSON$1(features[i], objectIdField || _findIdAttributeFromFeature(features[i]));
      featureCollection.features.push(feature);
    }
  }

  return featureCollection;
}

  // trim url whitespace and add a trailing slash if needed
function cleanUrl (url) {
  // trim leading and trailing spaces, but not spaces inside the url
  url = leaflet.Util.trim(url);

  // add a trailing slash to the url if the user omitted it
  if (url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
}

/* Extract url params if any and store them in requestParams attribute.
   Return the options params updated */
function getUrlParams (options$$1) {
  if (options$$1.url.indexOf('?') !== -1) {
    options$$1.requestParams = options$$1.requestParams || {};
    var queryString = options$$1.url.substring(options$$1.url.indexOf('?') + 1);
    options$$1.url = options$$1.url.split('?')[0];
    options$$1.requestParams = JSON.parse('{"' + decodeURI(queryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }
  options$$1.url = cleanUrl(options$$1.url.split('?')[0]);
  return options$$1;
}

function isArcgisOnline (url) {
  /* hosted feature services support geojson as an output format
  utility.arcgis.com services are proxied from a variety of ArcGIS Server vintages, and may not */
  return (/^(?!.*utility\.arcgis\.com).*\.arcgis\.com.*FeatureServer/i).test(url);
}

function geojsonTypeToArcGIS (geoJsonType) {
  var arcgisGeometryType;
  switch (geoJsonType) {
    case 'Point':
      arcgisGeometryType = 'esriGeometryPoint';
      break;
    case 'MultiPoint':
      arcgisGeometryType = 'esriGeometryMultipoint';
      break;
    case 'LineString':
      arcgisGeometryType = 'esriGeometryPolyline';
      break;
    case 'MultiLineString':
      arcgisGeometryType = 'esriGeometryPolyline';
      break;
    case 'Polygon':
      arcgisGeometryType = 'esriGeometryPolygon';
      break;
    case 'MultiPolygon':
      arcgisGeometryType = 'esriGeometryPolygon';
      break;
  }

  return arcgisGeometryType;
}

function warn () {
  if (console && console.warn) {
    console.warn.apply(console, arguments);
  }
}

function calcAttributionWidth (map) {
  // either crop at 55px or user defined buffer
  return (map.getSize().x - options.attributionWidthOffset) + 'px';
}

function setEsriAttribution (map) {
  if (map.attributionControl && !map.attributionControl._esriAttributionAdded) {
    map.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Powered by <a href="https://www.esri.com">Esri</a>');

    var hoverAttributionStyle = document.createElement('style');
    hoverAttributionStyle.type = 'text/css';
    hoverAttributionStyle.innerHTML = '.esri-truncated-attribution:hover {' +
      'white-space: normal;' +
    '}';

    document.getElementsByTagName('head')[0].appendChild(hoverAttributionStyle);
    leaflet.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution:hover');

    // define a new css class in JS to trim attribution into a single line
    var attributionStyle = document.createElement('style');
    attributionStyle.type = 'text/css';
    attributionStyle.innerHTML = '.esri-truncated-attribution {' +
      'vertical-align: -3px;' +
      'white-space: nowrap;' +
      'overflow: hidden;' +
      'text-overflow: ellipsis;' +
      'display: inline-block;' +
      'transition: 0s white-space;' +
      'transition-delay: 1s;' +
      'max-width: ' + calcAttributionWidth(map) + ';' +
    '}';

    document.getElementsByTagName('head')[0].appendChild(attributionStyle);
    leaflet.DomUtil.addClass(map.attributionControl._container, 'esri-truncated-attribution');

    // update the width used to truncate when the map itself is resized
    map.on('resize', function (e) {
      map.attributionControl._container.style.maxWidth = calcAttributionWidth(e.target);
    });

    map.attributionControl._esriAttributionAdded = true;
  }
}

function _setGeometry (geometry) {
  var params = {
    geometry: null,
    geometryType: null
  };

  // convert bounds to extent and finish
  if (geometry instanceof leaflet.LatLngBounds) {
    // set geometry + geometryType
    params.geometry = boundsToExtent(geometry);
    params.geometryType = 'esriGeometryEnvelope';
    return params;
  }

  // convert L.Marker > L.LatLng
  if (geometry.getLatLng) {
    geometry = geometry.getLatLng();
  }

  // convert L.LatLng to a geojson point and continue;
  if (geometry instanceof leaflet.LatLng) {
    geometry = {
      type: 'Point',
      coordinates: [geometry.lng, geometry.lat]
    };
  }

  // handle L.GeoJSON, pull out the first geometry
  if (geometry instanceof leaflet.GeoJSON) {
    // reassign geometry to the GeoJSON value  (we are assuming that only one feature is present)
    geometry = geometry.getLayers()[0].feature.geometry;
    params.geometry = geojsonToArcGIS$1(geometry);
    params.geometryType = geojsonTypeToArcGIS(geometry.type);
  }

  // Handle L.Polyline and L.Polygon
  if (geometry.toGeoJSON) {
    geometry = geometry.toGeoJSON();
  }

  // handle GeoJSON feature by pulling out the geometry
  if (geometry.type === 'Feature') {
    // get the geometry of the geojson feature
    geometry = geometry.geometry;
  }

  // confirm that our GeoJSON is a point, line or polygon
  if (geometry.type === 'Point' || geometry.type === 'LineString' || geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    params.geometry = geojsonToArcGIS$1(geometry);
    params.geometryType = geojsonTypeToArcGIS(geometry.type);
    return params;
  }

  // warn the user if we havn't found an appropriate object
  warn('invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object');

  return;
}

function _getAttributionData (url, map) {
  if (Support.cors) {
    request(url, {}, leaflet.Util.bind(function (error, attributions) {
      if (error) { return; }
      map._esriAttributions = [];
      for (var c = 0; c < attributions.contributors.length; c++) {
        var contributor = attributions.contributors[c];

        for (var i = 0; i < contributor.coverageAreas.length; i++) {
          var coverageArea = contributor.coverageAreas[i];
          var southWest = leaflet.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
          var northEast = leaflet.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
          map._esriAttributions.push({
            attribution: contributor.attribution,
            score: coverageArea.score,
            bounds: leaflet.latLngBounds(southWest, northEast),
            minZoom: coverageArea.zoomMin,
            maxZoom: coverageArea.zoomMax
          });
        }
      }

      map._esriAttributions.sort(function (a, b) {
        return b.score - a.score;
      });

      // pass the same argument as the map's 'moveend' event
      var obj = { target: map };
      _updateMapAttribution(obj);
    }, this));
  }
}

function _updateMapAttribution (evt) {
  var map = evt.target;
  var oldAttributions = map._esriAttributions;

  if (!map || !map.attributionControl) return;

  var attributionElement = map.attributionControl._container.querySelector('.esri-dynamic-attribution');

  if (attributionElement && oldAttributions) {
    var newAttributions = '';
    var bounds = map.getBounds();
    var wrappedBounds = leaflet.latLngBounds(
      bounds.getSouthWest().wrap(),
      bounds.getNorthEast().wrap()
    );
    var zoom = map.getZoom();

    for (var i = 0; i < oldAttributions.length; i++) {
      var attribution = oldAttributions[i];
      var text = attribution.attribution;

      if (!newAttributions.match(text) && attribution.bounds.intersects(wrappedBounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
        newAttributions += (', ' + text);
      }
    }

    newAttributions = newAttributions.substr(2);
    attributionElement.innerHTML = newAttributions;
    attributionElement.style.maxWidth = calcAttributionWidth(map);

    map.fire('attributionupdated', {
      attribution: newAttributions
    });
  }
}

var EsriUtil = {
  warn: warn,
  cleanUrl: cleanUrl,
  getUrlParams: getUrlParams,
  isArcgisOnline: isArcgisOnline,
  geojsonTypeToArcGIS: geojsonTypeToArcGIS,
  responseToFeatureCollection: responseToFeatureCollection,
  geojsonToArcGIS: geojsonToArcGIS$1,
  arcgisToGeoJSON: arcgisToGeoJSON$1,
  boundsToExtent: boundsToExtent,
  extentToBounds: extentToBounds,
  calcAttributionWidth: calcAttributionWidth,
  setEsriAttribution: setEsriAttribution,
  _setGeometry: _setGeometry,
  _getAttributionData: _getAttributionData,
  _updateMapAttribution: _updateMapAttribution,
  _findIdAttributeFromFeature: _findIdAttributeFromFeature,
  _findIdAttributeFromResponse: _findIdAttributeFromResponse
};

var Task = leaflet.Class.extend({

  options: {
    proxy: false,
    useCors: cors
  },

  // Generate a method for each methodName:paramName in the setters for this task.
  generateSetter: function (param, context) {
    return leaflet.Util.bind(function (value) {
      this.params[param] = value;
      return this;
    }, context);
  },

  initialize: function (endpoint) {
    // endpoint can be either a url (and options) for an ArcGIS Rest Service or an instance of EsriLeaflet.Service
    if (endpoint.request && endpoint.options) {
      this._service = endpoint;
      leaflet.Util.setOptions(this, endpoint.options);
    } else {
      leaflet.Util.setOptions(this, endpoint);
      this.options.url = cleanUrl(endpoint.url);
    }

    // clone default params into this object
    this.params = leaflet.Util.extend({}, this.params || {});

    // generate setter methods based on the setters object implimented a child class
    if (this.setters) {
      for (var setter in this.setters) {
        var param = this.setters[setter];
        this[setter] = this.generateSetter(param, this);
      }
    }
  },

  token: function (token) {
    if (this._service) {
      this._service.authenticate(token);
    } else {
      this.params.token = token;
    }
    return this;
  },

  // ArcGIS Server Find/Identify 10.5+
  format: function (boolean) {
    // use double negative to expose a more intuitive positive method name
    this.params.returnUnformattedValues = !boolean;
    return this;
  },

  request: function (callback, context) {
    if (this.options.requestParams) {
      leaflet.Util.extend(this.params, this.options.requestParams);
    }
    if (this._service) {
      return this._service.request(this.path, this.params, callback, context);
    }

    return this._request('request', this.path, this.params, callback, context);
  },

  _request: function (method, path, params, callback, context) {
    var url = (this.options.proxy) ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;

    if ((method === 'get' || method === 'request') && !this.options.useCors) {
      return Request.get.JSONP(url, params, callback, context);
    }

    return Request[method](url, params, callback, context);
  }
});

function task (options) {
  options = getUrlParams(options);
  return new Task(options);
}

var Query = Task.extend({
  setters: {
    'offset': 'resultOffset',
    'limit': 'resultRecordCount',
    'fields': 'outFields',
    'precision': 'geometryPrecision',
    'featureIds': 'objectIds',
    'returnGeometry': 'returnGeometry',
    'returnM': 'returnM',
    'transform': 'datumTransformation',
    'token': 'token'
  },

  path: 'query',

  params: {
    returnGeometry: true,
    where: '1=1',
    outSR: 4326,
    outFields: '*'
  },

  // Returns a feature if its shape is wholly contained within the search geometry. Valid for all shape type combinations.
  within: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelContains'; // to the REST api this reads geometry **contains** layer
    return this;
  },

  // Returns a feature if any spatial relationship is found. Applies to all shape type combinations.
  intersects: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelIntersects';
    return this;
  },

  // Returns a feature if its shape wholly contains the search geometry. Valid for all shape type combinations.
  contains: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelWithin'; // to the REST api this reads geometry **within** layer
    return this;
  },

  // Returns a feature if the intersection of the interiors of the two shapes is not empty and has a lower dimension than the maximum dimension of the two shapes. Two lines that share an endpoint in common do not cross. Valid for Line/Line, Line/Area, Multi-point/Area, and Multi-point/Line shape type combinations.
  crosses: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelCrosses';
    return this;
  },

  // Returns a feature if the two shapes share a common boundary. However, the intersection of the interiors of the two shapes must be empty. In the Point/Line case, the point may touch an endpoint only of the line. Applies to all combinations except Point/Point.
  touches: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelTouches';
    return this;
  },

  // Returns a feature if the intersection of the two shapes results in an object of the same dimension, but different from both of the shapes. Applies to Area/Area, Line/Line, and Multi-point/Multi-point shape type combinations.
  overlaps: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelOverlaps';
    return this;
  },

  // Returns a feature if the envelope of the two shapes intersects.
  bboxIntersects: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelEnvelopeIntersects';
    return this;
  },

  // if someone can help decipher the ArcObjects explanation and translate to plain speak, we should mention this method in the doc
  indexIntersects: function (geometry) {
    this._setGeometryParams(geometry);
    this.params.spatialRel = 'esriSpatialRelIndexIntersects'; // Returns a feature if the envelope of the query geometry intersects the index entry for the target geometry
    return this;
  },

  // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
  nearby: function (latlng, radius) {
    latlng = leaflet.latLng(latlng);
    this.params.geometry = [latlng.lng, latlng.lat];
    this.params.geometryType = 'esriGeometryPoint';
    this.params.spatialRel = 'esriSpatialRelIntersects';
    this.params.units = 'esriSRUnit_Meter';
    this.params.distance = radius;
    this.params.inSr = 4326;
    return this;
  },

  where: function (string) {
    // instead of converting double-quotes to single quotes, pass as is, and provide a more informative message if a 400 is encountered
    this.params.where = string;
    return this;
  },

  between: function (start, end) {
    this.params.time = [start.valueOf(), end.valueOf()];
    return this;
  },

  simplify: function (map, factor) {
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  orderBy: function (fieldName, order) {
    order = order || 'ASC';
    this.params.orderByFields = (this.params.orderByFields) ? this.params.orderByFields + ',' : '';
    this.params.orderByFields += ([fieldName, order]).join(' ');
    return this;
  },

  run: function (callback, context) {
    this._cleanParams();

    // services hosted on ArcGIS Online and ArcGIS Server 10.3.1+ support requesting geojson directly
    if (this.options.isModern || isArcgisOnline(this.options.url)) {
      this.params.f = 'geojson';

      return this.request(function (error, response) {
        this._trapSQLerrors(error);
        callback.call(context, error, response, response);
      }, this);

    // otherwise convert it in the callback then pass it on
    } else {
      return this.request(function (error, response) {
        this._trapSQLerrors(error);
        callback.call(context, error, (response && responseToFeatureCollection(response)), response);
      }, this);
    }
  },

  count: function (callback, context) {
    this._cleanParams();
    this.params.returnCountOnly = true;
    return this.request(function (error, response) {
      callback.call(this, error, (response && response.count), response);
    }, context);
  },

  ids: function (callback, context) {
    this._cleanParams();
    this.params.returnIdsOnly = true;
    return this.request(function (error, response) {
      callback.call(this, error, (response && response.objectIds), response);
    }, context);
  },

  // only valid for Feature Services running on ArcGIS Server 10.3+ or ArcGIS Online
  bounds: function (callback, context) {
    this._cleanParams();
    this.params.returnExtentOnly = true;
    return this.request(function (error, response) {
      if (response && response.extent && extentToBounds(response.extent)) {
        callback.call(context, error, extentToBounds(response.extent), response);
      } else {
        error = {
          message: 'Invalid Bounds'
        };
        callback.call(context, error, null, response);
      }
    }, context);
  },

  distinct: function () {
    // geometry must be omitted for queries requesting distinct values
    this.params.returnGeometry = false;
    this.params.returnDistinctValues = true;
    return this;
  },

  // only valid for image services
  pixelSize: function (rawPoint) {
    var castPoint = leaflet.point(rawPoint);
    this.params.pixelSize = [castPoint.x, castPoint.y];
    return this;
  },

  // only valid for map services
  layer: function (layer) {
    this.path = layer + '/query';
    return this;
  },

  _trapSQLerrors: function (error) {
    if (error) {
      if (error.code === '400') {
        warn('one common syntax error in query requests is encasing string values in double quotes instead of single quotes');
      }
    }
  },

  _cleanParams: function () {
    delete this.params.returnIdsOnly;
    delete this.params.returnExtentOnly;
    delete this.params.returnCountOnly;
  },

  _setGeometryParams: function (geometry) {
    this.params.inSr = 4326;
    var converted = _setGeometry(geometry);
    this.params.geometry = converted.geometry;
    this.params.geometryType = converted.geometryType;
  }

});

function query (options) {
  return new Query(options);
}

var Find = Task.extend({
  setters: {
    // method name > param name
    'contains': 'contains',
    'text': 'searchText',
    'fields': 'searchFields', // denote an array or single string
    'spatialReference': 'sr',
    'sr': 'sr',
    'layers': 'layers',
    'returnGeometry': 'returnGeometry',
    'maxAllowableOffset': 'maxAllowableOffset',
    'precision': 'geometryPrecision',
    'dynamicLayers': 'dynamicLayers',
    'returnZ': 'returnZ',
    'returnM': 'returnM',
    'gdbVersion': 'gdbVersion',
    // skipped implementing this (for now) because the REST service implementation isnt consistent between operations
    // 'transform': 'datumTransformations',
    'token': 'token'
  },

  path: 'find',

  params: {
    sr: 4326,
    contains: true,
    returnGeometry: true,
    returnZ: true,
    returnM: false
  },

  layerDefs: function (id, where) {
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  simplify: function (map, factor) {
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  run: function (callback, context) {
    return this.request(function (error, response) {
      callback.call(context, error, (response && responseToFeatureCollection(response)), response);
    }, context);
  }
});

function find (options) {
  return new Find(options);
}

var Identify = Task.extend({
  path: 'identify',

  between: function (start, end) {
    this.params.time = [start.valueOf(), end.valueOf()];
    return this;
  }
});

function identify (options) {
  return new Identify(options);
}

var IdentifyFeatures = Identify.extend({
  setters: {
    'layers': 'layers',
    'precision': 'geometryPrecision',
    'tolerance': 'tolerance',
    // skipped implementing this (for now) because the REST service implementation isnt consistent between operations.
    // 'transform': 'datumTransformations'
    'returnGeometry': 'returnGeometry'
  },

  params: {
    sr: 4326,
    layers: 'all',
    tolerance: 3,
    returnGeometry: true
  },

  on: function (map) {
    var extent = boundsToExtent(map.getBounds());
    var size = map.getSize();
    this.params.imageDisplay = [size.x, size.y, 96];
    this.params.mapExtent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
    return this;
  },

  at: function (geometry) {
    // cast lat, long pairs in raw array form manually
    if (geometry.length === 2) {
      geometry = leaflet.latLng(geometry);
    }
    this._setGeometryParams(geometry);
    return this;
  },

  layerDef: function (id, where) {
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  simplify: function (map, factor) {
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  run: function (callback, context) {
    return this.request(function (error, response) {
      // immediately invoke with an error
      if (error) {
        callback.call(context, error, undefined, response);
        return;

      // ok no error lets just assume we have features...
      } else {
        var featureCollection = responseToFeatureCollection(response);
        response.results = response.results.reverse();
        for (var i = 0; i < featureCollection.features.length; i++) {
          var feature = featureCollection.features[i];
          feature.layerId = response.results[i].layerId;
        }
        callback.call(context, undefined, featureCollection, response);
      }
    });
  },

  _setGeometryParams: function (geometry) {
    var converted = _setGeometry(geometry);
    this.params.geometry = converted.geometry;
    this.params.geometryType = converted.geometryType;
  }
});

function identifyFeatures (options) {
  return new IdentifyFeatures(options);
}

var IdentifyImage = Identify.extend({
  setters: {
    'setMosaicRule': 'mosaicRule',
    'setRenderingRule': 'renderingRule',
    'setPixelSize': 'pixelSize',
    'returnCatalogItems': 'returnCatalogItems',
    'returnGeometry': 'returnGeometry'
  },

  params: {
    returnGeometry: false
  },

  at: function (latlng) {
    latlng = leaflet.latLng(latlng);
    this.params.geometry = JSON.stringify({
      x: latlng.lng,
      y: latlng.lat,
      spatialReference: {
        wkid: 4326
      }
    });
    this.params.geometryType = 'esriGeometryPoint';
    return this;
  },

  getMosaicRule: function () {
    return this.params.mosaicRule;
  },

  getRenderingRule: function () {
    return this.params.renderingRule;
  },

  getPixelSize: function () {
    return this.params.pixelSize;
  },

  run: function (callback, context) {
    return this.request(function (error, response) {
      callback.call(context, error, (response && this._responseToGeoJSON(response)), response);
    }, this);
  },

  // get pixel data and return as geoJSON point
  // populate catalog items (if any)
  // merging in any catalogItemVisibilities as a propery of each feature
  _responseToGeoJSON: function (response) {
    var location = response.location;
    var catalogItems = response.catalogItems;
    var catalogItemVisibilities = response.catalogItemVisibilities;
    var geoJSON = {
      'pixel': {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [location.x, location.y]
        },
        'crs': {
          'type': 'EPSG',
          'properties': {
            'code': location.spatialReference.wkid
          }
        },
        'properties': {
          'OBJECTID': response.objectId,
          'name': response.name,
          'value': response.value
        },
        'id': response.objectId
      }
    };

    if (response.properties && response.properties.Values) {
      geoJSON.pixel.properties.values = response.properties.Values;
    }

    if (catalogItems && catalogItems.features) {
      geoJSON.catalogItems = responseToFeatureCollection(catalogItems);
      if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
        for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
          geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i];
        }
      }
    }
    return geoJSON;
  }

});

function identifyImage (params) {
  return new IdentifyImage(params);
}

var Service = leaflet.Evented.extend({

  options: {
    proxy: false,
    useCors: cors,
    timeout: 0
  },

  initialize: function (options) {
    options = options || {};
    this._requestQueue = [];
    this._authenticating = false;
    leaflet.Util.setOptions(this, options);
    this.options.url = cleanUrl(this.options.url);
  },

  get: function (path, params, callback, context) {
    return this._request('get', path, params, callback, context);
  },

  post: function (path, params, callback, context) {
    return this._request('post', path, params, callback, context);
  },

  request: function (path, params, callback, context) {
    return this._request('request', path, params, callback, context);
  },

  metadata: function (callback, context) {
    return this._request('get', '', {}, callback, context);
  },

  authenticate: function (token) {
    this._authenticating = false;
    this.options.token = token;
    this._runQueue();
    return this;
  },

  getTimeout: function () {
    return this.options.timeout;
  },

  setTimeout: function (timeout) {
    this.options.timeout = timeout;
  },

  _request: function (method, path, params, callback, context) {
    this.fire('requeststart', {
      url: this.options.url + path,
      params: params,
      method: method
    }, true);

    var wrappedCallback = this._createServiceCallback(method, path, params, callback, context);

    if (this.options.token) {
      params.token = this.options.token;
    }
    if (this.options.requestParams) {
      leaflet.Util.extend(params, this.options.requestParams);
    }
    if (this._authenticating) {
      this._requestQueue.push([method, path, params, callback, context]);
      return;
    } else {
      var url = (this.options.proxy) ? this.options.proxy + '?' + this.options.url + path : this.options.url + path;

      if ((method === 'get' || method === 'request') && !this.options.useCors) {
        return Request.get.JSONP(url, params, wrappedCallback, context);
      } else {
        return Request[method](url, params, wrappedCallback, context);
      }
    }
  },

  _createServiceCallback: function (method, path, params, callback, context) {
    return leaflet.Util.bind(function (error, response) {
      if (error && (error.code === 499 || error.code === 498)) {
        this._authenticating = true;

        this._requestQueue.push([method, path, params, callback, context]);

        // fire an event for users to handle and re-authenticate
        this.fire('authenticationrequired', {
          authenticate: leaflet.Util.bind(this.authenticate, this)
        }, true);

        // if the user has access to a callback they can handle the auth error
        error.authenticate = leaflet.Util.bind(this.authenticate, this);
      }

      callback.call(context, error, response);

      if (error) {
        this.fire('requesterror', {
          url: this.options.url + path,
          params: params,
          message: error.message,
          code: error.code,
          method: method
        }, true);
      } else {
        this.fire('requestsuccess', {
          url: this.options.url + path,
          params: params,
          response: response,
          method: method
        }, true);
      }

      this.fire('requestend', {
        url: this.options.url + path,
        params: params,
        method: method
      }, true);
    }, this);
  },

  _runQueue: function () {
    for (var i = this._requestQueue.length - 1; i >= 0; i--) {
      var request$$1 = this._requestQueue[i];
      var method = request$$1.shift();
      this[method].apply(this, request$$1);
    }
    this._requestQueue = [];
  }
});

function service (options) {
  options = getUrlParams(options);
  return new Service(options);
}

var MapService = Service.extend({

  identify: function () {
    return identifyFeatures(this);
  },

  find: function () {
    return find(this);
  },

  query: function () {
    return query(this);
  }

});

function mapService (options) {
  return new MapService(options);
}

var ImageService = Service.extend({

  query: function () {
    return query(this);
  },

  identify: function () {
    return identifyImage(this);
  }
});

function imageService (options) {
  return new ImageService(options);
}

var FeatureLayerService = Service.extend({

  options: {
    idAttribute: 'OBJECTID'
  },

  query: function () {
    return query(this);
  },

  addFeature: function (feature, callback, context) {
    this.addFeatures(feature, callback, context);
  },

  addFeatures: function (features, callback, context) {
    var featuresArray = features.features ? features.features : [features];
    for (var i = featuresArray.length - 1; i >= 0; i--) {
      delete featuresArray[i].id;
    }
    features = geojsonToArcGIS$1(features);
    features = featuresArray.length > 1 ? features : [features];
    return this.post('addFeatures', {
      features: features
    }, function (error, response) {
      // For compatibility reason with former addFeature function,
      // we return the object in the array and not the array itself
      var result = (response && response.addResults) ? response.addResults.length > 1 ? response.addResults : response.addResults[0] : undefined;
      if (callback) {
        callback.call(context, error || response.addResults[0].error, result);
      }
    }, context);
  },

  updateFeature: function (feature, callback, context) {
    this.updateFeatures(feature, callback, context);
  },

  updateFeatures: function (features, callback, context) {
    var featuresArray = features.features ? features.features : [features];
    features = geojsonToArcGIS$1(features, this.options.idAttribute);
    features = featuresArray.length > 1 ? features : [features];

    return this.post('updateFeatures', {
      features: features
    }, function (error, response) {
      // For compatibility reason with former updateFeature function,
      // we return the object in the array and not the array itself
      var result = (response && response.updateResults) ? response.updateResults.length > 1 ? response.updateResults : response.updateResults[0] : undefined;
      if (callback) {
        callback.call(context, error || response.updateResults[0].error, result);
      }
    }, context);
  },

  deleteFeature: function (id, callback, context) {
    this.deleteFeatures(id, callback, context);
  },

  deleteFeatures: function (ids, callback, context) {
    return this.post('deleteFeatures', {
      objectIds: ids
    }, function (error, response) {
      // For compatibility reason with former deleteFeature function,
      // we return the object in the array and not the array itself
      var result = (response && response.deleteResults) ? response.deleteResults.length > 1 ? response.deleteResults : response.deleteResults[0] : undefined;
      if (callback) {
        callback.call(context, error || response.deleteResults[0].error, result);
      }
    }, context);
  }
});

function featureLayerService (options) {
  return new FeatureLayerService(options);
}

var tileProtocol = (window.location.protocol !== 'https:') ? 'http:' : 'https:';

var BasemapLayer = leaflet.TileLayer.extend({
  statics: {
    TILES: {
      Streets: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Street_Map'
        }
      },
      Topographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Topo_Map'
        }
      },
      Oceans: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA',
          attributionUrl: 'https://static.arcgis.com/attribution/Ocean_Basemap'
        }
      },
      OceansLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      NationalGeographic: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.'
        }
      },
      DarkGray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors'
        }
      },
      DarkGrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''

        }
      },
      Gray: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          attribution: 'HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors'
        }
      },
      GrayLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 16,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      Imagery: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 22,
          maxNativeZoom: 22,
          downsampled: false,
          subdomains: ['server', 'services'],
          attribution: 'DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Imagery'
        }
      },
      ImageryLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      ImageryTransportation: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      ShadedRelief: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'USGS'
        }
      },
      ShadedReliefLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 12,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      Terrain: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          attribution: 'USGS, NOAA'
        }
      },
      TerrainLabels: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 13,
          subdomains: ['server', 'services'],
          pane: (pointerEvents) ? 'esri-labels' : 'tilePane',
          attribution: ''
        }
      },
      USATopo: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 15,
          subdomains: ['server', 'services'],
          attribution: 'USGS, National Geographic Society, i-cubed'
        }
      },
      ImageryClarity: {
        urlTemplate: tileProtocol + '//clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
        }
      },
      Physical: {
        urlTemplate: tileProtocol + '//{s}.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 8,
          subdomains: ['server', 'services'],
          attribution: 'U.S. National Park Service'
        }
      },
      ImageryFirefly: {
        urlTemplate: tileProtocol + '//fly.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Firefly/MapServer/tile/{z}/{y}/{x}',
        options: {
          minZoom: 1,
          maxZoom: 19,
          attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
          attributionUrl: 'https://static.arcgis.com/attribution/World_Imagery'
        }
      }
    }
  },

  initialize: function (key, options) {
    var config;

    // set the config variable with the appropriate config object
    if (typeof key === 'object' && key.urlTemplate && key.options) {
      config = key;
    } else if (typeof key === 'string' && BasemapLayer.TILES[key]) {
      config = BasemapLayer.TILES[key];
    } else {
      throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Physical", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ImageryClarity", "ImageryFirefly", ShadedRelief", "ShadedReliefLabels", "Terrain", "TerrainLabels" or "USATopo"');
    }

    // merge passed options into the config options
    var tileOptions = leaflet.Util.extend(config.options, options);

    leaflet.Util.setOptions(this, tileOptions);

    if (this.options.token && config.urlTemplate.indexOf('token=') === -1) {
      config.urlTemplate += ('?token=' + this.options.token);
    }
    if (this.options.proxy) {
      config.urlTemplate = this.options.proxy + '?' + config.urlTemplate;
    }

    // call the initialize method on L.TileLayer to set everything up
    leaflet.TileLayer.prototype.initialize.call(this, config.urlTemplate, tileOptions);
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (this.options.pane === 'esri-labels') {
      this._initPane();
    }
    // some basemaps can supply dynamic attribution
    if (this.options.attributionUrl) {
      _getAttributionData((this.options.proxy ? this.options.proxy + '?' : '') + this.options.attributionUrl, map);
    }

    map.on('moveend', _updateMapAttribution);

    // Esri World Imagery is cached all the way to zoom 22 in select regions
    if (this._url.indexOf('World_Imagery') !== -1) {
      map.on('zoomanim', _fetchTilemap, this);
    }

    leaflet.TileLayer.prototype.onAdd.call(this, map);
  },

  onRemove: function (map) {
    map.off('moveend', _updateMapAttribution);
    leaflet.TileLayer.prototype.onRemove.call(this, map);
  },

  _initPane: function () {
    if (!this._map.getPane(this.options.pane)) {
      var pane = this._map.createPane(this.options.pane);
      pane.style.pointerEvents = 'none';
      pane.style.zIndex = 500;
    }
  },

  getAttribution: function () {
    if (this.options.attribution) {
      var attribution = '<span class="esri-dynamic-attribution">' + this.options.attribution + '</span>';
    }
    return attribution;
  }
});

function _fetchTilemap (evt) {
  var map = evt.target;
  if (!map) { return; }

  var oldZoom = map.getZoom();
  var newZoom = evt.zoom;
  var newCenter = map.wrapLatLng(evt.center);

  if (newZoom > oldZoom && newZoom > 13 && !this.options.downsampled) {
    // convert wrapped lat/long into tile coordinates and use them to generate the tilemap url
    var tilePoint = map.project(newCenter, newZoom).divideBy(256).floor();

    // use new coords to determine the tilemap url
    var tileUrl = leaflet.Util.template(this._url, leaflet.Util.extend({
      s: this._getSubdomain(tilePoint),
      x: tilePoint.x,
      y: tilePoint.y,
      z: newZoom
    }, this.options));

    // 8x8 grids are cached
    var tilemapUrl = tileUrl.replace(/tile/, 'tilemap') + '/8/8';

    // an array of booleans in the response indicate missing tiles
    L.esri.request(tilemapUrl, {}, function (err, response) {
      if (!err) {
        for (var i = 0; i < response.data.length; i++) {
          if (!response.data[i]) {
            // if necessary, resample a lower zoom
            this.options.maxNativeZoom = newZoom - 1;
            this.options.downsampled = true;
            break;
          }
          // if no tiles are missing, reset the original maxZoom
          this.options.maxNativeZoom = 22;
        }
      }
    }, this);
  } else if (newZoom < 13) {
    // if the user moves to a new region, time for a fresh test
    this.options.downsampled = false;
  }
}

function basemapLayer (key, options) {
  return new BasemapLayer(key, options);
}

var TiledMapLayer = leaflet.TileLayer.extend({
  options: {
    zoomOffsetAllowance: 0.1,
    errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAAAA1BMVEUzNDVszlHHAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAAAAAAAAAB6mUWpAAAADZJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7waBAAABw08RwAAAAABJRU5ErkJggg=='
  },

  statics: {
    MercatorZoomLevels: {
      '0': 156543.03392799999,
      '1': 78271.516963999893,
      '2': 39135.758482000099,
      '3': 19567.879240999901,
      '4': 9783.9396204999593,
      '5': 4891.9698102499797,
      '6': 2445.9849051249898,
      '7': 1222.9924525624899,
      '8': 611.49622628138002,
      '9': 305.74811314055802,
      '10': 152.874056570411,
      '11': 76.437028285073197,
      '12': 38.218514142536598,
      '13': 19.109257071268299,
      '14': 9.5546285356341496,
      '15': 4.7773142679493699,
      '16': 2.38865713397468,
      '17': 1.1943285668550501,
      '18': 0.59716428355981699,
      '19': 0.29858214164761698,
      '20': 0.14929107082381,
      '21': 0.07464553541191,

      '22': 0.0373227677059525,
      '23': 0.0186613838529763
    }
  },

  initialize: function (options) {
    options = leaflet.Util.setOptions(this, options);

    // set the urls
    options = getUrlParams(options);
    this.tileUrl = (options.proxy ? options.proxy + '?' : '') + options.url + 'tile/{z}/{y}/{x}' + (options.requestParams && Object.keys(options.requestParams).length > 0 ? leaflet.Util.getParamString(options.requestParams) : '');
    // Remove subdomain in url
    // https://github.com/Esri/esri-leaflet/issues/991
    if (options.url.indexOf('{s}') !== -1 && options.subdomains) {
      options.url = options.url.replace('{s}', options.subdomains[0]);
    }
    this.service = mapService(options);
    this.service.addEventParent(this);

    var arcgisonline = new RegExp(/tiles.arcgis(online)?\.com/g);
    if (arcgisonline.test(options.url)) {
      this.tileUrl = this.tileUrl.replace('://tiles', '://tiles{s}');
      options.subdomains = ['1', '2', '3', '4'];
    }

    if (this.options.token) {
      this.tileUrl += ('?token=' + this.options.token);
    }

    // init layer by calling TileLayers initialize method
    leaflet.TileLayer.prototype.initialize.call(this, this.tileUrl, options);
  },

  getTileUrl: function (tilePoint) {
    var zoom = this._getZoomForUrl();

    return leaflet.Util.template(this.tileUrl, leaflet.Util.extend({
      s: this._getSubdomain(tilePoint),
      x: tilePoint.x,
      y: tilePoint.y,
      // try lod map first, then just default to zoom level
      z: (this._lodMap && this._lodMap[zoom]) ? this._lodMap[zoom] : zoom
    }, this.options));
  },

  createTile: function (coords, done) {
    var tile = document.createElement('img');

    leaflet.DomEvent.on(tile, 'load', leaflet.Util.bind(this._tileOnLoad, this, done, tile));
    leaflet.DomEvent.on(tile, 'error', leaflet.Util.bind(this._tileOnError, this, done, tile));

    if (this.options.crossOrigin) {
      tile.crossOrigin = '';
    }

    /*
     Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
     http://www.w3.org/TR/WCAG20-TECHS/H67
    */
    tile.alt = '';

    // if there is no lod map or an lod map with a proper zoom load the tile
    // otherwise wait for the lod map to become available
    if (!this._lodMap || (this._lodMap && this._lodMap[this._getZoomForUrl()])) {
      tile.src = this.getTileUrl(coords);
    } else {
      this.once('lodmap', function () {
        tile.src = this.getTileUrl(coords);
      }, this);
    }

    return tile;
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (!this._lodMap) {
      this.metadata(function (error, metadata) {
        if (!error && metadata.spatialReference) {
          var sr = metadata.spatialReference.latestWkid || metadata.spatialReference.wkid;
          // display the copyright text from the service using leaflet's attribution control
          if (!this.options.attribution && map.attributionControl && metadata.copyrightText) {
            this.options.attribution = metadata.copyrightText;
            map.attributionControl.addAttribution(this.getAttribution());
          }

          // if the service tiles were published in web mercator using conventional LODs but missing levels, we can try and remap them
          if (map.options.crs === leaflet.CRS.EPSG3857 && (sr === 102100 || sr === 3857)) {
            this._lodMap = {};
            // create the zoom level data
            var arcgisLODs = metadata.tileInfo.lods;
            var correctResolutions = TiledMapLayer.MercatorZoomLevels;

            for (var i = 0; i < arcgisLODs.length; i++) {
              var arcgisLOD = arcgisLODs[i];
              for (var ci in correctResolutions) {
                var correctRes = correctResolutions[ci];

                if (this._withinPercentage(arcgisLOD.resolution, correctRes, this.options.zoomOffsetAllowance)) {
                  this._lodMap[ci] = arcgisLOD.level;
                  break;
                }
              }
            }

            this.fire('lodmap');
          } else if (map.options.crs && map.options.crs.code && (map.options.crs.code.indexOf(sr) > -1)) {
            // if the projection is WGS84, or the developer is using Proj4 to define a custom CRS, no action is required
          } else {
            // if the service was cached in a custom projection and an appropriate LOD hasn't been defined in the map, guide the developer to our Proj4 sample
            warn('L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html');
          }
        }
      }, this);
    }

    leaflet.TileLayer.prototype.onAdd.call(this, map);
  },

  metadata: function (callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  identify: function () {
    return this.service.identify();
  },

  find: function () {
    return this.service.find();
  },

  query: function () {
    return this.service.query();
  },

  authenticate: function (token) {
    var tokenQs = '?token=' + token;
    this.tileUrl = (this.options.token) ? this.tileUrl.replace(/\?token=(.+)/g, tokenQs) : this.tileUrl + tokenQs;
    this.options.token = token;
    this.service.authenticate(token);
    return this;
  },

  _withinPercentage: function (a, b, percentage) {
    var diff = Math.abs((a / b) - 1);
    return diff < percentage;
  }
});

function tiledMapLayer (url, options) {
  return new TiledMapLayer(url, options);
}

var Overlay = leaflet.ImageOverlay.extend({
  onAdd: function (map) {
    this._topLeft = map.getPixelBounds().min;
    leaflet.ImageOverlay.prototype.onAdd.call(this, map);
  },
  _reset: function () {
    if (this._map.options.crs === leaflet.CRS.EPSG3857) {
      leaflet.ImageOverlay.prototype._reset.call(this);
    } else {
      leaflet.DomUtil.setPosition(this._image, this._topLeft.subtract(this._map.getPixelOrigin()));
    }
  }
});

var RasterLayer = leaflet.Layer.extend({
  options: {
    opacity: 1,
    position: 'front',
    f: 'image',
    useCors: cors,
    attribution: null,
    interactive: false,
    alt: ''
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    if (this.options.zIndex) {
      this.options.position = null;
    }

    this._update = leaflet.Util.throttle(this._update, this.options.updateInterval, this);

    map.on('moveend', this._update, this);

    // if we had an image loaded and it matches the
    // current bounds show the image otherwise remove it
    if (this._currentImage && this._currentImage._bounds.equals(this._map.getBounds())) {
      map.addLayer(this._currentImage);
    } else if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }

    this._update();

    if (this._popup) {
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }

    // add copyright text listed in service metadata
    this.metadata(function (err, metadata) {
      if (!err && !this.options.attribution && map.attributionControl && metadata.copyrightText) {
        this.options.attribution = metadata.copyrightText;
        map.attributionControl.addAttribution(this.getAttribution());
      }
    }, this);
  },

  onRemove: function (map) {
    if (this._currentImage) {
      this._map.removeLayer(this._currentImage);
    }

    if (this._popup) {
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }

    this._map.off('moveend', this._update, this);
  },

  bindPopup: function (fn, popupOptions) {
    this._shouldRenderPopup = false;
    this._lastClick = false;
    this._popup = leaflet.popup(popupOptions);
    this._popupFunction = fn;
    if (this._map) {
      this._map.on('click', this._getPopupData, this);
      this._map.on('dblclick', this._resetPopupState, this);
    }
    return this;
  },

  unbindPopup: function () {
    if (this._map) {
      this._map.closePopup(this._popup);
      this._map.off('click', this._getPopupData, this);
      this._map.off('dblclick', this._resetPopupState, this);
    }
    this._popup = false;
    return this;
  },

  bringToFront: function () {
    this.options.position = 'front';
    if (this._currentImage) {
      this._currentImage.bringToFront();
      this._setAutoZIndex(Math.max);
    }
    return this;
  },

  bringToBack: function () {
    this.options.position = 'back';
    if (this._currentImage) {
      this._currentImage.bringToBack();
      this._setAutoZIndex(Math.min);
    }
    return this;
  },

  setZIndex: function (value) {
    this.options.zIndex = value;
    if (this._currentImage) {
      this._currentImage.setZIndex(value);
    }
    return this;
  },

  _setAutoZIndex: function (compare) {
    // go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)
    if (!this._currentImage) {
      return;
    }
    var layers = this._currentImage.getPane().children;
    var edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min
    for (var i = 0, len = layers.length, zIndex; i < len; i++) {
      zIndex = layers[i].style.zIndex;
      if (layers[i] !== this._currentImage._image && zIndex) {
        edgeZIndex = compare(edgeZIndex, +zIndex);
      }
    }

    if (isFinite(edgeZIndex)) {
      this.options.zIndex = edgeZIndex + compare(-1, 1);
      this.setZIndex(this.options.zIndex);
    }
  },

  getAttribution: function () {
    return this.options.attribution;
  },

  getOpacity: function () {
    return this.options.opacity;
  },

  setOpacity: function (opacity) {
    this.options.opacity = opacity;
    if (this._currentImage) {
      this._currentImage.setOpacity(opacity);
    }
    return this;
  },

  getTimeRange: function () {
    return [this.options.from, this.options.to];
  },

  setTimeRange: function (from, to) {
    this.options.from = from;
    this.options.to = to;
    this._update();
    return this;
  },

  metadata: function (callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  authenticate: function (token) {
    this.service.authenticate(token);
    return this;
  },

  redraw: function () {
    this._update();
  },

  _renderImage: function (url, bounds, contentType) {
    if (this._map) {
      // if no output directory has been specified for a service, MIME data will be returned
      if (contentType) {
        url = 'data:' + contentType + ';base64,' + url;
      }

      // if server returns an inappropriate response, abort.
      if (!url) return;

      // create a new image overlay and add it to the map
      // to start loading the image
      // opacity is 0 while the image is loading
      var image = new Overlay(url, bounds, {
        opacity: 0,
        crossOrigin: this.options.useCors,
        alt: this.options.alt,
        pane: this.options.pane || this.getPane(),
        interactive: this.options.interactive
      }).addTo(this._map);

      var onOverlayError = function () {
        this._map.removeLayer(image);
        this.fire('error');
        image.off('load', onOverlayLoad, this);
      };

      var onOverlayLoad = function (e) {
        image.off('error', onOverlayLoad, this);
        if (this._map) {
          var newImage = e.target;
          var oldImage = this._currentImage;

          // if the bounds of this image matches the bounds that
          // _renderImage was called with and we have a map with the same bounds
          // hide the old image if there is one and set the opacity
          // of the new image otherwise remove the new image
          if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
            this._currentImage = newImage;

            if (this.options.position === 'front') {
              this.bringToFront();
            } else if (this.options.position === 'back') {
              this.bringToBack();
            }

            if (this.options.zIndex) {
              this.setZIndex(this.options.zIndex);
            }

            if (this._map && this._currentImage._map) {
              this._currentImage.setOpacity(this.options.opacity);
            } else {
              this._currentImage._map.removeLayer(this._currentImage);
            }

            if (oldImage && this._map) {
              this._map.removeLayer(oldImage);
            }

            if (oldImage && oldImage._map) {
              oldImage._map.removeLayer(oldImage);
            }
          } else {
            this._map.removeLayer(newImage);
          }
        }

        this.fire('load', {
          bounds: bounds
        });
      };

      // If loading the image fails
      image.once('error', onOverlayError, this);

      // once the image loads
      image.once('load', onOverlayLoad, this);
    }
  },

  _update: function () {
    if (!this._map) {
      return;
    }

    var zoom = this._map.getZoom();
    var bounds = this._map.getBounds();

    if (this._animatingZoom) {
      return;
    }

    if (this._map._panTransition && this._map._panTransition._inProgress) {
      return;
    }

    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      if (this._currentImage) {
        this._currentImage._map.removeLayer(this._currentImage);
        this._currentImage = null;
      }
      return;
    }

    var params = this._buildExportParams();
    leaflet.Util.extend(params, this.options.requestParams);

    if (params) {
      this._requestExport(params, bounds);

      this.fire('loading', {
        bounds: bounds
      });
    } else if (this._currentImage) {
      this._currentImage._map.removeLayer(this._currentImage);
      this._currentImage = null;
    }
  },

  _renderPopup: function (latlng, error, results, response) {
    latlng = leaflet.latLng(latlng);
    if (this._shouldRenderPopup && this._lastClick.equals(latlng)) {
      // add the popup to the map where the mouse was clicked at
      var content = this._popupFunction(error, results, response);
      if (content) {
        this._popup.setLatLng(latlng).setContent(content).openOn(this._map);
      }
    }
  },

  _resetPopupState: function (e) {
    this._shouldRenderPopup = false;
    this._lastClick = e.latlng;
  },

  _calculateBbox: function () {
    var pixelBounds = this._map.getPixelBounds();

    var sw = this._map.unproject(pixelBounds.getBottomLeft());
    var ne = this._map.unproject(pixelBounds.getTopRight());

    var neProjected = this._map.options.crs.project(ne);
    var swProjected = this._map.options.crs.project(sw);

    // this ensures ne/sw are switched in polar maps where north/top bottom/south is inverted
    var boundsProjected = leaflet.bounds(neProjected, swProjected);

    return [boundsProjected.getBottomLeft().x, boundsProjected.getBottomLeft().y, boundsProjected.getTopRight().x, boundsProjected.getTopRight().y].join(',');
  },

  _calculateImageSize: function () {
    // ensure that we don't ask ArcGIS Server for a taller image than we have actual map displaying within the div
    var bounds = this._map.getPixelBounds();
    var size = this._map.getSize();

    var sw = this._map.unproject(bounds.getBottomLeft());
    var ne = this._map.unproject(bounds.getTopRight());

    var top = this._map.latLngToLayerPoint(ne).y;
    var bottom = this._map.latLngToLayerPoint(sw).y;

    if (top > 0 || bottom < size.y) {
      size.y = bottom - top;
    }

    return size.x + ',' + size.y;
  }
});

var ImageMapLayer = RasterLayer.extend({

  options: {
    updateInterval: 150,
    format: 'jpgpng',
    transparent: true,
    f: 'image'
  },

  query: function () {
    return this.service.query();
  },

  identify: function () {
    return this.service.identify();
  },

  initialize: function (options) {
    options = getUrlParams(options);
    this.service = imageService(options);
    this.service.addEventParent(this);

    leaflet.Util.setOptions(this, options);
  },

  setPixelType: function (pixelType) {
    this.options.pixelType = pixelType;
    this._update();
    return this;
  },

  getPixelType: function () {
    return this.options.pixelType;
  },

  setBandIds: function (bandIds) {
    if (leaflet.Util.isArray(bandIds)) {
      this.options.bandIds = bandIds.join(',');
    } else {
      this.options.bandIds = bandIds.toString();
    }
    this._update();
    return this;
  },

  getBandIds: function () {
    return this.options.bandIds;
  },

  setNoData: function (noData, noDataInterpretation) {
    if (leaflet.Util.isArray(noData)) {
      this.options.noData = noData.join(',');
    } else {
      this.options.noData = noData.toString();
    }
    if (noDataInterpretation) {
      this.options.noDataInterpretation = noDataInterpretation;
    }
    this._update();
    return this;
  },

  getNoData: function () {
    return this.options.noData;
  },

  getNoDataInterpretation: function () {
    return this.options.noDataInterpretation;
  },

  setRenderingRule: function (renderingRule) {
    this.options.renderingRule = renderingRule;
    this._update();
  },

  getRenderingRule: function () {
    return this.options.renderingRule;
  },

  setMosaicRule: function (mosaicRule) {
    this.options.mosaicRule = mosaicRule;
    this._update();
  },

  getMosaicRule: function () {
    return this.options.mosaicRule;
  },

  _getPopupData: function (e) {
    var callback = leaflet.Util.bind(function (error, results, response) {
      if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire
      setTimeout(leaflet.Util.bind(function () {
        this._renderPopup(e.latlng, error, results, response);
      }, this), 300);
    }, this);

    var identifyRequest = this.identify().at(e.latlng);

    // set mosaic rule for identify task if it is set for layer
    if (this.options.mosaicRule) {
      identifyRequest.setMosaicRule(this.options.mosaicRule);
      // @TODO: force return catalog items too?
    }

    // @TODO: set rendering rule? Not sure,
    // sometimes you want raw pixel values
    // if (this.options.renderingRule) {
    //   identifyRequest.setRenderingRule(this.options.renderingRule);
    // }

    identifyRequest.run(callback);

    // set the flags to show the popup
    this._shouldRenderPopup = true;
    this._lastClick = e.latlng;
  },

  _buildExportParams: function () {
    var sr = parseInt(this._map.options.crs.code.split(':')[1], 10);

    var params = {
      bbox: this._calculateBbox(),
      size: this._calculateImageSize(),
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: sr,
      imageSR: sr
    };

    if (this.options.from && this.options.to) {
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if (this.options.pixelType) {
      params.pixelType = this.options.pixelType;
    }

    if (this.options.interpolation) {
      params.interpolation = this.options.interpolation;
    }

    if (this.options.compressionQuality) {
      params.compressionQuality = this.options.compressionQuality;
    }

    if (this.options.bandIds) {
      params.bandIds = this.options.bandIds;
    }

    // 0 is falsy *and* a valid input parameter
    if (this.options.noData === 0 || this.options.noData) {
      params.noData = this.options.noData;
    }

    if (this.options.noDataInterpretation) {
      params.noDataInterpretation = this.options.noDataInterpretation;
    }

    if (this.service.options.token) {
      params.token = this.service.options.token;
    }

    if (this.options.renderingRule) {
      params.renderingRule = JSON.stringify(this.options.renderingRule);
    }

    if (this.options.mosaicRule) {
      params.mosaicRule = JSON.stringify(this.options.mosaicRule);
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if (this.options.f === 'json') {
      this.service.request('exportImage', params, function (error, response) {
        if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire
        if (this.options.token) {
          response.href += ('?token=' + this.options.token);
        }
        if (this.options.proxy) {
          response.href = this.options.proxy + '?' + response.href;
        }
        this._renderImage(response.href, bounds);
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.options.url + 'exportImage' + leaflet.Util.getParamString(params), bounds);
    }
  }
});

function imageMapLayer (url, options) {
  return new ImageMapLayer(url, options);
}

var DynamicMapLayer = RasterLayer.extend({

  options: {
    updateInterval: 150,
    layers: false,
    layerDefs: false,
    timeOptions: false,
    format: 'png24',
    transparent: true,
    f: 'json'
  },

  initialize: function (options) {
    options = getUrlParams(options);
    this.service = mapService(options);
    this.service.addEventParent(this);

    if ((options.proxy || options.token) && options.f !== 'json') {
      options.f = 'json';
    }

    leaflet.Util.setOptions(this, options);
  },

  getDynamicLayers: function () {
    return this.options.dynamicLayers;
  },

  setDynamicLayers: function (dynamicLayers) {
    this.options.dynamicLayers = dynamicLayers;
    this._update();
    return this;
  },

  getLayers: function () {
    return this.options.layers;
  },

  setLayers: function (layers) {
    this.options.layers = layers;
    this._update();
    return this;
  },

  getLayerDefs: function () {
    return this.options.layerDefs;
  },

  setLayerDefs: function (layerDefs) {
    this.options.layerDefs = layerDefs;
    this._update();
    return this;
  },

  getTimeOptions: function () {
    return this.options.timeOptions;
  },

  setTimeOptions: function (timeOptions) {
    this.options.timeOptions = timeOptions;
    this._update();
    return this;
  },

  query: function () {
    return this.service.query();
  },

  identify: function () {
    return this.service.identify();
  },

  find: function () {
    return this.service.find();
  },

  _getPopupData: function (e) {
    var callback = leaflet.Util.bind(function (error, featureCollection, response) {
      if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire
      setTimeout(leaflet.Util.bind(function () {
        this._renderPopup(e.latlng, error, featureCollection, response);
      }, this), 300);
    }, this);

    var identifyRequest;
    if (this.options.popup) {
      identifyRequest = this.options.popup.on(this._map).at(e.latlng);
    } else {
      identifyRequest = this.identify().on(this._map).at(e.latlng);
    }

    // remove extraneous vertices from response features if it has not already been done
    identifyRequest.params.maxAllowableOffset ? true : identifyRequest.simplify(this._map, 0.5);

    if (!(this.options.popup && this.options.popup.params && this.options.popup.params.layers)) {
      if (this.options.layers) {
        identifyRequest.layers('visible:' + this.options.layers.join(','));
      } else {
        identifyRequest.layers('visible');
      }
    }

    // if present, pass layer ids and sql filters through to the identify task
    if (this.options.layerDefs && typeof this.options.layerDefs !== 'string' && !identifyRequest.params.layerDefs) {
      for (var id in this.options.layerDefs) {
        if (this.options.layerDefs.hasOwnProperty(id)) {

          identifyRequest.layerDef(id, this.options.layerDefs[id]);
        }
      }
    }

    identifyRequest.run(callback);

    // set the flags to show the popup
    this._shouldRenderPopup = true;
    this._lastClick = e.latlng;
  },

  _buildExportParams: function () {
    var sr = parseInt(this._map.options.crs.code.split(':')[1], 10);

    var params = {
      bbox: this._calculateBbox(),
      size: this._calculateImageSize(),
      dpi: 96,
      format: this.options.format,
      transparent: this.options.transparent,
      bboxSR: sr,
      imageSR: sr
    };

    if (this.options.dynamicLayers) {
      params.dynamicLayers = this.options.dynamicLayers;
    }

    if (this.options.layers) {
      if (this.options.layers.length === 0) {
        return;
      } else {
        params.layers = 'show:' + this.options.layers.join(',');
      }
    }

    if (this.options.layerDefs) {
      params.layerDefs = typeof this.options.layerDefs === 'string' ? this.options.layerDefs : JSON.stringify(this.options.layerDefs);
    }

    if (this.options.timeOptions) {
      params.timeOptions = JSON.stringify(this.options.timeOptions);
    }

    if (this.options.from && this.options.to) {
      params.time = this.options.from.valueOf() + ',' + this.options.to.valueOf();
    }

    if (this.service.options.token) {
      params.token = this.service.options.token;
    }

    if (this.options.proxy) {
      params.proxy = this.options.proxy;
    }

    // use a timestamp to bust server cache
    if (this.options.disableCache) {
      params._ts = Date.now();
    }

    return params;
  },

  _requestExport: function (params, bounds) {
    if (this.options.f === 'json') {
      this.service.request('export', params, function (error, response) {
        if (error) { return; } // we really can't do anything here but authenticate or requesterror will fire

        if (this.options.token && response.href) {
          response.href += ('?token=' + this.options.token);
        }
        if (this.options.proxy && response.href) {
          response.href = this.options.proxy + '?' + response.href;
        }
        if (response.href) {
          this._renderImage(response.href, bounds);
        } else {
          this._renderImage(response.imageData, bounds, response.contentType);
        }
      }, this);
    } else {
      params.f = 'image';
      this._renderImage(this.options.url + 'export' + leaflet.Util.getParamString(params), bounds);
    }
  }
});

function dynamicMapLayer (url, options) {
  return new DynamicMapLayer(url, options);
}

var VirtualGrid = leaflet.Layer.extend({

  options: {
    cellSize: 512,
    updateInterval: 150
  },

  initialize: function (options) {
    options = leaflet.setOptions(this, options);
    this._zooming = false;
  },

  onAdd: function (map) {
    this._map = map;
    this._update = leaflet.Util.throttle(this._update, this.options.updateInterval, this);
    this._reset();
    this._update();
  },

  onRemove: function () {
    this._map.removeEventListener(this.getEvents(), this);
    this._removeCells();
  },

  getEvents: function () {
    var events = {
      moveend: this._update,
      zoomstart: this._zoomstart,
      zoomend: this._reset
    };

    return events;
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  removeFrom: function (map) {
    map.removeLayer(this);
    return this;
  },

  _zoomstart: function () {
    this._zooming = true;
  },

  _reset: function () {
    this._removeCells();

    this._cells = {};
    this._activeCells = {};
    this._cellsToLoad = 0;
    this._cellsTotal = 0;
    this._cellNumBounds = this._getCellNumBounds();

    this._resetWrap();
    this._zooming = false;
  },

  _resetWrap: function () {
    var map = this._map;
    var crs = map.options.crs;

    if (crs.infinite) { return; }

    var cellSize = this._getCellSize();

    if (crs.wrapLng) {
      this._wrapLng = [
        Math.floor(map.project([0, crs.wrapLng[0]]).x / cellSize),
        Math.ceil(map.project([0, crs.wrapLng[1]]).x / cellSize)
      ];
    }

    if (crs.wrapLat) {
      this._wrapLat = [
        Math.floor(map.project([crs.wrapLat[0], 0]).y / cellSize),
        Math.ceil(map.project([crs.wrapLat[1], 0]).y / cellSize)
      ];
    }
  },

  _getCellSize: function () {
    return this.options.cellSize;
  },

  _update: function () {
    if (!this._map) {
      return;
    }

    var mapBounds = this._map.getPixelBounds();
    var cellSize = this._getCellSize();

    // cell coordinates range for the current view
    var cellBounds = leaflet.bounds(
      mapBounds.min.divideBy(cellSize).floor(),
      mapBounds.max.divideBy(cellSize).floor());

    this._removeOtherCells(cellBounds);
    this._addCells(cellBounds);

    this.fire('cellsupdated');
  },

  _addCells: function (cellBounds) {
    var queue = [];
    var center = cellBounds.getCenter();
    var zoom = this._map.getZoom();

    var j, i, coords;
    // create a queue of coordinates to load cells from
    for (j = cellBounds.min.y; j <= cellBounds.max.y; j++) {
      for (i = cellBounds.min.x; i <= cellBounds.max.x; i++) {
        coords = leaflet.point(i, j);
        coords.z = zoom;

        if (this._isValidCell(coords)) {
          queue.push(coords);
        }
      }
    }

    var cellsToLoad = queue.length;

    if (cellsToLoad === 0) { return; }

    this._cellsToLoad += cellsToLoad;
    this._cellsTotal += cellsToLoad;

    // sort cell queue to load cells in order of their distance to center
    queue.sort(function (a, b) {
      return a.distanceTo(center) - b.distanceTo(center);
    });

    for (i = 0; i < cellsToLoad; i++) {
      this._addCell(queue[i]);
    }
  },

  _isValidCell: function (coords) {
    var crs = this._map.options.crs;

    if (!crs.infinite) {
      // don't load cell if it's out of bounds and not wrapped
      var cellNumBounds = this._cellNumBounds;

      if (!cellNumBounds) return false;
      if (
        (!crs.wrapLng && (coords.x < cellNumBounds.min.x || coords.x > cellNumBounds.max.x)) ||
        (!crs.wrapLat && (coords.y < cellNumBounds.min.y || coords.y > cellNumBounds.max.y))
      ) {
        return false;
      }
    }

    if (!this.options.bounds) {
      return true;
    }

    // don't load cell if it doesn't intersect the bounds in options
    var cellBounds = this._cellCoordsToBounds(coords);
    return leaflet.latLngBounds(this.options.bounds).intersects(cellBounds);
  },

  // converts cell coordinates to its geographical bounds
  _cellCoordsToBounds: function (coords) {
    var map = this._map;
    var cellSize = this.options.cellSize;
    var nwPoint = coords.multiplyBy(cellSize);
    var sePoint = nwPoint.add([cellSize, cellSize]);
    var nw = map.wrapLatLng(map.unproject(nwPoint, coords.z));
    var se = map.wrapLatLng(map.unproject(sePoint, coords.z));

    return leaflet.latLngBounds(nw, se);
  },

  // converts cell coordinates to key for the cell cache
  _cellCoordsToKey: function (coords) {
    return coords.x + ':' + coords.y;
  },

  // converts cell cache key to coordiantes
  _keyToCellCoords: function (key) {
    var kArr = key.split(':');
    var x = parseInt(kArr[0], 10);
    var y = parseInt(kArr[1], 10);

    return leaflet.point(x, y);
  },

  // remove any present cells that are off the specified bounds
  _removeOtherCells: function (bounds) {
    for (var key in this._cells) {
      if (!bounds.contains(this._keyToCellCoords(key))) {
        this._removeCell(key);
      }
    }
  },

  _removeCell: function (key) {
    var cell = this._activeCells[key];

    if (cell) {
      delete this._activeCells[key];

      if (this.cellLeave) {
        this.cellLeave(cell.bounds, cell.coords);
      }

      this.fire('cellleave', {
        bounds: cell.bounds,
        coords: cell.coords
      });
    }
  },

  _removeCells: function () {
    for (var key in this._cells) {
      var cellBounds = this._cells[key].bounds;
      var coords = this._cells[key].coords;

      if (this.cellLeave) {
        this.cellLeave(cellBounds, coords);
      }

      this.fire('cellleave', {
        bounds: cellBounds,
        coords: coords
      });
    }
  },

  _addCell: function (coords) {
    // wrap cell coords if necessary (depending on CRS)
    this._wrapCoords(coords);

    // generate the cell key
    var key = this._cellCoordsToKey(coords);

    // get the cell from the cache
    var cell = this._cells[key];
    // if this cell should be shown as isnt active yet (enter)

    if (cell && !this._activeCells[key]) {
      if (this.cellEnter) {
        this.cellEnter(cell.bounds, coords);
      }

      this.fire('cellenter', {
        bounds: cell.bounds,
        coords: coords
      });

      this._activeCells[key] = cell;
    }

    // if we dont have this cell in the cache yet (create)
    if (!cell) {
      cell = {
        coords: coords,
        bounds: this._cellCoordsToBounds(coords)
      };

      this._cells[key] = cell;
      this._activeCells[key] = cell;

      if (this.createCell) {
        this.createCell(cell.bounds, coords);
      }

      this.fire('cellcreate', {
        bounds: cell.bounds,
        coords: coords
      });
    }
  },

  _wrapCoords: function (coords) {
    coords.x = this._wrapLng ? leaflet.Util.wrapNum(coords.x, this._wrapLng) : coords.x;
    coords.y = this._wrapLat ? leaflet.Util.wrapNum(coords.y, this._wrapLat) : coords.y;
  },

  // get the global cell coordinates range for the current zoom
  _getCellNumBounds: function () {
    var worldBounds = this._map.getPixelWorldBounds();
    var size = this._getCellSize();

    return worldBounds ? leaflet.bounds(
      worldBounds.min.divideBy(size).floor(),
      worldBounds.max.divideBy(size).ceil().subtract([1, 1])) : null;
  }
});

function BinarySearchIndex (values) {
  this.values = [].concat(values || []);
}

BinarySearchIndex.prototype.query = function (value) {
  var index = this.getIndex(value);
  return this.values[index];
};

BinarySearchIndex.prototype.getIndex = function getIndex (value) {
  if (this.dirty) {
    this.sort();
  }

  var minIndex = 0;
  var maxIndex = this.values.length - 1;
  var currentIndex;
  var currentElement;

  while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0;
    currentElement = this.values[Math.round(currentIndex)];
    if (+currentElement.value < +value) {
      minIndex = currentIndex + 1;
    } else if (+currentElement.value > +value) {
      maxIndex = currentIndex - 1;
    } else {
      return currentIndex;
    }
  }

  return Math.abs(~maxIndex);
};

BinarySearchIndex.prototype.between = function between (start, end) {
  var startIndex = this.getIndex(start);
  var endIndex = this.getIndex(end);

  if (startIndex === 0 && endIndex === 0) {
    return [];
  }

  while (this.values[startIndex - 1] && this.values[startIndex - 1].value === start) {
    startIndex--;
  }

  while (this.values[endIndex + 1] && this.values[endIndex + 1].value === end) {
    endIndex++;
  }

  if (this.values[endIndex] && this.values[endIndex].value === end && this.values[endIndex + 1]) {
    endIndex++;
  }

  return this.values.slice(startIndex, endIndex);
};

BinarySearchIndex.prototype.insert = function insert (item) {
  this.values.splice(this.getIndex(item.value), 0, item);
  return this;
};

BinarySearchIndex.prototype.bulkAdd = function bulkAdd (items, sort) {
  this.values = this.values.concat([].concat(items || []));

  if (sort) {
    this.sort();
  } else {
    this.dirty = true;
  }

  return this;
};

BinarySearchIndex.prototype.sort = function sort () {
  this.values.sort(function (a, b) {
    return +b.value - +a.value;
  }).reverse();
  this.dirty = false;
  return this;
};

var FeatureManager = VirtualGrid.extend({
  /**
   * Options
   */

  options: {
    attribution: null,
    where: '1=1',
    fields: ['*'],
    from: false,
    to: false,
    timeField: false,
    timeFilterMode: 'server',
    simplifyFactor: 0,
    precision: 6
  },

  /**
   * Constructor
   */

  initialize: function (options) {
    VirtualGrid.prototype.initialize.call(this, options);

    options = getUrlParams(options);
    options = leaflet.Util.setOptions(this, options);

    this.service = featureLayerService(options);
    this.service.addEventParent(this);

    // use case insensitive regex to look for common fieldnames used for indexing
    if (this.options.fields[0] !== '*') {
      var oidCheck = false;
      for (var i = 0; i < this.options.fields.length; i++) {
        if (this.options.fields[i].match(/^(OBJECTID|FID|OID|ID)$/i)) {
          oidCheck = true;
        }
      }
      if (oidCheck === false) {
        warn('no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.');
      }
    }

    if (this.options.timeField.start && this.options.timeField.end) {
      this._startTimeIndex = new BinarySearchIndex();
      this._endTimeIndex = new BinarySearchIndex();
    } else if (this.options.timeField) {
      this._timeIndex = new BinarySearchIndex();
    }

    this._cache = {};
    this._currentSnapshot = []; // cache of what layers should be active
    this._activeRequests = 0;
  },

  /**
   * Layer Interface
   */

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    setEsriAttribution(map);

    this.service.metadata(function (err, metadata) {
      if (!err) {
        var supportedFormats = metadata.supportedQueryFormats;

        // Check if someone has requested that we don't use geoJSON, even if it's available
        var forceJsonFormat = false;
        if (this.service.options.isModern === false) {
          forceJsonFormat = true;
        }

        // Unless we've been told otherwise, check to see whether service can emit GeoJSON natively
        if (!forceJsonFormat && supportedFormats && supportedFormats.indexOf('geoJSON') !== -1) {
          this.service.options.isModern = true;
        }

        if (metadata.objectIdField) {
          this.service.options.idAttribute = metadata.objectIdField;
        }

        // add copyright text listed in service metadata
        if (!this.options.attribution && map.attributionControl && metadata.copyrightText) {
          this.options.attribution = metadata.copyrightText;
          map.attributionControl.addAttribution(this.getAttribution());
        }
      }
    }, this);

    map.on('zoomend', this._handleZoomChange, this);

    return VirtualGrid.prototype.onAdd.call(this, map);
  },

  onRemove: function (map) {
    map.off('zoomend', this._handleZoomChange, this);

    return VirtualGrid.prototype.onRemove.call(this, map);
  },

  getAttribution: function () {
    return this.options.attribution;
  },

  /**
   * Feature Management
   */

  createCell: function (bounds, coords) {
    // dont fetch features outside the scale range defined for the layer
    if (this._visibleZoom()) {
      this._requestFeatures(bounds, coords);
    }
  },

  _requestFeatures: function (bounds, coords, callback) {
    this._activeRequests++;

    // our first active request fires loading
    if (this._activeRequests === 1) {
      this.fire('loading', {
        bounds: bounds
      }, true);
    }

    return this._buildQuery(bounds).run(function (error, featureCollection, response) {
      if (response && response.exceededTransferLimit) {
        this.fire('drawlimitexceeded');
      }

      // no error, features
      if (!error && featureCollection && featureCollection.features.length) {
        // schedule adding features until the next animation frame
        leaflet.Util.requestAnimFrame(leaflet.Util.bind(function () {
          this._addFeatures(featureCollection.features, coords);
          this._postProcessFeatures(bounds);
        }, this));
      }

      // no error, no features
      if (!error && featureCollection && !featureCollection.features.length) {
        this._postProcessFeatures(bounds);
      }

      if (error) {
        this._postProcessFeatures(bounds);
      }

      if (callback) {
        callback.call(this, error, featureCollection);
      }
    }, this);
  },

  _postProcessFeatures: function (bounds) {
    // deincrement the request counter now that we have processed features
    this._activeRequests--;

    // if there are no more active requests fire a load event for this view
    if (this._activeRequests <= 0) {
      this.fire('load', {
        bounds: bounds
      });
    }
  },

  _cacheKey: function (coords) {
    return coords.z + ':' + coords.x + ':' + coords.y;
  },

  _addFeatures: function (features, coords) {
    var key = this._cacheKey(coords);
    this._cache[key] = this._cache[key] || [];

    for (var i = features.length - 1; i >= 0; i--) {
      var id = features[i].id;

      if (this._currentSnapshot.indexOf(id) === -1) {
        this._currentSnapshot.push(id);
      }
      if (this._cache[key].indexOf(id) === -1) {
        this._cache[key].push(id);
      }
    }

    if (this.options.timeField) {
      this._buildTimeIndexes(features);
    }

    this.createLayers(features);
  },

  _buildQuery: function (bounds) {
    var query = this.service.query()
      .intersects(bounds)
      .where(this.options.where)
      .fields(this.options.fields)
      .precision(this.options.precision);

    if (this.options.requestParams) {
      leaflet.Util.extend(query.params, this.options.requestParams);
    }

    if (this.options.simplifyFactor) {
      query.simplify(this._map, this.options.simplifyFactor);
    }

    if (this.options.timeFilterMode === 'server' && this.options.from && this.options.to) {
      query.between(this.options.from, this.options.to);
    }

    return query;
  },

  /**
   * Where Methods
   */

  setWhere: function (where, callback, context) {
    this.options.where = (where && where.length) ? where : '1=1';

    var oldSnapshot = [];
    var newSnapshot = [];
    var pendingRequests = 0;
    var requestError = null;
    var requestCallback = leaflet.Util.bind(function (error, featureCollection) {
      if (error) {
        requestError = error;
      }

      if (featureCollection) {
        for (var i = featureCollection.features.length - 1; i >= 0; i--) {
          newSnapshot.push(featureCollection.features[i].id);
        }
      }

      pendingRequests--;

      if (pendingRequests <= 0 && this._visibleZoom()) {
        this._currentSnapshot = newSnapshot;
        // schedule adding features for the next animation frame
        leaflet.Util.requestAnimFrame(leaflet.Util.bind(function () {
          this.removeLayers(oldSnapshot);
          this.addLayers(newSnapshot);
          if (callback) {
            callback.call(context, requestError);
          }
        }, this));
      }
    }, this);

    for (var i = this._currentSnapshot.length - 1; i >= 0; i--) {
      oldSnapshot.push(this._currentSnapshot[i]);
    }

    for (var key in this._activeCells) {
      pendingRequests++;
      var coords = this._keyToCellCoords(key);
      var bounds = this._cellCoordsToBounds(coords);
      this._requestFeatures(bounds, key, requestCallback);
    }

    return this;
  },

  getWhere: function () {
    return this.options.where;
  },

  /**
   * Time Range Methods
   */

  getTimeRange: function () {
    return [this.options.from, this.options.to];
  },

  setTimeRange: function (from, to, callback, context) {
    var oldFrom = this.options.from;
    var oldTo = this.options.to;
    var pendingRequests = 0;
    var requestError = null;
    var requestCallback = leaflet.Util.bind(function (error) {
      if (error) {
        requestError = error;
      }

      this._filterExistingFeatures(oldFrom, oldTo, from, to);

      pendingRequests--;

      if (callback && pendingRequests <= 0) {
        callback.call(context, requestError);
      }
    }, this);

    this.options.from = from;
    this.options.to = to;

    this._filterExistingFeatures(oldFrom, oldTo, from, to);

    if (this.options.timeFilterMode === 'server') {
      for (var key in this._activeCells) {
        pendingRequests++;
        var coords = this._keyToCellCoords(key);
        var bounds = this._cellCoordsToBounds(coords);
        this._requestFeatures(bounds, key, requestCallback);
      }
    }

    return this;
  },

  refresh: function () {
    for (var key in this._activeCells) {
      var coords = this._keyToCellCoords(key);
      var bounds = this._cellCoordsToBounds(coords);
      this._requestFeatures(bounds, key);
    }

    if (this.redraw) {
      this.once('load', function () {
        this.eachFeature(function (layer) {
          this._redraw(layer.feature.id);
        }, this);
      }, this);
    }
  },

  _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
    var layersToRemove = (oldFrom && oldTo) ? this._getFeaturesInTimeRange(oldFrom, oldTo) : this._currentSnapshot;
    var layersToAdd = this._getFeaturesInTimeRange(newFrom, newTo);

    if (layersToAdd.indexOf) {
      for (var i = 0; i < layersToAdd.length; i++) {
        var shouldRemoveLayer = layersToRemove.indexOf(layersToAdd[i]);
        if (shouldRemoveLayer >= 0) {
          layersToRemove.splice(shouldRemoveLayer, 1);
        }
      }
    }

    // schedule adding features until the next animation frame
    leaflet.Util.requestAnimFrame(leaflet.Util.bind(function () {
      this.removeLayers(layersToRemove);
      this.addLayers(layersToAdd);
    }, this));
  },

  _getFeaturesInTimeRange: function (start, end) {
    var ids = [];
    var search;

    if (this.options.timeField.start && this.options.timeField.end) {
      var startTimes = this._startTimeIndex.between(start, end);
      var endTimes = this._endTimeIndex.between(start, end);
      search = startTimes.concat(endTimes);
    } else if (this._timeIndex) {
      search = this._timeIndex.between(start, end);
    } else {
      warn('You must set timeField in the layer constructor in order to manipulate the start and end time filter.');
      return [];
    }

    for (var i = search.length - 1; i >= 0; i--) {
      ids.push(search[i].id);
    }

    return ids;
  },

  _buildTimeIndexes: function (geojson) {
    var i;
    var feature;
    if (this.options.timeField.start && this.options.timeField.end) {
      var startTimeEntries = [];
      var endTimeEntries = [];
      for (i = geojson.length - 1; i >= 0; i--) {
        feature = geojson[i];
        startTimeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField.start])
        });
        endTimeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField.end])
        });
      }
      this._startTimeIndex.bulkAdd(startTimeEntries);
      this._endTimeIndex.bulkAdd(endTimeEntries);
    } else {
      var timeEntries = [];
      for (i = geojson.length - 1; i >= 0; i--) {
        feature = geojson[i];
        timeEntries.push({
          id: feature.id,
          value: new Date(feature.properties[this.options.timeField])
        });
      }

      this._timeIndex.bulkAdd(timeEntries);
    }
  },

  _featureWithinTimeRange: function (feature) {
    if (!this.options.from || !this.options.to) {
      return true;
    }

    var from = +this.options.from.valueOf();
    var to = +this.options.to.valueOf();

    if (typeof this.options.timeField === 'string') {
      var date = +feature.properties[this.options.timeField];
      return (date >= from) && (date <= to);
    }

    if (this.options.timeField.start && this.options.timeField.end) {
      var startDate = +feature.properties[this.options.timeField.start];
      var endDate = +feature.properties[this.options.timeField.end];
      return ((startDate >= from) && (startDate <= to)) || ((endDate >= from) && (endDate <= to));
    }
  },

  _visibleZoom: function () {
    // check to see whether the current zoom level of the map is within the optional limit defined for the FeatureLayer
    if (!this._map) {
      return false;
    }
    var zoom = this._map.getZoom();
    if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
      return false;
    } else { return true; }
  },

  _handleZoomChange: function () {
    if (!this._visibleZoom()) {
      this.removeLayers(this._currentSnapshot);
      this._currentSnapshot = [];
    } else {
      /*
      for every cell in this._activeCells
        1. Get the cache key for the coords of the cell
        2. If this._cache[key] exists it will be an array of feature IDs.
        3. Call this.addLayers(this._cache[key]) to instruct the feature layer to add the layers back.
      */
      for (var i in this._activeCells) {
        var coords = this._activeCells[i].coords;
        var key = this._cacheKey(coords);
        if (this._cache[key]) {
          this.addLayers(this._cache[key]);
        }
      }
    }
  },

  /**
   * Service Methods
   */

  authenticate: function (token) {
    this.service.authenticate(token);
    return this;
  },

  metadata: function (callback, context) {
    this.service.metadata(callback, context);
    return this;
  },

  query: function () {
    return this.service.query();
  },

  _getMetadata: function (callback) {
    if (this._metadata) {
      var error;
      callback(error, this._metadata);
    } else {
      this.metadata(leaflet.Util.bind(function (error, response) {
        this._metadata = response;
        callback(error, this._metadata);
      }, this));
    }
  },

  addFeature: function (feature, callback, context) {
    this.addFeatures(feature, callback, context);
  },

  addFeatures: function (features, callback, context) {
    this._getMetadata(leaflet.Util.bind(function (error, metadata) {
      if (error) {
        if (callback) { callback.call(this, error, null); }
        return;
      }
      // GeoJSON featureCollection or simple feature
      var featuresArray = features.features ? features.features : [features];

      this.service.addFeatures(features, leaflet.Util.bind(function (error, response) {
        if (!error) {
          for (var i = featuresArray.length - 1; i >= 0; i--) {
            // assign ID from result to appropriate objectid field from service metadata
            featuresArray[i].properties[metadata.objectIdField] = featuresArray.length > 1 ? response[i].objectId : response.objectId;
            // we also need to update the geojson id for createLayers() to function
            featuresArray[i].id = featuresArray.length > 1 ? response[i].objectId : response.objectId;
          }
          this.createLayers(featuresArray);
        }

        if (callback) {
          callback.call(context, error, response);
        }
      }, this));
    }, this));
  },

  updateFeature: function (feature, callback, context) {
    this.updateFeatures(feature, callback, context);
  },

  updateFeatures: function (features, callback, context) {
    // GeoJSON featureCollection or simple feature
    var featuresArray = features.features ? features.features : [features];
    this.service.updateFeatures(features, function (error, response) {
      if (!error) {
        for (var i = featuresArray.length - 1; i >= 0; i--) {
          this.removeLayers([featuresArray[i].id], true);
        }
        this.createLayers(featuresArray);
      }

      if (callback) {
        callback.call(context, error, response);
      }
    }, this);
  },

  deleteFeature: function (id, callback, context) {
    this.deleteFeatures(id, callback, context);
  },

  deleteFeatures: function (ids, callback, context) {
    return this.service.deleteFeatures(ids, function (error, response) {
      var responseArray = response.length ? response : [response];
      if (!error && responseArray.length > 0) {
        for (var i = responseArray.length - 1; i >= 0; i--) {
          this.removeLayers([responseArray[i].objectId], true);
        }
      }
      if (callback) {
        callback.call(context, error, response);
      }
    }, this);
  }
});

var FeatureLayer = FeatureManager.extend({

  options: {
    cacheLayers: true
  },

  /**
   * Constructor
   */
  initialize: function (options) {
    FeatureManager.prototype.initialize.call(this, options);
    this._originalStyle = this.options.style;
    this._layers = {};
  },

  /**
   * Layer Interface
   */

  onRemove: function (map) {
    for (var i in this._layers) {
      map.removeLayer(this._layers[i]);
      // trigger the event when the entire featureLayer is removed from the map
      this.fire('removefeature', {
        feature: this._layers[i].feature,
        permanent: false
      }, true);
    }

    return FeatureManager.prototype.onRemove.call(this, map);
  },

  createNewLayer: function (geojson) {
    var layer = leaflet.GeoJSON.geometryToLayer(geojson, this.options);
    // trap for GeoJSON without geometry
    if (layer) {
      layer.defaultOptions = layer.options;
    }
    return layer;
  },

  _updateLayer: function (layer, geojson) {
    // convert the geojson coordinates into a Leaflet LatLng array/nested arrays
    // pass it to setLatLngs to update layer geometries
    var latlngs = [];
    var coordsToLatLng = this.options.coordsToLatLng || leaflet.GeoJSON.coordsToLatLng;

    // copy new attributes, if present
    if (geojson.properties) {
      layer.feature.properties = geojson.properties;
    }

    switch (geojson.geometry.type) {
      case 'Point':
        latlngs = leaflet.GeoJSON.coordsToLatLng(geojson.geometry.coordinates);
        layer.setLatLng(latlngs);
        break;
      case 'LineString':
        latlngs = leaflet.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 0, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
      case 'MultiLineString':
        latlngs = leaflet.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
      case 'Polygon':
        latlngs = leaflet.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
      case 'MultiPolygon':
        latlngs = leaflet.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 2, coordsToLatLng);
        layer.setLatLngs(latlngs);
        break;
    }
  },

  /**
   * Feature Management Methods
   */

  createLayers: function (features) {
    for (var i = features.length - 1; i >= 0; i--) {
      var geojson = features[i];

      var layer = this._layers[geojson.id];
      var newLayer;

      if (this._visibleZoom() && layer && !this._map.hasLayer(layer) && (!this.options.timeField || this._featureWithinTimeRange(geojson))) {
        this._map.addLayer(layer);
        this.fire('addfeature', {
          feature: layer.feature
        }, true);
      }

      // update geometry if necessary
      if (layer && this.options.simplifyFactor > 0 && (layer.setLatLngs || layer.setLatLng)) {
        this._updateLayer(layer, geojson);
      }

      if (!layer) {
        newLayer = this.createNewLayer(geojson);

        if (!newLayer) {
          warn('invalid GeoJSON encountered');
        } else {
          newLayer.feature = geojson;

          // bubble events from individual layers to the feature layer
          newLayer.addEventParent(this);

          if (this.options.onEachFeature) {
            this.options.onEachFeature(newLayer.feature, newLayer);
          }

          // cache the layer
          this._layers[newLayer.feature.id] = newLayer;

          // style the layer
          this.setFeatureStyle(newLayer.feature.id, this.options.style);

          this.fire('createfeature', {
            feature: newLayer.feature
          }, true);

          // add the layer if the current zoom level is inside the range defined for the layer, it is within the current time bounds or our layer is not time enabled
          if (this._visibleZoom() && (!this.options.timeField || (this.options.timeField && this._featureWithinTimeRange(geojson)))) {
            this._map.addLayer(newLayer);
          }
        }
      }
    }
  },

  addLayers: function (ids) {
    for (var i = ids.length - 1; i >= 0; i--) {
      var layer = this._layers[ids[i]];
      if (layer && (!this.options.timeField || this._featureWithinTimeRange(layer.feature))) {
        this._map.addLayer(layer);
      }
    }
  },

  removeLayers: function (ids, permanent) {
    for (var i = ids.length - 1; i >= 0; i--) {
      var id = ids[i];
      var layer = this._layers[id];
      if (layer) {
        this.fire('removefeature', {
          feature: layer.feature,
          permanent: permanent
        }, true);
        this._map.removeLayer(layer);
      }
      if (layer && permanent) {
        delete this._layers[id];
      }
    }
  },

  cellEnter: function (bounds, coords) {
    if (this._visibleZoom() && !this._zooming && this._map) {
      leaflet.Util.requestAnimFrame(leaflet.Util.bind(function () {
        var cacheKey = this._cacheKey(coords);
        var cellKey = this._cellCoordsToKey(coords);
        var layers = this._cache[cacheKey];
        if (this._activeCells[cellKey] && layers) {
          this.addLayers(layers);
        }
      }, this));
    }
  },

  cellLeave: function (bounds, coords) {
    if (!this._zooming) {
      leaflet.Util.requestAnimFrame(leaflet.Util.bind(function () {
        if (this._map) {
          var cacheKey = this._cacheKey(coords);
          var cellKey = this._cellCoordsToKey(coords);
          var layers = this._cache[cacheKey];
          var mapBounds = this._map.getBounds();
          if (!this._activeCells[cellKey] && layers) {
            var removable = true;

            for (var i = 0; i < layers.length; i++) {
              var layer = this._layers[layers[i]];
              if (layer && layer.getBounds && mapBounds.intersects(layer.getBounds())) {
                removable = false;
              }
            }

            if (removable) {
              this.removeLayers(layers, !this.options.cacheLayers);
            }

            if (!this.options.cacheLayers && removable) {
              delete this._cache[cacheKey];
              delete this._cells[cellKey];
              delete this._activeCells[cellKey];
            }
          }
        }
      }, this));
    }
  },

  /**
   * Styling Methods
   */

  resetStyle: function () {
    this.options.style = this._originalStyle;
    this.eachFeature(function (layer) {
      this.resetFeatureStyle(layer.feature.id);
    }, this);
    return this;
  },

  setStyle: function (style) {
    this.options.style = style;
    this.eachFeature(function (layer) {
      this.setFeatureStyle(layer.feature.id, style);
    }, this);
    return this;
  },

  resetFeatureStyle: function (id) {
    var layer = this._layers[id];
    var style = this._originalStyle || leaflet.Path.prototype.options;
    if (layer) {
      leaflet.Util.extend(layer.options, layer.defaultOptions);
      this.setFeatureStyle(id, style);
    }
    return this;
  },

  setFeatureStyle: function (id, style) {
    var layer = this._layers[id];
    if (typeof style === 'function') {
      style = style(layer.feature);
    }
    if (layer.setStyle) {
      layer.setStyle(style);
    }
    return this;
  },

  /**
   * Utility Methods
   */

  eachActiveFeature: function (fn, context) {
    // figure out (roughly) which layers are in view
    if (this._map) {
      var activeBounds = this._map.getBounds();
      for (var i in this._layers) {
        if (this._currentSnapshot.indexOf(this._layers[i].feature.id) !== -1) {
          // a simple point in poly test for point geometries
          if (typeof this._layers[i].getLatLng === 'function' && activeBounds.contains(this._layers[i].getLatLng())) {
            fn.call(context, this._layers[i]);
          } else if (typeof this._layers[i].getBounds === 'function' && activeBounds.intersects(this._layers[i].getBounds())) {
            // intersecting bounds check for polyline and polygon geometries
            fn.call(context, this._layers[i]);
          }
        }
      }
    }
    return this;
  },

  eachFeature: function (fn, context) {
    for (var i in this._layers) {
      fn.call(context, this._layers[i]);
    }
    return this;
  },

  getFeature: function (id) {
    return this._layers[id];
  },

  bringToBack: function () {
    this.eachFeature(function (layer) {
      if (layer.bringToBack) {
        layer.bringToBack();
      }
    });
  },

  bringToFront: function () {
    this.eachFeature(function (layer) {
      if (layer.bringToFront) {
        layer.bringToFront();
      }
    });
  },

  redraw: function (id) {
    if (id) {
      this._redraw(id);
    }
    return this;
  },

  _redraw: function (id) {
    var layer = this._layers[id];
    var geojson = layer.feature;

    // if this looks like a marker
    if (layer && layer.setIcon && this.options.pointToLayer) {
      // update custom symbology, if necessary
      if (this.options.pointToLayer) {
        var getIcon = this.options.pointToLayer(geojson, leaflet.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
        var updatedIcon = getIcon.options.icon;
        layer.setIcon(updatedIcon);
      }
    }

    // looks like a vector marker (circleMarker)
    if (layer && layer.setStyle && this.options.pointToLayer) {
      var getStyle = this.options.pointToLayer(geojson, leaflet.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
      var updatedStyle = getStyle.options;
      this.setFeatureStyle(geojson.id, updatedStyle);
    }

    // looks like a path (polygon/polyline)
    if (layer && layer.setStyle && this.options.style) {
      this.resetStyle(geojson.id);
    }
  }
});

function featureLayer (options) {
  return new FeatureLayer(options);
}

// export version

exports.VERSION = version;
exports.Support = Support;
exports.options = options;
exports.Util = EsriUtil;
exports.get = get;
exports.post = xmlHttpPost;
exports.request = request;
exports.Task = Task;
exports.task = task;
exports.Query = Query;
exports.query = query;
exports.Find = Find;
exports.find = find;
exports.Identify = Identify;
exports.identify = identify;
exports.IdentifyFeatures = IdentifyFeatures;
exports.identifyFeatures = identifyFeatures;
exports.IdentifyImage = IdentifyImage;
exports.identifyImage = identifyImage;
exports.Service = Service;
exports.service = service;
exports.MapService = MapService;
exports.mapService = mapService;
exports.ImageService = ImageService;
exports.imageService = imageService;
exports.FeatureLayerService = FeatureLayerService;
exports.featureLayerService = featureLayerService;
exports.BasemapLayer = BasemapLayer;
exports.basemapLayer = basemapLayer;
exports.TiledMapLayer = TiledMapLayer;
exports.tiledMapLayer = tiledMapLayer;
exports.RasterLayer = RasterLayer;
exports.ImageMapLayer = ImageMapLayer;
exports.imageMapLayer = imageMapLayer;
exports.DynamicMapLayer = DynamicMapLayer;
exports.dynamicMapLayer = dynamicMapLayer;
exports.FeatureManager = FeatureManager;
exports.FeatureLayer = FeatureLayer;
exports.featureLayer = featureLayer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//  sourceMappingURL=esri-leaflet-debug.js.map

/*! catiline 2.4.2 2013-08-08*/
/*!©2013 Calvin Metcalf @license MIT https://github.com/calvinmetcalf/catiline */
if (typeof document === 'undefined') {
    self._noTransferable=true;
	self.onmessage=function(e){
		/*jslint evil: true */
		eval(e.data);
	};
} else {
(function(global){
	'use strict';
/*!From setImmediate Copyright (c) 2012 Barnesandnoble.com,llc, Donavon West, and Domenic Denicola @license MIT https://github.com/NobleJS/setImmediate */
(function(attachTo,global) {
	var tasks = (function () {
		function Task(handler, args) {
			this.handler = handler;
			this.args = args;
		}
		Task.prototype.run = function () {
			// See steps in section 5 of the spec.
			if (typeof this.handler === 'function') {
				// Choice of `thisArg` is not in the setImmediate spec; `undefined` is in the setTimeout spec though:
				// http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html
				this.handler.apply(undefined, this.args);
			} else {
				var scriptSource = '' + this.handler;
				/*jshint evil: true */
				eval(scriptSource);
			}
		};

		var nextHandle = 1; // Spec says greater than zero
		var tasksByHandle = {};
		var currentlyRunningATask = false;

		return {
			addFromSetImmediateArguments: function (args) {
				var handler = args[0];
				var argsToHandle = Array.prototype.slice.call(args, 1);
				var task = new Task(handler, argsToHandle);

				var thisHandle = nextHandle++;
				tasksByHandle[thisHandle] = task;
				return thisHandle;
			},
			runIfPresent: function (handle) {
				// From the spec: 'Wait until any invocations of this algorithm started before this one have completed.'
				// So if we're currently running a task, we'll need to delay this invocation.
				if (!currentlyRunningATask) {
					var task = tasksByHandle[handle];
					if (task) {
						currentlyRunningATask = true;
						try {
							task.run();
						} finally {
							delete tasksByHandle[handle];
							currentlyRunningATask = false;
						}
					}
				} else {
					// Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
					// 'too much recursion' error.
					global.setTimeout(function () {
						tasks.runIfPresent(handle);
					}, 0);
				}
			},
			remove: function (handle) {
				delete tasksByHandle[handle];
			}
		};
	}());
		// Installs an event handler on `global` for the `message` event: see
		// * https://developer.mozilla.org/en/DOM/window.postMessage
		// * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

		var MESSAGE_PREFIX = 'com.catilinejs.setImmediate' + Math.random();

		function isStringAndStartsWith(string, putativeStart) {
			return typeof string === 'string' && string.substring(0, putativeStart.length) === putativeStart;
		}

		function onGlobalMessage(event) {
			// This will catch all incoming messages (even from other windows!), so we need to try reasonably hard to
			// avoid letting anyone else trick us into firing off. We test the origin is still this window, and that a
			// (randomly generated) unpredictable identifying prefix is present.
			if (event.source === global && isStringAndStartsWith(event.data, MESSAGE_PREFIX)) {
				var handle = event.data.substring(MESSAGE_PREFIX.length);
				tasks.runIfPresent(handle);
			}
		}
		if (global.addEventListener) {
			global.addEventListener('message', onGlobalMessage, false);
		} else {
			global.attachEvent('onmessage', onGlobalMessage);
		}

		attachTo.setImmediate = function () {
			var handle = tasks.addFromSetImmediateArguments(arguments);

			// Make `global` post a message to itself with the handle and identifying prefix, thus asynchronously
			// invoking our onGlobalMessage listener above.
			global.postMessage(MESSAGE_PREFIX + handle, '*');

			return handle;
		};
	})(catiline,global);

/*! Promiscuous ©2013 Ruben Verborgh @license MIT https://github.com/RubenVerborgh/promiscuous*/
(function (exports,tick) {
	var func = 'function';
	// Creates a deferred: an object with a promise and corresponding resolve/reject methods
	function Deferred() {
		// The `handler` variable points to the function that will
		// 1) handle a .then(onFulfilled, onRejected) call
		// 2) handle a .resolve or .reject call (if not fulfilled)
		// Before 2), `handler` holds a queue of callbacks.
		// After 2), `handler` is a simple .then handler.
		// We use only one function to save memory and complexity.
		var handler = function (onFulfilled, onRejected, value) {
			// Case 1) handle a .then(onFulfilled, onRejected) call
			var createdDeffered;
			if (onFulfilled !== handler) {
				createdDeffered = createDeferred();
				handler.queue.push({ deferred: createdDeffered, resolve: onFulfilled, reject: onRejected });
				return createdDeffered.promise;
			}

			// Case 2) handle a .resolve or .reject call
			// (`onFulfilled` acts as a sentinel)
			// The actual function signature is
			// .re[ject|solve](sentinel, success, value)
			var action = onRejected ? 'resolve' : 'reject',queue,deferred,callback;
			for (var i = 0, l = handler.queue.length; i < l; i++) {
				queue = handler.queue[i];
				deferred = queue.deferred;
				callback = queue[action];
				if (typeof callback !== func) {
					deferred[action](value);
				} else {
					execute(callback, value, deferred);
				}
			}
			// Replace this handler with a simple resolved or rejected handler
			handler = createHandler(promise, value, onRejected);
		};
		function Promise(){
			this.then=function (onFulfilled, onRejected) {
				return handler(onFulfilled, onRejected);
			};
		}
		var promise = new Promise();
		this.promise = promise;
		// The queue of deferreds
		handler.queue = [];

		this.resolve = function (value)	{
			handler.queue && handler(handler, true, value);
		};
			
		this.reject = function (reason) {
			handler.queue && handler(handler, false, reason);
		};
	}
	
	function createDeferred(){
		return new Deferred();
	}
	
	// Creates a fulfilled or rejected .then function
	function createHandler(promise, value, success) {
		return function (onFulfilled, onRejected) {
			var callback = success ? onFulfilled : onRejected, result;
			if (typeof callback !== func) {
				return promise;
			}
			execute(callback, value, result = createDeferred());
			return result.promise;
		};
	}

	// Executes the callback with the specified value,
	// resolving or rejecting the deferred
	function execute(callback, value, deferred) {
		tick(function () {
			var result;
			try {
				result = callback(value);
				if (result && typeof result.then === func) {
					result.then(deferred.resolve, deferred.reject);
				} else {
					deferred.resolve(result);
				}
			}
			catch (error) {
				deferred.reject(error);
			}
		});
	}
 
	// Returns a resolved promise
	exports.resolve= function (value) {
		var promise = {};
		promise.then = createHandler(promise, value, true);
		return promise;
	};
	// Returns a rejected promise
	exports.reject= function (reason) {
		var promise = {};
		promise.then = createHandler(promise, reason, false);
		return promise;
	};
	// Returns a deferred
	exports.deferred= createDeferred;
	exports.all=function(array){
		var promise = exports.deferred();
		var len = array.length;
		var resolved=0;
		var out = [];
		var onSuccess=function(n){
			return function(v){
				out[n]=v;
				resolved++;
				if(resolved===len){
					promise.resolve(out);
				}
			};
		};
		array.forEach(function(v,i){
			v.then(onSuccess(i),function(a){
				promise.reject(a);
			});
		});
		return promise.promise;
	};
})(catiline,catiline.setImmediate);

catiline._hasWorker = typeof Worker !== 'undefined'&&typeof fakeLegacy === 'undefined';
catiline.URL = window.URL || window.webkitURL;
catiline._noTransferable=!catiline.URL;
//regex out the importScript call and move it up to the top out of the function.
function regexImports(string){
	var rest=string,
	match = true,
	matches = {},
	loopFunc = function(a,b){
		if(b){
			'importScripts('+b.split(',').forEach(function(cc){
				matches[catiline.makeUrl(cc.match(/\s*[\'\"](\S*)[\'\"]\s*/)[1])]=true; // trim whitespace, add to matches
			})+');\n';
		}
	};
	while(match){
		match = rest.match(/(importScripts\(.*?\);?)/);
		rest = rest.replace(/(importScripts\(\s*(?:[\'\"].*?[\'\"])?\s*\);?)/,'\n');
		if(match){
			match[0].replace(/importScripts\(\s*([\'\"].*?[\'\"])?\s*\);?/g,loopFunc);
		}
	}
	matches = Object.keys(matches);
	return [matches,rest];
}

function moveImports(string){
	var str = regexImports(string);
	var matches = str[0];
	var rest = str[1];
	if(matches.length>0){
		return 'importScripts(\''+matches.join('\',\'')+'\');\n'+rest;
	}else{
		return rest;
	}
}
function moveIimports(string){
	var str = regexImports(string);
	var matches = str[0];
	var rest = str[1];
	if(matches.length>0){
		return 'importScripts(\''+matches.join('\',\'')+'\');eval(__scripts__);\n'+rest;
	}else{
		return rest;
	}
}
function getPath(){
	if(typeof SHIM_WORKER_PATH !== 'undefined'){
		return SHIM_WORKER_PATH;
	}else if('SHIM_WORKER_PATH' in catiline){
		return catiline.SHIM_WORKER_PATH;
	}
	var scripts = document.getElementsByTagName('script');
		var len = scripts.length;
		var i = 0;
		while(i<len){
			if(/catiline(\.min)?\.js/.test(scripts[i].src)){
				return scripts[i].src;
			}
			i++;
		}
}
function appendScript(iDoc,text){
	var iScript = iDoc.createElement('script');
			if (typeof iScript.text !== 'undefined') {
				iScript.text = text;
			} else {
				iScript.innerHTML = text;
			}
		if(iDoc.readyState==='complete'){
			iDoc.documentElement.appendChild(iScript);
		}else{
			iDoc.onreadystatechange=function(){
				if(iDoc.readyState==='complete'){
					iDoc.documentElement.appendChild(iScript);
				}
			};
		}
}
//much of the iframe stuff inspired by https://github.com/padolsey/operative
//mos tthings besides the names have since been changed
function actualMakeI(script,codeword){
	var iFrame = document.createElement('iframe');
		iFrame.style.display = 'none';
		document.body.appendChild(iFrame);
		var iWin = iFrame.contentWindow;
		var iDoc = iWin.document;
	var text=['try{ ',
	'var __scripts__=\'\';function importScripts(scripts){',
	'	if(Array.isArray(scripts)&&scripts.length>0){',
	'		scripts.forEach(function(url){',
	'			var ajax = new XMLHttpRequest();',
	'			ajax.open(\'GET\',url,false);',
	'			ajax.send();__scripts__+=ajax.responseText;',
	'			__scripts__+=\'\\n;\';',
	'		});',
	'	}',
	'};',
	script,
	'}catch(e){',
	'	window.parent.postMessage([\''+codeword+'\',\'error\'],\'*\')',
	'}'].join('\n');
	appendScript(iDoc,text);

	return iFrame;
}
function makeIframe(script,codeword){
	var promise = catiline.deferred();
	if(document.readyState==='complete'){
		promise.resolve(actualMakeI(script,codeword));
	}else{
		window.addEventListener('load',function(){
			promise.resolve(actualMakeI(script,codeword));
		},false);
	}
	return promise.promise;
}
catiline.makeIWorker = function (strings,codeword){
	var script =moveIimports(strings.join(''));
	var worker = {onmessage:function(){}};
	var ipromise = makeIframe(script,codeword);
	window.addEventListener('message',function(e){
		if(typeof e.data ==='string'&&e.data.length>codeword.length&&e.data.slice(0,codeword.length)===codeword){
			worker.onmessage({data:JSON.parse(e.data.slice(codeword.length))});
		}
	});
	worker.postMessage=function(data){
		ipromise.then(function(iFrame){
			iFrame.contentWindow.postMessage(JSON.stringify(data),'*');
		});
	};
	worker.terminate=function(){
		ipromise.then(function(iFrame){
			document.body.removeChild(iFrame);
		});
	};
	return worker;
	
};
//accepts an array of strings, joins them, and turns them into a worker.
function makeFallbackWorker(script){
	catiline._noTransferable=true;
	var worker = new Worker(getPath());
	worker.postMessage(script);
	return worker;
}
catiline.makeWorker = function (strings, codeword){
	if(!catiline._hasWorker){
		return catiline.makeIWorker(strings,codeword);
	}
	var worker;
	var script =moveImports(strings.join(''));
	if(catiline._noTransferable){
		return makeFallbackWorker(script);
	}
	try{
		worker= new Worker(catiline.URL.createObjectURL(new Blob([script],{type: 'text/javascript'})));
	}catch(e){
		try{
			worker=makeFallbackWorker(script);
		}catch(ee){
			worker = catiline.makeIWorker(strings,codeword);
		}
	}finally{
		return worker;
	}
};

catiline.makeUrl = function (fileName) {
	var link = document.createElement('link');
	link.href = fileName;
	return link.href;
};

catiline.Worker = function Catiline(obj) {
		if(typeof obj === 'function'){
			obj = {
				data:obj
			};
		}
		var __codeWord__='com.catilinejs.'+(catiline._hasWorker?'iframe':'worker')+Math.random();
		var listeners = {};
		var self = this;
		self.on = function (eventName, func, scope) {
			scope = scope || self;
			if (eventName.indexOf(' ') > 0) {
				eventName.split(' ').map(function (v) {
					return self.on(v, func, scope);
				}, this);
				return self;
			}
			if (!(eventName in listeners)) {
				listeners[eventName] = [];
			}
			listeners[eventName].push(function (a) {
				func.call(scope, a);
			});
			return self;
		};
	
		function _fire(eventName, data) {
			if (eventName.indexOf(' ') > 0) {
				eventName.split(' ').forEach(function (v) {
					_fire(v, data);
				});
				return self;
			}
			if (!(eventName in listeners)) {
				return self;
			}
			listeners[eventName].forEach(function (v) {
				v(data);
			});
			return self;
		}
		self.fire = function (eventName, data, transfer) {
			if(catiline._noTransferable){
				worker.postMessage([[eventName], data]);
			}else{
				worker.postMessage([[eventName], data], transfer);
			}
			
			return self;
		};
		self.off = function (eventName, func) {
			if (eventName.indexOf(' ') > 0) {
				eventName.split(' ').map(function (v) {
					return self.off(v, func);
				});
				return self;
			}
			if (!(eventName in listeners)) {
				return self;
			}
			else if (!func) {
				delete listeners[eventName];
			}
			else {
				if (listeners[eventName].indexOf(func) > -1) {
					if (listeners[eventName].length > 1) {
						delete listeners[eventName];
					}
					else {
						listeners[eventName].splice(listeners[eventName].indexOf(func), 1);
					}
				}
			}
			return self;
		};
		var i = 0;
		var promises = [];
		var rejectPromises = function (msg) {
			if (typeof msg !== 'string' && 'preventDefault' in msg) {
				msg.preventDefault();
				msg = msg.message;
			}
			promises.forEach(function (p) {
				if (p) {
					p.reject(msg);
				}
			});
		};
		obj.__codeWord__='"'+__codeWord__+'"';
		if (!('initialize' in obj)) {
			if ('init' in obj) {
				obj.initialize = obj.init;
			}
			else {
				obj.initialize = function () {};
			}
		}
		var fObj = '{\n\t';
		var keyFunc = function (key) {
			var out = function (data, transfer) {
				var i = promises.length;
				promises[i] = catiline.deferred();
				if(catiline._noTransferable){
					worker.postMessage([[__codeWord__, i], key, data]);
				}else{
					worker.postMessage([[__codeWord__, i], key, data], transfer);
				}
				return promises[i].promise;
			};
			return out;
		};
		for (var key in obj) {
			if (i !== 0) {
				fObj = fObj + ',\n\t';
			}
			else {
				i++;
			}
			fObj = fObj + key + ':' + obj[key].toString();
			self[key] = keyFunc(key);
		}
		fObj = fObj + '}';
		var worker = catiline.makeWorker(['\'use strict\';\n\nvar _db = ',fObj,';\nvar listeners = {};\nvar __iFrame__ = typeof document!=="undefined";\nvar __self__={onmessage:function(e){\n	_fire("messege",e.data[1]);\n	if(e.data[0][0]===_db.__codeWord__){\n		return regMsg(e);\n	}else{\n		_fire(e.data[0][0],e.data[1]);\n	}\n}};\nif(__iFrame__){\n	window.onmessage=function(e){\n		if(typeof e.data === "string"){\n			e ={data: JSON.parse(e.data)};\n		}\n		__self__.onmessage(e);\n	};\n}else{\n	self.onmessage=__self__.onmessage;\n}\n__self__.postMessage=function(rawData, transfer){\n	var data;\n	if(!self._noTransferable&&!__iFrame__){\n		self.postMessage(rawData, transfer);\n	}else if(__iFrame__){\n		data = _db.__codeWord__+JSON.stringify(rawData);\n		window.parent.postMessage(data,"*");\n	}else if(self._noTransferable){\n		self.postMessage(rawData);\n	}\n};\n_db.on = function (eventName, func, scope) {\n	if(eventName.indexOf(" ")>0){\n		return eventName.split(" ").map(function(v){\n			return _db.on(v,func,scope);\n		},_db);\n	}\n	scope = scope || _db;\n	if (!(eventName in listeners)) {\n		listeners[eventName] = [];\n	}\n	listeners[eventName].push(function (a) {\n		func.call(scope, a, _db);\n	});\n};\nfunction _fire(eventName,data){\n	if(eventName.indexOf(" ")>0){\n		eventName.split(" ").forEach(function(v){\n			_fire(v,data);\n		});\n		return;\n	}\n	if (!(eventName in listeners)) {\n		return;\n	}\n	listeners[eventName].forEach(function (v) {\n		v(data);\n	});\n}\n\n_db.fire = function (eventName, data, transfer) {\n	__self__.postMessage([[eventName], data], transfer);\n};\n_db.off=function(eventName,func){\n	if(eventName.indexOf(" ")>0){\n		return eventName.split(" ").map(function(v){\n			return _db.off(v,func);\n		});\n	}\n	if(!(eventName in listeners)){\n		return;\n	}else if(!func){\n		delete listeners[eventName];\n	}else{\n		if(listeners[eventName].indexOf(func)>-1){\n			if(listeners[eventName].length>1){\n				delete listeners[eventName];\n			}else{\n				listeners[eventName].splice(listeners[eventName].indexOf(func),1);\n			}\n		}\n	}\n};\nvar console={};\nfunction makeConsole(method){\n	return function(){\n		var len = arguments.length;\n		var out =[];\n		var i = 0;\n		while (i<len){\n			out.push(arguments[i]);\n			i++;\n		}\n		_db.fire("console",[method,out]);\n	};\n}\n["log", "debug", "error", "info", "warn", "time", "timeEnd"].forEach(function(v){\n	console[v]=makeConsole(v);\n});\nvar regMsg = function(e){\n	var cb=function(data,transfer){\n		__self__.postMessage([e.data[0],data],transfer);\n	};\n	var result;\n	if(__iFrame__){\n		try{\n			result = _db[e.data[1]](e.data[2],cb,_db);\n		}catch(e){\n			_db.fire("error",JSON.stringify(e));\n		}\n	}else{\n		result = _db[e.data[1]](e.data[2],cb,_db);\n	}\n	if(typeof result !== "undefined"){\n		cb(result);\n	}\n};\n_db.initialize(_db);\n'],__codeWord__);
		worker.onmessage = function (e) {
			_fire('message', e.data[1]);
			if (e.data[0][0] === __codeWord__) {
				promises[e.data[0][1]].resolve(e.data[1]);
				promises[e.data[0][1]] = 0;
			}
			else {
				_fire(e.data[0][0], e.data[1]);
			}
		};
		self.on('error',rejectPromises);
		worker.onerror = function (e) {
			_fire('error', e);
		};
		self.on('console', function (msg) {
			console[msg[0]].apply(console, msg[1]);
		});
		self._close = function () {
			worker.terminate();
			rejectPromises('closed');
			return catiline.resolve();
		};
		if (!('close' in self)) {
			self.close = self._close;
		}
	};
catiline.worker = function (obj){
	return new catiline.Worker(obj);
};

catiline.Queue = function CatilineQueue(obj, n, dumb) {
	var self = this;
	self.__batchcb__ = {};
	self.__batchtcb__ = {};
	self.batch = function (cb) {
		if (typeof cb === 'function') {
			self.__batchcb__.__cb__ = cb;
			return self.__batchcb__;
		}
		else {
			return clearQueue(cb);
		}
	};
	self.batchTransfer = function (cb) {
		if (typeof cb === 'function') {
			self.__batchtcb__.__cb__ = cb;
			return self.__batchtcb__;
		}
		else {
			return clearQueue(cb);
		}
	};
	var workers = new Array(n);
	var numIdle = 0;
	var idle = [];
	var que = [];
	var queueLen = 0;
	while (numIdle < n) {
		workers[numIdle] = new catiline.Worker(obj);
		idle.push(numIdle);
		numIdle++;
	}
	self.on = function (eventName, func, context) {
		workers.forEach(function (worker) {
			worker.on(eventName, func, context);
		});
		return self;
	};
	self.off = function (eventName, func, context) {
		workers.forEach(function (worker) {
			worker.off(eventName, func, context);
		});
		return self;
	};
	var batchFire = function (eventName, data) {
		workers.forEach(function (worker) {
			worker.fire(eventName, data);
		});
		return self;
	};
	self.fire = function (eventName, data) {
		workers[~~ (Math.random() * n)].fire(eventName, data);
		return self;
	};
	self.batch.fire = batchFire;
	self.batchTransfer.fire = batchFire;

	function clearQueue(mgs) {
		mgs = mgs || 'canceled';
		queueLen = 0;
		var oQ = que;
		que = [];
		oQ.forEach(function (p) {
			p[3].reject(mgs);
		});
		return self;
	}

	function keyFunc(k) {
		return function (data, transfer) {
			return doStuff(k, data, transfer);
		};
	}

	function keyFuncBatch(k) {
		return function (array) {
			return catiline.all(array.map(function (data) {
				return doStuff(k, data);
			}));
		};
	}

	function keyFuncBatchCB(k) {
		return function (array) {
			var self = this;
			return catiline.all(array.map(function (data) {
				return doStuff(k, data).then(self.__cb__);
			}));
		};
	}

	function keyFuncBatchTransfer(k) {
		return function (array) {
			return catiline.all(array.map(function (data) {
				return doStuff(k, data[0], data[1]);
			}));
		};
	}

	function keyFuncBatchTransferCB(k) {
		return function (array) {
			var self = this;
			return catiline.all(array.map(function (data) {
				return doStuff(k, data[0], data[1]).then(self.__cb__);
			}));
		};
	}
	for (var key in obj) {
		self[key] = keyFunc(key);
		self.batch[key] = keyFuncBatch(key);
		self.__batchcb__[key] = keyFuncBatchCB(key);
		self.batchTransfer[key] = keyFuncBatchTransfer(key);
		self.__batchtcb__[key] = keyFuncBatchTransferCB(key);
	}

	function done(num) {
		var data;
		if (queueLen) {
			data = que.shift();
			queueLen--;
			workers[num][data[0]](data[1], data[2]).then(function (d) {
				done(num);
				data[3].resolve(d);
			}, function (d) {
				done(num);
				data[3].reject(d);
			});
		}
		else {
			numIdle++;
			idle.push(num);
		}
	}

	function doStuff(key, data, transfer) { //srsly better name!
		if (dumb) {
			return workers[~~ (Math.random() * n)][key](data, transfer);
		}
		var promise = catiline.deferred(),
			num;
		if (!queueLen && numIdle) {
			num = idle.pop();
			numIdle--;
			workers[num][key](data, transfer).then(function (d) {
				done(num);
				promise.resolve(d);
			}, function (d) {
				done(num);
				promise.reject(d);
			});
		}
		else if (queueLen || !numIdle) {
			queueLen = que.push([key, data, transfer, promise]);
		}
		return promise.promise;
	}
	self._close = function () {
		return catiline.all(workers.map(function (w) {
			return w._close();
		}));
	};
	if (!('close' in self)) {
		self.close = self._close;
	}
};
catiline.queue = function (obj, n, dumb) {
	return new catiline.Queue(obj, n, dumb);
};

function catiline(object,queueLength,unmanaged){
	if(arguments.length === 1 || !queueLength || queueLength <= 1){
		return new catiline.Worker(object);
	}else{
		return new catiline.Queue(object,queueLength,unmanaged);
	}
}

function initBrowser(catiline){
	var origCW = global.cw;
	catiline.noConflict=function(newName){
		global.cw = origCW;
		if(newName){
			global[newName]=catiline;
		}
	};
	global.catiline = catiline;
	global.cw = catiline;
	if(!('communist' in global)){
		global.communist=catiline;
	}
	
}

if(typeof define === 'function'){
	define(function(require){
		catiline.SHIM_WORKER_PATH=require.toUrl('./catiline.js');
		return catiline;
	});
}else if(typeof module === 'undefined' || !('exports' in module)){
	initBrowser(catiline);
} else {
	module.exports=catiline;
}
catiline.version = '2.4.2';
})(this);}


/* leaflet.shpfile.js */

'use strict';

/* global cw, shp */
L.Shapefile = L.GeoJSON.extend({
  options: {
    importUrl: 'shp.js'
  },

  initialize: function(file, options) {
    L.Util.setOptions(this, options);
    if (typeof cw !== 'undefined') {
      /*eslint-disable no-new-func*/
      if (!options.isArrayBuffer) {
        this.worker = cw(new Function('data', 'cb', 'importScripts("' + this.options.importUrl + '");shp(data).then(cb);'));
      } else {
        this.worker = cw(new Function('data', 'importScripts("' + this.options.importUrl + '"); return shp.parseZip(data);'));
      }
      /*eslint-enable no-new-func*/
    }
    L.GeoJSON.prototype.initialize.call(this, {
      features: []
    }, options);
    this.addFileData(file);
  },

  addFileData: function(file) {
    var self = this;
    this.fire('data:loading');
    if (typeof file !== 'string' && !('byteLength' in file)) {
      var data = this.addData(file);
      this.fire('data:loaded');
      return data;
    }
    if (!this.worker) {
      shp(file).then(function(data) {
        self.addData(data);
        self.fire('data:loaded');
      }).catch(function(err) {
        self.fire('data:error', err);
      })
      return this;
    }
    var promise;
    if (this.options.isArrayBufer) {
      promise = this.worker.data(file, [file]);
    } else {
      promise = this.worker.data(cw.makeUrl(file));
    }

    promise.then(function(data) {
      self.addData(data);
      self.fire('data:loaded');
      self.worker.close();
    }).then(function() {}, function(err) {
      self.fire('data:error', err);
    })
    return this;
  }
});

L.shapefile = function(a, b, c) {
  return new L.Shapefile(a, b, c);
};



// end of NWR-radios-leaflet.js scripts
// ]]>
