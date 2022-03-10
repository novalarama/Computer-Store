const express = require('express')
const app = express()
const port = 8000

let routes = [
    {prefix :`/customer`, route : require(`./routes/customer`)},
    {prefix :`/admin`, route : require(`./routes/admin`)},
    {prefix :`/product`, route : require(`./routes/product`)},
    {prefix :`/transaksi`, route : require(`./routes/transaksi`)}
    
]

for (let i = 0; i < routes.length; i++) {
    app.use(routes[i].prefix, routes[i].route)
    
}

app.listen(port, ()=> {
    console.log(`Server run on port ${port}`);
})