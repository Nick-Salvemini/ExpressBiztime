const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

// GET /invoices

// Return info on invoices: like {invoices: [{id, comp_code}, ...]}

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT * FROM invoices');
        return res.json({ invoices: results.rows })
    } catch (e) {
        return next(e)
    }
})

// GET /invoices/[id]

// Returns obj on given invoice.
// If invoice cannot be found, returns 404.
// Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with id of ${id}`, 404)
        }
        return res.json({ invoice: results.rows })
    } catch (e) {
        return next(e)
    }
})

// POST /invoices

// Adds an invoice.
// Needs to be passed in JSON body of: {comp_code, amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt, paid, add_date, paid_date } = req.body;
        results = await db.query('INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt, paid, add_date, paid_date]);
        return res.status(201).json({ invoice: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

// PUT /invoices/[id]

// Updates an invoice.
// If invoice cannot be found, returns a 404.
// Needs to be passed in a JSON body of {amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comp_code, amt, paid, add_date, paid_date } = req.body;
        results = await db.query('UPDATE invoices SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5 WHERE id=$6 RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt, paid, add_date, paid_date, id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        return res.send({ invoice: results.rows[0] })
    } catch (e) {
        return next(e)
    }
})

// DELETE /invoices/[id]

// Deletes an invoice.
// If invoice cannot be found, returns a 404.
// Returns: {status: "deleted"}
// Also, one route from the previous part should be updated:

router.delete('/:id', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM invoices WHERE id = $1', [req.params.id])
        return res.send({ msg: "DELETED!" })
    } catch (e) {
        return next(e)
    }
})

// GET /companies/[code]

// Return obj of company: {company: {code, name, description, invoices: [id, ...]}}
// If the company given cannot be found, this should return a 404 status response.

router.get('/companies/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        console.log('11111111');
        results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
        console.log('2222222222222222');
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404);
        } else {
            results2 = await db.query('SELECT * FROM invoices WHERE comp_code=$1', [code]);
            console.log('3333333333333333');
            return res.send({ company: { code: results.rows.code, name: results.rows.name, description: results.rows.description, invoices: results2.rows } })
        }
    } catch (e) {
        return next(e)
    }
})

module.exports = router;