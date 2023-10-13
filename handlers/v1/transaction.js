const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getPagination } = require('../../helpers/pagination');

module.exports = {
    // Create Transaction
    createTransaction: async(req, res, next) => {
        try {
            let { amount, sourceAccountId, destinationAccountId } = req.body;

            const source = await prisma.bankAccounts.findUnique({where: {id: Number(sourceAccountId) }});
            if (!source) {
                return res.status(404).json({
                    status: false,
                    message: `Source Account with id ${id} Not Found!`,
                    data: null
                });
            }

            const destination = await prisma.bankAccounts.findUnique({where: { id : Number(destinationAccountId) }});
            if(!destination) {
                return res.status(404).json({
                    status: false,
                    message: `Destination Account with id ${id} Not Found!`,
                    data: null
                });
            }

            // Checking Balance 
            if (source.balance < amount) {
                return res.status(400).json({
                    status: false,
                    message: "Bad Request! Not Enough Balance!",
                    data: null
                });
            }

            // transaction update
            await prisma.bankAccounts.update({
                where: {id : Number(sourceAccountId)},
                data: {
                    balance: Number(source.balance) - amount
                },
            });

            await prisma.bankAccounts.update({
                where: {id: Number(destinationAccountId)},
                data: {
                    balance: Number(destination.balance) + amount
                },
            });

            let newTransaction = await prisma.transactions.create({
                data: {
                    amount,
                    sourceAccountId,
                    destinationAccountId
                }
            });

            res.status(201).json({
                status: true,
                message: "Transaction Created Successfully!",
                data: newTransaction
            })

        } catch (err) {
            next(err);
        }
    },

    // Get All Transactions
    getAllTransactions: async(req, res, next) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let allTransactions = await prisma.transactions.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            const { _count } = await prisma.transactions.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: "OK",
                data: { pagination, allTransactions }
            });
        } catch (err) {
            next(err);
        }
    },

    //Get Detail Transactions by Id
    getDetailTransaction: async (req, res, next) => {
        try {
            let { id } = req.params;
            let  transaction = await prisma.transactions.findUnique({
                where: {id: Number(id)},
                include: {
                    sourceAcount: {
                        include: {
                            user: {
                                select: {
                                    name: true
                                },
                            },
                        },
                    },
                    destinationAccount: {
                        include: {
                            user: {
                                select: {
                                    name: true
                                },
                            },
                        },
                    },
                },
            });

            if(!transaction) {
                return res.status(400).json({
                    status: false,
                    message: "Bad Request!",
                    data: `Transactions with id ${id} doesn\'t exist!`
                });
            }

            res.status(200).json({
                status: true,
                message: "OK!",
                data: transaction
            });

        } catch (err) {
            next(err);
        }
    }
}