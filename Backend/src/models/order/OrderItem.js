import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";
import { Order } from "./Order.js";
import { Laptop } from "../laptop/Laptop.js";

export const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Order,
      key: 'id'
    }
  },
  laptopId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Laptop,
      key: 'id'
    }
  },
  laptopName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  laptopImage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
});

// Define associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(Laptop, { foreignKey: 'laptopId' });
Laptop.hasMany(OrderItem, { foreignKey: 'laptopId' }); 