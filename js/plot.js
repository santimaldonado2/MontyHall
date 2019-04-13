function logit(x){
    if (x == 1){
        x = 0.999;
    }
    if (x == 0){
        x = 0.001
    }

    return Math.log(x / (1 - x))
}

function plot_results(data){    
    p_width = parseFloat($('.curve_plot').width());
    p_height = parseFloat($('.curve_plot').height());

    linedata = [
        {"concentration": 0.01, "logitPercentage": data.curve_data.coefficient*Math.log10(0.01) + data.curve_data.intercept},
        {"concentration": 35, "logitPercentage": data.curve_data.coefficient*Math.log10(35) + data.curve_data.intercept},
    ]



    data.control.map( control => {
      control.x1 = control.concentration_lower_bound;
      control.x2 = control.concentration_upper_bound;
      control.y1 = control.percentage;
      control.y2 = control.percentage;
    });

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = p_width - margin.left - margin.right,
        height = p_height - margin.top - margin.bottom;

    x_ticks_values = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.2, 0.3, 0.4, 0.5,0.6, 0.7, 0.8, 1, 2, 3, 4, 5, 6, 7, 8, 10, 20, 30]

    var xValue = function(d) { return d.concentration;}, // data -> value
        xScale = d3.scaleLog().range([0, width]).domain([0.01,40]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom(xScale)
            .tickValues(x_ticks_values)
            .tickFormat(tick => {
                if (tick < 0.1) return tick.toFixed(2).toString().substring(1);
                if (tick < 1) return tick.toFixed(1).toString().substring(1);
                return tick.toFixed(0);
            })

    y_ticks_values = [0.05,0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]

    // setup y
    var yValue = function(d) { return logit(d.percentage);}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]).domain([logit(0.03), logit(0.97)]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft(yScale)
            .tickValues(y_ticks_values.map(y => logit(y)))
            .tickFormat((tick, i) => parseInt(y_ticks_values[i]*100)+"%");

    line = d3.line()
        .x(xMap)
        .y(function(d) { return yScale(d.logitPercentage);});

    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .tickValues(x_ticks_values)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .tickValues(y_ticks_values.map(y => logit(y)))
    }
    // Plot
    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Axes
    svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Concentration");

    svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Percentage");
    //GRID      
    svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + height + ")")
          .call(make_x_gridlines()
              .tickSize(-height)
              .tickFormat("")
          )

     svg.append("g")
          .attr("class", "grid")
          .call(make_y_gridlines()
              .tickSize(-width)
              .tickFormat("")
          )


    svg.selectAll(".calibration-dot")
        .data(data.calibration)
      .enter().append("circle")
        .attr("cy", yMap)
        .attr("cx", xMap)
        .attr("r", 5)
        .attr("class", "calibration-dot");

    svg.append("path")
        .datum(linedata)
        .attr("class", "calibration-curve")
        .attr("d", line);

    svg.selectAll(".calibration-bound")
        .data(data.control)
      .enter().append("line")
        .attr("class", "calibration-bound")
        .attr("x1", d => xScale(d.x1))
        .attr("x2", d => xScale(d.x2))
        .attr("y1", d => yScale(logit(d.y1)))
        .attr("y2", d => yScale(logit(d.y2)));

    svg.selectAll(".control-dot")
        .data(data.control)
      .enter().append("circle")
        .attr("cy", yMap)
        .attr("cx", xMap)
        .attr("r", 5)
        .attr("class",  d => { return d.calibration_control_result === "true" ?"control-dot-ok":"control-dot-bad"});

    svg.selectAll(".patient-dot")
        .data(data.patients)
      .enter().append("circle")
        .attr("cy", yMap)
        .attr("cx", xMap)
        .attr("r", 5)
        .attr("class", "patient-dot");

    console.log(data)
}