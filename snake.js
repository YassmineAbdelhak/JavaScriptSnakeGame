//parametres
var snakeX = 2;
var snakeY = 2;
var height = 28;
var width = 50;
var interval = 100;
var increment = 4; 
//bg music
function bgm(){
    var m=new Audio;
    m.src='sm.mp3';
    m.play();
    m.volume=1;
}
//les variables de jeu
var length = 0;
var tailX = [snakeX];
var tailY = [snakeY];
var fX;
var fY;
var running = false;
var gameOver = false;
var direction = -1; 
// haut = 0, bas = -1, gauche = 1, droite = 2
var int; 
var score = 0;

// direction temporaire (cela permet aux utilisateurs d'appuyer trop rapidement sur les touches et de se transformer en eux-mêmes)
var tempdir = direction;


function run(){
    init();
    int =setInterval(gameLoop, interval); // setinterval exécute une boucle de jeu à chaque intervalle
}
function init(){
    createMap();
    createSnake();
    createFruit();
}
//c'est pour dessiner le map de jeu 
function createMap(){
    document.write("<table>");
    for( var y = 0; y < height; y++){
        document.write("<tr>");
        for( var x = 0; x < width; x++){
            if(x == 0 || x == width -1 || y == 0 || y == height -1){ 
                document.write("<td class='wall' id='"+ x + "-" + y +"'></td>");//"-" c'est le carreau qu'on le dessine
            }else{
                document.write("<td class='blank' id='"+ x + "-" + y +"'></td>");
            }
        }
        document.write("</tr>");
    }
    document.write("</table>");
}

function createSnake(){
     set(snakeX, snakeY, "snake")

}
function get(x,y){
    return document.getElementById(x+"-"+y); //dessine le corps de serpent
}
 
function set(x,y,value){ 
    if(x != null && y != null) 
        get(x,y).setAttribute("class", value); 
} 

function rand(min,max){
    return Math.floor(Math.random() * (max-min) + min);
}
function getType(x,y){
    return get(x,y).getAttribute("class");//si serpant a manger le fruit
}
function createFruit(){
    var found = false;
    while(!found && (length < (width-2)*(height-2)+1)){
        var fruitX = rand(1,width-1); 
        var fruitY = rand(1,height-1);
        if(getType(fruitX, fruitY) == "blank")
        found = true;
    }
    set(fruitX, fruitY, "fruit");
    fX = fruitX;
    fY = fruitY;
}
window.addEventListener("keypress", function key(event){
   // si la clé est 8 définie vers le haut
    var key = event.keyCode;
    if(direction != -1 && key == 56)
         tempdir = 0;
        // si la clé est 2 définie vers le bas
        else if(direction != 0 && key == 50)
              tempdir = -1;
        //// si la clé est 4 définie vers la gauche
               else if(direction != 2 && key == 52)
             tempdir = 1;
        //// si la clé est 2 définie vers la droite
        else if (direction != 1 && key == 54)
                tempdir = 2;
        if(!running)
               running = true;
        else if(key == 32)
               running = false; 

});
function gameLoop(){ 
    if(running && !gameOver){ 
        update(); 
    }else if(gameOver){ 
        clearInterval(int);
    }
}

function update(){
    bgm();
    direction = tempdir;
    
// empêche les fruits de ne pas apparaître
    set(fX, fY, "fruit");
    
// met à jour la queue
    updateTail();
    
// met le dernier segment de la queue à blanc avant de déplacer le serpent
    set(tailX[length], tailY[length], "blank"); 
    
// met à jour la position du serpent en fonction de la direction
    if(direction == 0)
         snakeY--;
    else if(direction == -1)
         snakeY++;
    else if(direction == 1)
         snakeX--;
    else if(direction == 2)
         snakeX++;
         // dessine la tête du serpent 
    set(snakeX, snakeY, "snake");
    //vérifie les collisions avec soi-même
    for(var i = tailX.length-1; i>=0; i--){ 
        if(snakeX == tailX[i] && snakeY == tailY[i]){
            gameOver = true;
            break;
        }
    }
   // vérifie la collision avec le mur
    if(snakeX == 0 || snakeX == width-1 || snakeY == 0 || snakeY == height-1)
           gameOver = true;
    
   // vérifie la collision avec les fruits      
    else if(snakeX == fX && snakeY == fY){
        
// ajoute 4 au score
       score+=4;
       
// crée un nouveau fruit, qui remplace automatiquement l'ancien              
       createFruit();
       
// ajoute l'incrément de jeu à la longueur du serpent qui le rend plus long
       length+=increment;
    }
    //set
    document.getElementById("score").innerHTML = "score: "+ score;
}
function updateTail(){
    for(var i = length; i > 0; i--){
        tailX[i] = tailX[i-1];
        tailY[i] = tailY[i-1];
    }
    tailX[0] = snakeX;
    tailY[0] = snakeY;
}
run();