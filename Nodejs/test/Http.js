var http = require('http')

var server = http.createServer()
server.on('request', function(){
	console.log('Receive client request.')
})
server.listen(3000, function(){
	console.log('Server startup successfully')
})
