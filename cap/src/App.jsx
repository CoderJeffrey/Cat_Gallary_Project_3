import { useState } from 'react'
import './App.css' 

import APIForm from './Components/APIform';
import PrevStocks from './Components/PrevStocks';


function App() {
  const [count, setCount] = useState(0);
  const [quota, setQuota] = useState(null);
  const [currentStock, setCurrentStock] = useState({
    "ticker": "",
    "exchange": "",
    "name": "",
    "phone": "",
    "weburl":  "",
    "logo": "",
    "country": "",
  });

  const [prevStocks, setPrevStocks] = useState([]);
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY; // hidden file starts with . and this is the only way to import it
  
  const [inputs, setInputs] = useState({
    stock: "",
  });

  // useEffect(() => {
  //   console.log(prevStocks);
  // }, [prevStocks]);

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();

    // we can check if we didn't receive a url back from our API call (meaning a proper screenshot couldn't be taken) and then make our own message! If we do get a url back, we can make it our currentImage.
    if (json.ticker == null){
      alert("Oops! Something went wrong with that query, let's try again!")
    } else {
      setCurrentStock({
        "ticker": json.ticker,
        "exchange": json.exchange,
        "name": json.name,
        "phone": json.phone,
        "weburl":  json.weburl,
        "logo":  json.logo,
        "country": json.country,
      });

      setPrevStocks((prevStocks) => {
        const filtered = prevStocks.filter((stock) => {
          return stock.ticker !== json.ticker;
        });

        const updatedStocks = [...filtered, {
          "ticker": json.ticker,
          "exchange": json.exchange,
          "name": json.name,
          "phone": json.phone,
          "weburl":  json.weburl,
          "logo":  json.logo,
          "country": json.country,
        }];
       
        return updatedStocks;
      });

      // print the prevStocks array and print out its phone, weburl and logo
      reset();
    }
  }


  const getQuota = async () => {
    const response = await fetch("https://finnhub.io/api/v1/quote?symbol=AAPL&token=" + ACCESS_KEY);
    const result = await response.json();
    await console.log(result);
    await setQuota(result);
  }

  const reset = () => {
    setInputs({
      stock: "",
    }); 
  }

  const makeQuery = () => {
    let stock_symbol = inputs.stock;
    let query = `https://finnhub.io/api/v1/stock/profile2?symbol=${stock_symbol}&token=${ACCESS_KEY}`;
    callAPI(query).catch(console.error);
  }


  const submitForm = () => {
    let defaultValues = {
      stock: "AAPL",
    };

    // make sure there is a url
    if (inputs.stock == "" || inputs.stock == " ") {
      alert("You forgot to submit an stock SYMBOL!");
    } else{ 
        // for (const [key, value] of Object.entries(inputs)) { // Object.entries(inputs) Google!
        //   if (value == ""){
        //     inputs[key] = defaultValues[key]
        //   }
        // }
        makeQuery();
    }
  }


  
  return (
    <div className="whole-page">
      <h1>Get the info of your fav stock!</h1>

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
        
      {currentStock ? (
        <div className='container'>
          <h3> Current Stock: </h3>
          <p> Ticker: {currentStock.ticker} </p>
          <p> Exchange: {currentStock.exchange} </p>
          <p> Name: {currentStock.name} </p>
          <p> Phone: {currentStock.phone} </p>
          <p> Weburl: {currentStock.weburl} </p>
          <p> Logo: {currentStock.logo} </p>
          <p> Country: {currentStock.country} </p>
        </div>
      ) : (
        <div> </div>
      )}

      <br></br>

      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://finnhub.io/api/v1/stock/profile2?
          <br></br>
          &stock={inputs.stock}
          <br></br>
          &access_key={ACCESS_KEY}  
          <br></br>
        </p>
      </div>
      <br></br>

      <div className="container">
         <PrevStocks prevStocks={prevStocks}/>
      </div>

    </div>
  )
}

export default App
