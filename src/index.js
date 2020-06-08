const express = require ("express");
const port = 3333;

const routes = require ('./routes')


const instance = express();
instance.use(express.json());
instance.use(routes);

instance.listen(port, ()=>{
    console.log(`API Started on PORT: ${port}`)
});