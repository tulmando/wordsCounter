// business logic for the words

class WordsBl {
    constructor() {
        this.wordsCounter = require('../services').wordsCounter
    }

    async getWordStatistics(word) {
        return await this.wordsCounter.getWordStatistics(word);
    }

    async countWordsFromTextInBody(text) {
        // TODO implement
        return
    }

    async countWordsFromTextWithStream(source) {
        // TODO implement
        return
    }
}

let wordsBl;

if (!wordsBl) {
    wordsBl = new WordsBl();
}

module.exports = wordsBl;
