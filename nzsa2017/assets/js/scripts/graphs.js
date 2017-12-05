function graphs() {
  // load all the graphs ...

  mapCenter = [-36.8523, 174.7691];
  routeCenter = [-36.843871, 174.685693];
  aklMap();


  busdata = [];
  points_visible = false;

  d3.csv("data/route110.csv", function(d) {
    return {
      lat: +d.lat,
      lng: +d.lng,
    };
  }, function(data) {
    demoroute = data;
  });

  d3.csv("data/segments.csv", function(d) {
      return {
        id: d.id,
        speed: +d.speed,
        from: [+d.ystart, +d.xstart],
        to: [+d.yend, +d.xend]
      }
  }, function(data) {
    segments = data;
    var state = Reveal.getCurrentSlide().attributes["data-state"];
    if (state == undefined) return;
    if (state.value == "busmodel") addPointsToMap();
    if (state.value == "busmodel2") demoRoute();
  });

  Reveal.addEventListener('fragmentshown', fragmentForward);
  Reveal.addEventListener('fragmenthidden', fragmentBack);

  Reveal.addEventListener('realtimebuses', function() {
    addPointsToMap(1000);
  });
  Reveal.addEventListener('theProblem', function() {
    console.log("hello");
    removePoints();
  });

  Reveal.addEventListener('ourSolution', function() { removePoints(); });

  Reveal.addEventListener('busmodel', function() {
    if (busdata.length == 0) {
      alert("Data isn't loaded yet :(");
      return;
    }
    removeSegmentLines();
    removePoints(100);
    setTimeout(function() {
      zoomMap(11);
    }, 100);
  });

  Reveal.addEventListener('busmodel2', function() {
    demoRoute();
  });

  Reveal.addEventListener("busmodel3", function() {
    removeSegmentLines();
    zoomMap();
  });

  Reveal.addEventListener("networkmodel", function() {
    zoomMap();
  });

  Reveal.addEventListener("prediction", function() {
    removeSegmentLines();
    removePoints(100);
    setTimeout(function() {
      zoomMap();
    }, 1000);
  });

  Reveal.addEventListener("end", function () {
    zoomMap();
    setTimeout(addPointsToMap, 1000);
  });
}

function fragmentForward () {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  switch (state.value) {
    case "realtimebuses":
      zoomMap(11);
      break;
    case "busmodel2":
      doParticles(true);
      break;
    case "segSpeeds":
      doSegmentStuff(true);
      break;
  }
}

function fragmentBack () {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  switch (state.value) {
    case "realtimebuses":
      zoomMap(16);
      break;
    case "busmodel2":
      doParticles(false);
      break;
    case "segSpeeds":
      doSegmentStuff(false);
      break;
  }
}

function getSlideZoom() {
  var Zoom;
  switch (Reveal.getState().indexh) {
    case 0:
    case 1:
    case 11:
    case 12:
    case 13:
      Zoom = 16;
      break;
    case 7:
      Zoom = 13;
      break;
    case 8:
    case 9:
    case 10:
      Zoom = 12;
      break;
    default:
      Zoom = 11;
  }
  return Zoom;
}

function aklMap() {
  var Zoom = getSlideZoom();
  aklmap = new L.Map("aklMap", {
    center: Reveal.getState().indexh == 7 ? routeCenter : mapCenter,
    zoom: Zoom,
    zoomControl: false,
    attributionControl: false
  });
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
  }).addTo(aklmap);
  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .append("svg");

  getBusData();  
  setInterval(getBusData, 30000);
}

function getBusData () {
  var url;
  if ($(".busIcon").length == 0) {
    busdata = [];
    url = "y4obrzaqecdgemt/vehicle_locations_prev.pb";
  } else {
    url = "1fvto9ex649mkri/vehicle_locations.pb";
  }
  protobuf.load("assets/proto/gtfs-realtime.proto", function(err, root) {
      if (err)
          throw err;
      var f = root.lookupType("transit_realtime.FeedMessage");
      var xhr = new XMLHttpRequest();
      var vp = "https://dl.dropboxusercontent.com/s/" + url + "?dl=1";
      xhr.open("GET", vp, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function(evt) {
          var m = f.decode (new Uint8Array(xhr.response));
          if (busdata.length == 0) {
            busdata = m.entity;
            addPointsToMap();
            setTimeout(getBusData, 1000);
          } else {
            updateData(m.entity);
          }
      }
      xhr.send(null);
  });
}

function updateData(data) {
  // if current slide doesn't have any points, don't add them!
  if ($(".busIcon").length == 0) return;

  // do a check to see if the data has changed ... 
  busdata = data;

  busdata.forEach(function(d) {
    d.pt = project(d.vehicle.position.longitude, d.vehicle.position.latitude);
  });

  pts = aklsvg.selectAll(".busIcon")
    .data(busdata, function(d) { return d.vehicle.vehicle.id; });


  pts.transition().duration(29500)
      .ease(d3.easeLinear)
      .attr("x", function(d) { return d.pt.x; })
      .attr("y", function(d) { return d.pt.y; });

  pts.enter()
    .append("svg:image")
      .attr("xlink:href", "assets/img/bus-blue.png")
      .attr("class", "busIcon" + (aklmap.getZoom () > 14 ? "" : " busIcon-small"))
      .attr("x", function(d) { return d.pt.x; })
      .attr("y", function(d) { return d.pt.y; })
      .attr("opacity", 0)
        .transition()
          .duration(1000)
          .attr("opacity", 1);

  pts.exit()
    .transition()
      .duration(1000)
      .attr("opacity", 0)
      .remove();

}

function addPointsToMap(speed) {
  if ($.inArray(Reveal.getState().indexh, [2, 3, 4, 5, 6, 7, 8, 9, 11]) > -1) return;
  if ($(".busIcon").length > 0) return; // points exist ...
  if (speed == undefined) speed = 1000;
  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());

  // modify the data
  busdata.forEach(function(d) {
    d.pt = project(d.vehicle.position.longitude, d.vehicle.position.latitude);
  });

  aklbuses = aklsvg.selectAll("circle")
    .data(busdata, function(d) { return d.vehicle.vehicle.id; })
    .enter()
      .append("svg:image")
        .attr("xlink:href", "assets/img/bus-blue.png")
        .attr("class", "busIcon" + (aklmap.getZoom () > 14 ? "" : " busIcon-small"))
        .attr("x", function(d) { return d.pt.x; })
        .attr("y", function(d) { return d.pt.y; })
        .attr("opacity", 0)
          .transition().duration(speed)
            .attr("opacity", 1);

  points_visible = true;
}

function removePoints(speed) {
  if (speed == undefined) speed = 500;

  aklsvg.selectAll(".busIcon")
    .transition()
      .duration(300)
      .delay(function(d) { return Math.floor(Math.random() * speed); })
      .attr("opacity", 0)
      .remove();

  aklsvg.selectAll("circle")
    .transition()
      .duration(300)
      .delay(function(d) { return Math.floor(Math.random() * speed); })
      .attr("opacity", 0)
      .remove();

  aklsvg.selectAll("path")
    .transition()
      .duration(100)
      .attr("opacity", 0)
      .remove();


  points_visible = false;
}

function project(x, y) {
  var pt = aklmap.latLngToLayerPoint(new L.LatLng(y, x));
  return pt;
}


function zoomMap(zoom) {
  var ind = Reveal.getState().indexh;
  var newZoom = zoom == undefined ? getSlideZoom() : zoom;
  var ctr = mapCenter;
  if (newZoom == aklmap.getZoom ()) return;
  if (ind == 7) {
    ctr = routeCenter;
  }

  var easeadd = $(".busIcon").length == 0;
  removePoints(0);
  setTimeout(function() {
    aklmap.flyTo(ctr, newZoom, {"duration": 1, "easeLinearity": 0.5});
  }, 100);
  setTimeout(function() {
    addPointsToMap(2000 * easeadd);
  }, 1100);
}


function demoRoute() {
  removePoints();
  var wait = aklmap.getZoom() != 13;
  if (wait) {
    setTimeout(function() {
      var cnt = [-36.843871, 174.685693];
      aklmap.flyTo(cnt, 13);
    }, 1000);
  }
  setTimeout(addRouteLine, 2500 * wait);
}

function addRouteLine() {
  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());

  // modify the data
  demoroute.forEach(function(d) {
    d.pt = project(d.lng, d.lat);
  });

  var lineFun = d3.line()
      .x(function(d) { return d.pt.x; })
      .y(function(d) { return d.pt.y; });

  routepath = aklsvg.append("path")
    .data([demoroute])
    .attr("class", "routeline")
    .attr("d", lineFun)
    .attr("opacity", 0)
    .transition()
      .duration(500)
      .attr("opacity", 1);

  var path = routepath.node();
  particles = [
    {"d": 100, "v": 300, "it": 1}, 
    {"d": 110, "v": 340, "it": 1}, 
    {"d": 120, "v": 310, "it": 1}, 
    {"d": 120, "v": 280, "it": 1}, 
    {"d": 130, "v": 290, "it": 1}, 
    {"d": 130, "v": 300, "it": 1}, 
    {"d": 130, "v": 280, "it": 1}, 
    {"d": 140, "v": 330, "it": 1}, 
    {"d": 140, "v": 310, "it": 1}, 
    {"d": 150, "v": 280, "it": 1}
  ];
  particles.forEach(function(d) { 
    d.pt = path.getPointAtLength(d.d); 
  });
}

function showFirstBus() {
  realbus = {"lat": -36.832347, "lng": 174.617887};
  realbus.pt = project(realbus.lng, realbus.lat);
  aklsvg
    .append("svg:image")
      .attr("xlink:href", "assets/img/bus-red.png")
      .attr("class", "realbus busIcon busIcon-large")
      .attr("x", realbus.pt.x - 9)
      .attr("y", realbus.pt.y - 9)
      .attr("opacity", 0)
      .transition().delay(500)
        .duration(500)
        .attr("opacity", 1);
}

function doParticles(forward) {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  if (state.value != "busmodel2") return;
  var f = Reveal.getState().indexf;
  switch(f-1) {
    case 0:
      showFirstBus();
      break;
    case 2: 
      addParticles();
      break;
    case 3:
      moveParticles();
      break;
    case 6:
      resampleParticles();
      break;
    case 7:
      moveParticles();
      break;
    case 8:
      resampleParticles();
      break;
    case 9:
      moveParticles();
      break;
    case 10:
      resampleParticles();
      break;
  }
}

function addParticles() {
  aklsvg.select(".realbus")
    .transition().duration(600)
      .attr("opacity", 0)
      .attr("r", 0)
      .remove();

  aklbuses = aklsvg.selectAll(".particle")
    .data(particles, function(d) { return d.id; })
    .enter()
      .append("circle")
      .attr("class", "particle")
      .attr("transform", function(d) { return "translate(" + d.pt.x + "," + d.pt.y + ")"; })
      .attr("r", 4)
      .attr("opacity", 0)
        .transition().delay(500)
          .duration(500)
          .attr("opacity", 1);
}

function translateParticle() {
  var path = routepath.node();
  var L = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(d.d + t * (d.v));
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

function moveParticles() {
  var p2;
  switch (particles[0].it) {
    case 1:
      p2 = {"lat": -36.853830, "lng": 174.644537};
      break;
    case 2:
      var p2 = {"lat": -36.871718, "lng": 174.690972};
      break;
    case 3:
      var p2 = {"lat": -36.864646, "lng": 174.733029};
      break;
    // case 4:
    //   var p2 = {"lat": -36.850464, "lng": 174.762619};
    //   break;
  }
  var speed = particles[0].it > 2 ? 5000 : 10000;
  p2.pt = project(p2.lng, p2.lat);
  aklsvg.selectAll(".particle")
    .transition()
      .duration(speed)
      .ease(d3.easeLinear)
      .attrTween("transform", translateParticle());

  aklsvg.append("svg:image")
    .attr("xlink:href", "assets/img/bus-red.png")
    .attr("class", "realbus busIcon busIcon-large")
    .attr("x", p2.pt.x - 9)
    .attr("y", p2.pt.y - 9)
    .attr("opacity", 0)
    .transition().delay(speed-300).duration(300)
      .attr("opacity", 1);
}

function resampleParticles() {
  var newparticles = [], ind = [];
  switch(particles[0].it) {
    case 1:
      ind = [2, 4, 5, 6, 9, 2, 4, 5, 6, 9];
      break;
    case 2:
      ind = [0, 2, 4, 5, 8, 0, 2, 4, 5, 8];
      break;
    case 3:
      ind = [3, 4, 6, 9, 3, 4, 6, 9, 3, 4];
      break;
    case 4:
      ind = [3, 3, 3, 3, 3, 9, 9, 9, 9, 9];
      break;
  }
  for (i=0; i<ind.length; i++) {
    var newd = particles[ind[i]].d + particles[ind[i]].v;
    newparticles[i] = {
      "d": newd,
      "v": particles[i].v,
      "pt": routepath.node().getPointAtLength(newd),
      "it": particles[i].it + 1
    };
  }

  particles = newparticles;
  aklsvg.selectAll(".particle")
    .data(particles)
    .attr("transform", function(d) { return "translate(" + d.pt.x + "," + d.pt.y + ")"; });

  aklsvg.select(".realbus")
    .transition().delay(500).duration(600)
      .attr("opacity", 0)
      .attr("r", 0)
      .remove();
}



function doSegmentStuff() {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  if (state.value != "segSpeeds") return;
  var f = Reveal.getState().indexf;
  switch(f) {
    case 0: 
      addPointsToMap();
      createSegmentsLines();
      break;
    case 1:
      showSegmentLines();
      break;
    case 2:
      removeSegmentLines();
      removePoints();
      break;
  }
}

function createSegmentsLines() {
  aklsvg = d3.select(aklmap.getPanes().overlayPane)
      .select("svg").attr("class", "aklsvgoverlay")
        .attr("height", $("#aklMap").height())
        .attr("width", $("#aklMap").width());

  aklsvg.selectAll("line")
    .transition().duration(200)
      .attr("opacity", 0)
      .remove();

  // modify the data
  segments.forEach(function(d) {
    d.From = project(d.from[1], d.from[0]);
    d.To = project(d.to[1], d.to[0]);
  });
  var segmentstokeep = [];
  for(i=0;i<segments.length;i++) {
    if (sizeD(segments[i]) < 120 && !isNaN(segments[i].speed)) 
      segmentstokeep.push(segments[i]);
  }
  segments = segmentstokeep;
}

function showSegmentLines() {
  // removePoints(30000);
  aklsvg.selectAll(".busIcon")
    .transition().duration(10000)
      .attr("opacity", 0)
      .remove();

  var col1 = "red",
      col2 = "yellow",
      col3 = "green";
  var colour = d3.scaleLinear()
      .domain([0, 20, 50, 60, 61, 100])
      .range([col1, col2, col3, col3, col1, col3]);
  var seglines = aklsvg.selectAll("line")
      .data(segments)
      .enter().append("line")
        .attr("x1", function(d) { return d.From.x; })
        .attr("y1", function(d) { return d.From.y; })
        .attr("x2", function(d) { return d.To.x; })
        .attr("y2", function(d) { return d.To.y; })
        .attr("stroke", function(d) {
          return colour(d.speed);
        })
        .attr("opacity", 0)
        .transition().duration(1000)
          .delay(function(d) { return Math.floor(Math.random() * 30000); })
          .attr("opacity", 0.5);

}

function removeSegmentLines() {
  aklsvg.selectAll("line")
    .transition().duration(1000)
      .attr("opacity", 0)
      .remove();
}

function sizeD(d) {
  var len = Math.sqrt(Math.pow(d.From.x - d.To.x, 2) + Math.pow(d.From.y - d.To.y, 2));
  return len;
}