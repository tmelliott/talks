
function loadEtaGraph () {

    etadata = [{"time":32,"eta":10},{"time":33,"eta":9},{"time":34,"eta":8},{"time":35,"eta":7},
        {"time":36,"eta":6},{"time":37,"eta":5},{"time":37,"eta":8},{"time":38,"eta":7},{"time":39,"eta":6},
        {"time":40,"eta":5},{"time":40,"eta":6},{"time":41,"eta":5},{"time":42,"eta":4},{"time":43,"eta":3},
        {"time":44,"eta":2},{"time":45,"eta":1},{"time":46,"eta":0},{"time":47,"eta":0},{"time":48,"eta":0}];

    etagraph = undefined;

    var state = Reveal.getCurrentSlide().attributes["data-state"];
    if (state == undefined) return;
    if (state.value == "etagraphOld") oldgraphETAs();
    Reveal.addEventListener("etagraphOld", oldgraphETAs);
    Reveal.addEventListener("currentETAs", clearEtaLine);

    Reveal.addEventListener("fragmentshown", showgraphLine);
    Reveal.addEventListener("fragmenthidden", showgraphLine);
}

function clearEtaLine () {
    if (etagraph != undefined) {
        etagraph.selectAll(".line").remove();
    }
}

function oldgraphETAs () {
    if ($(".busIcon").length == 0) {
        setTimeout(addPointsToMap, 1000);
    }
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = $("#ETAgraph").width() - margin.left - margin.right,
        height = $("#ETAgraph").height() - margin.top - margin.bottom;

    xl2 = 
        d3.scaleLinear()
            .domain([32, 48])
            .range([0, width]);
    yl2 = 
        d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0]);

    etaline =
        d3.line()
            .x(function(d) { return xl2(d.time); })
            .y(function(d) { return yl2(d.eta); });

    if ($("#ETAgraph svg").length > 0) return;
    etagraph = 
        d3.select("#ETAgraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    etagraph.append("g").attr("class", "axis xaxis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(xl2).ticks(5));
    etagraph.append("g").attr("class", "axis")
        .call(d3.axisLeft(yl2).ticks(6));
    $(".xaxis g text").each(function(i) {
        $(this).html("7:" + $(this).html());
    });

}

function showgraphLine () {
    var state = Reveal.getCurrentSlide().attributes["data-state"];
    if (state == undefined) return;
    if (state.value != "etagraphOld") return;
   
    var pth = etagraph.append("path")
        .data([etadata])
        .attr("class", "line delayline")
        .attr("d", etaline);

    var len = pth.node().getTotalLength();
    pth.attr("stroke-dasharray", len + " " + len)
        .attr("stroke-dashoffset", len)
        .transition().delay(500)
            .duration(6000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

}