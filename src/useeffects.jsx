useEffect(() => {
  const fetchData = () => {
    axios
      .get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
      .then((response) => {
        const data = response.data.timeline;

        const cases = data.cases;

        let k = Object.keys(cases);
        let n = k.length;
        let newCase = { [k[0]]: cases[k[0]] };
        for (let i = 0; i < n - 1; i++) {
          newCase[k[i + 1]] = cases[k[i + 1]] - cases[k[i]];
        }

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
        let newRecovered = { [kr[0]]: recovered[kr[0]] };
        for (let i = 0; i < nr - 1; i++) {
          newRecovered[k[i + 1]] = recovered[k[i + 1]] - recovered[k[i]];
        }
        console.log(newRecovered);
        data.recovered = newRecovered;

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
