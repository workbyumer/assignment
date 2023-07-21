import React, { useEffect, useState } from "react";
import axios from "axios";

const MonthlyData = ({ country }) => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
        );
        const data = response.data.timeline;
        const monthlyData = groupDataByMonth(data);
        setMonthlyData(monthlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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
    <div>
      {console.log(monthlyData)}
      <h2>Monthly Data for {country}</h2>
      <ul>
        {monthlyData.map((monthData) => (
          <li key={monthData.month}>
            <strong>Month: {monthData.month}</strong>
            <br />
            Total Cases: {monthData.cases}
            <br />
            Total Deaths: {monthData.deaths}
            <br />
            Total Recovered: {monthData.recovered}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyData;
