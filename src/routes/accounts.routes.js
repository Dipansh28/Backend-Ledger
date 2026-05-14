const express = require("express");
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * - GET /api/accounts/
 * - Get all accounts
 */
router.get("/", accountController.getAllAccountsController);

/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);

/**
 * - GET /api/accounts/me
 * - Get all accounts of the logged-in user
 * - protected route
 */
router.get("/me", authMiddleware.authMiddleware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 * - POST /api/accounts/balance/:accountId
 * - get balance of a specific account
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)
router.post("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)


module.exports = router;