$(document).ready(function() {
  // call functions etc here
  Reveal.initialize({
    controls: false,
    // height: '100%',
    // width: '100%',
    // margin: 0,
    progress: false,
    // transition: 'none',
    history: true, // can unset this for final - makes reloading nicer
    math: {
      jax: ["output/CommonHTML"],
  		// mathjax: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js',
  		config: 'TeX-AMS_HTML-full'  // See http://docs.mathjax.org/en/latest/config-files.html
  	},
    dependencies: [
  		{ src: 'assets/revealjs/plugin/math/math.js', async: true }
  	]
  });

  LoadSegmentData();

  // more functions?
  // aklMap();
});

var segdata, svg, ax, ay, ac, ad, at, margin = {}, height, width;

// variables we'll need to use throughout the place
// var aklmap, busdata, points_visible, aklsvg, aklbuses, pts = [], routepath, particles, realbus, segments;


Reveal.addEventListener('fragmentshown', fragmentChng);
Reveal.addEventListener('fragmenthidden', fragmentChng);

Reveal.addEventListener('graph', function() {
  $("#aklMap").addClass("showme");
});

function fragmentChng () {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  switch (state.value) {
    case "titlepage":
      titlepageFrag();
      break;
    case "graph":
      graphFrag();
      break;
  }
}


function titlepageFrag () {
  var fi = Reveal.getState().indexf;
  
  if (fi == -1) {
    $("#titlepage .inline-slides .slide0").removeClass('gone');
    $("#titlepage .inline-slides .slide1").removeClass('shown gone');
  }
  if (fi == 0) {
    $("#titlepage .inline-slides .slide0").addClass('gone');
    $("#titlepage .inline-slides .slide1").addClass('shown');
  }
  
}

function graphFrag () {
  var fi = Reveal.getState().indexf;

  switch (fi) {
    case -1:
      break;
    case 0:
      addPoints();
      break;
    case 1:
      colourPoints();
      break;
    case 2:
      spreadPoints();
      break;
    case 3:
      transformY();
      break;
    case 4:
      transformX();
      break;
  }
}





function LoadSegmentData () {
  d3.csv("data/segspeed.csv", function(d) {
    return {
      id: +d.id,
      time: +d.tt,
      dist: +d.seg_dist,
      speed: +d.speed,
      lat: +d.lat,
      lng: +d.lng,
      latr: +d.latr,
      lngr: +d.lngr
    };
  }).then (function (data) {
    segdata = data;
    loadMap();
  });
}

function loadMap() {
  var Zoom = 14;
  aklmap = new L.Map("aklMap", {
    center: [-36.81755, 174.7523],
    zoom: Zoom,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
  }).addTo(aklmap);

  setTimeout(initializeGraph, 1000);
}

function project(x, y) {
  var pt = aklmap.latLngToLayerPoint(new L.LatLng(y, x));
  return pt;
  // return [y, x];
}

function initializeGraph () {
  height = $("#aklMap").height();
  width = $("#aklMap").width();
  margin = {top: 5, bottom: 50, left: 50, right: 5};
  d3.select(aklmap.getPanes().overlayPane).append('div')
    .attr('class', 'mapmask')
    .attr('height', height).attr('width', width);
  svg = d3.select(aklmap.getPanes().overlayPane)
        .append("svg")
        .attr("height", height)
        .attr("width", width);
  // svg = d3.select("#mainSVG")
  //   .attr('height', height)
  //   .attr('width', width);
  ptsg = svg.append('g');
      // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  ax = d3.scaleLinear()
    .domain([174.7413, 174.7643])
    .range([200, width-200]);
  ay = d3.scaleLinear()
    .domain([-36.83419, -36.79885])
    .range([height - margin.top - margin.bottom, margin.top]);

  ad = d3.scaleLinear()
    .domain([0, 4500])
    .range([height - margin.top - margin.bottom, margin.top]);
  at = d3.scaleLinear()
    .domain([5, 23])
    .range([margin.left, width - margin.right - margin.left]);

  ac = d3.scaleLinear()
    .domain([5, 10, 15, 20])
    .range(['#440154', '#31688E', '#35B779', '#FDE725']);
}

function addPoints () {
  segdata.forEach(function(d) {
    d.pt = project(d.lng, d.lat);
    d.ptr = project(d.lngr, d.latr);
  });

  pts = ptsg.selectAll(".obs")
    .data(segdata, function(d) { return d.id; })
    .enter()
      .append("circle")
      .attr("class", "obs")
      .attr("cx", function(d) { return (d.pt.x); })
      .attr("cy", function(d) { return (d.pt.y); })
      .attr("r", 5)
      .attr("opacity", 0)
      .attr("sroke", "black")
      .attr("fill", "black")
      .transition()
        .delay(function() { return 500 * Math.random(); })
        .duration(200)
        .attr("opacity", 1);
}

function colourPoints () {
  ptsg.selectAll(".obs")
    .transition()
      .duration(500)
      .attr("cx", function(d) { return (d.pt.x); })
      .attr("cy", function(d) { return (d.pt.y); })
      .attr("stroke", function(d) { return ac(d.speed); })
      .attr("fill", function(d) { return ac(d.speed); });
}

function spreadPoints () {
  ptsg.selectAll(".obs")
    .transition()
      .duration(500)
      .attr("cx", function(d) { return (d.ptr.x); })
      .attr("cy", function(d) { return (d.ptr.y); });
}

function transformY () {
  $(".leaflet-tile-pane").addClass('hideme');
  // add the axis first ...
  svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(ad).ticks(5)
        .tickFormat(function(z) { return z / 1000; }));

  ptsg.selectAll(".obs")
    .transition()
      .delay(function(d) { return 2000 + ay(d.latr)*2 + Math.random() * 400; })
      .duration(500)
      .attr("cx", function() { return at(5.2 + Math.random()); })
      .attr("cy", function(d) { return ad(d.dist); });
}

function transformX () {
  // add the axis first ...
  svg.append("g")
    .attr("transform", "translate(" + "0" + "," + (height - margin.bottom) + ")")
    .attr("class", "axis axis-x")
    .call(d3.axisBottom(at).ticks(6)
        .tickFormat(function(z) { 
          if (z < 12) return z + "am";
          if (z == 12) return ("12pm");
          return (z-12) + "pm"; 
        }));

  svg.selectAll(".obs")
    .transition()
      .duration(1000)
      .delay(2000)
      .attr("cx", function(d) { return at(d.time); });
}







