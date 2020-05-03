const Mutex = require('async-mutex').Mutex;


class WordsDB {
    constructor() {
        this.mutex = new Mutex();
        this.db = require("./db");
        this.tableName = 'words.db';
        // the "word" attribute is indexed in order to improve the "findOne" performance.
        this.db.initTable(this.tableName, ['word']);
    }

    async increment(word, count) {
        let newItem = await this.db.findOne(this.tableName, {word: word});
        if (!newItem) { // first time for this word
            newItem = {word: word, count: count};
            await this.db.insert(this.tableName, newItem)
        } else { // already exists. update the count
            newItem.count += count;
            await this.db.update(this.tableName, newItem)
        }
    }

    async bulkUpdate(wordsDict) {
        try {
            // we need mutual exclusion for this operation.
            // the api might be called simultaneously.
            // since the update of the word counter relied on the current value within the db,
            // we need the following section to be an atomic operation (read, +=val, update)
            await this.mutex.runExclusive(async (_) => {
                for (const [word, count] of Object.entries(wordsDict)) {
                    await this.increment(word, count);
                }
            });
        } catch (err) { // TODO try-catch
            console.log('!!!!!! wordsCounter. err + ' + err);
            // TODO
        }

    }

    async getWordStatistics(word) {
        // TODO IDO try-catch?
        // here we also need a mutual exclusion (read only when there are no other parallel writes)
        return await this.mutex.runExclusive(async (_) => {
            let item = await this.db.findOne(this.tableName, {word: word});
            if (!item) return 0; // for a word which does not exist
            return item.count;
        });
    }
}

let wordsDB;

if (!wordsDB) {
    wordsDB = new WordsDB();
}

module.exports = wordsDB;
