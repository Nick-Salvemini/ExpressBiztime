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



// router.get('/:id', async (req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e)
//     }
// })

// POST /invoices



// Adds an invoice.
// Needs to be passed in JSON body of: {comp_code, amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

// router.post('/', async (req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e)
//     }
// })

// PUT /invoices/[id]



// Updates an invoice.
// If invoice cannot be found, returns a 404.
// Needs to be passed in a JSON body of {amt}
// Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

// router.put('/:id', async (req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e)
//     }
// })

// DELETE /invoices/[id]



// Deletes an invoice.
// If invoice cannot be found, returns a 404.
// Returns: {status: "deleted"}
// Also, one route from the previous part should be updated:

// router.delete('/:id', async (req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e)
//     }
// })

// GET /companies/[code]



// Return obj of company: {company: {code, name, description, invoices: [id, ...]}}
// If the company given cannot be found, this should return a 404 status response.

// router.get('/companies/:code', async (req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e)
//     }
// })

// module.exports = router;

//-------------------------------------------------------------------------------------------------

// router.get('/:id', async (req, res, next) => {
//     try {
//         const { code } = req.params;
//         const results = await db.query('SELECT * FROM companies WHERE code = $1', [code]);
//         if (results.rows.length === 0) {
//             throw new ExpressError(`Can't find company with code of ${code}`, 404)
//         }
//         return res.json({ company: results.rows })
//     } catch (e) {
//         return next(e)
//     }
// })

// router.post('/', async (req, res, next) => {
//     try {
//         const { code, name, description } = req.body;
//         results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
//         return res.status(201).json({ company: results.rows[0] })
//     } catch (e) {
//         return next(e)
//     }
// })

// router.put('/:id', async (req, res, next) => {
//     try {
//         const { code } = req.params;
//         const { name, description } = req.body;
//         results = await db.query('UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING code, name, description', [code, name, description]);
//         if (results.rows.length === 0) {
//             throw new ExpressError(`Can't find company with code of ${code}`, 404)
//         }
//         return res.send({ company: results.rows[0] })
//     } catch (e) {
//         return next(e)
//     }
// })

// router.delete('/:id', async (req, res, next) => {
//     try {
//         const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
//         return res.send({ msg: "DELETED!" })
//     } catch (e) {
//         return next(e)
//     }
// })

// router.get('/companies/:code', async (req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e)
//     }
// })

module.exports = router;