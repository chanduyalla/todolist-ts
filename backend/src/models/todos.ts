"use strict";
const { Model } = require("sequelize");

interface todosAttributes {
  id?: number;
  title: string;
  priority: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
module.exports = (sequelize: any, DataTypes: any) => {
  class Todos extends Model<todosAttributes> implements todosAttributes {
    public id!: number;
    public title!: string;
    public priority!: string;
    public completed!: boolean;

    public updatedAt!: Date;
    public createdAt!: Date;
    public deletedAt!: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Todos.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      priority: { type: DataTypes.STRING, allowNull: false },
      completed: { type: DataTypes.BOOLEAN, allowNull: false },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Todos",
      tableName: "Todos",
    }
  );
  return Todos;
};
