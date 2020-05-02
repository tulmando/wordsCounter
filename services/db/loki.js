const lokijs = require("lokijs");


class Loki {
    constructor() {
        this.initDB();
    }

    initDB() {
        this.db = new lokijs('words.db', {
            autosave: true,
            autosaveInterval: 4000
        });
    }

    initTable(tableName, indices) {
        this[tableName] = this.db.getCollection(tableName);
        if (this[tableName] === null) {

            this[tableName] = this.db.addCollection(tableName, { indices: indices });
        }
    }

    async insert(tableName, item) {
        this[tableName].insert(item)
    }

    async update(tableName, item) {
        this[tableName].update(item)
    }

    async findOne(tableName, queryObj) {
        return this[tableName].findOne(queryObj);
    }
}

let loki;

if (!loki) {
    loki = new Loki();
}

module.exports = loki;
