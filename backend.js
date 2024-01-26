const express = require('express')
const session = require('express-session');
const http = require("http")
const path = require("path")
const mysql = require("mysql2")
const bodyParser = require('body-parser');
const passport = require('passport');
const { render } = require('ejs');
const LocalStrategy = require('passport-local').Strategy;

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use('/public', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to db
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

// listen
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let query_result = 0



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/viewEmployee', (req, res) => {

  connection.query('SELECT * FROM Employee', (error, results) => {
    const data = {
      employees: results
    };
    res.render('viewEmployee', data);
  })

});

app.get('/add', (req, res) => {
  const data = {
    employees: query_result
  };
 
    res.render('add', data);
});

app.post('/add', (req, res) => {
  const result = req.body
  const employeeNum = `"${parseInt(result.employeeNum)}"`
  const employeeName = `"${result.employeeName}"`
  const employeeAddress = `"${result.employeeAddress}"`
  const employeeSalary = `"${parseFloat(result.employeeSalary)}"`
  const employeeRole = `"${result.employeeRole}"`
  
  const insertQuery = `INSERT INTO Employee(Name, Address, Salary, Employee_Number, Role) VALUES (${employeeName}, ${employeeAddress}, ${employeeSalary}, ${employeeNum}, ${employeeRole})`
  console.log(insertQuery)

  connection.query(insertQuery , (error, result) => {
    console.log(error)
    res.redirect('/viewEmployee')
  })
  
});

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(authUser))

function authUser (user, password, done) {
  //Search the user, password in the DB to authenticate the user
  //Let's assume that a search within your DB returned the username and password match for "Kyle".
     let authenticated_user = { id: 123, name: "Kyle"}
     return done (null, authenticated_user )
  }

passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login',
  passport.authenticate('local',
   { successRedirect: '/', failureRedirect: '/login' })
);