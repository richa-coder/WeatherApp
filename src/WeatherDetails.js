import React, { useState , useEffect} from "react";
import axios from 'axios'
const WEATHER__KEY ='205815ace8b4a6a3c0e9a8877dec7f14'

export default  function WeatherDetails(props){
    console.log('props.locationParams.lat' +props.locationParams.lat)
    const [weatherdata, setWeather] = useState({temperature:'',humidity:'',description:''}); //Initializing an object hook
    useEffect(() => {
            if(props.locationParams.long !== '' || props.locationParams.lat !== ''){
            let url ='http://api.openweathermap.org/data/2.5/weather?lat=' + props.locationParams.lat+'&lon=' + props.locationParams.long +'&exclude=hourly,daily&appid='+WEATHER__KEY
            axios.get(url)
            .then(function (response) {
            let weatherData=response.data.main;
            //State is set based on API response which will inturn trigger render methoda and update display
            setWeather({
                ...weatherData,
                temperature: weatherData.temp !=='' ? (weatherData.temp - 273.15).toPrecision(2) +'C':'',
                humidity: weatherData.humidity !=='' ?weatherData.humidity  +'%':'',
                description: response.data.weather[0].description,
           });
          })
          .catch(function (error) {
            console.log(error);
          }); 
        }
          }, [props.locationParams.long,props.locationParams.lat]);  //The api call will be made only when these props change, controlled update(similar to ComponentDidUpdate)
         
         return(
                <div id ='weather-info' className={props.locationParams.lat ===''?'display-none'  :' '}> 
                <div>Temperature: {weatherdata.temperature}</div>
                <div>Humidity: {weatherdata.humidity} </div>
                <div>Weather: {weatherdata.description}</div>
                </div>
               )    
}


