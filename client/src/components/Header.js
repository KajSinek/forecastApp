import { Link } from "react-router-dom";
import {
  AppBar
} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
        faLocationDot, faDroplet, faGauge, 
        faWind, faHourglass, faSun, faCloud, 
        faSnowflake, faCloudRain, faCloudBolt, 
        faTornado, faSmog, faArrowUp, faArrowDown 
      } from '@fortawesome/free-solid-svg-icons'
import sunsetImage from '../styles/img/sunset.png';
import sunriseImage from '../styles/img/sunrise.png';

export default function Header(props) {

  let sunrise, sunset, daytime, time;
  let forecastArr = [];

  //funkcia pre určenie ikonky na počasie
  function switchParams(param) {
    switch(param) {
      case 'Clear': return <FontAwesomeIcon icon={faSun} />;
      case 'Clouds': return <FontAwesomeIcon icon={faCloud} />;
      case 'Snow': return <FontAwesomeIcon icon={faSnowflake} />;
      case 'Rain': return <FontAwesomeIcon icon={faCloudRain} />;
      case 'Thunderstorm': return <FontAwesomeIcon icon={faCloudBolt} />;
      case 'Drizzle': return <FontAwesomeIcon icon={faSmog} />;
      case 'Mist': return <FontAwesomeIcon icon={faSmog} />;
      case 'Smoke': return <FontAwesomeIcon icon={faSmog} />;
      case 'Haze': return <FontAwesomeIcon icon={faSmog} />;
      case 'Dust': return <FontAwesomeIcon icon={faSmog} />;
      case 'Fog': return <FontAwesomeIcon icon={faSmog} />;
      case 'Sand': return <FontAwesomeIcon icon={faSmog} />;
      case 'Ash': return <FontAwesomeIcon icon={faSmog} />;
      case 'Squall': return <FontAwesomeIcon icon={faSmog} />;
      case 'Tornado': return <FontAwesomeIcon icon={faTornado} />;
      default: return null;
    }
  }

  if(!props.isLoading) {
    let startindex, lastindex, maxTemp, minTemp;
    let tempWeatherArr = [];
    let tempTempArr = []; 

    //výpočet východu a západu slnka + nastavenie to ako čas
    sunrise = new Date(props.data.sys.sunrise * 1000);
    sunset = new Date(props.data.sys.sunset * 1000);

    //z východu a západu slnka vypočítanie dĺžky dňa
    daytime = ((props.data.sys.sunset * 1000) - (props.data.sys.sunrise * 1000)) / 3600000
    let minutes = daytime.toFixed(2).slice(3, 5) * 60 / 100;
    daytime = daytime.toFixed(2).slice(0, 2).concat("h ").concat(parseInt(minutes, 10)).concat("m");

    //nastavenie času podľa určeného formátu
    let options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric' };
    time = new Date(props.data.dt * 1000).toLocaleString("en-US", options);

    //pre predpoveď počasia získanie ohľaničenia dní a to - zajtra, posledný deň - pretože json, ktorý je získaný je predpoveď na 5 dní
    const today = new Date();
    let tomorrow = new Date() , lastday = new Date()
    tomorrow.setDate(today.getDate() + 1)
    tomorrow = tomorrow.toISOString().slice(0, 10);
    lastday.setDate(today.getDate() + 3);
    lastday = lastday.toISOString().slice(0, 10);

    function forecastFunc(maxTemp, minTemp, tempArr, i) { //funkcia pre získanie max, min temploty a času pre predpoveď počasia
      //po poslednom meraní z poľa s hodnotami teplôt - získanie maxima a minima
      maxTemp = Math.max(...tempArr);
      minTemp = Math.min(...tempArr);

      //nastavenie času na formát, ktorý bol vopred určený
      let options = { weekday: 'short', day: 'numeric' };
      let date = new Date(props.forecast.list[i].dt_txt).toLocaleString("en-US", options);
      forecastArr.push({minTemp: minTemp, maxTemp: maxTemp, clouds: tempWeatherArr[0], dateForecast: date});
    }


    //získanie indexu v json data úplne prvého merania, ktoré je potrebné
    for(let i = 0 ; i < props.forecast.list.length ; i++) {
      if(props.forecast.list[i].dt_txt.slice(0, 10) === tomorrow) {startindex = i; break;}
    }

    //získanie indexu v json data úplne posledného merania, ktoré je potrebné
    for(let i = 0 ; i < props.forecast.list.length ; i++) {
      if(props.forecast.list[i].dt_txt.slice(0, 10) === lastday) {lastindex = i;}
    }

    for(let i = startindex ; i <= lastindex ; i++) {
      if(i < lastindex - 15) {

        //získanie počasia o 12:00
        if(props.forecast.list[i].dt_txt.slice(11, 19) === "12:00:00") {
          tempWeatherArr.push(props.forecast.list[i].weather[0].main);
        }

        //vytvorenie dočasného poľa s hodnotami teplôt
        tempTempArr.push(props.forecast.list[i].main.temp);

        if(props.forecast.list[i].dt_txt.slice(11, 19) === "21:00:00") {
          forecastFunc(maxTemp, minTemp, tempTempArr, i);

          tempTempArr = [];
          tempWeatherArr = [];

          //forecastData(tempTempArr, tempWeatherArr, maxTemp, minTemp, i);
        }
        continue;
      }

      if(i < lastindex - 7) {
        if(props.forecast.list[i].dt_txt.slice(11, 19) === "12:00:00") {
          tempWeatherArr.push(props.forecast.list[i].weather[0].main);
        }

        tempTempArr.push(props.forecast.list[i].main.temp);

        if(props.forecast.list[i].dt_txt.slice(11, 19) === "21:00:00") {

          forecastFunc(maxTemp, minTemp, tempTempArr, i);

          tempTempArr = [];
          tempWeatherArr = [];
        }
        continue;
      }

      if(i <= lastindex) {
        if(props.forecast.list[i].dt_txt.slice(11, 19) === "12:00:00") {
          tempWeatherArr.push(props.forecast.list[i].weather[0].main);
        }

        tempTempArr.push(props.forecast.list[i].main.temp);

        if(props.forecast.list[i].dt_txt.slice(11, 19) === "21:00:00") {

          forecastFunc(maxTemp, minTemp, tempTempArr, i);

          tempTempArr = [];
          tempWeatherArr = [];
        }
        continue;
      }
    }

    //props.data.weather[0].main = "Tornado";
  }

  return (
    <>
    <AppBar position="static">
      {!props.isLoading ?
        <>
          <div id="weatherNav">
            <div>{time}</div>
            <div><Link className="nav-link" to={`/filter`}>
                  {props.city}, Slovakia <FontAwesomeIcon icon={faLocationDot} />
                </Link></div>  
          </div>
          <div>
            <div id="weatherInfo">
              <div id="weatherDesc">
                <div></div>
                <div>
                  {
                    switchParams(props.data.weather[0].main)
                  }
                </div>
                <div>{props.data.weather[0].main}</div>
                <div></div>
              </div>
              <div id="actTemp"><p>{Math.ceil(props.data.main.temp)} <sup>°C</sup></p></div>
              <div id="minMaxTemp">
                <div></div>
                <div>{Math.ceil(props.data.main.temp_min)} °C <FontAwesomeIcon icon={faArrowUp} /></div>
                <div>{Math.ceil(props.data.main.temp_max)} °C <FontAwesomeIcon icon={faArrowDown} /></div>
                <div></div>
              </div>
              <div className="weatherTypeUni">
                <div><FontAwesomeIcon icon={faDroplet} /></div>
                <div>{props.data.main.humidity}%</div>
                <div>Humidity</div>
              </div>
              <div className="weatherTypeUni">
                <div><FontAwesomeIcon icon={faGauge} /></div>
                <div>{props.data.main.pressure} mBar</div>
                <div>Pressure</div>
              </div>
              <div className="weatherTypeUni">
                <div><FontAwesomeIcon icon={faWind} /></div>
                <div>{(props.data.wind.speed * 3.6).toFixed(2)} km/h</div>
                <div>Wind</div>
              </div>
              <div className="weatherTypeUni">
                <div><img src={sunriseImage} alt="Sunrise icon" /></div>
                <div>{sunrise.toLocaleString("en-GB",{hour12: true}).slice(12, 16)} AM</div>
                <div>Sunrise</div>
              </div>
              <div className="weatherTypeUni">
                <div><img src={sunsetImage} alt="Sunset icon" /></div>
                <div>{sunset.toLocaleString("en-GB",{hour12: true}).slice(12, 16)} PM</div>
                <div>Sunset</div>
              </div>
              <div className="weatherTypeUni">
                <div><FontAwesomeIcon icon={faHourglass} /></div>
                <div>{daytime}</div>
                <div>Daytime</div>
              </div>
            </div>
          </div>

          <section id="forecast">
            {forecastArr.map((item, index) => (
              <div key={index}>
                <div>
                  {
                  switchParams(item.clouds)
                  }
                </div>
                <div>{item.dateForecast}</div>
                <div>{Math.ceil(item.maxTemp)} °C <FontAwesomeIcon icon={faArrowUp} /> {Math.ceil(item.minTemp)} °C <FontAwesomeIcon icon={faArrowDown} /></div>
              </div>
            ))}
          </section>
        </>
      : null }
    </AppBar>

    </>

  );
      }