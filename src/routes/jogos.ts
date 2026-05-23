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

        res.json(jogos);

    } catch {
        res.status(500).json({
            erro: "Erro ao buscar jogo"
        })
    }
});

router.post("/", async (req:Request, res:Response)=>{

    const {titulo,idGenero, idPlataformas} = req.body;

    if (!titulo || idGenero){
        res.status(400).json(
            {erro: "Os Campos título e idGenero são obrigatórios"}
        )
    }

    const genero = await prisma.genero.findUnique({
        where:{id:Number(idGenero)}    
    })

    if (!genero){
        res.status(404).json({
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

    //Validação dos dados acerca da plataforma

    if(plataformas.length !== idPlataformas.length){
        res.status(404).json({
            erro:"Uma ou mais plataformas não estão cadastradas"
        })
    }

    // Cria o jogo
    const novoJogo = await prisma.jogo.create({
        data: {
            titulo: titulo,
            idGenero: Number(idGenero),
            Plataformas: {
                connect: idPlataformas.map((id:Number)=>(id))
            }
        },
        include:{
            genero: true
        }
    })
})

export default router
