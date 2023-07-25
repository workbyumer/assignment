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
import { getOrigFromAcc, groupDataByMonth, top10Extracter } from "./helper";
import _ from "lodash";

const App = () => {
  const [country, setcountry] = useState("Pakistan");
  const [isLoading, setisLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [location, setlocation] = useState({});
  const [allCountries, setallCountires] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
        );
        const data = getOrigFromAcc(response.data.timeline);
        const monthlyData = groupDataByMonth(data);
        setMonthlyData(monthlyData);
      } catch (error) {
        navigation("./error");
      }
    };

    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          `https://disease.sh/v3/covid-19/countries/${country}`
        );
        const locationData = _.pick(response.data, ["countryInfo"]);
        const { lat, long: lng } = locationData.countryInfo;
        setlocation({ lat, lng });
      } catch (error) {
        navigation("/error");
      }
    };

    const fetchallCountries = async () => {
      try {
        const response = await axios.get(
          "https://disease.sh/v3/covid-19/countries?sort=cases"
        );
        const data = top10Extracter(response.data);
        setallCountires(data);
      } catch (error) {
        navigation("/error");
      }
    };
    fetchData();
    fetchLocation();
    fetchallCountries();
  }, [country]);

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
