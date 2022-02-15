var fs = require('fs')
fs.readFile('../data/ReadFile.txt', function(error, data){
    console.log(data.toString())
})