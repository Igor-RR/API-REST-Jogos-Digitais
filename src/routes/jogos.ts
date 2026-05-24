import { Request,Response,Router } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/",async (req:Request,res:Response) =>{
    try{
        const jogos = await prisma.jogo.findMany({
            include: {
                plataformas: true,
                genero: true
            }
        })

        res.status(200).json(jogos);

    } catch {
        return res.status(500).json({
            erro: "Erro ao buscar jogo"
        })
    }
});

router.post("/", async (req:Request, res:Response)=>{

    try {

        const {titulo,idGenero, idPlataformas} = req.body;

        if (!titulo || !idGenero){
            return res.status(400).json(
                {erro: "Os Campos título e idGenero são obrigatórios"}
            )
        }

        const genero = await prisma.genero.findUnique({
            where:{id:Number(idGenero)}    
        })

        if (!genero){
            return res.status(404).json({
                erro:"O gênero informado não existe"
            })
        }

        // Busca pelas plataformas cadastradas
        const plataformas = await prisma.plataforma.findMany({
            where: {
                id: {
                    in: idPlataformas
                }
            }
        })

        //Validação dos dados acerca da plataforma, verificando se todos os ids existem

        if(plataformas.length !== idPlataformas.length){
            return res.status(404).json({
                erro:"Uma ou mais plataformas não estão cadastradas"
            })
        }

        // Cria o jogo
        const novoJogo = await prisma.jogo.create({
            data: {
                titulo: titulo,
                idGenero: Number(idGenero),
                plataformas: {
                    connect: idPlataformas.map((id:number)=>({id:Number(id)}))
                }
            },
            include:{
                genero: true,
                plataformas: true
            }
        })

        res.status(201).json({novoJogo})

    }

    catch {
        
        return res.status(500).json({
            erro: "Erro ao cadastrar jogo"
        })
    }

    
})

router.put("/:id", async(req:Request,res:Response)=>{

    try{

        const id = Number(req.params.id)
        const {titulo,idGenero} = req.body

        if(Number.isNaN(id)) {
            return res.status(400).json({
                erro : "ID Inválido."
            });
        }


        if(!titulo || !idGenero){
            return res.status(400).json({
                erro:"Os campos título e idGenero são obrigatórios"
            })
        }

        const jogo = await prisma.jogo.findUnique({
            where:{id}
        })

        if(!jogo){
            return res.status(404).json({
                erro:"O jogo não foi encontrado"
            })
        }

        const jogoAtualizado = await prisma.jogo.update({
            where:{id},
            data:{
                titulo: titulo,
                idGenero: Number(idGenero)
            },
            include:{
                genero: true,
                plataformas:true
            }
        })

        res.status(200).json(jogoAtualizado)
    }

    catch {

        return res.status(500).json({
            erro: "Erro ao atualizar jogo"
        })
    }
})

router.patch("/:id",async(req:Request,res:Response)=>{
    
    try{
        const id = Number(req.params.id)

        const {titulo,idGenero} = req.body

        if(Number.isNaN(id)) {
            return res.status(400).json({
                erro : "ID Inválido."
            });
        }

        const jogo = await prisma.jogo.findUnique({
            where:{id}
        })

        if(!jogo){
            return res.status(404).json({
                erro:"O jogo não foi encontrado"
            })
        }

        const jogoAtualizado = await prisma.jogo.update(
            {
                where: {id},
                data:{
                    titulo: titulo ? titulo:undefined,
                    idGenero: idGenero ? idGenero:undefined
                }
            }
        )

        res.status(200).json(jogoAtualizado)
    }

     catch {

        return res.status(500).json({
            erro: "Erro ao atualizar jogo"
        })
    }
    
})

router.delete("/:id", async(req:Request,res:Response)=>{
    
    try{
        const id = Number(req.params.id)

        if (Number.isNaN(id)){
            return res.status(400).json({
                erro:"O id passado não é um número"
            })
        }

        const jogo = await prisma.jogo.findUnique({
            where:{id}
        })

        if (!jogo){
            return res.status(404).json({
                erro:"Jogo não encontado"
            })
        }

        await prisma.jogo.delete({
            where:{id}
        })

        res.status(204).send()

    }

    catch {

        return res.status(500).json({
            erro: "Erro ao deletar jogo"
        })
    }
    
})

export default router
