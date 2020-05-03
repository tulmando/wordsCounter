// business logic for the words
const axios = require('axios');
const fs = require('fs');
const es = require('event-stream');

// TODO helpers

class WordsBl {
    constructor() {
        this.wordsCounter = require('../services').wordsCounter
    }

    async getWordStatistics(word) {
        return await this.wordsCounter.getWordStatistics(word);
    }

    // a helper function to clean each line from any spaces & non-letters
    async cleanLine(line) {
        // remove all white spaces from the text.
        // keep a space between words (for \n for example).
        line = line.replace(/\s/g, ' ');
        // remove all characters which are not letters.
        // return all letters as lower case.
        return line.replace(/[^a-zA-Z ]+/g, '').toLowerCase();
    }

    async countWordsInLine(line, wordDict) {
        line = await this.cleanLine(line);
        let splittedWords = line.split(' ');
        for (let word of splittedWords) {
            if (word.length === 0) continue; // skip empty string (we don't need it).
            wordDict[word] = wordDict[word] || 0;
            wordDict[word] += 1;
        }
    }

    async countWordsFromReadStream(readStream, wordDict) {
        let self = this;
        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('ready', function () {
            readStream.pipe(es.split())
                .pipe(es.mapSync(async function (line) {

                        // pause the readstream
                        readStream.pause();

                        // process line
                        await self.countWordsInLine(line, wordDict);

                        // resume the readstream
                        readStream.resume();
                    })
                        .on('error', function (err) {
                            console.log('error in the es.mapSync: ' + err);
                            throw err;
                        })
                        .on('end', async function () {
                            console.log('Read entire file. updating word counter');
                            await self.wordsCounter.bulkUpdate(wordDict);
                        })
                );
        });

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        readStream.on('error', function (err) {
            console.log('error in the readStream: ' + err);
            throw err;
        });
    }

    async countWordsFromTextInBody(text) {
        let wordDict = {};

        let lines = text.split('\n');
        for (let line of lines) {
            await this.countWordsInLine(line, wordDict);
        }
        await this.wordsCounter.bulkUpdate(wordDict);
    }

    async countWordsFromTextFromFilepath(filepath) {
        // input check: make sure the filepath exists.
        if (!fs.existsSync(filepath)) {
            throw new Error('filepath does not exist. filepath was: ' + filepath);
        }

        let wordDict = {};

        // This line opens the file as a readable stream
        let readStream = fs.createReadStream(filepath);
        await this.countWordsFromReadStream(readStream, wordDict);
    }

    async countWordsFromTextFromUrl(url) {
        let wordDict = {};
        // TODO generate the output name (rand name)
        // output name should be random. Because there might be parallel calls for the api.
        // If we use the same file we won't count properly
        const filenameForStream = 'temp-stream.txt';
        // make sure the file doesn't exist. if it does, delete it.
        if (fs.existsSync(filenameForStream)) {
            fs.unlinkSync(filenameForStream);
        }

        // create stream from the url into the filenameForStream file
        let response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        response.data.pipe(fs.createWriteStream(filenameForStream));

        // create a readstream from the file and count words
        let readStream = fs.createReadStream(filenameForStream);
        await this.countWordsFromReadStream(readStream, wordDict);
    }

}

let wordsBl;

if (!wordsBl) {
    wordsBl = new WordsBl();
}

module.exports = wordsBl;
