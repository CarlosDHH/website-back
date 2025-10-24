const { warehouseService } = require('../services');


exports.getAllWarehouseAdmon = async (req, res) => {
    const result = await warehouseService.getAll();
    return res.status(result.statusCode).json(result)
}

exports.getWarehouseAdmonById = async (req, res) => {
    const result = await warehouseService.getById(req.params.id);
    return res.status(result.statusCode).json(result)
}

exports.createWarehouseAdmon = async (req, res) => {
    const result = await warehouseService.create(req.body);
    return res.status(result.statusCode).json(result)
}

exports.updateWarehouseAdmonById = async (req, res) => {
    const result = await warehouseService.updateById(req.params.id, req.body);
    return res.status(result.statusCode).json(result)   
}

exports.deleteWarehouseAdmonById = async (req,res) =>{
    const result = await warehouseService.deleteById(req.params.id);
    return res.status(result.statusCode).json(result)
}
