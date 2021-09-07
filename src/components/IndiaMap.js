import React, { useContext, useEffect } from "react";
import { DataContext } from "../common/DataContext";
import * as d3 from "d3";
import styled from "styled-components";
import StateCord from "../common/StateCord/State.json";

const IndiaMap = ({ activeState }) => {
  const { geoIndia, geoIndiaJSON } = useContext(DataContext);
  const width = 1000;
  const height = 1000;

  useEffect(() => {
    geoIndia();
  }, []);

  useEffect(() => {
    if (geoIndiaJSON === undefined) return;

    function tweenDash() {
      const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
      return function (t) {
        return i(t);
      };
    }

    function transition(path) {
      path
        .transition()
        .duration(3000)
        .attrTween("stroke-dasharray", tweenDash)
        .on("end", () => {
          d3.select(this).call(transition);
        });
    }

    d3.select(".indiaMap > svg").remove();
    const mapColor =
      activeState === "confirm"
        ? "#ff073a99"
        : activeState === "death"
        ? "#6c757d99"
        : activeState === "recover"
        ? "#28a74599"
        : "#007bff99";

    const svg = d3
      .select(".indiaMap")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var projection = d3.geoMercator().fitSize([width, height], geoIndiaJSON);
    var path = d3.geoPath().projection(projection);

    svg
      .selectAll("path")
      .data(geoIndiaJSON.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", mapColor)
      .call(transition);

    svg
      .selectAll("circle")
      .data([1])
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d) =>
          projection([
            StateCord["West Bengal"].long,
            StateCord["West Bengal"].lat,
          ])[0]
      )
      .attr(
        "cy",
        (d) =>
          projection([
            StateCord["West Bengal"].long,
            StateCord["West Bengal"].lat,
          ])[1]
      )
      .attr("r", 15.24917 * 4)
      .style("fill", "#fff");
  }, [geoIndiaJSON, activeState]);

  console.log(geoIndiaJSON);

  return (
    <Container>
      <div className="indiaMap"></div>
    </Container>
  );
};

export default IndiaMap;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  &.indiaMap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
