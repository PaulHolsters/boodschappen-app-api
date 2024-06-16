import {Router} from "express";
import e from "../../dbschema/edgeql-js";
import {client, getDBError} from "../index";

const router = Router()

router.get('/:user',async (req,res,next)=> {
    try {
        const nieuwArtikelItem = await e.select(e.ArtikelItem,()=>({
            filter_single:{user:req.params.user},
            id:true,
            user:true,
            hoeveelheid:true,
            artikel:{
                id:true,
                titel:true,
                eenheid:true
            }
        })).run(client)
        if(!nieuwArtikelItem) throw new Error('nieuw artikel item niet kunnen vinden')
        res.status(201).send(nieuwArtikelItem)
    } catch (err) {
        const [code, error] = getDBError(err)
        res.status(code).json({
            error: error
        })
    }
})
router.post('/:user',async (req,res,next)=>{
    try {
        const naam = req.body.naam
        const hoeveelheid = req.body.hoeveelheid
        const eenheid = req.body.eenheid

        // zoek eerst of het artikel al bestaat
        const result = await e.select(e.Artikel,()=>({
            filter_single:{titel:naam}
        })).run(client)
        if(!result){
            // indien NEE => insert het Artikel en het ArtikelItem in één beweging
            const artikel = await e.insert(e.Artikel,{
                titel:e.str(naam),
                eenheid:eenheid.toUpperCase()
            }).run(client)
            if(!artikel) throw new Error('unable to insert artikel')
            const artikelItem = await e.insert(e.ArtikelItem,{
                artikel:e.select(e.Artikel,()=>({
                    filter_single:{id:artikel.id}
                })),
                hoeveelheid:hoeveelheid,
                user:req.params.user
            }).run(client)
            if(!artikelItem) throw new Error('unable to insert artikelItem')
            const nieuwArtikelItem = await e.select(e.ArtikelItem,()=>({
                filter_single:{id:artikelItem.id},
                id:true,
                user:true,
                hoeveelheid:true,
                artikel:{
                    id:true,
                    titel:true,
                    eenheid:true
                }
            })).run(client)
            if(!nieuwArtikelItem) throw new Error('nieuw artikel item niet kunnen vinden')
            res.status(201).send(nieuwArtikelItem)
        } else{
            // indien JA => gebruik het bij de insert van ArtikelItem
            const artikelItem = await e.insert(e.ArtikelItem,{
                artikel:e.select(e.Artikel,()=>({
                    filter_single:{id:result.id}
                })),
                hoeveelheid:hoeveelheid,
                user:req.params.user
            }).run(client)
            if(!artikelItem) throw new Error('unable to insert artikelItem')
            const nieuwArtikelItem = await e.select(e.ArtikelItem,()=>({
                filter_single:{id:artikelItem.id},
                id:true,
                user:true,
                hoeveelheid:true,
                artikel:{
                    id:true,
                    titel:true,
                    eenheid:true
                }
            })).run(client)
            if(!nieuwArtikelItem) throw new Error('nieuw artikel item niet kunnen vinden')
            res.status(201).send(nieuwArtikelItem)
        }
    } catch (err){
        const [code,error] = getDBError(err)
        res.status(code).json({
            error: error
        })
    }
})
export default router