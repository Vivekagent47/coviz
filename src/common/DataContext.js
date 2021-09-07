import * as React from "react";
import axios from "axios";

export const DataContext = React.createContext();

export const DataProvider = (props) => {
  const data = useProvideData();
  return (
    // eslint-disable-next-line react/prop-types
    <DataContext.Provider value={data}>{props.children}</DataContext.Provider>
  );
};

const useProvideData = () => {
  const [countryData, setCountryData] = React.useState();
  const [historyData, setHistoryData] = React.useState();
  const [geoIndiaJSON, setIndiaJSON] = React.useState();

  const getData = async () => {
    await axios
      .get("https://disease.sh/v3/covid-19/countries/ind")
      .then((res) => {
        const resData = res.data;
        setCountryData(resData);
      });
  };

  const getHistoryData = async (days) => {
    try {
      await axios
        .get(`https://disease.sh/v3/covid-19/historical/ind?lastdays=${days}`)
        .then((res) => {
          const resData = res.data;
          setHistoryData(resData);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const getPath = async (days) => {
    await getHistoryData(days);
  };

  const geoIndia = async () => {
    try {
      await axios
        .get(
          "https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/india/state_ut/india_state.json"
        )
        .then((res) => {
          const resData = res.data;
          setIndiaJSON(resData);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    getData,
    countryData,
    getPath,
    historyData,
    geoIndia,
    geoIndiaJSON,
  };
};
