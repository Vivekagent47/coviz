import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DataContext } from "../common/DataContext";
import * as d3 from "d3";
import IndiaMap from "./IndiaMap";

function Overall() {
  const { getData, countryData, getPath, historyData } =
    React.useContext(DataContext);
  const [activeCard, setActiveCard] = useState("confirm");

  const setActive = (val) => {
    setActiveCard(val);
  };
  const margin = { top: 10, right: 10, bottom: 2, left: 10 };
  const height = 75;
  const width = 120;

  const confirmCases = historyData
    ? Object.entries(historyData.timeline.cases).map((d) => {
        const [month, day, year] = d[0].split("/");
        return [new Date(2000 + Number(year), Number(month) - 1, day), d[1]];
      })
    : [];
  const recoverCases = historyData
    ? Object.entries(historyData.timeline.recovered).map((d) => {
        const [month, day, year] = d[0].split("/");
        return [new Date(2000 + Number(year), Number(month) - 1, day), d[1]];
      })
    : [];
  const deathCases = historyData
    ? Object.entries(historyData.timeline.deaths).map((d) => {
        const [month, day, year] = d[0].split("/");
        return [new Date(2000 + Number(year), Number(month) - 1, day), d[1]];
      })
    : [];

  useEffect(() => {
    getData();
    getPath(500);
  }, []);

  useEffect(() => {
    if (confirmCases.length <= 0) return;
    if (recoverCases.length <= 0) return;
    if (deathCases.length <= 0) return;

    const activeArray = () => {
      let res = [];
      for (let i = 0; i < confirmCases.length - 60; i++) {
        res.push([
          confirmCases[i][0],
          confirmCases[i][1] - recoverCases[i][1] - deathCases[i][1],
        ]);
      }
      return res;
    };

    const xScale = d3.scaleTime().clamp(true).range([0, width]);
    const yScale = d3.scaleLinear().clamp(true).range([height, 0]);

    const timeDomain = d3.extent(confirmCases, (d) => d[0]);
    xScale.domain(timeDomain);

    const lineGenerator = d3.line().x((d) => xScale(d[0]));

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

    function miniPath(map, data, yScale, transition, stockColor) {
      d3.select(`.${map} > svg`).remove();

      let svg = d3
        .select(`.${map}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const caseDomain = d3.max(data, (d) => d[1]);
      yScale.domain([0, caseDomain]);

      svg
        .append("path")
        .attr("d", lineGenerator.y((d) => yScale(d[1]))(data))
        .attr("fill", "none")
        .attr("stroke", stockColor)
        .attr("stroke-width", 2.5)
        .call(transition);
    }

    miniPath("confirmMap", confirmCases, yScale, transition, "#ff073a99");
    miniPath("activeMap", activeArray(), yScale, transition, "#007bff99");
    miniPath("recoverMap", recoverCases, yScale, transition, "#28a74599");
    miniPath("deathMap", deathCases, yScale, transition, "#6c757d99");
  }, [historyData]);

  return (
    <Container>
      <Top>
        <h1>India</h1>
        <p>
          Last Updated at{" "}
          {countryData ? new Date(countryData.updated).toString() : ""}
        </p>
      </Top>
      <CardContainer>
        <Card
          className={activeCard === "confirm" ? "active" : ""}
          onClick={() => setActive("confirm")}
          type="confirm"
        >
          <h6>Confirmed</h6>
          <h1>
            {countryData ? countryData.total.cases.toLocaleString("en-IN") : 0}
          </h1>
          <div className="confirmMap"></div>
        </Card>
        <Card
          className={activeCard === "active" ? "active" : ""}
          onClick={() => setActive("active")}
          type="active"
        >
          <h6>Active</h6>
          <h1>
            {countryData ? countryData.total.active.toLocaleString("en-IN") : 0}
          </h1>
          <div className="activeMap"></div>
        </Card>
        <Card
          className={activeCard === "recover" ? "active" : ""}
          onClick={() => setActive("recover")}
          type="recover"
        >
          <h6>Recovered</h6>
          <h1>
            {countryData
              ? countryData.total.recovered.toLocaleString("en-IN")
              : 0}
          </h1>
          <div className="recoverMap"></div>
        </Card>
        <Card
          className={activeCard === "death" ? "active" : ""}
          onClick={() => setActive("death")}
          type="death"
        >
          <h6>Deaths</h6>
          <h1>
            {countryData ? countryData.total.deaths.toLocaleString("en-IN") : 0}
          </h1>
          <div className="deathMap"></div>
        </Card>
      </CardContainer>
      <IndiaMap activeState={activeCard} />
    </Container>
  );
}

export default Overall;

const Container = styled.div`
  position: relative;
  display: block;
  margin: auto;
  @media (max-width: 800px) {
    width: 90%;
  }
`;

const Top = styled.div`
  position: relative;
  h1 {
    width: max-content;
    padding: 4px 8px;
    background: rgba(226, 48, 40, 0.06274509803921569);
    font-size: 24px !important;
    font-weight: 900;
    color: #e23028;
    border-radius: 4px;
  }

  p {
    color: #6c757d;
    font-weight: 600;
    margin-top: 0.5rem;
    font-size: 12px !important;
  }
`;

const CardContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 20px 0;
  @media (max-width: 800px) {
    flex-wrap: wrap;
    /* justify-content: space-between; */
  }
`;

const Card = styled.div`
  position: relative;
  display: flex;
  width: 40%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) =>
    props.type === "confirm"
      ? "#ff073a"
      : props.type === "active"
      ? "#007bff"
      : props.type === "recover"
      ? "#28a745"
      : "#6c757d"};

  h6 {
    font-weight: 600;
    overflow-wrap: break-word;
    text-align: center;
    width: 100%;
    font-size: 12px;
    padding: 4px 0;
  }

  h1 {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    padding: 4px 0;
  }

  svg {
    margin-top: 20px;
  }

  &.active {
    background: ${(props) =>
      props.type === "confirm"
        ? "rgba(255, 7, 58, 0.125)"
        : props.type === "active"
        ? "rgba(0, 123, 255, 0.125)"
        : props.type === "recover"
        ? "rgba(40, 167, 69, 0.125)"
        : "rgba(108, 117, 125, 0.125)"};
    transition: 0.15s ease-in-out;
  }
  &:hover {
    background: ${(props) =>
      props.type === "confirm"
        ? "rgba(255, 7, 58, 0.125)"
        : props.type === "active"
        ? "rgba(0, 123, 255, 0.125)"
        : props.type === "recover"
        ? "rgba(40, 167, 69, 0.125)"
        : "rgba(108, 117, 125, 0.125)"};
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;
