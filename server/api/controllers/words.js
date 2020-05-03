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

async function countWordsFromText(req, res, next) {

    let source = req.body.source;

    try {
        if (source === "body") {
            let text = req.body.text;
            await wordsBl.countWordsFromTextInBody(text);
            res.status(201).json();
        } else if (source === "filepath") {
            let filepath = req.body.filepath;
            await wordsBl.countWordsFromTextWithStream(filepath);
            res.status(201).json();
        } else if (source === "url") {
            let url = req.body.url;
            await wordsBl.countWordsFromTextWithStream(url);
            res.status(201).json();
        } else {
            console.log('source parameter is not legal. expected: body/filepath/url. got: ' + source);
            res.sendStatus(400);
        }

    } catch (e) {
        console.log('error in words.js, countWordsFromText. error: ' + e);
        res.sendStatus(400);
    }
}

module.exports = {
    getWordStatistics,
    countWordsFromText
};
