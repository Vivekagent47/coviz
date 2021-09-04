import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DataContext } from "../common/DataContext";

function Overall() {
  const { getData, countryData } = React.useContext(DataContext);
  const [activeCard, setActiveCard] = useState("confirm");

  const setActive = (val) => {
    setActiveCard(val);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      <Top>
        <h1>{countryData ? countryData.country : ""}</h1>
      </Top>
      <CardContainer>
        <Card
          className={activeCard === "confirm" ? "active" : ""}
          onClick={() => setActive("confirm")}
          type="confirm"
        >
          <h6>Confirmed</h6>
          <h1>{countryData ? countryData.cases.toLocaleString("en-IN") : 0}</h1>
        </Card>
        <Card
          className={activeCard === "active" ? "active" : ""}
          onClick={() => setActive("active")}
          type="active"
        >
          <h6>Active</h6>
          <h1>
            {countryData ? countryData.active.toLocaleString("en-IN") : 0}
          </h1>
        </Card>
        <Card
          className={activeCard === "recover" ? "active" : ""}
          onClick={() => setActive("recover")}
          type="recover"
        >
          <h6>Recovered</h6>
          <h1>
            {countryData ? countryData.recovered.toLocaleString("en-IN") : 0}
          </h1>
        </Card>
        <Card
          className={activeCard === "death" ? "active" : ""}
          onClick={() => setActive("death")}
          type="death"
        >
          <h6>Deaths</h6>
          <h1>
            {countryData ? countryData.deaths.toLocaleString("en-IN") : 0}
          </h1>
        </Card>
      </CardContainer>
    </Container>
  );
}

export default Overall;

const Container = styled.div`
  display: block;
  padding: 100px;
  width: 50%;
`;

const Top = styled.div`
  h1 {
    width: max-content;
    padding: 4px 8px;
    background: rgba(226, 48, 40, 0.06274509803921569);
    font-size: 24px !important;
    font-weight: 900;
    color: #e23028;
    border-radius: 4px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin: 20px 0;
`;

const Card = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border-radius: 8px;
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
`;
