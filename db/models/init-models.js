var DataTypes = require("sequelize").DataTypes;
var _employees = require("./employees");
var _history = require("./history");
var _products = require("./products");
var _users = require("./users");
var _roles = require("./roles");

function initModels(sequelize) {
  var roles = _roles(sequelize, DataTypes);
  var employees = _employees(sequelize, DataTypes);
  var history = _history(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  users.belongsTo(roles, { as: "role", foreignKey: "roleId" });
  history.belongsTo(employees, { as: "employee", foreignKey: "employeeId"});
  employees.hasMany(history, { as: "histories", foreignKey: "employeeId"});
  employees.belongsTo(users, { as: "foreman", foreignKey: "foremanId" });
  history.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(history, { as: "histories", foreignKey: "productId"});

  return {
    roles,
    employees,
    history,
    products,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
