function loadoldETAs () {
    var width = $("#ETA1").width(),
        height = $("#ETA1").height();

    window.etasvg = 
        d3.select("#ETA1").append("svg")
            .attr("width", width + "px")
            .attr("height", height + "px");

    xl = 
        d3.scaleLinear()
            .domain([0, 100])
            .range([0, width]);
    yl = 
        d3.scaleLinear()
            .domain([10, -10])
            .range([height, 0]);
    linefun = 
        d3.line()
            .x(function(d) { return xl(d.x); })
            .y(function(d) { return yl(d.y); });

    etalinedata = [{"x": 0, "y": 0}, {"x": 100, "y": 0}];
    etasvg.append("path").attr("class", "routeline")
        .attr("d", linefun(etalinedata));

    buspos = {"x": 0, "y": -1, "height": 100};
    // bussvg = 
    //     etasvg.append("svg:image")
    //         .attr("xlink:href", "assets/img/bus.svg")
    //         .attr("id", "bus1")
    //         // .attr("x", xl(buspos.x)).attr("y", yl(buspos.y))
    //         .attr("height", buspos.height + "px")
    //         .attr("opacity", 0);

    var state = Reveal.getCurrentSlide().attributes["data-state"];
    if (state == undefined) return;
    if (state.value == "currentETAs") oldETAs();
    Reveal.addEventListener("currentETAs", oldETAs);
    Reveal.addEventListener("fragmentshown", oldETAs2);
    Reveal.addEventListener("fragmenthidden", oldETAs2);

    Reveal.addEventListener("theProblem", clearETAs);
    // Reveal.addEventListener("etagraphOld", clearETAs);
}

function clearETAs () {
    etasvg.selectAll("circle").remove();
    etasvg.selectAll(".bus").remove();
    etasvg.selectAll("text").remove();
}

function oldETAs () {
    etastops = [
        {"x": 20, "sched": 30, "delay": 2},
        {"x": 40, "sched": 32, "delay": 5}, 
        {"x": 60, "sched": 34, "delay": 6}, 
        {"x": 90, "sched": 40, "delay": 8}
    ];
    etasvg.selectAll(".routestop")
        .data(etastops)
        .enter()
            .append("circle").attr("class", "routestop")
            .attr("cx", function(d) { return xl(d.x); })
            .attr("cy", yl(0))
            .attr("r", 10)
            .attr("opacity", 0)
            .transition().delay(function(d) { return d.x * 10 + 500; })
                .duration(500)
                .attr("r", 3)
                .attr("opacity", 1);
    etasvg.selectAll(".stopschedule")
        .data(etastops)
        .enter()
            .append("text").attr("class", function(d) { return "stopschedule stopschedule-" + d.x; })
            .attr("x", function(d) { return xl(d.x); })
            .attr("y", yl(2))
            .attr("font-size", "24px")
            .attr("text-anchor", "middle")
            .text(function(d) { return "7:" + d.sched; })
            .attr("opacity", 0)
            .transition().delay(function(d) { return d.x * 10 + 500; })
                .duration(500)
                .attr("opacity", 1);

    bussvg = 
        etasvg.append("svg:image")
            .attr("xlink:href", "assets/img/bus.svg")
            .attr("id", "bus1").attr("class", "bus")
            .attr("x", xl(buspos.x))
            .attr("y", yl(buspos.y) - buspos.height / 2)
            .attr("height", buspos.height + "px")
            .attr("opacity", 0)
        .transition().delay(1500)
            .duration(500)
            .attr("y", yl(buspos.y))
            .attr("opacity", 1);
}

function oldETAs2 () {
    var state = Reveal.getCurrentSlide().attributes["data-state"];
    if (state == undefined) return;
    if (state.value != "currentETAs") return;

    var f = Reveal.getState().indexf;
    switch(f) {
        case 0:
            console.log('bus arrives first stop; delay = 3min');
            arriveStop(0);
            break;
        case 1:
            console.log('set ETA for upcoming stops');
            etaStop(0);
            break;
        case 2:
            arriveStop(1);
            setTimeout(function() {
                etaStop(1);
            }, 3000);
            break;
        case 3:
            arriveStop(2);
            setTimeout(function() {
                etaStop(2);
            }, 3000);
            break;
        case 4:
            arriveStop(3);
            setTimeout(function() {
                etaStop(3);
            }, 3000);
            break;
    }
}

function arriveStop (i) {
    etasvg.select("#bus1")
        .transition().duration(2000)
            .attr("x", xl(etastops[i].x) - buspos.height * 0.6);

    setTimeout(function() {
        $(".stopschedule-" + etastops[i].x).addClass("old");
    }, 2000);
    etasvg.select(".stopactual-" + etastops[i].x).remove();
    etasvg.append("text").attr("class", "stopactual stopactual-" + etastops[i].x)
        .attr("x", xl(etastops[i].x))
        .attr("y", yl(4))
        .attr("font-size", "24px")
        .attr("text-anchor", "middle")
        .text("7:" + (etastops[i].sched + etastops[i].delay))
        .attr("opacity", 0)
        .transition().delay(2000)
            .duration(500)
            .attr("opacity", 1);
    etasvg.append("text").attr("class", "stopdelay")
        .attr("x", xl(etastops[i].x))
        .attr("y", yl(6))
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("delay = " + etastops[i].delay + " min")
        .attr("opacity", 0)
        .transition().delay(2500)
            .duration(500)
            .attr("opacity", 1);
}

function etaStop (i) {
    var delay = etastops[i].delay;
    i++;
    while (i < etastops.length) {
        etasvg.select(".stopactual-" + etastops[i].x).remove();
        etasvg.append("text").attr("class", "stopactual stopactual-" + etastops[i].x)
            .attr("x", xl(etastops[i].x))
            .attr("y", yl(4))
            .attr("font-size", "24px")
            .attr("text-anchor", "middle")
            .text("ETA: 7:" + (etastops[i].sched + delay))
            .attr("opacity", 0)
            .transition()
                .duration(500)
                .attr("opacity", 1);
        i++;
    }
}