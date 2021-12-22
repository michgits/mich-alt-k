const express = require('express');
const app = express();
const port = 3000;

const appendjson = require('appendjson');
const fs = require('fs');

var urlJSON = fs.readFileSync('urls.json', 'utf-8')
var urls = JSON.parse(urlJSON)

app.get('/*', (req, res) => {
  if (req.params[0] == "create") {
    create(req,res)
  } else if (req.params[0] == "api/getLink" && req.query.id) {
    res.setHeader('content-type', 'text/plain');
    if (checkId(req.query.id) === false) {
      res.setStatus(400)
      res.send("Invalid ID")
    } else {
      res.send(JSON.parse(fs.readFileSync('urls.json'))[req.query.id])
    }
  } else if (req.params[0] == "api/createLink" && req.query.url) {
    if (req.query.url) {
      if (validURL(req.query.url)) {
        var id = makeID(10);
        appendjson(JSON.parse(`{ "${id}": "${req.query.url}" }`), 'urls.json', function() {})
        res.send('https://mich.gq/' + id)
        urlJSON = fs.readFileSync('urls.json', 'utf-8')
        urls = JSON.parse(urlJSON)
      } else {
        res.setStatus(400)
      }
    } else {
      res.setStatus(400)
    }
  } else if (req.params[0]) {
    if (checkId(req.params[0]) === false) {
      res.send(fs.readFileSync('index.html', 'utf-8').replace(`<input type="url" name="url"><br>`, 'Invalid ID').replace(`<button>Shorten!</button>`, '').replace('<ex></ex>', `
      <meta property="og:title" content="⌥ + K">
  <meta property="og:description" content="Invalid URL">
  <meta property="og:image" content="https://i.imgur.com/slTUfRB.png">
  <meta name="theme-color" content="#4169e1">
  
  <meta property="twitter:card" content="summary">
  <meta property="twitter:title" content="⌥ + K">
  <meta property="twitter:image" content="https://i.imgur.com/slTUfRB.png">
  <meta property="twitter:description" content="Invalid URL">
      `))
    } else {
      var url = JSON.parse(fs.readFileSync('urls.json', 'utf-8'))[req.params[0]];
      res.send(
        fs.readFileSync('meta.html', 'utf-8')
        .replaceAll('meta_desc', url)
        .replaceAll('redirect_url', url))
    }
  } else {
    res.send(fs.readFileSync('index.html', 'utf-8').replace('<ex></ex>', `
      <meta property="og:title" content="sus">
  <meta property="og:description" content="link = short">
  <meta property="og:image" content="https://i.imgur.com/slTUfRB.png">
  <meta name="theme-color" content="#4169e1">
  
  <meta property="twitter:card" content="summary">
  <meta property="twitter:title" content="sus">
  <meta property="twitter:image" content="https://i.imgur.com/slTUfRB.png">
  <meta property="twitter:description" content="link = short">
      `))
  }
})

app.listen(port);

function makeID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function create(req, res) {
  if (req.query.url) {
    if (validURL(req.query.url)) {
      var id = makeID(10);
    appendjson(JSON.parse(`{ "${id}": "${req.query.url}" }`), 'urls.json', function() {})
    res.send(fs.readFileSync('index.html', 'utf-8').replace(`<input type="url" name="url"><br>`, '<a href="' + 'https://mich.gq/' + id + '">' + 'https://mich.gq/' + id + '</a>').replace(`<button>Shorten!</button>`, ''))
    urlJSON = fs.readFileSync('urls.json', 'utf-8')
    urls = JSON.parse(urlJSON)
    } else {
      res.send(fs.readFileSync('index.html', 'utf-8').replace(`<input type="url" name="url"><br>`, 'Invalid ID').replace(`<button>Shorten!</button>`, ''))
    }
  }
}

function checkId(id) {
  if (JSON.parse(fs.readFileSync('urls.json')).hasOwnProperty(id)) {
    return true;
  } else {
    return false;
  }
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}