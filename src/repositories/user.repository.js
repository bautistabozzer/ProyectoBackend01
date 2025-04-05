import { UserDao } from '../dao/user.dao.js';
import { UserDTO } from '../dto/user.dto.js';
import { createHash } from '../utils/bcrypt.js';

export class UserRepository {
    constructor() {
        this.dao = new UserDao();
    }

    async getAllUsers(options = {}) {
        const users = await this.dao.getAll({}, options);
        return UserDTO.fromArray(users);
    }

    async getUserById(id) {
        const user = await this.dao.getById(id);
        return UserDTO.from(user);
    }

    async getUserByEmail(email) {
        const user = await this.dao.findByEmail(email);
        return UserDTO.from(user);
    }

    async createUser(userData) {
        const hashedPassword = await createHash(userData.password);
        const user = await this.dao.create({
            ...userData,
            password: hashedPassword
        });
        return UserDTO.from(user);
    }

    async updateUser(id, userData) {
        if (userData.password) {
            userData.password = await createHash(userData.password);
        }
        const user = await this.dao.update(id, userData);
        return UserDTO.from(user);
    }

    async deleteUser(id) {
        return await this.dao.delete(id);
    }

    async updateLastConnection(id) {
        return await this.dao.updateLastConnection(id);
    }

    async getUsersWithoutPurchases() {
        const users = await this.dao.getUsersWithoutPurchases();
        return UserDTO.fromArray(users);
    }

    async paginateUsers(filter = {}, options = {}) {
        const result = await this.dao.paginate(filter, options);
        return {
            ...result,
            docs: UserDTO.fromArray(result.docs)
        };
    }
} 