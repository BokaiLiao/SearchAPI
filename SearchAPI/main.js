const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs')

const app = express();
const port = 3001;

let website = "";
let s = "";
let dataArr = [];
let resultArr = [];


//WebCrawler use only
let link = "";
let max = 0;
let robotLink = "";
let pastLinks = [];
let disallows = [];
let links = [];
let status = 0;
let counter = 0;
let loc = 0;


app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.post('/data', (req, res) => {
    const data = req.body;

    console.log(data);
    website = data.key;
    s = data.s;
    max = parseInt(data.max);
    set(website).then(function (x) {
        let temp = []
        console.log(links)
        for (const element of links) {
            createDict(element, s).then(function (x) {
                temp.push(x);
                console.log(x)
                if(temp.length == max){
                    yo(temp)
                }
                dataArr.push(x);
            })
        }
        });

    //dataArr.push(data);

    res.send('Data is added to the database');
});



app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));



//WebScorer
async function scoreRemote(url, keyPhrase){
    let score = 0;
    let resp = await axios.get(url);
    let $ = cheerio.load(resp.data);

    $('title').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 10
        }
    });
    $('a').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 2
        }
    });
    $('b').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 2
        }
    });
    $('strong').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 2
        }
    });
    $('i').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 2
        }
    });
    $('em').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 2
        }
    });
    $('h1').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 5
        }
    });
    $('h2').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 4
        }
    });
    $('h3').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 3
        }
    });
    $('h4').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 3
        }
    });
    $('h5').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 3
        }
    });
    $('p').each((_, e) => {
        let row  = $(e).text()
        if(row.includes(keyPhrase)){
            score += 1
        }
    });
    return score;
}


//WebCrawler
async function set(url){
    link = url;
    robotLink = link.substring(0, link.indexOf('/', link.indexOf('/') + 2)) + '/robots.txt'
    
    await parseWebsite(link)
}

async function parseWebsite(link){

    pastLinks.push(link)

    try{
        let resp = await axios.get(link);
        let $ = cheerio.load(resp.data);
        let a = $('a');
        await disallow(robotLink);

        for (const link of a) {
            if(loc < max){
                let row = link.attribs.href;
                if (row != null && row.includes('https:')) {
                    const stat = async function (a) {
                        status = await getStatus(row);
                        if (!isNaN(status)) {
                            if ((status - 200) >= 0 && (status - 200) <= 99) {
                                for (const element of disallows) {
                                    if (!row.includes(element)) {
                                        if (!links.includes(row)) {
                                            console.log(row);
                                            links.push(row);
                                            loc++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    await stat();
                }
            }
            else{
                break;
            }
        }

        await hm();
    }
    catch(error){
        process.stdout.write("")
    }


}

async function getStatus(link){
    try{
        const req = await fetch(link);
        return req.status;
    } catch(error){
        process.stdout.write("");
    }
}

async function disallow(rob){
    try {
        let resp = await axios.get(rob);
        let $ = cheerio.load(resp.data);
        let bot = $.html()

        let splitter = bot.split('Disallow: ');
        for (let i = 1; i < splitter.length; i++) {
            if (!splitter[i].includes('Allow: ')) {
                if(i == splitter.length - 1){
                    disallows.push(splitter[i].substring(0, splitter[i].indexOf('<')));
                }
                else{
                    disallows.push(splitter[i]);
                } 
            }
        }
    }
    catch (error) {
        process.stdout.write("");
    }

}

async function hm(){
    if(links.length > max){
        let len = links.length
        for(let i = 0; i < (len - max); i++){
            links.splice(-1);
        }
    }
    else if(links.length < max){
        while(pastLinks.includes(links[counter]) || links[counter].includes("premium") || links[counter].includes("infographic") || links[counter].includes("corporate") || links[counter] == null || links[counter].includes("busysub")){
            counter++;
        }
        link = links[counter];
        await parseWebsite(links[counter]);
    }
    
}

//extra methods
async function getTitle(title){
    try{
        let resp = await axios.get(title);
        let $ = cheerio.load(resp.data);
        return $('title').text();
    }
    catch (error){
        process.stdout.write("");
    }
}

async function createDict(e, keyPhrase){
    const date = new Date()
    let day = date.getDate();
    if(day < 10){
        day = day.toString().padStart(2, '0');
    }
    let month = date.getMonth() + 1;
    if(month < 10){
        month = month.toString().padStart(2, '0')
    }
    let year = date.getFullYear();
    let hour = date.getHours();
    if(hour < 10){
        hour = hour.toString().padStart(2, '0');
    }
    let minute = date.getMinutes();
    if(minute < 10){
        minute = minute.toString().padStart(2, '0')
    }
    let second = date.getSeconds();
    if(second < 10){
        second = second.toString().padStart(2, '0')
    }

    let currentDate = `${year}-${month}-${day}  ${hour}:${minute}:${second}`;
    
    let dat = {}
    dat["url"] = e;
    dat["title"] = await getTitle(e);
    dat["score"] = await scoreRemote(e, keyPhrase);
    dat["value"] = s;
    dat["date"] = currentDate
    resultArr.push(dat);
    return dat;
}

async function yo(x){
    let dict = {};
    dict["maximum"] = max;
    dict["keyword"] = s;
    dict["results"] = x;
    fs.writeFile('data.json', JSON.stringify(dict), function(err){
        if(err) throw err;
    });
    app.get('/data', (req, res) => {
        res.json(dataArr);
    });
}