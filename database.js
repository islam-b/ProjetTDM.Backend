const Sequelize = require('sequelize');

const sequelize = new Sequelize('ls6ctt78odq9udww', ' pntl4l6gicnyyzuc', 'bmbyl358lxogg7yb', {
    host: 'q3vtafztappqbpzn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    port: '3306',
    dialect: 'mysql',
    operatorsAliases: false,
    define: {
        freezeTableName: true,
        timestamps:false
    }
});



sequelize
    .authenticate().then(() => {
    console.log('Connection has been established successfully.');
})
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports=sequelize;
