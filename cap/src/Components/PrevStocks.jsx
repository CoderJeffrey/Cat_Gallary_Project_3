import React from 'react';

const PrevStocks = ({prevStocks}) => {
    return (
        <div>
            <p>Searched Stocks</p>
            <div className='prevStock_container'>
                {
                    prevStocks && prevStocks.length > 0 ? (
                        prevStocks.map((stock, index) => (
                            <li key={index}>
                                <p> Ticker: {stock.ticker} </p>
                                <p> Exchange: {stock.exchange} </p>
                                <p> Name: {stock.name} </p>
                                <p> Phone: {stock.phone} </p>
                                <p> Weburl: {stock.weburl} </p>
                                <p> Logo: {stock.logo} </p>
                                <p> Country: {stock.country} </p>
                            </li>
                        )) 
                    ) : (
                            <div>
                                <h3>You haven't searched for a stock yet!</h3>
                            </div>
                        )
                }
            </div>
        </div>
    );
}

export default PrevStocks;