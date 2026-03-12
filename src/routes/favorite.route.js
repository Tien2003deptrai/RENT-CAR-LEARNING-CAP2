const express = require("express");
const favoriteController = require("../controllers/favorite.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const favoriteValidation = require("../validations/favorite.validation");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
    "/toggle",
    authMiddleware,
    authorizeRoles("user"),
    favoriteValidation.toggleFavorite,
    validate,
    favoriteController.toggleFavorite
);

router.post(
    "/my-favorites",
    authMiddleware,
    authorizeRoles("user"),
    favoriteValidation.getMyFavorites,
    validate,
    favoriteController.getMyFavorites
);

module.exports = router;
