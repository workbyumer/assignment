import { Box } from "@mui/material";
import TableData from "./components/table";
import axios from "axios";
import { useEffect, useState } from "react";
import LineChartCases from "./components/lineChartCases";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Maps from "./components/map";
import Loaders from "./loaders";
import SearchCountry from "./autoComplete";

const App = () => {
  const [country, setcountry] = useState("Pakistan");
  const [isLoading, setisLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [location, setlocation] = useState({});
  const [allCountries, setallCountires] = useState([]);
  const [countryData, setcountryData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
        )
        .then((response) => {
          const data = response.data.timeline;
          const monthlyData = groupDataByMonth(data);
          setMonthlyData(monthlyData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchLocation = () => {
      axios
        .get(`https://disease.sh/v3/covid-19/countries/${country}`)
        .then((response) => {
          const dataLocation = response.data.countryInfo;
          const dataCountry = response.data;

          const { lat, long } = dataLocation;
          setcountryData({
            country: dataCountry.country,
            cases: dataCountry.cases,
            deaths: dataCountry.deaths,
            recovered: dataCountry.recovered,
          });
          setlocation({ lat, lng: long });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    const fetchallCountries = () => {
      axios
        .get(`https://disease.sh/v3/covid-19/countries?yesterday=yesterday`)
        .then((response) => {
          const data = response.data.map((m) => {
            return {
              country: m.country,
              lat: m.countryInfo.lat,
              lng: m.countryInfo.long,
              cases: m.cases,
              deaths: m.deaths,
              recovered: m.recovered,
            };
          });
          // Sort the countries based on cases in descending order
          data.sort((a, b) => b.cases - a.cases);

          // Get the first 10 countries with the highest cases
          const top10Countries = data.slice(0, 10);

          setallCountires(top10Countries);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchData();
    fetchLocation();
    fetchallCountries();
  }, [country]);

  const groupDataByMonth = (data) => {
    const dates = Object.keys(data.cases);
    const monthlyData = {};

    dates.forEach((date) => {
      const [month, day, year] = date.split("/");
      const key = `${year}-${month.padStart(2, "0")}`;
      if (!monthlyData[key]) {
        monthlyData[key] = {
          cases: 0,
          deaths: 0,
          recovered: 0,
        };
      }

      monthlyData[key].cases += data.cases[date];
      monthlyData[key].deaths += data.deaths[date];
      monthlyData[key].recovered += data.recovered[date];
    });

    const monthlyDataArray = Object.entries(monthlyData).map(
      ([month, value]) => ({
        month,
        ...value,
      })
    );

    return monthlyDataArray;
  };

  return (
    <Box>
      {isLoading === true ? (
        <Loaders check={isLoading} />
      ) : (
        <Box marginTop={8} display={isLoading === true ? "none" : "block"}>
          <SearchCountry getCountry={setcountry} />
          <Routes>
            <Route
              path="/table"
              element={<TableData data={monthlyData} country={country} />}
            />
            <Route
              path="/charts"
              element={<LineChartCases data={monthlyData} country={country} />}
            />
            <Route
              path="/map"
              element={
                <Maps
                  data={location}
                  countryInfo={countryData}
                  top10Countries={allCountries}
                  apiKey="AIzaSyB3I-b43fURLg1l-XX4XtQVvqAdAmCMcMM"
                />
              }
            />
          </Routes>
        </Box>
      )}

      <Navbar />
    </Box>
  );
};

export default App;
