import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";
import TableData from "./components/table";
import LineChartCases from "./components/lineChartCases";
import Navbar from "./components/navbar";
import Maps from "./components/map";
import Loaders from "./components/loaders";
import SearchCountry from "./components/autoComplete";
import NotFound from "./components/notFound";

const App = () => {
  const [country, setcountry] = useState("Pakistan");
  const [isLoading, setisLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [location, setlocation] = useState({});
  const [allCountries, setallCountires] = useState([]);
  const [countryData, setcountryData] = useState({});

  const navigation = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
        )
        .then((response) => {
          const data = response.data.timeline;
          const cases = orignalData(data.cases);
          const deaths = orignalData(data.deaths);
          const recovered = orignalData(data.recovered);
          data.cases = cases;
          data.deaths = deaths;
          data.recovered = recovered;

          const monthlyData = groupDataByMonth(data);
          setMonthlyData(monthlyData);
          navigation("/map");
        })
        .catch((error) => {
          navigation("/error");
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
          navigation("/error");
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

          data.sort((a, b) => b.cases - a.cases);

          const top10Countries = data.slice(0, 10);

          setallCountires(top10Countries);
        })
        .catch((error) => {
          navigation("/error");
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
  const orignalData = (accumalated) => {
    let k = Object.keys(accumalated);
    let n = k.length;
    let realData = { [k[0]]: accumalated[k[0]] };
    for (let i = 0; i < n - 1; i++) {
      realData[k[i + 1]] = Math.abs(accumalated[k[i + 1]] - accumalated[k[i]]);
    }
    return realData;
  };
  return (
    <Box>
      {isLoading === true ? (
        <Loaders check={isLoading} />
      ) : (
        <Box marginTop={8} display={isLoading === true ? "none" : "block"}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={10}
          >
            <SearchCountry getCountry={setcountry} country={country} />
          </Box>
          <Routes>
            <Route
              path="/table"
              element={
                <TableData
                  data={monthlyData}
                  country={country}
                  status={isLoading}
                />
              }
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
                  dataTable={monthlyData}
                  countryTable={country}
                  countryInfo={countryData}
                  top10Countries={allCountries}
                  apiKey="AIzaSyB3I-b43fURLg1l-XX4XtQVvqAdAmCMcMM"
                />
              }
            />
            <Route path="/error" element={<NotFound />} />
          </Routes>
        </Box>
      )}
      <Box marginTop={1}>
        <Navbar />
      </Box>
    </Box>
  );
};

export default App;
