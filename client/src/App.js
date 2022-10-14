import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Contact from "./components/Contact";
import Filter from "./components/Filter";
import React, { useState } from "react";
import { useEffect } from "react";

export default function App() {
  const [city, setCity] = new useState("Košice");
  const [forecast, setForecast] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {

    async function fetchData() {

      //get json data - počasie pre 1 deň
      await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=5ffb5bf4ce6360ba8081af78f245a958`)
        .then((response) => response.json())
        .then((actualData) => {setData(actualData); setIsLoading(true)})
        .catch((err) => {
          console.log(err.message);
      });

      //get json data - predpoveď počasia pre 5 dní
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=5ffb5bf4ce6360ba8081af78f245a958`)
        .then((response) => response.json())
        .then((actualData) => {setForecast(actualData);console.log(actualData.list[0]); setIsLoading(false);})
        .catch((err) => {
          console.log(err.message);
      });
    }

    fetchData();
  }, [city])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Header city={city} data={data} isLoading={isLoading} forecast={forecast} />} />
        <Route path="/filter" element={<Filter setCity={setCity} data={data} />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}