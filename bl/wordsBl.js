// business logic for the words
const axios = require('axios');
// TODO helpers

class WordsBl {
    constructor() {
        this.wordsCounter = require('../services').wordsCounter
    }

    async getWordStatistics(word) {
        return await this.wordsCounter.getWordStatistics(word);
    }

    async normalizeWord(word) {
        // remove all characters which are not letters.
        // return all letters as lower case.
        return word.replace(/[^a-zA-Z ]+/g, '').toLowerCase();
    }

    async countWordsFromTextInBody(text) {
        let wordDict = {}
        // remove all white spaces from the text.
        // keep a space between words (for \n for example).
        text = text.replace(/\s/g, ' ');
        let splittedWords = text.split(' ');
        for (let word of splittedWords) {
            word = await this.normalizeWord(word);
            if (word.length === 0) return;
            wordDict[word] = wordDict[word] || 0;
            wordDict[word] += 1;
        }

        console.log('!!!! wordDict: ' + JSON.stringify(wordDict)); // TODO
        await this.wordsCounter.bulkUpdate(wordDict);
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
