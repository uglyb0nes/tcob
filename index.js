const task = require('./config/function.js');
const inquirer = require('inquirer');

function mainMenu() {
    inquirer.prompt({
        type: 'list',
        message: 'Use arrow keys to select task ',
        choices: [
            '>View Employees',
            '>View Deparments',
            '>View Employees',
            '>Add Employee',
            '>Add Department',
            '>Add Role',
            '>Update Role',
            '>Update Manager',
            '>Delete Employee',
            '>EXIT'
        ],
        name: 'choice'
    }).then(function ({ choice }) {
        if (choice === '>View Employees') {
            task.viewEmployees()
                .then(function () {
                    console.log('\n');
                    mainMenu();
                });
        } else if (choice === '>View Departments') {
            task.viewDepartments()
                .then(function () {
                    console.log('\n');
                    mainMenu();
                });
        } else if (choice === '>View Roles') {
            task.viewRoles()
                .then(function () {
                    console.log('\n');
                    mainMenu();
                });
        } else if (choice === '>Add Employee') {
            addEmployeePrompt();
        } else if (choice === '>Add Department') {
            addDepartmentPrompt();
        } else if (choice === '>Add Role') {
            addRolePrompt();
        } else if (choice === '>Update Role') {
            updateRolePrompt();
        } else if (choice === '>Update Manager') {
            updateManagerPrompt();
        } else if (choice === '>Delete Employee') {
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
            managerArray.push('none');
            task.getRoles()
                .then(function (response) {
                    const roleTitleArray = [];
                    for (let i = 0; i < response.length; i++) {
                        roleTitleArray.push(response[i].title);
                    }
                    inquirer.prompt([{
                        type: 'input',
                        message: 'Enter First Name: ',
                        name: 'firstName'
                    },
                    {
                        type: 'input',
                        message: 'Enter Last Name: ',
                        name: 'lastName'
                    },
                    {
                        type: 'list',
                        message: 'Select role: ',
                        choices: roleTitleArray,
                        name: 'role'
                    },
                    {
                        type: 'list',
                        message: 'Select Manager: ',
                        choices: managerArray,
                        name: 'manager'
                    }]).then(function ({ firstName, lastName, role, manager }) {
                        const roleId = response[roleTitleArray.indexOf(role)].id;
                        if (manager === 'none') {
                            task.addEmployee(firstName, lastName, roleId)
                                .then(function () {
                                    console.log('\n');
                                    mainMenu();
                                });
                        } else {
                            const managerId = res[managerArray.indexOf(manager)].id;
                            task.addEmployee(firstName, lastName, roleId, managerId)
                                .then(function () {
                                    console.log('\n');
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
                type: 'input',
                message: 'Department Name: ',
                name: 'deptName'
            }).then(function ({ deptName }) {
                if (deptArray.includes(deptName)) {
                    console.log('Department Already Exists\n');
                    mainMenu();
                } else {
                    task.addDepartment(deptName)
                        .then(function () {
                            console.log('\n');
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
                        type: 'input',
                        message: 'Enter Role: ',
                        name: 'title'
                    },
                    {
                        type: 'input',
                        message: 'Enter Salary: ',
                        name: 'salary'
                    },
                    {
                        type: 'list',
                        message: 'Select Department: ',
                        choices: deptNames,
                        name: 'department'
                    }]).then(function ({ title, salary, department }) {
                        const deptId = deptArray[deptNames.indexOf(department)].id;
                        if (roleArray.includes(title)) {
                            console.log('Title Already Exists\n');
                            mainMenu();
                        } else {
                            task.addRole(title, salary, deptId)
                                .then(function () {
                                    console.log('\n');
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
                        type: 'list',
                        message: 'Choose Employee: ',
                        choices: emptArr,
                        name: 'employee'
                    },
                    {
                        type: 'list',
                        message: 'Select Role: ',
                        choices: roleArray,
                        name: 'role'
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
                type: 'list',
                message: 'Select Manager: ',
                choices: emptArr,
                name: 'employee'
            },
            {
                type: 'list',
                message: 'Select Manger: ',
                choices: emptArr,
                name: 'manager'
            }]).then(function ({ employee, manager }) {
                if (employee === manager) {
                    console.log('Invalid');
                    mainMenu();
                } else {
                    const emptId = employees[emptArr.indexOf(employee)].id;
                    const mgrId = employees[emptArr.indexOf(manager)].id;
                    task.updateManager(emptId, mgrId)
                        .then(function () {
                            console.log('\n');
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
                type: 'list',
                message: 'Select Employee ',
                choices: empArray,
                name: 'employee'
            }).then(function ({ employee }) {
                const empId = employees[empArray.indexOf(employee)].id;
                task.deleteRecord('employees', empId)
                    .then(function () {
                        console.log('\n');
                        mainMenu();
                    });
            });
        });
};

mainMenu();