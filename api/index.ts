'use strict'
import bodyParser from "body-parser";
import http from 'http'
import * as edgedb from "edgedb"
import express from 'express'

import boodschappenLijst from './routes/artikels'

export const index = express()
export const client:edgedb.Client = edgedb.createClient();

export const getDBError = function (err:unknown):[number,string]{
    console.log(err)
    const error = ((err as Error).message).split('\n')[0]
    if(error === 'network error: AggregateError') return [500,error]
    return [400,error]
}

index.use(bodyParser.urlencoded({extended: false}))
index.use(bodyParser.json())

index.use(((req:any, res:any, next:any) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, DELETE, POST, GET')
        return res.status(200).json({})
    }
    next()
}))

// setting up middlewares



index.get("/", (req, res) => res.send("Express on Vercel"));

index.use('/boodschappen-lijst', boodschappenLijst)


// handle all non-defined requests
index.use((req:any, res:any, next:any)=>{
    const err = new Error('not found')
    next(err)
})

index.use((req:any, res:any, next:any) =>{
    return next
})
const port = Number(process.env.PORT || 6000)
http.createServer(index).listen(port,()=>{
    console.log('server listening on port 6000')
})
