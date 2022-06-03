const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    productName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "productName"
    },
    productPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    photoPath: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "productName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "productName" },
        ]
      },
    ]
  });
};
