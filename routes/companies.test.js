process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testComp1;
let testComp2;

beforeEach(async () => {
    const results = await db.query(`
    INSERT INTO companies (code, name, description) 
    VALUES ('ntndo', 'Nintendo', 'Bad Hardware, Great Game!'), ('sony', 'Sony', 'We have the best naming convention!') 
    RETURNING code, name, description`)

    testComp1 = results.rows[0]
    testComp2 = results.rows[1]
})


afterEach(async () => {
    await db.query(`DELETE FROM companies`)
})

afterAll(async () => {
    await db.end()
})

describe('GET /companies', () => {
    test('Get a list of all companies', async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ companies: [testComp1, testComp2] });
    })
})

describe('GET /companies/:code', () => {
    test('Returns company with the matching company code', async () => {
        const res = await request(app).get(`/companies/${testComp1.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ company: [testComp1] });
    })

    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).get(`/companies/0`);
        expect(res.statusCode).toBe(404);
    })
})

describe('POST /companies', () => {
    test('Adds a new user to companies and returns the company info', async () => {
        const res = await request(app).post('/companies').send({ code: 'xb', name: 'Xbox', description: 'We have no idea how these names work!' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ company: { code: 'xb', name: 'Xbox', description: 'We have no idea how these names work!' } })
    })
})

describe('PUT /companies/:code', () => {
    test('Updates a single user based on the code specified in the parameters', async () => {
        const res = await request(app).put(`/companies/${testComp1.code}`).send({ name: 'Nintendo', description: 'Home of Mario.' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ company: { code: 'ntndo', name: 'Nintendo', description: 'Home of Mario.' } });
    })
    test('Respond with 404 error when receiving invalid code', async () => {
        const res = await request(app).put(`/companies/zxcvbnm`).send({ name: 'Nintendo', description: 'Home of Mario.' });
        expect(res.statusCode).toBe(404);
    })
})

describe('DELETE /companies/:code', () => {
    test('Deletes a single user based on the code specified in the parameters', async () => {
        const res = await request(app).delete(`/companies/sony`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ msg: "DELETED!" });
    })
})
