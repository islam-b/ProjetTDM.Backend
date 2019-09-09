const Sequelize = require('sequelize');

const sequelize = new Sequelize('h0005gcldwlq52oc', 'umkmu0isbjg6igkb', 'sj0dsqwcbdz31hy5', {
    host: 'l7cup2om0gngra77.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
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
