export class BaseDao {
    constructor(model) {
        this.model = model;
    }

    async getAll(filter = {}, options = {}) {
        try {
            return await this.model.find(filter, null, options);
        } catch (error) {
            console.error('Error en BaseDao.getAll:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            console.error('Error en BaseDao.getById:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            console.error('Error en BaseDao.create:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error('Error en BaseDao.update:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error en BaseDao.delete:', error);
            throw error;
        }
    }

    async findOne(filter) {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            console.error('Error en BaseDao.findOne:', error);
            throw error;
        }
    }

    async paginate(filter = {}, options = {}) {
        try {
            return await this.model.paginate(filter, options);
        } catch (error) {
            console.error('Error en BaseDao.paginate:', error);
            throw error;
        }
    }
} 