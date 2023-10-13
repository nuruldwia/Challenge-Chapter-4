const { PrismaClient } = require('@prisma/client');
const { getPagination } = require('../../helpers/pagination');
const { json } = require('express');
const prisma = new PrismaClient();

module.exports = {
    // Create Bank Account
    createBankAccount: async (req, res, next) => {
        try {
            let { bankName, bankAccountNumber, balance, userId } = req.body;

            let newBankAccount = await prisma.bankAccounts.create({
                data: {
                    bankName,
                    bankAccountNumber,
                    balance,
                    userId
                },
            });

            res.status(201).json({
                status: true,
                message: "New Bank Account Created Successfully!",
                data: newBankAccount
            });

        } catch(err) {
            next(err);
        }
    },

    // Get All Bank Account
    getAllAccount: async (req, res, next) => {
        try {
            let { limit = 10, page = 1 } = req.query;
            limit = Number(limit);
            page = Number(page);

            let accounts = await prisma.bankAccounts.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            const { _count } = await prisma.bankAccounts.aggregate({
                _count: { id: true }
            });

            let pagination = getPagination(req, _count.id, page, limit);

            res.status(200).json({
                status: true,
                message: "OK",
                data: { pagination, accounts }
            });
        } catch (err) {
            next(err);
        }
    },

    // Get Detail Bank Account by Id
    getDetailAccount: async (req, res, next) => {
        try {
            let { id } = req.params;
            let account = await prisma.bankAccounts.findUnique({ 
                where: { id: Number(id) },
                include: {
                    user: { 
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            if (!account) {
                return res.status(400).json({
                    status: false,
                    message: "Bad Request!",
                    data: `Bank account with id ${id} doesn\'t exist!`
                });
            }

            res.status(200).json({
                status: true,
                message: "OK!",
                data: account
            });

        } catch(err) {
            next(err);
        }
    }
};