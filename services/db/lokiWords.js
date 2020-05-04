const path = require("path");
const lokijs = require("lokijs");
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter');

let dbFile = path.resolve(__dirname, './lokidb.json');

class LokiWords {
    constructor(tableName, indices) {
        this.db = new lokijs(dbFile,
            {
                verbose: true,
                autosave: true,
                autoload: true,
                autoloadCallback: () => {
                    this[tableName] = this.db.getCollection(tableName);
                    if (this[tableName] === null) {
                        console.log('init table for the first time. tableName: ' + tableName);
                        this[tableName] = this.db.addCollection(tableName, { indices: indices });
                    }
                },
                autosaveInterval: 5000,
                adapter: new LokiFSStructuredAdapter(),
                autosaveCallback: () => {
                    console.log('autosaved db');
                }
            }
        );
    }

    async insert(item) {
        this[tableName].insert(item)
    }

    async update(item) {
        this[tableName].update(item)
    }

    async findOne(queryObj) {
        return this[tableName].findOne(queryObj);
    }
}

let tableName = 'words.db';
let loki;

if (!loki) {
    loki = new LokiWords(tableName, ['word']);
}

module.exports = loki;
