let wordsBl = require('../../../bl').words;

async function getWordStatistics(req, res, next) {
    let word = req.swagger.params.word.value;

    if (word === "undefined") {
        res.sendStatus(400);
    } else {
        try {
            let count = await wordsBl.getWordStatistics(word);
            res.status(201).json(count);
        } catch (e) {
            console.log('error in words.js, getWordStatistics. error: ' + e);
            res.sendStatus(400);
        }
    }
}

async function countWordsFromTextInBody(req, res, next) {

    let text = req.body.text;

    try {
        await wordsBl.countWordsFromTextInBody(text);
        res.status(201).json();
    } catch (e) {
        console.log('error in words.js, countWordsFromTextInBody. error: ' + e);
        res.sendStatus(400);
    }
}

async function countWordsFromTextInFilepath(req, res, next) {
    let filepath = req.body.filepath;

    try {
        await wordsBl.countWordsFromTextInFilepath(filepath);
        res.status(201).json();
    } catch (e) {
        console.log('error in words.js, countWordsFromTextInFilepath. error: ' + e);
        res.sendStatus(400);
    }
}

async function countWordsFromTextInUrl(req, res, next) {
    let url = req.body.url;

    try {
        await wordsBl.countWordsFromTextInUrl(url);
        res.status(201).json();
    } catch (e) {
        console.log('error in words.js, countWordsFromTextInUrl. error: ' + e);
        res.sendStatus(400);
    }
}

module.exports = {
    getWordStatistics,
    countWordsFromTextInBody,
    countWordsFromTextInFilepath,
    countWordsFromTextInUrl
};
