import {Router} from "express";
import e from "../../dbschema/edgeql-js";
import {client, getDBError} from "../index";

const router = Router()

router.post('/:user',async (req,res,next)=>{
    try {

        const naam = req.body.naam
        const hoeveelheid = req.body.hoeveelheid
        const eenheid = req.body.eenheid
        // zoek eerst of het artikel al bestaat

        const result = await e.select(e.Artikel,()=>({
            naam:e.str(naam)
        })).run(client)
        if(!result){
            throw new Error('unable to query')
        } else if(result.length === 0){
            // indien NEE => insert het Artikel en het ArtikelItem in één beweging

        } else{
            // indien JA => gebruik het bij de insert van ArtikelItem

        }
        res.status(201).send(result)
    } catch (err){
        const [code,error] = getDBError(err)
        res.status(code).json({
            error: error
        })
    }
})
export default router