const { Router } = require("express");

const UsersController = require("../controllers/UsersController");

const usersRoutes = Router(); // nome da minha rota de usuários/ Routes() vem do express

const usersController = new UsersController();


usersRoutes.post("/", usersController.create); // aqui passo o nome da minha rota e tipo de requisição
usersRoutes.put("/:id", usersController.update);


module.exports = usersRoutes;