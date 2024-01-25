const express = require('express')
const http = require("http")
const path = require("path")
const mysql = require("mysql2")

const app = express()
const port = 3000

app.set('view engine', 'ejs')

// connect to d
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Kainos_Employee_System_with_data',
    port: 8889,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// verify connection
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
});
/*

// route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})
*/

// listen
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let query_result = 0

connection.query('SELECT * FROM Employee', (error, results) => {
    query_result = results
    console.log(query_result)
})

app.get('/', (req, res) => {
  const data = {
    employees: query_result
  };
 
    res.render('index', data);
});