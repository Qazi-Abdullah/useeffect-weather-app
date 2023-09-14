import axios from 'axios';
import { useState,useRef, useEffect } from 'react';
import WeatherCard from '../weatherWidget/weatherWidget';




const Home =  (e) => {
    // e.preventdefault();
//     not recommended
//    const [cityName, setCityName] = useState("")
const [weatherData, setweatherData] = useState ([]);
  
const cityNameRef = useRef(null);
const[currentLocationWeather, setCurrentLocationWeather] = useState(null)
const[isLoading, setIsLoading] = useState(false);

useEffect(() => {
    setIsLoading(true)

    const controller = new AbortController();


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async(location)=>{
        console.log("location:", location);    
     
    try{
    let API_KEY = '03b4bab7aafa03272197e29200c2b488'

     const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coards.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}&units=metric`,
        {
            signal: controller.signal,
          }
     )
            console.log(response.data);

            setCurrentLocationWeather(response.data);
            setIsLoading(true);
        }catch(error) {
            console.log(error.data);
            setIsLoading(false);

        }
    })
     }else{
        console.log("Geo location is not supported by this browser")
     }
     return () => {
        // cleanup function
        controller.abort();
      };
}, [] )

  const submitHandler = async (e) => {
    e.preventDefault();


    console.log("cityName:" , cityNameRef.current.value) 
    
    
    let API_KEY = '03b4bab7aafa03272197e29200c2b488'

    try{
        setIsLoading(true);

     const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityNameRef.current.value}&appid=${API_KEY}&units=metric`
        )
            console.log(response.data);

            setweatherData([response.data, ...weatherData] );
            setIsLoading(false);

        }catch(error) {
            console.log(error?.data);
            setIsLoading(false);
        
        }


}

    

  

    return <div>
    <form  className='form' onSubmit={submitHandler}>
        <div className='main' >
        <label className='label' htmlFor="cityNameInput">CityName</label>
        <br />
        <input
        className='input'
         type="text"
          id="cityNameInput"
           required 
           minLength={2} 
           maxLength={20}
        //    onChange={ (e) => setCityName(e.target.value)}
           ref = {cityNameRef}
            /></div>
        <br />
        <button className='btn' type="submit"> Get Weather</button>
    </form>

    <hr />


    {isLoading ? <div>Loading...</div> :null }

    {weatherData.length || currentLocationWeather || isLoading ?   null : <div>No Data</div> }


    { weatherData.map((eachWeatherData, index) => {
    return<WeatherCard key={index} weatherData={eachWeatherData}/>;
    })  }

{currentLocationWeather ? <WeatherCard weatherData={currentLocationWeather} /> : null}


    </div>
   
}

export default Home;