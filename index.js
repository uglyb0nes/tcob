const task = require("./config/function.js");
const inquirer = require("inquirer");

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "Choose a task: ",
        choices: [
            "-View all employees",
            "-View list of departments",
            "-View all employee roles",
            "-Add employee",
            "-Add department",
            "-Add role",
            "-Update an employee's role",
            "-Update an employee's manager",
            "-Delete an employee",
            "- ***Exit***"
        ],
        name: "choice"
    }).then(function ({ choice }) {
        if (choice === "-View all employees") {
            task.viewEmployees()
                .then(function () {
                    console.log("\n");
                    mainMenu();
                });
        } else if (choice === "-View list of departments") {
            task.viewDepartments()
                .then(function () {
                    console.log("\n");
                    mainMenu();
                });
        } else if (choice === "-View all employee roles") {
            task.viewRoles()
                .then(function () {
                    console.log("\n");
                    mainMenu();
                });
        } else if (choice === "-Add employee") {
            addEmployeePrompt();
        } else if (choice === "-Add department") {
            addDepartmentPrompt();
        } else if (choice === "-Add role") {
            addRolePrompt();
        } else if (choice === "-Update an employee's role") {
            updateRolePrompt();
        } else if (choice === "-Update an employee's manager") {
            updateManagerPrompt();
        } else if (choice === "-Delete an employee") {
            deleteEmployeePrompt();
        } else {
            task.endConnection();
        }
    });
}

function addEmployeePrompt() {
    task.getEmployees()
        .then(function (res) {
            const managerArray = [];
            for (let i = 0; i < res.length; i++) {
                managerArray.push(res[i].name);
            }
            managerArray.push("none");
            task.getRoles()
                .then(function (response) {
                    const roleTitleArray = [];
                    for (let i = 0; i < response.length; i++) {
                        roleTitleArray.push(response[i].title);
                    }
                    inquirer.prompt([{
                        type: "input",
                        message: "Enter employee's first name: ",
                        name: "firstName"
                    },
                    {
                        type: "input",
                        message: "Enter employee's last name: ",
                        name: "lastName"
                    },
                    {
                        type: "list",
                        message: "Select employee's role: ",
                        choices: roleTitleArray,
                        name: "role"
                    },
                    {
                        type: "list",
                        message: "Select employee's manager: ",
                        choices: managerArray,
                        name: "manager"
                    }]).then(function ({ firstName, lastName, role, manager }) {
                        const roleId = response[roleTitleArray.indexOf(role)].id;
                        if (manager === "none") {
                            task.addEmployee(firstName, lastName, roleId)
                                .then(function () {
                                    console.log("\n");
                                    mainMenu();
                                });
                        } else {
                            const managerId = res[managerArray.indexOf(manager)].id;
                            task.addEmployee(firstName, lastName, roleId, managerId)
                                .then(function () {
                                    console.log("\n");
                                    mainMenu();
                                });
                        }
                    });
                });
        });
}

function addDepartmentPrompt() {
    task.getDepartments()
        .then(function (response) {
            const deptArray = [];
            for (let i = 0; i < response.length; i++) {
                deptArray.push(response[i].name);
            }
            inquirer.prompt({
                type: "input",
                message: "Enter the name of new department you'd like to add: ",
                name: "deptName"
            }).then(function ({ deptName }) {
                if (deptArray.includes(deptName)) {
                    console.log("There is already a department with that name!\n");
                    mainMenu();
                } else {
                    task.addDepartment(deptName)
                        .then(function () {
                            console.log("\n");
                            mainMenu();
                        });
                }
            });
        });
}

function addRolePrompt() {
    task.getRoles()
        .then(function (roles) {
            const roleArray = [];
            for (let i = 0; i < roles.length; i++) {
                roleArray.push(roles[i].title);
            }
            task.getDepartments()
                .then(function (deptArray) {
                    const deptNames = [];
                    for (let i = 0; i < deptArray.length; i++) {
                        deptNames.push(deptArray[i].name);
                    }
                    inquirer.prompt([{
                        type: "input",
                        message: "Enter the name of the role you would like to add: ",
                        name: "title"
                    },
                    {
                        type: "input",
                        message: "Enter the annual salary of the new role: ",
                        name: "salary"
                    },
                    {
                        type: "list",
                        message: "Select the department in which the new role will work: ",
                        choices: deptNames,
                        name: "department"
                    }]).then(function ({ title, salary, department }) {
                        const deptId = deptArray[deptNames.indexOf(department)].id;
                        if (roleArray.includes(title)) {
                            console.log("Error - that title already exists!\n");
                            mainMenu();
                        } else {
                            task.addRole(title, salary, deptId)
                                .then(function () {
                                    console.log("\n");
                                    mainMenu();
                                });
                        }
                    });
                });
        });
}

function updateRolePrompt() {
    task.getEmployees()
        .then(function (res) {
            const emptArr = [];
            for (let i = 0; i < res.length; i++) {
                emptArr.push(res[i].name);
            }
            task.getRoles()
                .then(function (response) {
                    const roleArray = [];
                    for (let i = 0; i < response.length; i++) {
                        roleArray.push(response[i].title);
                    }
                    inquirer.prompt([{
                        type: "list",
                        message: "Choose the employee whose role you'd like to update: ",
                        choices: emptArr,
                        name: "employee"
                    },
                    {
                        type: "list",
                        message: "Select the employee's new role: ",
                        choices: roleArray,
                        name: "role"
                    }]).then(function ({ employee, role }) {
                        const emptId = res[emptArr.indexOf(employee)].id;
                        task.updateRole(emptId, role)
                            .then(function () {
                                console.log("\n");
                                mainMenu();
                            })
                    })
                })
        })
};

function updateManagerPrompt() {
    task.getEmployees()
        .then(function (employees) {
            const emptArr = [];
            for (let i = 0; i < employees.length; i++) {
                emptArr.push(employees[i].name);
            }
            inquirer.prompt([{
                type: "list",
                message: "Select the employee whose manager you would like to update: ",
                choices: emptArr,
                name: "employee"
            },
            {
                type: "list",
                message: "Select the employee's new manager: ",
                choices: emptArr,
                name: "manager"
            }]).then(function ({ employee, manager }) {
                if (employee === manager) {
                    console.log("Error - you cannot assign an employee to manage him/herself!");
                    mainMenu();
                } else {
                    const emptId = employees[emptArr.indexOf(employee)].id;
                    const mgrId = employees[emptArr.indexOf(manager)].id;
                    task.updateManager(emptId, mgrId)
                        .then(function () {
                            console.log("\n");
                            mainMenu();
                        });
                }
            });
        });
};

function deleteEmployeePrompt() {
    task.getEmployees()
        .then(function (employees) {
            const empArray = [];
            for (let i = 0; i < employees.length; i++) {
                empArray.push(employees[i].name);
            }
            inquirer.prompt({
                type: "list",
                message: "Which employee would you like to delete?",
                choices: empArray,
                name: "employee"
            }).then(function ({ employee }) {
                const empId = employees[empArray.indexOf(employee)].id;
                task.deleteRecord("employees", empId)
                    .then(function () {
                        console.log("\n");
                        mainMenu();
                    });
            });
        });
};

mainMenu();