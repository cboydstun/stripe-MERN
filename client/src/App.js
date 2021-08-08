import React,{useState} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import env from "react-dotenv";

function App() {

  const [product, setProduct] = useState({
    name:"react from FB",
    price:"10",
    productby:"FB"
  })

  const makePayment = token =>{
    const body = {
      token,
      product
    }    

    const header = {
      "Content-Type" : "application/json"
    }

    return fetch(`http://localhost:5000/payment`,{
      method:"POST",
      headers: header,
      body: JSON.stringify(body)
    }).then(response => {
      console.log(response)
    })
    .catch(err => console.log(err))
  }



  return (
    <div className="App">
      <header className="App-header">
        <StripeCheckout stripeKey={env.STRIPE_PUBLISHABLE_KEY} token={makePayment} name="Buy react"/>        
      </header>
    </div>
  );
}

export default App;