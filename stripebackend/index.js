const express = require("express")
const cors = require("cors")
const stripe = require("stripe")(process.env.SECRET_KEY)
const uuid = require("uuid/v4")

const app = express()

// Listening port
const port = process.env.PORT || 8321

// middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello from server")
})


app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT ", product)
    console.log("PRICE ", product.price)
    const idempotencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempotencyKey })
    }).then(result => res.status(200).json(result))
        .catch(err => console.log(err))
})

app.listen(port, () => console.log(`app running on http://localhost:${port}`))