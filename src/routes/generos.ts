import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    
    const generos = await prisma.genero.findMany({
        include: {
            jogos: true
        }
    });
    res.status(200).json(generos);

  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar gêneros"
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const { nome } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({
                erro: "O campo nome é obrigatório."
            });
        }

        const novoGenero = await prisma.genero.create({
            data: {
                nome : nome.trim()
            }
        });

        res.status(201).json(novoGenero);
    } catch {
        res.status(500).json({
            erro: "Erro ao cadastrar gênero"
        });
    }
} );

router.put("/:id", async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const { nome } = req.body;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({
                erro: "O campo nome é obrigatório."
            });
        }

        const generoExistente = await prisma.genero.findUnique({
            where: { id }
        });

        if(!generoExistente) {
            return res.status(404).json({
                erro: "Gênero não encontrado"
            });
        }

        const generoAtualizado = await prisma.genero.update({
            where: { id },
            data: {
                nome: nome.trim()
            }
        });

        res.json(generoAtualizado);
    } catch {
        return res.status(500).json({
            erro: "Erro ao atualizar gênero"
        })
    }
});

router.delete("/:id", async (req:Request, res: Response)=>{

    try {
        
        const id = Number(req.params.id)

        if(Number.isNaN(id)){
            return
        }
    }

    catch {

        res.status(500).json({erro:"Erro ao deletar gêneros"})

    }


})



export default router;