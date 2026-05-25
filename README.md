API RESTFULL

Para testar a API RESTFULL, primeiro limpe os registros presente no banco de dados, digite o comando abaixo no terminal:

    npx prisma migrate reset

Confirme com y

Em seguida, inicie o servidor TS:

    npm run dev

Com o servidor inciado, vá para a pasta http e realize o cadastro dos gêneros e plataformas, posteriomente cadastre os jogos.

Para verificar se os itens foram cadastrados, consulte com "send request" (É importante que você tenha instalado a extensão REST CLIENT do VSCode), que se localiza sob os GET's de cada arquivo. O número posterior ao / dos GET's indica o id do arquivo que você quer consultar. Para criar, envie requisições do tipo POST, para alterar utilize PUT (para todos os campos) ou PATCH (Para um único campo), para excluir utilize DELETE e o id do elemento que você quer excluir.

OBS: Você deve ter o prisma e o express instalados para poder realizar as ações de cadastro (banco de dados) e utilizar as rotas
