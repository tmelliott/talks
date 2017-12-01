function graphs() {
  // load all the graphs ...

  aklMap();

  busdata = [];
  points_visible = false;
  // d3.csv("data/vehicles.csv", function(d) {
  //   return {
  //     id: d.id,
  //     lat: +d.lat,
  //     lng: +d.lng,
  //     route: d.route
  //   };
  // }, function(data) {
  //   busdata = data;
  // });



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
  });

  Reveal.addEventListener('aim', function() {
    // remove points, if they exist!
    removePoints();
  });

  Reveal.addEventListener('ourSolution', removePoints);

  Reveal.addEventListener('busmodel', function() {
    if (busdata.length == 0) {
      alert("Data isn't loaded yet :(");
      return;
    }
    removeSegmentLines();

    // add points, if they don't already
    removePoints();
    setTimeout(function() {
      addPointsToMap(busdata, aklmap);
    }, 1000);
  });
  Reveal.addEventListener('busmodel2', function() {
    demoRoute();
  });
  Reveal.addEventListener("fragmentshown", doParticles);
  Reveal.addEventListener("fragmenthidden", doParticles);

  Reveal.addEventListener("busmodel3", function() {
    removePoints();
    // setTimeout(function() {
    //   addPointsToMap();
    // }, 2000);
  });

  Reveal.addEventListener("fragmentshown", doSegmentStuff);
  Reveal.addEventListener("fragmenthidden", doSegmentStuff);

  Reveal.addEventListener("prediction", function() {
    removeSegmentLines();
    removePoints();
  });
}


function aklMap() {
  aklmap = new L.Map("aklMap", {
    center: [-36.845794, 174.860478],
    zoom: 11,
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
  setInterval(getBusData, 10000);
}

function getBusData () {
  protobuf.load("assets/proto/gtfs-realtime.proto", function(err, root) {
      if (err)
          throw err;
      var f = root.lookupType("transit_realtime.FeedMessage");
      var xhr = new XMLHttpRequest();
      var vp = "https://dl.dropboxusercontent.com/s/1fvto9ex649mkri/vehicle_locations.pb?dl=1";
      xhr.open("GET", vp, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function(evt) {
          var m = f.decode (new Uint8Array(xhr.response));
          if (busdata.length == 0) {
            busdata = m.entity;
            addPointsToMap();
          } else {
            updateData(m.entity);
          }
      }
      xhr.send(null);
  });
}

function updateData(data) {
  console.log("update");
  // do a check to see if the data has changed ... 
  busdata = data;

  busdata.forEach(function(d) {
    d.pt = project(d.vehicle.position.longitude, d.vehicle.position.latitude);
  });

  pts = aklsvg.selectAll("circle")
    .data(busdata, function(d) { return d.vehicle.vehicle.id; });


  pts.transition().duration(10000)
      .ease(d3.easeLinear)
      .attr("cx", function(d) { return d.pt.x; })
      .attr("cy", function(d) { return d.pt.y; });

  pts.enter()
    .append("circle")
      .attr("cx", function(d) { return d.pt.x; })
      .attr("cy", function(d) { return d.pt.y; })
      .attr("r", 5)
      .attr("opacity", 0)
        .transition()
          .duration(1000)
          .attr("opacity", 1)
          .attr("r", 2);

  pts.exit()
    .transition()
      .duration(1000)
      .attr("opacity", 0)
      .remove();

}

function addPointsToMap() {
  // d3.select(".aklsvgoverlay").remove();
  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());
        //  g = aklsvg.append("g");

  // modify the data
  busdata.forEach(function(d) {
    d.pt = project(d.vehicle.position.longitude, d.vehicle.position.latitude);
  });

  aklbuses = aklsvg.selectAll("circle")
    .data(busdata, function(d) { return d.vehicle.vehicle.id; })
    .enter()
      .append("circle")
      .attr("cx", function(d) { return d.pt.x; })
      .attr("cy", function(d) { return d.pt.y; })
      .attr("r", 5)
      .attr("opacity", 0)
        .transition().delay(500)
          .duration(function(d) { return Math.floor(Math.random() * 5000); })
          .attr("opacity", 1)
          .attr("r", 2);

  points_visible = true;
}

function removePoints(speed) {
  if (speed == undefined) speed = 1000;
  if (aklmap.getZoom () != 11) {
    var cnt = [-36.845794, 174.860478];
    aklmap.flyTo(cnt, 11);
  }

  aklsvg.selectAll("circle")
    .transition()
      .duration(function(d) { return Math.floor(Math.random() * speed); })
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



function demoRoute() {
  removePoints();
  setTimeout(function() {
    var cnt = [-36.843871, 174.685693];
    aklmap.flyTo(cnt, 13);
  }, 1000);
  setTimeout(addRouteLine, 2500);
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

  realbus = {"lat": -36.832347, "lng": 174.617887};
  realbus.pt = project(realbus.lng, realbus.lat);
  aklsvg.append("circle")
    .attr("class", "realbus")
    .attr("cx", realbus.pt.x)
    .attr("cy", realbus.pt.y)
    .attr("r", 0)
    .attr("opacity", 0)
    .transition().delay(500)
      .duration(500)
      .attr("r", 7)
      .attr("opacity", 1);
}

function doParticles() {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  if (state.value != "busmodel2") return;
  var f = Reveal.getState().indexf;
  switch(f) {
    case 0: 
      addParticles();
      break;
    case 1:
      moveParticles();
      break;
    case 2:
      resampleParticles();
      break;
    case 3:
      moveParticles();
      break;
    case 4:
      resampleParticles();
      break;
    case 5:
      moveParticles();
      break;
    case 6:
      resampleParticles();
      break;
    case 7:
      moveParticles();
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
      .attr("r", 5)
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
    case 4:
      var p2 = {"lat": -36.850464, "lng": 174.762619};
      break;
  }
  p2.pt = project(p2.lng, p2.lat);
  aklsvg.selectAll(".particle")
    .transition()
      .duration(10000)
      .ease(d3.easeLinear)
      .attrTween("transform", translateParticle());

  aklsvg.append("circle")
    .attr("class", "realbus")
    .attr("cx", p2.pt.x)
    .attr("cy", p2.pt.y)
    .attr("opacity", 0)
    .attr("r", 0)
    .transition().delay(10000-300).duration(300)
      .attr("opacity", 1)
      .attr("r", 7);
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
  aklsvg.selectAll("circle")
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