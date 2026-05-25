import { Request,response,Response,Router } from "express";
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

        const novaPlataforma = await prisma.plataforma.create({
            data:{
                nome: nome,
                jogos: idsJogos
            },
            include:{
                jogos: true
            }
        })

        res.status(201).json(novaPlataforma)
    }
    
    catch{
        return res.status(500).json("Erro ao buscar plataforma")
    }

})

router.put("/:id", async(req:Request, res:Response)=>{
    try{
        const id = Number(req.params.id)

        const {nome} = req.body

        if (Number.isNaN(id)){
            return res.status(400).json({
                erro:"O ID passado deve ser um número"
            })
        }

        if (!nome || nome.trim() === ""){
            return res.status(400).json({
                erro:"O nome é um parâmetro obrigatório"
            })
        }

        const plataforma = await prisma.plataforma.findUnique({
            where:{id}
        })

        if(!plataforma){
            return res.status(404).json({
                erro:"A plataforma não foi encointrada"
            })
        }

        const plataformaAtualizada = await prisma.plataforma.update({
            where:{id},
            data:{nome},
            include:{jogos: true}
        })

        res.status(200).json(plataformaAtualizada)

    }

    catch{
        return res.status(500).json("Erro ao alterar plataforma")
    }   

})

router.delete("/:id", async (req:Request,res:Response)=>{
        
    try{

        const id = Number(req.params.id)

        if (Number.isNaN(id)){
            return res.status(400).json({
                erro:"O ID passado deve ser um número!"
            })
        }

        const plataforma = await prisma.plataforma.findUnique({
            where:{id}
        })

        if(!plataforma){
            return res.status(404).json({
                erro:"A plataforma não foi encontrada"
            })
        }

        await prisma.plataforma.delete({
            where:{id}
        })

        res.status(204).send()
    }

    catch{
        return res.status(500).json("Erro ao alterar plataforma")
    }   
})

export default router