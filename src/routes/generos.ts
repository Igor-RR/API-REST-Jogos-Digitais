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

    if(generos.length === 0){
        return res.status(404).json({
            erro:"Nenhum gênero encontrado"
        })
    }

    res.status(200).json(generos);

  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar gêneros"
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    
    const id = Number(req.params.id)

    if(Number.isNaN(id)){
        return res.status(400).json({
            erro:"O ID deve ser um número"
        })

    }

    const genero = await prisma.genero.findUnique({
        
        where:{id},
        include: {jogos: true}

    });

    if(!genero){
        return res.status(404).json({
            erro: "Gênero não encontrado"
        })

    }

    res.status(200).json(genero);

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

        res.status(200).json(generoAtualizado);

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
            return res.status(400).json({
                erro:"O ID deve ser um número"
            })
        }

        const genero = await prisma.genero.findUnique({
            where:{id}
        })

        if(!genero){
            return res.status(404).json("Gênero não encontrado")
        }

        await prisma.genero.delete({
            where:{id}
        })

        res.status(204).send()
    }

    catch {

        res.status(500).json({erro:"Erro ao deletar gênero"})

    }


})




export default router;