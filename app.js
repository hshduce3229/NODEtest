const http  = require('http').createServer(SeverInit);
const io    = require('socket.io')(http);
const fs    = require('fs');
const redis = require('redis');

const fendGame = require('./util.js').cendGame;
const fjoinGame = require('./util.js').cjoinGame;
var balls   = require('./util.js').balls;
var ballMap = require('./util.js').ballMap;
var Teacher = require('./util.js').Teacher;

//test program port
const port_redis = 6379;
const redisHost = '0.0.0.0';
const redis_client = redis.createClient(port_redis , redisHost);

function logger(req, res, next) 
{
  console.log('hellows ');
  next();
}


async function run( name_ , age_ , local_ , email_ ) 
{

  if(!redis_client.isOpen)
  {
    await redis_client.connect();
  }
  console.log('redisHost =' + redisHost + ':' + port_redis.toString() +' : '+  redis_client.isOpen); // this is true

  var room={
    name:name_, 
    age:age_,
    local:local_,
    email:email_
  };

  await redis_client.hSet(name_,room )
  //await redis_client.disconnect();
}
  

http.listen(3000, function(){ // http 서버가 포트 3000에서 수신 대기
  console.log('listening on *:3000');
});

function SeverInit (req, res) 
{

  let snape = new Teacher('Severus', 'Snape', 58, 'male', ['Potions'], 'Dark arts', 5);
  snape.greeting(); // Hi! I'm Severus.
  snape.farewell(); // Severus has left the building. Bye for now.
  
  snape.age // 58
  snape.subject; // Dark arts


  run('hongsh',11 ,'na' , 'hshduce222@ggdf' );

  if (req.url =='/' )
  {
    fs.readFile(__dirname + '/index.html', function( err, data) {
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
      
    });
  }
  else if (req.url =='/game' )
  {
    fs.readFile(__dirname + '/game/game2.html', function( err, data) {
        if(err){
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
  }
  else if ( req.url.toString().includes( '/picture' ))
  {
    var filename = __dirname + req.url;
    var ret = fs.existsSync( filename);
    console.log('file exist...:'+  filename +" "+ ret);

    if(ret)
    {
      fs.readFile(  filename, function(err, data)
      {
        console.log('picture loading...'+ filename);
        res.writeHead(200);
        res.write(data);
        res.end();    
      });
    }
  }
}


io.on('connection', function(socket)
{
  // 메세지 받기
  console.log(`${socket.id}님이 채팅방에 입장하셨습니다.`);
  
  redis_client.lRange('list', 0, 5,
    function(err,item)
    {
      io.emit('chat game', item);
    }
  );
  socket.on('chat game', function(msg)
  {
     redis_client.lPush('list', msg );

    console.log('message game: ' + msg);
	  io.emit('chat game', msg);
  });
});

io.on('connection', function(socket) 
{
  socket.on('disconnect', function(reason)
  {
      console.log(`${socket.id}님이 ${reason}의 이유로 퇴장하셨습니다. `)
      fendGame(socket);
      socket.broadcast.emit('leave_user', socket.id);
  });

  socket.on('send_location', function(data) 
  {
    
    console.log(`${socket.id}님이 update_state ` +' x : '+ data.x.toString()  +  ' y : ' + data.y .toString())
          socket.broadcast.emit('update_state', {
              id: data.id,
              x: data.x,
              y: data.y,
          })
  })

  console.log(`${socket.id}님이 입장하셨습니다.`);
  fjoinGame(socket);
  socket.emit('user_id', socket.id);

  for (var i = 0 ; i < balls.length; i++){
      let ball = balls[i];
      io.emit('join_user', {
          id: ball.id,
          x: ball.x,
          y: ball.y,
          color: ball.color,
      });
  }
})