import { Request,Response,Router } from "express";
import { prisma } from '../prisma'

const router = Router();


router.get("/", async (req:Request,res:Response)=>{
    try{

        const plataformas = await prisma.plataforma.findMany({
            include:{
                jogos: true
            }
        })

        res.status(200).json(plataformas)
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

        res.status(200).json(plataforma)

    }
    
    catch{
        return res.status(500).json("Erro ao buscar plataforma")
    }
    
})

router.post("/", async (req:Request,res:Response)=>{
    try{
        const {nome,idsJogos} = req.body

        if(!nome || nome.trim() == ""){
            return res.status(400).json({
                erro:"Nome inválido"
            })
        }

        const jogos = await prisma.jogo.findMany({
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
                jogos: {
                    connect: idsJogos.map((id:number)=>({id:Number(id)}))
                }
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
                erro:"A plataforma não foi encontrada"
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