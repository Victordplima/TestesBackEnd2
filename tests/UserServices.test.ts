import { UserService } from "../src/services/UserServices";
import { UserRepository } from "../src/database/UserRepository";
import { CustomError } from "../src/errors/CustomError";

describe("UserService", () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(() => {
        userRepository = new UserRepository();
        userService = new UserService(userRepository);
    });

    // Testes para a função getUserById
    it("should return a user when valid id is provided", async () => {
        // Mockando a função getUserById do repositório
        jest.spyOn(userRepository, "getUserById").mockResolvedValueOnce({
            id: "35b62ff4-64af-4721-a4c5-d038c6f730cf",
            name: "Rubens",
            email: "rubens@gmail.com",
            role: "ADMIN",
        });

        const user = await userService.getUserById("35b62ff4-64af-4721-a4c5-d038c6f730cf");

        expect(user).toBeDefined();
        expect(user.id).toBe("35b62ff4-64af-4721-a4c5-d038c6f730cf");
        expect(user.name).toBe("Rubens");
        expect(user.email).toBe("rubens@gmail.com");
        expect(user.role).toBe("ADMIN");
    });

    it("should throw an error when invalid id is provided", async () => {
        // Mockando a função getUserById do repositório para retornar null
        jest.spyOn(userRepository, "getUserById").mockResolvedValueOnce(null);

        await expect(userService.getUserById("invalid-id")).rejects.toThrowError("User not found");
    });

    it("should throw an error when user does not exist", async () => {
        // Arrange
        const userId = "non-existent-id";

        // Act & Assert
        await expect(userService.getUserById(userId)).rejects.toThrowError(
            new CustomError(404, "User not found")
        );
    });

    // Testes para a função getAllUsers
    it("should throw an error when user is not an admin", async () => {
        // Arrange
        const currentUser = { id: "user_id", name: "John", email: "john@example.com", role: "USER" };

        // Act & Assert
        await expect(userService.getAllUsers(currentUser)).rejects.toThrowError(
            new CustomError(403, "Unauthorized: Only admins can access this resource")
        );
    });

    it("should return all users when user is an admin", async () => {
        // Arrange
        const mockUsers = [
            { id: "user_id_1", name: "User 1", email: "user1@example.com", role: "USER" },
            { id: "user_id_2", name: "User 2", email: "user2@example.com", role: "USER" }
        ];
        jest.spyOn(UserRepository.prototype, "getAllUsers").mockResolvedValueOnce(mockUsers);
        const currentUser = { id: "admin_id", name: "Admin", email: "admin@example.com", role: "ADMIN" };

        // Act
        const users = await userService.getAllUsers(currentUser);

        // Assert
        expect(users).toEqual(mockUsers);
    });

    it("should throw an error when getAllUsers repository function throws an error", async () => {
        // Arrange
        jest.spyOn(UserRepository.prototype, "getAllUsers").mockRejectedValueOnce(new Error("Database error"));
        const currentUser = { id: "admin_id", name: "Admin", email: "admin@example.com", role: "ADMIN" };

        // Act & Assert
        await expect(userService.getAllUsers(currentUser)).rejects.toThrowError("Database error");
    });

    it("should return an empty array when there are no users", async () => {
        // Arrange
        jest.spyOn(UserRepository.prototype, "getAllUsers").mockResolvedValueOnce([]);
        const currentUser = { id: "admin_id", name: "Admin", email: "admin@example.com", role: "ADMIN" };

        // Act
        const users = await userService.getAllUsers(currentUser);

        // Assert
        expect(users).toEqual([]);
    });
});
