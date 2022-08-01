
var balls = [];
var ballMap = {};

module.exports.balls = balls;
module.exports.ballMap = ballMap;

const startX = 1024/2;
const startY = 768/2;

class PlayerBall{
  constructor(socket){
      this.socket = socket;
      this.x = startX;
      this.y = startY;
      this.color = getcolor();
      console.log('ball color : ' + this.color);

  }

  get id() {
      return this.socket.id;
  }
}

function joinGame(socket){
  let find_it = balls.filter((x)=> x.id == socket.id );
  if( find_it == false)
  {
    let ball = new PlayerBall(socket);

    balls.push(ball);
    ballMap[socket.id] = ball;

    return ball;
  }
  return find_it;
}

function endGame(socket){
  for( var i = 0 ; i < balls.length; i++){
      if(balls[i].id == socket.id){
          balls.splice(i,1);
          break
      }
  }
  delete ballMap[socket.id];
}

module.exports.cjoinGame =joinGame;
module.exports.cendGame = endGame;


function getcolor()
{
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

module.exports.PlayerBall = PlayerBall ; 


class Person {
  constructor(first,last,age,gender,interrests)
  {
    this.name ={
      first,last
    };
    this.age= age;
    this.gender= gender;
    this.interrests =interrests;
    
  }
  greeting(){
    console.log(`Hi! I'm ${this.name.first}`);
  }
  farewell() {
    console.log(`${this.name.first} has left the building. Bye for now!`);
  };
}


  class Teacher extends Person {
    constructor(first, last, age, gender, interests, subject, grade) {
      super(first, last, age, gender, interests);    //super키워드를 통해 상위 클래스의 멤버를 상속 받음
  
      // subject and grade are specific to Teacher    // Teacher에서 추가된 멤버
      this.subject = subject;
      this.grade = grade;

      
    }
  }

  module.exports.Teacher = Teacher ; 

