require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const express = require("express");

const routes = require("./routes");

migrationsRun();

const app = express();
app.use(express.json()); // forma de receber e enviar dados pelo corpo da requisição em forma de JSON

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    // erro que foi crido pelo cliente
    return response.status(error.statusCode).json({
      status: "error",
      message: error.mensagem,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
});

const PORT = 3335;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
