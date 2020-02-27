import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import StripeCheckout from "react-stripe-checkout";

function App() {
  const [product, setProduct] = useState({
    name: "React by FACEBOOK",
    price: 10,
    productBy: "Facebook"
  })
  const makePayment = (token) => {
    const body = {
      token,
      product
    }
    const headers = {
      "Content-Type": "application/json"
    }
    return fetch(`http://localhost:8321/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }).then(response => {
      console.log("RESPONSE ", response)
      const { status } = response
      console.log(status)
    }).catch(err => console.log(err))
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_PUBLISHABLE_KEY}
          token={makePayment}
          name="By React"
          amount={product.price * 100}
        >
          <button className="btn-large blue">Buy React just in {product.price} $</button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
