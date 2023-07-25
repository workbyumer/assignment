const orignalData = (accumalated) => {
  let k = Object.keys(accumalated);
  let n = k.length;
  let realData = { [k[0]]: accumalated[k[0]] };
  for (let i = 0; i < n - 1; i++) {
    realData[k[i + 1]] = Math.abs(accumalated[k[i + 1]] - accumalated[k[i]]);
  }
  return realData;
};
export function groupDataByMonth(data) {
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
}

export function getOrigFromAcc(data) {
  let dataOriginal = { ...data };
  const cases = orignalData(data.cases);
  const deaths = orignalData(data.deaths);
  const recovered = orignalData(data.recovered);
  dataOriginal.cases = cases;
  dataOriginal.deaths = deaths;
  dataOriginal.recovered = recovered;
  return dataOriginal;
}

export function top10Extracter(countries) {
  const data = countries.slice(0, 10).map((m) => {
    return {
      country: m.country,
      lat: m.countryInfo.lat,
      lng: m.countryInfo.long,
      cases: m.cases,
      deaths: m.deaths,
      recovered: m.recovered,
    };
  });
  return data;
}
