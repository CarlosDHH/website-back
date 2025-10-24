const { generateResponse } = require('../utils/handleResponse');
const WarehouseAdmon = require("../models/WarehouseAdmon");
const { Op } = require('sequelize');

const getAll = async () => {
    try {
        const warehouses = await WarehouseAdmon.findAll({
            where: {
                status: 1,
            }
        });
        return generateResponse(200, true, "Se han encontrado registros.", warehouses)
    } catch (error) {
        return generateResponse(500, false, `Ha ocurrido un error.`, null, error.message)
    }
}

const getById = async (id) => {
    try {
        const warehouse = await WarehouseAdmon.findByPk(id, {
            where: {
                status: 1,
            }
        });
        if (!warehouse) {
            return generateResponse(400, false, "No se ha encontrado el registro.")
        }
        return generateResponse(200, true, "Se ha encontrado el registro.", warehouse)
    } catch (error) {
        return generateResponse(500, false, `Ha ocurrido un error.`, null, error.message)
    }
}

const create = async (data) => {
    try {
        const { code, name } = data;
        const check = await checkIfWarehouseAlreadyExists(code, name);
        if (!check.success) {
            return check;
        }
        const warehouse = await WarehouseAdmon.create({
            code,
            name,
        });
        if (!warehouse) {
            return generateResponse(400, false, "No se ha creado el registro.")
        }

        return generateResponse(200, true, "Se ha creado el registro.", warehouse)
    } catch (error) {
        console.log(e);
        return generateResponse(500, false, `Ha ocurrido un error.`, null, error.message)
    }
}

const updateById = async (id, data) => {
    try {
        const { code, name } = data;
        const check = await checkIfWarehouseAlreadyExists(code, name, id);
        if (!check.success) {
            return check;
        }
        const warehouse = await WarehouseAdmon.findByPk(id, {
            where: {
                status: 1,
            }
        });
        if (!warehouse) {
            return generateResponse(400, false, "No se ha encontrado el registro.")
        }
        warehouse.code = code;
        warehouse.name = name;
        // warehouse.updatedBy = userId;
        await warehouse.save();
        return generateResponse(200, true, "Se ha actualizado el registro.", warehouse)
    } catch (error) {
        return generateResponse(500, false, `Ha ocurrido un error.`, null, error.message)
    }
}

const deleteById = async (id) => {
    try {
        const warehouse = await WarehouseAdmon.findByPk(id, {
            where: {
                status: 1,
            }
        });
        if (!warehouse) {
            return generateResponse(400, false, "No se ha encontrado el registro.")
        }
        warehouse.status = 0;
        // warehouse.updatedBy = userId;
        await warehouse.save();
       
        return generateResponse(200, true, "Se ha eliminado el registro.", warehouse)
    } catch (error) {
        return generateResponse(500, false, `Ha ocurrido un error.`, null, error.message)
    }
}

// *VALIDATIONS

const checkIfWarehouseAlreadyExists = async (code, name, id = null) => {
  try {
    const warehouses = await WarehouseAdmon.findAll({
      where: {
        status: 1,
        id: { [Op.ne]: id },
        [Op.or]: [
          { code },
          { name },
          { [Op.and]: [{ code }, { name }] },
        ],
      },
    });

    if (warehouses.length > 0) {
      // Analiza el primer conflicto encontrado (puedes mejorar esto si quieres devolver varios)
      const warehouse = warehouses[0];
      if (warehouse.code === code && warehouse.name === name) {
        return generateResponse(400, false, "El código y el nombre de almacén ya existen.");
      } else if (warehouse.code === code) {
        return generateResponse(400, false, "El código de almacén ya existe.");
      } else if (warehouse.name === name) {
        return generateResponse(400, false, "El nombre de almacén ya existe.");
      }
    }

    return generateResponse(200, true, "El almacén es válido.");
  } catch (error) {
    return generateResponse(500, false, "Ha ocurrido un error.", null, error.message);
  }
};


module.exports = {
    create,
    updateById,
    getById,
    getAll,
    deleteById,
}