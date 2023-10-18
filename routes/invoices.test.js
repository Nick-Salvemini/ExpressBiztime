process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');


// let testInv1;
// let testInv2;
// let testInv3;
// let testInv4;
// let testComp1;
// let testComp2;

// beforeEach(async () => {
//     const results1 = await db.query(`
//     INSERT INTO companies (code, name, description) 
//     VALUES ('ntndo', 'Nintendo', 'Bad Hardware, Great Game!'), ('sony', 'Sony', 'We have the best naming convention!') 
//     RETURNING code, name, description`)

//     console.log('line 19')

//     const results2 = await db.query(`
//     INSERT INTO invoices (comp_code, amt, paid, paid_date) 
//     VALUES ('ntndo', 100, true, '2023-10-01'), ('ntndo', 200, false, null), ('sony', 300, true, '2023-10-01'), ('sony', 400, false, null)
//     RETURNING id, comp_code, amt, paid, add_date, paid_date`)

//     console.log('line 25')

//     testComp1 = results1.rows[0]
//     testComp2 = results1.rows[1]

//     testInv1 = results2.rows[0]
//     testInv2 = results2.rows[1]
//     testInv3 = results2.rows[2]
//     testInv4 = results2.rows[3]
// })

// ---------------------------------------------------------------------------------------------------

// let testInv1 = { comp_code: 'ntndo', amt: 100, paid: true, paid_date: '2023-10-18' };
// let testInv2 = { comp_code: 'ntndo', amt: 200, paid: false, pade_date: null };
// let testInv3 = { comp_code: 'sony', amt: 300, paid: true, pade_date: '2023-10-18' };
// let testInv4 = { comp_code: 'sony', amt: 400, paid: false, pade_date: null };
// let testComp1 = { code: 'ntndo', name: 'Nintendo', description: 'Bad Hardware, Great Game!' };
// let testComp2 = { code: 'sony', name: 'Sony', description: 'We have the best naming convention!' };

// beforeEach(async () => {
// const results1 = await db.query(`
// INSERT INTO companies (code, name, description) 
// VALUES (${testComp1.code}, ${testComp1.name}, ${testComp1.description}), (${testComp2.code}, ${testComp2.name}, ${testComp2.description}) 
// RETURNING code, name, description`)

// const results1 = await db.query(`
//  INSERT INTO companies (code, name, description) 
//  VALUES ('ntndo', 'Nintendo', 'Bad Hardware, Great Game!'), ('sony', 'Sony', 'We have the best naming convention!')`)

// console.log('line 19')

// const results2 = await db.query(`
// INSERT INTO invoices (comp_code, amt, paid, paid_date) 
// VALUES (${testInv1.comp_code}, ${testInv1.amt}, ${testInv1.paid}, ${testInv1.paid_date}), (${testInv3.comp_code}, ${testInv3.amt}, ${testInv3.paid}, ${testInv3.paid_date}), (${testInv3.comp_code}, ${testInv3.amt}, ${testInv3.paid}, ${testInv3.paid_date}), (${testInv4.comp_code}, ${testInv4.amt}, ${testInv4.paid}, ${testInv4.paid_date})
// RETURNING id, comp_code, amt, paid, add_date, paid_date`)

// console.log('line 25')

// const results1 = await db.query(`
// INSERT INTO companies (code, name, description) 
// VALUES (${testComp1}), (${testComp2}) 
// RETURNING code, name, description`)

// console.log('line 19')

// const results2 = await db.query(`
// INSERT INTO invoices (comp_code, amt, paid, paid_date) 
// VALUES (${testInv1}), (${testInv2}), (${testInv3}), (${testInv4})
// RETURNING id, comp_code, amt, paid, add_date, paid_date`)

// console.log('line 25')

// testComp1 = results1.rows[0]
// testComp2 = results1.rows[1]

// testInv1 = results2.rows[0]
// testInv2 = results2.rows[1]
// testInv3 = results2.rows[2]
// testInv4 = results2.rows[3]
// })


// afterEach(async () => {
//     await db.query(`DELETE FROM invoices`);
//     await db.query(`DELETE FROM companies`);
// })


let testInv1 = { id: 1, comp_code: 'apple', amt: 100, paid: false, paid_date: null };
let testInv2 = { id: 2, comp_code: 'apple', amt: 200, paid: false, paid_date: null };
let testInv3 = { id: 3, comp_code: 'apple', amt: 300, paid: true, paid_date: '2018-01-01' };
let testInv4 = { id: 4, comp_code: 'ibm', amt: 400, paid: false, paid_date: null };

afterAll(async () => {
    await db.end()
})


// fdescribe('GET /invoices', () => {
//     test('Get a list of all invoices', async () => {
//         const res = await request(app).get('/invoices');
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toEqual({ invoices: [testInv1, testInv2, testInv3, testInv4] });
//     })
// })

fdescribe('GET /invoices', () => {
    test('Get a list of all invoices', async () => {
        const res = await request(app).get('/invoices');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ invoices: [testInv1, testInv2, testInv3, testInv4] });
    })
})

describe('GET /invoices/:id', () => {
    test('Returns invoice with the matching invoice id', async () => {
        const res = await request(app).get(`/invoices/${testInv1.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ invoice: [testInv1] });
    })

    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).get(`/invoices/0`);
        expect(res.statusCode).toBe(404);
    })
})

describe('POST /invoices', () => {
    test('Adds a new user to invoices and returns the invoice info', async () => {
        const res = await request(app).post('/invoices').send({ comp_code: 'sony', amt: 600, paid: false, add_date: '2019-01-01', paid_date: null });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ invoice: { id: 5, comp_code: 'sony', amt: 600, add_date: '2019-01-01', paid: false, paid_date: null } })
    })
})

describe('PUT /invoices/:id', () => {
    test('Updates a single invoice based on the id specified in the parameters', async () => {
        const res = await request(app).put(`/invoices/${testInv1.id}`).send({ comp_code: 'ntndo', amt: 900, add_date: '2019-01-01', paid: false, paid_date: null });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ invoice: { id: 1, comp_code: 'ntndo', amt: 900, add_date: '2019-01-01', paid: false, paid_date: null } });
    })
    test('Respond with 404 error when receiving invalid code', async () => {
        const res = await request(app).put(`/invoices/zxcvbnm`).send({ comp_code: 'ntndo', amt: 900, paid: false, paid_date: null });
        expect(res.statusCode).toBe(404);
    })
})

describe('DELETE /invoices/:id', () => {
    test('Deletes a single user based on the code specified in the parameters', async () => {
        const res = await request(app).delete(`/invoices/${testInv3.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ msg: "DELETED!" });
    })
})