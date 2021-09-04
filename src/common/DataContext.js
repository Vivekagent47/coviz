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

// export const useData = () => {
//   return React.useContext(DataContext);
// };

const useProvideData = () => {
  const [countryData, setCountryData] = React.useState();
  const [historyData, setHistoryData] = React.useState();
  // const [fullPath, setPullPath] = React.useState();

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

    const confirmKeys = historyData
      ? Object.keys(historyData.timeline.cases)
      : [];
    const confirmvalues = historyData
      ? Object.values(historyData.timeline.cases)
      : [];
  };

  React.useEffect(() => {
    getPath(400);
  }, []);

  // console.log(confirmKeys, confirmvalues);
  console.log(historyData ? Object.keys(historyData.timeline.cases) : []);

  return {
    getData,
    countryData,
    getPath,
  };
};
