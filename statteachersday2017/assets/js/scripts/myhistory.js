function myhistory() {
  Reveal.addEventListener("whoami", function() {
    removePts();
    removeLns()
  });

  Reveal.addEventListener("myhistory-born", function() {
    birthPlace();
  });
  Reveal.addEventListener("myhistory-grewup", function() {
    grewup();
  });
  Reveal.addEventListener("myhistory-highschool", function() {
    highschool();
  });

  Reveal.addEventListener("fragmentshown", strikeText);
  Reveal.addEventListener("fragmenthidden", strikeText);

  Reveal.addEventListener("myhistory-uoa", function() {
    uoa();
  });


  Reveal.addEventListener("endofhist", function() {
    removeLns()
  });
  Reveal.addEventListener("compstats1", function() {
    removePts();
  });

}

function strikeText(event) {
  var state = Reveal.getCurrentSlide().attributes["data-state"];
  if (state == undefined) return;
  var f = Reveal.getState().indexf;
  
  if (state.value == "myhistory-highschool") {
    if (f > 0) $(".english").addClass("striked")
    else $(".english").removeClass("striked");
  } else if (state.value == "myhistory-uoa") {
    if (f > 0) $(".marine").addClass("striked")
    else $(".marine").removeClass("striked");
  }
}


function removePts() {
  aklsvg.selectAll("circle")
    .transition()
      .duration(300)
      .attr("opacity", 0)
      .attr("r", 0)
      .remove();
}
function removeLns() {
  aklsvg.selectAll("path")
    .transition()
      .duration(300)
      .style("stroke-opacity", 0)
      .remove();
  aklsvg.selectAll("image")
    .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
}

function birthPlace() {
  removePts();
  removeLns()

  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());

  var westakl = [-36.871294, 174.626161],
      westaklLine = {};

  var ptpos = project(westakl[1], westakl[0]);

  aklsvg.append("circle")
    .attr("cx", ptpos.x)
      .attr("cy", ptpos.y)
      .attr("r", 0)
      .attr("opacity", 0)
      .attr("class", "maplocation")
      .transition().duration(500).delay(500)
        .attr("opacity", null)
        .attr("r", 10);

}


function grewup() {
  // removePts();
  removeLns()

  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());

  var stanmore = [-36.629044, 174.734790],
      stanmoreLine = {};

  var ptpos = project(stanmore[1], stanmore[0]);

  aklsvg.append("circle")
    .attr("cx", ptpos.x)
      .attr("cy", ptpos.y)
      .attr("r", 0)
      .attr("opacity", 0)
      .attr("class", "maplocation")
      .transition().duration(500).delay(500)
        .attr("opacity", null)
        .attr("r", 10);
}


function highschool() {
  // removePts();
  removeLns()

  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());

  var westlake = [-36.777269, 174.748566];
  var westlakeLine = [
    [-36.769924, 174.765201], [-36.717814, 174.844224], [-36.717814, 174.895722]
  ];

  var ptpos = project(westlake[1], westlake[0]),
      lnpos = [];
  for (i=0;i<westlakeLine.length;i++)
    lnpos.push(project(westlakeLine[i][1], westlakeLine[i][0]));

  var pathFn = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

  aklsvg.append("circle")
    .attr("cx", ptpos.x)
      .attr("cy", ptpos.y)
      .attr("r", 0)
      .attr("opacity", 0)
      .attr("class", "maplocation")
      .transition().duration(500).delay(500)
        .attr("opacity", null)
        .attr("r", 10);
  aklsvg.append("path")
    .data([lnpos])
    .attr("class", "line")
    .attr("d", pathFn)
    .style("stroke-opacity", 0)
      .transition().duration(500).delay(1000)
        .style("stroke-opacity", null);

  aklsvg.append("svg:image")
    .attr("xlink:href", "assets/img/westlakelogo.png")
    .attr("x", lnpos[lnpos.length-1].x)
    .attr("y", lnpos[lnpos.length-1].y)
    .attr("opacity", 0)
      .transition().duration(500).delay(1500)
        .attr("opacity", 1)
        .attr("class", "westlakelogo");
  aklsvg.append("svg:image")
    .attr("xlink:href", "assets/img/westlake.jpg")
    .attr("x", lnpos[lnpos.length-1].x)
    .attr("y", lnpos[lnpos.length-1].y)
    .attr("class", "westlakeimg")
    .attr("opacity", 0)
      .transition().duration(500).delay(1800)
        .attr("opacity", 1);


}


function uoa() {
  removeLns();

  aklsvg = d3.select(aklmap.getPanes().overlayPane)
        .select("svg").attr("class", "aklsvgoverlay")
          .attr("height", $("#aklMap").height())
          .attr("width", $("#aklMap").width());

  var uoa = [-36.852147, 174.768713];
  var uoaLine = [
    [-36.865676, 174.780330,],
    [-36.908238, 174.827485],
    [-36.908238, 174.890788]
  ];

  var ptpos = project(uoa[1], uoa[0]),
      lnpos = [];
  for (i=0;i<uoaLine.length;i++)
    lnpos.push(project(uoaLine[i][1], uoaLine[i][0]));

  var pathFn = d3.line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

  aklsvg.append("circle")
    .attr("cx", ptpos.x)
      .attr("cy", ptpos.y)
      .attr("r", 0)
      .attr("opacity", 0)
      .attr("class", "maplocation")
      .transition().duration(500).delay(500)
        .attr("opacity", null)
        .attr("r", 10);
  aklsvg.append("path")
    .data([lnpos])
    .attr("class", "line")
    .attr("d", pathFn)
    .style("stroke-opacity", 0)
      .transition().duration(500).delay(1000)
        .style("stroke-opacity", null);

  aklsvg.append("svg:image")
    .attr("xlink:href", "assets/img/uoa.png")
    .attr("x", lnpos[lnpos.length-1].x)
    .attr("y", lnpos[lnpos.length-1].y)
    .attr("opacity", 0)
      .transition().duration(500).delay(1500)
        .attr("opacity", 1)
        .attr("class", "uoalogo");
}
