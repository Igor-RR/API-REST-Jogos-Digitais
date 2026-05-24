import express from "express";
import generosRouter from "./routes/generos";
import plataformasRouter from "./routes/plataformas"
import jogosRouter from "./routes/jogos"

const app = express();
const PORT = 3000;

app.use(express.json());
    
app.use("/generos", generosRouter);
app.use("/plataformas", plataformasRouter);
app.use("/jogos",jogosRouter);

app.listen(PORT, () => {
    console.log(`Servidor executando em localhost:${PORT}`)
});