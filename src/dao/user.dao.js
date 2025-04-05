import { BaseDao } from './base.dao.js';
import { UserModel } from '../models/user.model.js';

export class UserDao extends BaseDao {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email) {
        try {
            return await this.findOne({ email });
        } catch (error) {
            console.error('Error en UserDao.findByEmail:', error);
            throw error;
        }
    }

    async updateLastConnection(userId) {
        try {
            return await this.update(userId, { lastConnection: new Date() });
        } catch (error) {
            console.error('Error en UserDao.updateLastConnection:', error);
            throw error;
        }
    }

    async getUsersWithoutPurchases() {
        try {
            const users = await this.model.aggregate([
                {
                    $lookup: {
                        from: 'carts',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'carts'
                    }
                },
                {
                    $match: {
                        'carts': { $size: 0 }
                    }
                }
            ]);
            return users;
        } catch (error) {
            console.error('Error en UserDao.getUsersWithoutPurchases:', error);
            throw error;
        }
    }
} 