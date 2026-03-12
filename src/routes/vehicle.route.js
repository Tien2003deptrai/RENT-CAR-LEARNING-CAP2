const express = require('express');
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorize.middleware');
const vehicleValidation = require('../validations/vehicle.validation');
const validate = require('../middlewares/validate.middleware');
const router = express.Router();

router.post('/create',
    authMiddleware,
    authorizeRoles('showroom'),
    vehicleValidation.createVehicle, validate,
    vehicleController.createVehicle
);

router.post('/getListVehicles', vehicleValidation.getListVehicles, validate, vehicleController.getListVehicles);

router.get('/getVehicleById/:vehicleId', vehicleValidation.getVehicleById, validate, vehicleController.getVehicleById);

router.put('/update/:id',
    authMiddleware,
    authorizeRoles('showroom'),
    vehicleValidation.updateVehicle, validate,
    vehicleController.updateVehicle
);

router.post('/my-vehicles',
    authMiddleware,
    authorizeRoles('showroom'),
    vehicleValidation.getMyVehicles, validate,
    vehicleController.getMyVehicles
);

router.delete('/deleteVehicleById/:vehicleId', authMiddleware, authorizeRoles('showroom'), vehicleValidation.deleteVehicleById, validate, vehicleController.deleteVehicleById);

module.exports = router;

