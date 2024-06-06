import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const getter = async () => {
  const resp = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  );
  const da = await resp.json();

  const data = da.data.map((d) => {
    return [new Date(d[0]), d[1]];
  });

  const width = 900;
  const height = 460;
  const padding = 50;
  const barWidth = (width - padding * 2) / data.length;
  const x = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
    .range([padding, width - padding]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height - padding, 0]);

  const tooltip = d3
    .select("#main")
    .append("div")
    .style("height", "fit-content")
    .style("min-width", "160px")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("top", "300px")
    .style("background", "white")
    .style("visibility", "hidden")
    .attr("class", "shadow text-center");

  d3.select("#main").append("svg").attr("width", width).attr("height", height);
  d3.select("svg")
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

  d3.select("svg")
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(d3.axisLeft(y));

  d3.select("svg")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => da.data[i][0])
    .attr("data-gdp", (d) => d[1])
    .attr("height", (d) => height - padding - y(d[1]))
    .attr("width", barWidth)
    .attr("fill", "red")

    .attr("x", (d, index) => x(d[0]))
    .attr("y", (d, index) => y(d[1]));

  const getQ = (q) => {
    if (q > 9) {
      return "Q4";
    } else if (q > 6) {
      return "Q3";
    } else if (q > 3) {
      return "Q2";
    }
    return "Q1";
  };
  const datediv = tooltip.append("div").attr("id", "date");
  const gdpdiv = tooltip.append("div").attr("id", "gdp");
  d3.selectAll(".bar").on("mouseover", (e) => {
    tooltip.style("visibility", "visible");
    tooltip.style("left", `${e.layerX + 20}px`);
    tooltip.attr("data-date", e.target.getAttribute("data-date"));
    const date = new Date(e.target.getAttribute("data-date"));
    const gdp = Number(e.target.getAttribute("data-gdp"));
    datediv.text(`${date.getFullYear()} ${getQ(date.getMonth() + 1)}`);
    gdpdiv.text(`$${gdp.toLocaleString()} Billion`);
  });
  d3.selectAll(".bar").on("mouseout", () => {
    tooltip.style("visibility", "hidden");
  });
};
getter();
