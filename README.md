<h1 align="center">
  Clothing Store Vouchers API
</h1>


## This is a RESTful API for a small clothing store. It offers two routes: one for creating vouchers and another for applying them.

<br />

## Starting the project
Use **npm i** to install project dependencies.
```bash
npm i
```

Create a PostgreSQL database with whatever name you want.
Configure the `.env.test` file using the `.env.example` file.
Run all migrations.
```cl
npm run prisma:migrate
```
Then start the project.

```cl
npm run dev
```

## Endpoints

### POST /vouchers
Create a new voucher with a unique alphanumeric code and a discount percentage value between 1 and 100. The request body should be in JSON format with the following properties:

- code: The voucher code as a string.
- discount: The discount percentage as a number.

Example request body:

```json
{
  "code": "ABC123",
  "discount": 10
}
```

### POST /vouchers/apply
Apply a voucher to a purchase. The request body should be in JSON format with the following properties:

- code: The voucher code as a string.
- amount: The total purchase amount as a number.

Example request body:

```json
{
  "code": "ABC123",
  "amount": 150
}
```

Example response:

```json
{
  "amount": 150,
  "discount": 15,
  "total": 135,
  "applied": true
}
```

## Business rules
- Vouchers must be created with a unique alphanumeric code and a discount percentage value between 1 and 100.
- Vouchers can only be used once.
- The purchase amount must be at least 100 in order to apply a voucher.
- When a voucher is applied, the API will respond with the purchase amount, discount amount, total amount after discount, and whether or not the voucher was successfully applied.

## Testing
This application has been thoroughly tested using unit tests. You can run the tests with the following command:
```cl
npm run test:unit
```
The tests cover all business rules and edge cases to ensure the API behaves as expected under various conditions.
<br />