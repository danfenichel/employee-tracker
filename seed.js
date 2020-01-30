const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');
require("dotenv").config();

const connection = mysql.createConnection({
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
    });
}

function viewAllData() {
    connection.query("SELECT a.id, a.first_name, a.last_name, role.title, role.salary, department.name, CONCAT(b.first_name ,' ' ,b.last_name) AS manager FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee a ON a.role_id = role.id LEFT JOIN employee b ON b.id = a.manager_id", function(err, res) {
        if (err) throw (err);
        console.log("\n");
        console.table(res);
        console.log("\n");
    });
    startQuestions();
}

function viewDepts() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw (err);
        console.log("\n");
        console.table(res);
        console.log("\n");
    });
    startQuestions();
}

function viewRoles() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw (err);
        console.log("\n");
        console.table(res);
        console.log("\n");
    });
    startQuestions();
}

function viewEmps() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw (err);
        console.log("\n");
        console.table(res);
        console.log("\n");
    });
    startQuestions();
}

function addData() {
    inquirer
    .prompt({
        name: "addMenu",
        type: "list",
        message: "Would you like to add a DEPARTMENT, a ROLE, or an EMPLOYEE?",
        choices: ["ADD DEPARTMENT", "ADD ROLE", "ADD EMPLOYEE", "GO BACK"]
    }).then(function(aAnswer) {
        if (aAnswer.addMenu === "ADD DEPARTMENT") {
            addDept();
        } else if (aAnswer.addMenu === "ADD ROLE") {
            addRole();
        } else if (aAnswer.addMenu === "ADD EMPLOYEE") {
            addEmp();
        } else {
            startQuestions();
        }
    });
}

function addDept() {
    inquirer
    .prompt({
        name: "newDept",
        type: "input",
        message: "What DEPARTMENT would you like to add?"
    }).then(async function(dAnswer) {
        connection.query("INSERT INTO department SET ?", {name: dAnswer.newDept}, function(err) {
            if (err) throw (err);
        });
        await startQuestions();
    });
}

function addRole() {
    inquirer
    .prompt([
        {
            name: "roleName",
            type: "input",
            message: "What is the title of the ROLE you would like to add?"
        },
        {
            name: "rolePay",
            type: "input",
            message: "What is the salary for this new ROLE?"
        },
        {
            name: "deptId",
            type: "input",
            message: "What is the department ID for this new ROLE?"
        }
    ]).then(async function(rAnswer) {
        connection.query("INSERT INTO role SET ?",
        {
            title: rAnswer.roleName,
            salary: rAnswer.rolePay,
            department_id: rAnswer.deptId
        }, 
        function(err) {
            if (err) throw (err);
        });
        await startQuestions();
    });
}

function addEmp() {
    inquirer
    .prompt([
        {
            name: "empFirstName",
            type: "input",
            message: "What is the first name of the EMPLOYEE you would like to add?"
        },
        {
            name: "empLastName",
            type: "input",
            message: "What is the last name of the EMPLOYEE you would like to add?"
        },
        {
            name: "roleId",
            type: "input",
            message: "What is the role ID for the EMPLOYEE you would like to add?"
        },
        {
            name: "mngrId",
            type: "input",
            message: "What is the manager ID for the EMPLOYEE you would like to add?"
        }
    ]).then(async function(eAnswer) {
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: eAnswer.empFirstName,
            last_name: eAnswer.empLastName,
            role_id: eAnswer.roleId,
            manager_id: eAnswer.mngrId
        }, function(err) {
            if (err) throw (err);
        });
        await startQuestions();
    });
}

function updateData() {
    inquirer
    .prompt([
        {
            name: "empId",
            type: "input",
            message: "What is the employee ID for the EMPLOYEE you would like to update?"
        },
        {
            name: "empRole",
            type: "input",
            message: "What is the new role ID for this EMPLOYEE?"
        }
    ]).then(async function(uAnswer) {
        connection.query("UPDATE employee SET ? WHERE ?",
        [
            {
                role_id: uAnswer.empRole 
            },
            {
                id: uAnswer.empId
            }
        ],
        function(err) {
            if (err) throw (err);
        });
        await startQuestions();
    });
}
