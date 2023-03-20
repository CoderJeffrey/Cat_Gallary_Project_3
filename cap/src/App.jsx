import { useState } from 'react'
import './App.css' 

import APIForm from './Components/APIform';
import Gallery from './Components/gallery';


function App() {
  const [count, setCount] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const [quota, setQuota] = useState(null);

  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY; // hidden file starts with . and this is the only way to import it
  
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    width: "",
    height: "",
  });

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    // we can check if we didn't receive a url back from our API call (meaning a proper screenshot couldn't be taken) and then make our own message! If we do get a url back, we can make it our currentImage.
    if (json.url == null){
      alert("Oops! Something went wrong with that query, let's try again!")
    } else {
      setCurrentImage(json.url);
      setPrevImages((images) => ([...images, json.url]))
      reset();
      getQuota();
    }
  }

  const getQuota = async () => {
    const response = await fetch("https://api.apiflash.com/v1/urltoimage/quota?access_key=" + ACCESS_KEY);
    const result = await response.json();
    console.log(result);
    await setQuota(result);
  }

  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      width: "",
      height: "",
    });
    
  }

  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json"; // json
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;
    
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    console.log('query: ' + query)

    callAPI(query).catch(console.error);
  }


  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      width: "1920",
      height: "1080",
    };

    // make sure there is a url
    if (inputs.url == "" || inputs.url == " ") {
      alert("You forgot to submit an url!");
    } else{ 
        for (const [key, value] of Object.entries(inputs)) { // Object.entries(inputs) Google!
          if (value == ""){
            inputs[key] = defaultValues[key]
          }
        }

        makeQuery();
    }



  
  }


  
  return (
    <div className="whole-page">
      <h1>Random Cats Gallary 📸</h1>
      {quota ? (
        <p className="quota">
          Remaining API calls: {quota.remaining} out of {quota.limit}
        </p>
      ) : (
        <p></p>
      )}

      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
      />
      <br></br>
        
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div> </div>
      )}

      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key={ACCESS_KEY}    
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
      </div>

      <br></br>

      <div className="container">
        <Gallery images={prevImages} />
      </div>

    </div>
  )
}

export default App
