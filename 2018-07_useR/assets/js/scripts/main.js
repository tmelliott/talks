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

var segdata, svg, ax, ay, ac, ad, at, margin = {}, height, width, fitdata, grid, preddata = [];

// variables we'll need to use throughout the place
// var aklmap, busdata, points_visible, aklsvg, aklbuses, pts = [], routepath, particles, realbus, segments;


Reveal.addEventListener('fragmentshown', fragmentChng);
Reveal.addEventListener('fragmenthidden', fragmentChng);

Reveal.addEventListener('graph', function() {
  $("#aklMap").addClass("showme");
});
Reveal.addEventListener('pred', speedGraph);
Reveal.addEventListener('useR', goAwayMaps);

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
    case 5:
      addGrid();
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

  d3.csv("data/fitspeed.csv", function(d) {
    return {
      id: +d.id,
      time: +d.tt,
      dist: +d.seg_dist,
      speed: +d.speed
    };
  }).then (function (data) {
    fitdata = data;
  });

  d3.csv("data/predspeeds_10.csv", function(d) {
    return {
      id: +d.id,
      dist: +d.seg_dist,
      speed: +d.speed
    };
  }).then (function (data) {
    preddata[0] = {id: 1, values: data};
  });  
  d3.csv("data/predspeeds_17.csv", function(d) {
    return {
      id: +d.id,
      dist: +d.seg_dist,
      speed: +d.speed
    };
  }).then (function (data) {
    preddata[1] = {id: 2, values: data};
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
  svg = d3.select(aklmap.getPanes().overlayPane)
        .append("svg")
        .attr("height", height)
        .attr("width", width);
  svg.append("rect")
    .attr("class", "mapcover")
    .attr("transform", "translate(" + width * 0.1 + "," + height * 0.1 + ")")
    .attr("height", height * 0.8)
    .attr("width", width * 0.8);
  ptsg = svg.append('g');

  ax = d3.scaleLinear()
    .domain([174.7413, 174.7643])
    .range([200, width-200]);
  ay = d3.scaleLinear()
    .domain([-36.83419, -36.79885])
    .range([height - margin.top - margin.bottom, margin.top]);

  // height = window height
  // 0.8height = height of box
  // 0.1height = margin of box
  // 0.05height = padding of box
  
  ad = d3.scaleLinear()
    .domain([0, 4500])
    .range([0.85 * height, 0.15 * height]);
  at = d3.scaleLinear()
    .domain([5, 23])
    .range([0.15 * width, 0.85 * width]);

  ac = d3.scaleLinear()
    .domain([5, 10, 15, 20])
    .range(['#440154', '#31688E', '#35B779', '#FDE725']);

  as = d3.scaleLinear()
    .domain([0, 70])
    .range([0.82 * height, 0.15 * height]);
  ad2 = d3.scaleLinear()
    .domain([0, 4500])
    .range([0.15 * width, 0.85 * width]);
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
  $(".mapcover").addClass("showme");
  // add the axis first ...
  svg.append("g")
    .attr("transform", "translate(" + (0.15 * width) + "," + 0 + ")")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(ad).ticks(5)
        .tickFormat(function(z) { return z / 1000; }))
    .attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);

  svg.append('text')
    .attr("transform", "rotate(-90)")
    .attr("class", "axis-label")
    .attr("x", -0.5 * height)
    .attr("y", 0.10 * width)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Distance (km)")
    .attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);

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
    .attr("transform", "translate(" + "0" + "," + (0.86 * height) + ")")
    .attr("class", "axis axis-x")
    .call(d3.axisBottom(at).ticks(6)
        .tickFormat(function(z) { 
          if (z < 12) return z + "am";
          if (z == 12) return ("12pm");
          return (z-12) + "pm"; 
        }))
    .attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);

  svg.selectAll(".obs")
    .transition()
      .duration(1000)
      .delay(2000)
      .attr("cx", function(d) { return at(d.time); });
}

function addGrid () {
  grid = svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + "0" + "," + margin.top + ")");

  ptsg.selectAll('.obs')
    .transition()
      .duration(500)
      .attr('opacity', 0);

  grid.selectAll('rect')
    .data(fitdata, function (d) { return d.id; })
    .enter()
      .append('rect')
      .attr('class', 'griditem')
      .attr('x', function (d) { return at (d.time); })
      .attr('y', function (d) { return ad (d.dist + 221.6557); })
      .attr('width', at(22.329167) - at(21.891667))
      .attr('height', ad(0) - ad(221.6557))
      .attr('fill', 'transparent')
      .transition()
        .duration(500)
        .attr('fill', function (d) { return ac (d.speed); });

    svg.append('text')
      .attr("class", "plottext")
      .attr("x", 0.5 * width)
      .attr("y", 0.12 * height)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("mgcv::gam(speed ~ s(time, distance))")
      .attr("opacity", 0)
      .transition()
        .duration(1000)
        .attr("opacity", 1);
}


function speedGraph () {
  grid.selectAll('rect')
    .transition()
      .duration(500)
      .attr("fill", "transparent");
  svg.selectAll('text')
    .transition()
      .duration(500)
      .attr("opacity", 0);
  svg.selectAll('.axis')
    .transition()
      .duration(500)
      .attr("opacity", 0);

  svg.append("g")
    .attr("transform", "translate(" + (0.15 * width) + "," + 0 + ")")
    .attr("class", "axis axis-y")
    .call(d3.axisLeft(as).ticks(5))
    .attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);

  svg.append("g")
    .attr("transform", "translate(" + "0" + "," + (0.83 * height) + ")")
    .attr("class", "axis axis-x")
    .call(d3.axisBottom(ad2).ticks(6)
        .tickFormat(function(z) { return z / 1000; }))
    .attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);

  svg.select('.axis-label')
    .text("Speed (km/h)")
    .transition()
      .duration(1000)
      .attr("opacity", 1);

  svg.append('text')
    .attr("class", "axis-label")
    .attr("x", 0.5 * width)
    .attr("y", 0.865 * height)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Distance (km)")
    .attr("opacity", 0)
    .transition()
      .duration(1000)
      .attr("opacity", 1);


  var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return ad2(d.dist); })
    .y(function(d) { return as(d.speed / 1000 * 60 * 60); });

  svg.append('path')
    .attr('class', 'line line1')
    .attr("d", line(preddata[0].values))
    .attr('opacity', 0)
    .transition()
      .delay(1000)
      .duration(500)
      .attr('opacity', 1);

  svg.append('text')
    .attr("class", "text-label")
    .attr("x", ad2(3000))
    .attr("y", as(66))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("10:00 am")
    .attr("opacity", 0)
    .transition()
      .delay(1000)
      .duration(500)
      .attr("opacity", 1);

  svg.append('path')
    .attr('class', 'line line2')
    .attr("d", line(preddata[1].values))
    .attr('opacity', 0)
    .transition()
      .delay(5000)
      .duration(500)
      .attr('opacity', 1);

  svg.append('text')
    .attr("class", "text-label text-label2")
    .attr("x", ad2(3000))
    .attr("y", as(41))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("5:30 pm")
    .attr("opacity", 0)
    .transition()
      .delay(5000)
      .duration(500)
      .attr("opacity", 1);


}

function goAwayMaps () {
  $("#aklMap").removeClass("showme");
  svg.selectAll('*')
    .transition()
    .duration(500)
    .attr('opacity', 0);
}

