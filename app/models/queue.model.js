const { DataTypes, Sequelize } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} Sequelize
 * @returns
 */
module.exports = (sequelize, Sequelize) => {
  const queue = sequelize.define(
    "queue",
    {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      video_id: {
        type: Sequelize.STRING(45),
      },
      user_id: {
        type: Sequelize.STRING(45),
      },
      voice_channel_id: {
        type: Sequelize.STRING(45),
      },
      msg_channel_id: {
        type: Sequelize.STRING(45),
      },
      added_on: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.TEXT,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return queue;
};
