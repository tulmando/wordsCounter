// business logic for the words

class WordsBl {
    async getWordStatistics() {
        // TODO
        return 10 // TODO implement and delete
    }

    async countWordsFromTextInBody(text) {
        // TODO implement
        return
    }

    async countWordsFromTextInFilepath(text) {
        // TODO implement
        return
    }

    async countWordsFromTextInUrl(text) {
        // TODO implement
        return
    }

}

let wordsBl;

if (!wordsBl) {
    wordsBl = new WordsBl();
}

module.exports = wordsBl;
