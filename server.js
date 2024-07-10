const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
var bodyParser = require('body-parser') 
const fs = require('fs')
app.use(express.json())
app.use(cors())
app.options('*',cors())
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 

app.get('/',(req,res) => {
    res.send(`welcome to home`)
})

app.get('/products',(req,res) => {
    var Products = JSON.parse(fs.readFileSync('products.json').toString())
    let allProducts = Products.map((p) => {
        return {
            id:p.id,
            title:p.title,
            price:p.price
        }
    })
    res.send(allProducts)
})

app.get('/products/:id',(req,res) => {
    var Products = JSON.parse(fs.readFileSync('products.json').toString()) 
    let singleProd = Products.filter((p) => {
       return  p.id == req.params.id
    })
    if(singleProd.length === 0){
        res.send(`the ${req.params.id} is not found`)
    }else{
        res.send(singleProd)
    }
})

app.post('/products',(req,res) => {
    var Products = JSON.parse(fs.readFileSync('products.json').toString()) 
    const {title,price} = req.body
    if(!title){
        res.send(`title field should be mandatory`)
    }
    if(!price){
        res.send(`price field should be mandatory`)
    }
    let newProd = {
        id:Products.length + 1,
        title:title,
        price:price
    }
    Products.push(newProd)
    fs.writeFile("products.json",JSON.stringify(Products,null,2),function(err){
        if(err){
            console.log(err.message)
            res.status(500).send(`error post request`)
        }else{
            console.log(`new Product added`)
            res.status(201).send(newProd)
        }
    })
})

app.put('/products/:id',(req,res) => {
    var Products = JSON.parse(fs.readFileSync('products.json').toString()) 
    const {title,price} = req.body
    let index = Products.findIndex((p) => {
        return p.id == req.params.id
    })
    let Product = Products[index]
    if(title){
       Product.title = title
    }
    if(price){
        Product.price = price
     }
     fs.writeFile("products.json",JSON.stringify(Products,null,2),function(err){
        if(err){
            console.log(err.message)
            res.status(500).send(`error put request`)
        }else{
            console.log(` Product updated`)
            res.status(200).send(Product)
        }
    })
})

app.delete('/products/:id',(req,res) => {
    var Products = JSON.parse(fs.readFileSync('products.json').toString()) 
    const {title,price} = req.body
    let index = Products.findIndex((p) => {
        return p.id == req.params.id
    })
    Products.splice(index,1)
    fs.writeFile("products.json",JSON.stringify(Products,null,2),function(err){
        if(err){
            console.log(err.message)
            res.status(500).send(`error delete request`)
        }else{
            console.log(` Product updated`)
            res.status(200).send(Products)
        }
    })
})
const port = 3500

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})