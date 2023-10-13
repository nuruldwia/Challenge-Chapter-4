const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserDetail, updateUser } = require('../handlers/v1/users');
const { createBankAccount, getAllAccount, getDetailAccount } = require('../handlers/v1/bank_account')
const { createTransaction, getAllTransactions, getDetailTransaction } = require('../handlers/v1/transaction');

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: 'Welcome to Basic Banking Prisma API!',
        data: null
    });
});

router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);
router.put('/users/:id', updateUser);

router.post('/accounts', createBankAccount);
router.get('/accounts', getAllAccount);
router.get('/accounts/:id', getDetailAccount);

router.post('/transactions', createTransaction);
router.get('/transactions', getAllTransactions);
router.get('/transactions/:id', getDetailTransaction)

module.exports = router;