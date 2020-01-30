const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: process.env.DB_PASSWORD,
    database: "staff_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the startQuestions function after the connection is made to prompt the user
    startQuestions();
  });

function startQuestions() {
    inquirer
    .prompt({
      name: "mainMenu",
      type: "list",
      message: "Would you like to VIEW, ADD, or UPDATE employee/company information?",
      choices: ["VIEW", "ADD", "UPDATE", "EXIT"]
    }).then(function(answer) {
      if (answer.mainMenu === "VIEW") {
        viewData();
      } else if (answer.mainMenu === "ADD") {
        addData();
      } else if (answer.mainMenu === "UPDATE") {
        updateData();
      } else {
          connection.end();
      }
    });
}

function viewData() {
    inquirer
    .prompt({
        name: "viewMenu",
        type: "list",
        message: "Would you like to view ALL company data, view DEPARTMENTS, view ROLES, or view EMPLOYEES?",
        choices: ["VIEW ALL DATA", "VIEW DEPARTMENTS", "VIEW ROLES", "VIEW EMPLOYEES", "GO BACK"]
    }).then(function(vAnswer) {
        if (vAnswer.viewMenu === "VIEW ALL DATA") {
            viewAllData();
        } else if (vAnswer.viewMenu === "VIEW DEPARTMENTS") {
            viewDepts();
        } else if (vAnswer.viewMenu === "VIEW ROLES") {
            viewRoles();
        } else if (vAnswer.viewMenu === "VIEW EMPLOYEES") {
            viewEmps();
        } else {
            startQuestions();
        }
    })
}

// function view_all_departments() {
//     connection.query("SELECT * FROM departments", function (err, res) {
//         if (err) throw err;
//         // Log all results of the SELECT statement
//         console.log("\n");
//         console.table(res);
//     })
//     main_menu_prompt()
// }