var sqlite3 = require('sqlite3').verbose();


class APIUsesSQLiteRepo {
    constructor (
        db = {}
    ) {
        this.db = new sqlite3.Database('db.sqlite');
    }

    create (cost_center, url_id, uses) {
        this.db.run("INSERT INTO api_uses VALUES (?,?,?)", [cost_center, url_id, uses])
    }

    update (url_id, values) {
        const { cost_center, uses } = values
        this.db.run(`UPDATE api_uses SET VALUES (?,?,?) WHERE url_id = ${url_id}`, [cost_center, url_id, uses])
    }

    addUse (url_id, qtd) {
        this.db.run(`UPDATE api_uses SET uses = uses + ${qtd} WHERE url_id = '${url_id}'`)
    }
}

function migrate () {
    const apiUsesSQLiteRepo = new APIUsesSQLiteRepo()
    apiUsesSQLiteRepo.db.exec("DROP TABLE IF EXISTS api_uses")
    apiUsesSQLiteRepo.db.exec("CREATE TABLE api_uses (cost_center, url_id, uses)")
    apiUsesSQLiteRepo.create('ti', 'ti', 0)
    apiUsesSQLiteRepo.create('doc', 'doc', 0)
    apiUsesSQLiteRepo.create('acessoria', 'acessoria', 0)
    apiUsesSQLiteRepo.db.close()
    console.log('Migration successfull!')
}

module.exports = {
    APIUsesSQLiteRepo,
    migrate
}