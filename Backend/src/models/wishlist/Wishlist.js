import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";
import { User } from "../user/User.js";
import { Laptop } from "../laptop/Laptop.js";

export const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
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
Wishlist.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Wishlist, { foreignKey: 'userId' });

Wishlist.belongsTo(Laptop, { foreignKey: 'laptopId' });
Laptop.hasMany(Wishlist, { foreignKey: 'laptopId' }); 