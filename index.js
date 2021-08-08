const cors = require("cors")
const express = require("express")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const uuid = require("uuid")
require('dotenv').config();

const app = express()

//midelware
app.use(express.json())
app.use(cors())

//router
app.get("/",(req,res)=>{
    res.send("It works")
})

app.post("/payment",(req,res) => {
    const {product , token } = req.body;
    console.log("Product",product);
    console.log("Price",product.price);

    // To avoid duplication for payments
    const idempotencyKey = uuid();

    return stripe.customers.create({
        email:token.email,
        source:token.id
    })
    .then(customer =>{
        stripe.charger.create({
            amount: product.price * 100,
            currency:'usd',
            customer:customer.id,
            receipt_email: token.email,
            description: `purchase of $(product.name)`,
            shipping: {
                name: token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        },{idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => {console.log(err)})
 })
//listen
app.listen(5000,()=> console.log("listening at port:5000"))