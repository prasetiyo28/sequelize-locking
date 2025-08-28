const sequelize = require('../db');
const Account = require('../models/Account');
(async()=>{try{await sequelize.authenticate();await sequelize.sync({alter:true});
const [a1]=await Account.findOrCreate({where:{id:1},defaults:{owner:'Alice',balance:1000}});
const [a2]=await Account.findOrCreate({where:{id:2},defaults:{owner:'Bob',balance:1000}});
const [a3]=await Account.findOrCreate({where:{id:3},defaults:{owner:'Charlie',balance:1000}});
console.log('Seeded accounts:',[a1.toJSON(),a2.toJSON(),a3.toJSON()]);process.exit(0);}catch(err){console.error(err);process.exit(1);}})();
