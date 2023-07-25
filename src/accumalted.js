// let cases = {
//   a: 0,
//   b: 1,
//   c: 3,
//   d: 3,
//   e: 4,
// };

// let k = Object.keys(cases);
// console.log(k);
// let n = k.length;
// console.log(n);
// let newCase = { [k[0]]: 0 };
// for (let i = 0; i < n - 1; i++) {
//   newCase[k[i + 1]] = cases[k[i + 1]] - cases[k[i]];
// }
// console.log(newCase);

const fetchData = () => {
  axios
    .get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
    .then((response) => {
      const data = response.data.timeline;
      const dataKey = Object.keys(data);
    

      const cases = data.cases
      const deaths = data.deaths
      const recovered = data.recovered
      const cases = data.cases;
      const orignalData = (accumalated) => {
        let k = Object.keys(accumalated);
        let n = k.length;
        let realData = { [k[0]]: accumalated[k[0]] };
        for (let i = 0; i < n - 1; i++) {
          realData[k[i + 1]] = accumalated[k[i + 1]] - accumalated[k[i]];
        }
        return realdata;
      };

      data.cases = newCase;

      const deaths = data.deaths;

      let kd = Object.keys(deaths);
      let nd = kd.length;
      let newDeaths = { [kd[0]]: 0 };
      for (let i = 0; i < nd - 1; i++) {
        newDeaths[k[i + 1]] = deaths[k[i + 1]] - deaths[k[i]];
      }

      data.deaths = newDeaths;

      const recovered = data.recovered;
      console.log(recovered);
      let kr = Object.keys(recovered);
      let nr = kr.length;
      let newRecovered = { [kr[0]]: 0 };
      for (let i = 0; i < nr - 1; i++) {
        newRecovered[k[i + 1]] = recovered[k[i + 1]] - recovered[k[i]];
      }
      console.log(newRecovered);
      data.recovered = newRecovered;
      ..................

      
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

      const monthlyData = groupDataByMonth(data);
      // setMonthlyData(monthlyData);
      //   console.log(monthlyData);
      navigation("/map");
    })
    .catch((error) => {
      navigation("/error");
    });
};
fetchData();
