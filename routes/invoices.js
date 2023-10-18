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
        const results = await db.query(
            'SELECT c.code, c.name, c.description, i.id, i.comp_Code, i.amt, i.paid, i.paid_date FROM companies AS c LEFT JOIN invoices AS i ON c.code = i.comp_code WHERE c.code = $1',
            [req.params.code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${req.params.code}`, 404);
        }

        const { code, name, description } = results.rows[0];
        const invoices = results.rows.map(r => ({ id: r.id, comp_Code: r.comp_Code, amt: r.amt, paid: r.paid, paid_date: r.paid_date }));
        return res.send({ code, name, description, invoices });

    } catch (e) {
        return next(e)
    }
})

module.exports = router;