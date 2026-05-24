import { Request,Response,Router } from "express";
import { prisma } from '../prisma'
import router from "./generos";


router.get("/", async (req:Request,res:Response)=>{
    try{

        const plataformas = prisma.plataforma.findMany({
            include:{
                jogos: true
            }
        })
    }
    catch{
        return res.status(500).json("Erro ao buscar plataformas")
    }
})

router.get("/:id", async(req:Request, res:Response)=>{

    try{
        const id = Number(req.params.id)

        if(Number.isNaN(id)){
            return res.status(400).json({
                erro:"O ID deve ser um número"
            })
        }

        const plataforma = await prisma.plataforma.findUnique({
            where:{id},
            include:{
                jogos: true
            }
        })

        if(!plataforma){
            return res.status(404).json({
                erro:"Plataforma não encontrada"
            })
        }

        res.send(200).json(plataforma)

    }
    
    catch{
        return res.status(500).json("Erro ao buscar plataforma")
    }
    
})

router.post("/", async (req:Request,res:Response)=>{
    try{
        const {nome,idsJogos} = req.body

        if(!nome || nome.trim() == ""){
            return res.status(404).json({
                erro:"Nome inálido"
            })
        }

        const jogos = await prisma.plataforma.findMany({
            where:{
                id:{
                    in:idsJogos
                }
            }
        })

        if(jogos.length !== idsJogos.length){
            return res.status(404).json({
                erro:"Um ou mais jogos não estão cadastrados"
            })
        }
    }
    
    catch{
        return res.status(500).json("Erro ao buscar plataforma")
    }

})



export default router