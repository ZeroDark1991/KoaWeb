const config = require('./config')
const sequelize = require('sequelize')

const seqIns = new sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

const Pet = seqIns.define('pet', {
    id: {
        type: sequelize.STRING(50),
        primaryKey: true
    },
    name: sequelize.STRING(100),
    gender: sequelize.BOOLEAN,
    birth: sequelize.STRING(20),
    createdAt: sequelize.BIGINT,
    updatedAt: sequelize.BIGINT,
    version: sequelize.BIGINT
},{
    timestamps: false
})

let now = Date.now()
function tryCreate(){
    Pet.create({
        id: `id-${now}`,
        name: 'kala',
        gender: false,
        birth: '2010-1-1',
        createdAt:now,
        updatedAt:now,
        version:0
    })
    .then((data)=>{
        console.log(`created: ${JSON.stringify(data)}`)
    })
    .catch((e)=>{
        console.log(e)
    })  
}

function tryFind(){
    Pet.findAll({
        where: {
            name: 'kala'
        }
    })
    .then((result)=>{
        console.log(`find: ${result}`)
        result.forEach(item => {
            console.log(JSON.stringify(item))
            item.updatedAt = Date.now()
            // item.save()
            item.destroy()
            .then((result)=>{
                JSON.stringify(result)
            })
            .catch((e)=>{
                console.log(e)
            })
        })
    })
    .catch((e)=>{
        console.log(e)
    })
}
tryFind()
