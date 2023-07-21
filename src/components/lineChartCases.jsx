import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LineChart from "react-apexcharts";

const LineChartCases = ({ data, country }) => {
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const LineDataCases = data?.map((m) => m.cases);
  const BarDataDeaths = data?.map((m) => m.deaths);
  const PieDataRecovered = data?.map((m) => m.recovered);
  const chartDataCountry = data?.map((m) => m.month);

  const lineOptions = {
    xaxis: {
      categories: chartDataCountry,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: "90%",
            animations: {
              enabled: false,
            },
          },
        },
      },
    ],
    markers: {
      size: 1,
    },
  };
  const barOptions = {
    xaxis: {
      categories: chartDataCountry,
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: "90%",
          },
        },
      },
    ],
  };

  const lineSeries = [
    {
      name: "Cases",
      data: LineDataCases,
    },
  ];

  const barSeries = [
    {
      name: "Deaths",
      data: BarDataDeaths,
    },
  ];

  const pieOptions = {
    labels: chartDataCountry, // Setting country names as labels
    dataLabels: {
      enabled: true, // Display data labels on the pie slices
    },

    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            width: "90%",
            animations: {
              enabled: false,
            },
          },
        },
      },
    ],
  };

  const pieSeries = PieDataRecovered;

  return (
    <Box sx={{ width: "100%" }}>
      <h1>{country}</h1>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Cases" />
          <Tab label="Deaths" />
          <Tab label="Recovered" />
        </Tabs>
      </Box>
      {value === 0 && (
        <CustomTabPanel>
          <LineChart
            options={lineOptions}
            series={lineSeries}
            type="line"
            width="1000"
            height="300"
            data-datalazyloaded="false"
          />
        </CustomTabPanel>
      )}
      {value === 1 && (
        <CustomTabPanel>
          <LineChart
            options={barOptions}
            series={barSeries}
            type="bar"
            width="1000"
            height="300"
            data-datalazyloaded="false"
          />
        </CustomTabPanel>
      )}
      {value === 2 && (
        <CustomTabPanel>
          <LineChart
            options={pieOptions}
            series={pieSeries}
            type="pie"
            width="1000"
            height="300"
            data-datalazyloaded="false"
          />
        </CustomTabPanel>
      )}
    </Box>
  );
};
LineChartCases.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  country: PropTypes.string.isRequired,
};
export default LineChartCases;
