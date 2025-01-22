const fs = require('fs').promises;
const path = require('path');

class UserManager {
  constructor(filename) {
    this.path = path.join(__dirname, filename);
  }

  async readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Si el archivo no existe, retornamos un array vacío
        return [];
      }
      throw new Error(`Error al leer el archivo: ${error.message}`);
    }
  }

  async writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error al escribir el archivo: ${error.message}`);
    }
  }
}

module.exports = UserManager;