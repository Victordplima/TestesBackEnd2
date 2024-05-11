// src/routes/userRoutes.ts
import express from "express";
import { UserController } from "../controller/UserController";
import { UserService } from "../services/UserServices";
import { UserRepository } from "../database/UserRepository";

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/users/profile/:id", userController.getUserById);
router.get("/users/all", userController.getAllUsers);

// Adicionando rota para o perfil do usuário
router.get("/users/profile", userController.getUserProfile);

export { router as userRoutes };
