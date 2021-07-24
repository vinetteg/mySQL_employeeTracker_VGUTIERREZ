const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

//established connection to db
const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "Frozen3.",
  database: "businessDB",
});

connection.connect((err) => {
  if (err) throw err;
});

//prompts user for first action/what does the user want to do
const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add a role",
        "Add an employee",
        "View all departments",
        "View all roles",
        "View all employees",
        "Update a role",
        "Leave employee tracker",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;

        case "Update a role":
          updateRole();
          break;
        case "Leave employee tracker":
          connection.end();
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: "dept",
      type: "input",
      message: "What is the name of the department you would like to add?",
    })
    .then((answer) => {
      console.log("Inserting a new department...\n");
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} department added!\n`);
          runSearch();
        }
      );
    });

  //   console.log(query.sql);
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the role you would like to add?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the role you are adding?",
      },
      {
        name: "dept_id",
        type: "input",
        message: "What is the department id number of the new role?",
      },
    ])
    .then((answer) => {
      console.log("Inserting a new role...\n");
      connection.query(
        "INSERT INTO position SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.dept_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} role added!\n`);
          runSearch();
        }
      );
    });

  //   console.log(query.sql);
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the first name of the new employee?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the last name of the new employee?",
      },
      {
        name: "role_id",
        type: "input",
        message: "What is role ID number of the new employee?",
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is the manager ID of the new employee?",
      },
    ])
    .then((answer) => {
      console.log("Inserting a new role...\n");
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee added!\n`);
          runSearch();
        }
      );
    });

  //   console.log(query.sql);
};

const viewDepartments = () => {
  connection.query(
    "SELECT * FROM department",

    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    }
  );
};
const viewRoles = () => {
  connection.query(
    "SELECT * FROM position",

    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    }
  );
};

const viewEmployees = () => {
  connection.query(
    "SELECT * FROM employee",

    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    }
  );
};

const updateRole = () => {
  let employeeList;
  let ids;
  let names;
  connection.query(
    "SELECT id, first_name, last_name FROM employee",

    function (err, res) {
      if (err) throw err;
      // console.log(typeof res);
      let results = JSON.stringify(res);
      results = JSON.parse(results);
      employeeList = results;

      // employeeList.push(...results);
      // console.log(results);
      names = results.map((a) => `${a["first_name"]} ${a["last_name"]}`);
      ids = results.map((a) => a["id"]);
      // console.log(result);
      inquirer
        .prompt([
          {
            name: "update_position",
            type: "list",
            choices: names,
            message: "Which employee role would you like to update?",
          },
        ])
        .then((answer) => {
          // 1. once the name is picked, filter the employeelist to get the person's id;
          // 2. now that you have the chosen person's id you can use it in the update query
          inquirer.prompt([
            {
              name: "update_role",
              type: "input",
              message: "Which role would you like to update the employee to?",
            },
          ]);
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
              },
              {
                role_id: answer.role_id,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} employee updated!\n`);
              runSearch();
            }
          );
        });
    }
  );

  // let result = employeeList.map((a) => a.id);

  //   console.log(query.sql);
};

runSearch();
