const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// load images
const images = {};
images.player = new Image();
images.player.src = 'https://i.ibb.co/Ybk7y06/character.png';
const characterActions = ['up', 'top right', 'right', 'down right', 'down'];
const numberOfCharacters = 1;
const characters = [];

let charId = new Date().getTime();

const charIdStr = localStorage.getItem("char_id");
if (charId == null) {
    localStorage.setItem("char_id", charId.toString());
} else {
    charId = Number(charIdStr);
}


// Use WebSocket transport endpoint.
const centrifuge = new Centrifuge('wss://socket.superrich.kaileak.com/connection/websocket', {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMDAxIn0.c1_mzBOchMPIBCXeY1m8cuPKaqhAAhG16eIpGKFKrBM"
});

// Allocate Subscription to a channel.
const sub = centrifuge.newSubscription('gossip:game', {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiZ29zc2lwOmdhbWUiLCJzdWIiOiJ1c2VyMDAxIn0.rFbCOLHug1JBczK4OHCYRohzq63cb9p3G9IHfV9zmVo"
});

// React on `news` channel real-time publications.
sub.on('publication', function(ctx) {
    console.log(ctx.data);
    if (characters.length > 0) {
        let foundChar = false;
        for (var i = 0; i < characters.length; i++) {
            if (characters[i].getCharId() == ctx.data.char_id) {
                characters[i].setX(ctx.data.x);
                characters[i].setY(ctx.data.y);
                characters[i].setDestX(ctx.data.dest_x);
                characters[i].setDestY(ctx.data.dest_y);
                foundChar = true;
            }
        }
        if (!foundChar) {
            const newChar = new Character(ctx.data.char_id);
            newChar.setX(ctx.data.x);
            newChar.setY(ctx.data.y);
            newChar.setDestX(ctx.data.dest_x);
            newChar.setDestY(ctx.data.dest_y);
            characters.push(newChar);
        }
        
    }
});

// Trigger subscribe process.
sub.subscribe();

// Trigger actual connection establishement.
centrifuge.on('connected', function(ctx) {
    // now client connected to Centrifugo and authenticated.
    console.log("connected " + ctx);
}).connect();

centrifuge.on('disconnected', function(ctx) {
    // do whatever you need in case of disconnect from server
    console.log("disconnected");
});

class Character {
    constructor(charId){
        this.charId = charId;
        this.width = 40;
        this.height = 43.875;
        this.frameX = 3;
        this.x = Math.random() * canvas.width - this.width;
        this.y = Math.random() * canvas.height - this.height;
        this.speed = 4 ; //(Math.random() * 2) + 3;
        this.minFrame = 0;
        this.destX = this.x;
        this.destY = this.y;
        this.action = characterActions[Math.floor(Math.random() * characterActions.length)];
        if (this.action === 'up') {
            this.frameY = 0; 
            this.minFrame = 4;
            this.maxFrame = 15;
        }
        else if (this.action === 'top right') {
            this.frameY = 1; 
            this.minFrame = 4;
            this.maxFrame = 14;
        }
        else if (this.action === 'right') {
            this.frameY = 3; 
            this.minFrame = 3;
            this.maxFrame = 13;
        }
        else if (this.action === 'down right') {
            this.frameY = 4;
            this.minFrame = 4;
            this.maxFrame = 15;
        } 
        else if (this.action === 'down') {
            this.minFrame = 0;
            this.frameY = 6;
            this.maxFrame = 12;
        }
        else if (this.action === 'jump') {
            this.minFrame = 0;
            this.frameY = 7; 
            this.maxFrame = 9;
        }

    }
    draw(){
        drawSprite(images.player, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width * 1.5, this.height * 1.5);
        
        if (this.x != this.destX && this.y != this.destY) {
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }
        
    }
    update(){
        if (this.action === 'up') {
            if (this.y < 0 - (this.height * 5)) {
                 this.y = canvas.height + this.height;
                 this.x = Math.random() * canvas.width;
                 this.speed = (Math.random() * 2) + 3;
             } else {
                 this.y -= this.speed;  
             }
         }
         else if (this.action === 'top right') {
             if (this.y < 0 - this.height && this.x > canvas.width + this.width) {
                 this.y = canvas.height + this.height
                 this.x = Math.random() * canvas.width;
                 this.speed = (Math.random() * 2) + 3;
             } else {
                 this.y -= this.speed; 
                 this.x += this.speed; 
             }
         }
         else if (this.action === 'right') {
             if (this.x > canvas.width + (this.width * 5)) {
                 this.x = 0 - this.width;
                 this.y = Math.random() * canvas.height; 
                 this.speed = (Math.random() * 2) + 3;
             } else {
                 this.x += this.speed; 
             }
         }
         else if (this.action === 'down right') {
             if (this.y > canvas.height + this.height && this.x > canvas.width + this.width) {
                 this.y = 0 - this.height
                 this.x = Math.random() * canvas.width;
                 this.speed = (Math.random() * 2) + 3;
             } else {
                 this.y += this.speed; 
                 this.x += this.speed; 
             }
         } 
         else if (this.action === 'down') {
             if (this.y > canvas.height + (this.height * 5)) {
                 this.y = 0 - this.height;
                 this.x = Math.random() * canvas.width;
                 this.speed = (Math.random() * 2) + 3;
             } else {
                 this.y += this.speed;  
             }
         }
         else if (this.action === 'jump') {
 
         }
    }

    move() {
        this.x = (this.x < this.destX) ? this.x + this.speed : 
                (this.x > this.destX) ? this.x - this.speed : this.x;
        this.y = (this.y < this.destY) ? this.y + this.speed :
                (this.y > this.destY) ? this.y - this.speed : this.y;
        
    }


    setDestX(x) {
        this.destX = x;
    }

    setDestY(y) {
        this.destY = y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getCharId() {
        return this.charId;
    }
}

const ownCharacter = new Character(charId);
characters.push(ownCharacter);
// for (i = 0; i < numberOfCharacters; i++){
//     characters.push(new Character());
// }



function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    
    for (i = 0; i < characters.length; i++ ){
        characters[i].draw();
        // characters[i].update();
        characters[i].move();
    }
    

}

window.onload = function() {
    setInterval(animate, 1000/20);

    // initial character
    sub.publish({
        "char_id": charId,
        "dest_x": ownCharacter.getX(),
        "dest_y": ownCharacter.getY(),
        "x": ownCharacter.getX(),
        "y": ownCharacter.getY()
    });

    canvas.addEventListener("click", function(evt) {
        // characters[0].setX(evt.clientX);
        // characters[0].setY(evt.clientY);
        sub.publish({
            "char_id": charId,
            "dest_x": evt.clientX,
            "dest_y": evt.clientY,
            "x": ownCharacter.getX(),
            "y": ownCharacter.getY()
        });
    });
};

window.addEventListener('resize', function(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})