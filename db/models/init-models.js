var DataTypes = require("sequelize").DataTypes;
var _employees = require("./employees");
var _history = require("./history");
var _products = require("./products");
var _users = require("./users");

function initModels(sequelize) {
  var employees = _employees(sequelize, DataTypes);
  var history = _history(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  history.belongsTo(employees, { as: "employee", foreignKey: "employeeId"});
  employees.hasMany(history, { as: "histories", foreignKey: "employeeId"});
  history.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(history, { as: "histories", foreignKey: "productId"});

  return {
    employees,
    history,
    products,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
