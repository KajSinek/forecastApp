import { useNavigate } from 'react-router-dom';
import {
  AppBar
} from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

export default function Filter(props) {

  const itemList = [
    "Bratislava",
    "Humenné",
    "Koromľa",
    "Košice",
    "Michalovce",
    "Sobrance"
  ];

  const navigate = useNavigate();

  const [filteredList, setFilteredList] = new useState(itemList);
  const [cityTemp, setCityTemp] = new useState({});
  const [isLoading, setIsLoading] = new useState(true);

  const filterBySearch = (event) => {
    // prístup k input hodnote
    const query = event.target.value;
    // kópia itemListu
    let updatedList = [...itemList];
    // filtrovanie inputu
    updatedList = updatedList.filter((item) => {
      return item.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    // updatnutie výsledných hodnôt
    setFilteredList(updatedList);
  };

  //funkcia, ktorá sa spustí po kliknutí a nastaví mesto na to, ktoré sa zaklikne
  function onClick(item) {
    props.setCity(item);
    navigate("/");
  }

  useLayoutEffect(() => {
    async function fetchData() {
      let tempObj = {};
      let tempArray = [];
      for(let i = 0 ; i < 6 ; i++) {
        //počasie pre 6 určených miest
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${itemList[i]}&units=metric&appid=5ffb5bf4ce6360ba8081af78f245a958`)
          .then((response) => response.json())
          .then((actualData) => {tempObj[itemList[i]] = actualData.main.temp; tempArray.push(tempObj);})
          .catch((err) => {
            console.log(err.message);
          });
      }
      setCityTemp(tempArray);
      setIsLoading(false);
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppBar className="filter" position="static">
      <div className="search-header">
        <div className="search-text">Location</div>
        <div className="right-inner-addon input-container">
            <FontAwesomeIcon icon={faLocationDot} />
            <i className="fa fa-search"></i>
            <input id="search-box" placeholder='Search city ...' onChange={filterBySearch} />
        </div>
      </div>
      <div id="item-list">
        <ol>
          {filteredList.map((item, index) => (
            <li key={index}>
              <button onClick={() => onClick(item)}>{item}</button>
              <div>{!isLoading ? " " + Math.ceil(Object.values(cityTemp[index])[index]) + " °C" : null}</div>
          </li>
          ))}
        </ol>
      </div>
    </AppBar>

  );
}
