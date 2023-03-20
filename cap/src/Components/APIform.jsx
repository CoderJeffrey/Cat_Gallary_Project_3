import React from 'react';
import { useState } from 'react';



const APIForm = ({inputs, handleChange, onSubmit}) => {
    const inputsInfo = [
        "Input the ticker of the stock you want to see (e.g. AAPL for Apple)",
    ];

    return (
      <div>
        <form className="form-container">
            {inputs &&
                Object.entries(inputs).map(([category, value], index) => (
                <li className="form" key={index}>
                    <h2>{category} </h2>
                    <input
                        type="text"
                        name={category}
                        value={value}
                        placeholder="Input this attribute..."
                        onChange={handleChange}
                        className="textbox"
                    />
                    <br></br>
                    <p> {inputsInfo[index]}</p>
                </li>
            ))}
        </form>

        <button type="submit" className="button" onClick={onSubmit}>
            Search
        </button>
      </div>
    );
  };
  
  export default APIForm;