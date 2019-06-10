'use strict';
const readline = require('readline');
const fs = require('fs');

const topics = new Map();
topics.set('1', 'Feature');
topics.set('2', 'Bug');
topics.set('3', 'Refactor / Improvement');

const answers = {
    topic: '',
    type: '',
    body: ''
};


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function question(question) {
    return new Promise(res => {
        rl.question(`\u001b[1;36m${question}\u001b[0m`, function (answer) {
            res(answer);
        });
    })
}

function validate() {
    if (answers.topic.length < 10) {
        console.log('Topic needs to be at least 10 characters long');
        process.exit();
    }
    if (!topics.has(answers.type)) {
        console.log('Topic is not valid!, pick a valid number');
        process.exit();
    }
    if (answers.body.length < 30) {
        console.log('Description needs to be at least 30 characters long');
        process.exit();
    }
}

async function main() {
    answers.topic = await question('Topic, short description: \n');
    answers.type = await question('Type: \n 1 = Feature \n 2 = Bug \n 3 = Refactor/Improvement \n');
    answers.body = await question('Description: \n');
    rl.close();
    validate();

    answers.type = topics.get(answers.type);
    const result = JSON.stringify(answers);
    const fileName = answers.topic.replace(new RegExp(/ /, 'g'), '_');
    fs.writeFile(`../commit-logs/master/${fileName}.json`, result, 'utf8', err => {
        if (err) console.log('Something went wrong');
        console.log('Commit saved');
    });
}

main();
