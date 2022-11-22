const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const memImg = document.getElementById("memory-img");
const levelStats = document.getElementById("level-stats");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const level = document.getElementById("level");
const easy  = document.getElementById("easy");
const medium = document.getElementById("medium");
const difficult = document.getElementById("difficult");
const impossible = document.getElementById("impossible");
const levelContainer = document.getElementById("level-container");
const wrapper = document.querySelector(".wrapper");
const about =document.getElementById("about");
const exit = document.getElementById("exit");
const play = document.getElementById("play");
const menu = document.getElementById("menu");
const aboutContainer =document.getElementById("about-container");
const back = document.getElementById("back");
const music = document.getElementById("music");
const musicValue = document.getElementById("music-value");
const backgroundSound = new Audio("./audio/background.mp3");
const clickSound = new Audio("./audio/click.wav");
const rightSound = new Audio("./audio/right.wav");
const wrongSound = new Audio("./audio/wrong.mp3");


let cards;
let interval;
let firstCard = false;
let secondCard = false;

function playbeep(){ 
    clickSound.play();

}


//Items array
const items = [
  { name: "apple", image: "apple.png" },
  { name: "car", image: "car.png" },
  { name: "cat", image: "cat.png" },
  { name: "dog", image: "dog.png" },
  { name: "lion", image: "lion.png" },
  { name: "mango", image: "mango.png" },
  { name: "monkey", image: "monkey.png" },
  { name: "teddy-bear", image: "teddy-bear.png" },
  { name: "pizza", image: "pizza.png" },
  { name: "home", image: "home.png" },
  { name: "burger", image: "burger.png" },
  { name: "banana", image: "banana.png" }
];
//Initial size
let row = 4,col = 4;
//Initial Time
let seconds = 0,
  minutes = 0,
  str = "00:00";
//Initial moves and win count
let movesCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
  str = `${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (row,col) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (row * col) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues,row,col) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < row * col; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}" onclick="playbeep()">
        <div class="card-before"></div>
        <div class="card-after">
        <img src="./img/${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${col},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if(!card.classList.contains("flipped")){
          if (!card.classList.contains("matched")) {
              //flip the cliked card
              card.classList.add("flipped");
              //if it is the firstcard (!firstCard since firstCard is initially false)
              if (!firstCard) {
                //so current card will become firstCard
                firstCard = card;
                //current cards value becomes firstCardValue
                firstCardValue = card.getAttribute("data-card-value");
              } else{
                    //increment moves since user selected second card
                    movesCounter();
                    //secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                          //if both cards match add matched class so these cards would beignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        rightSound.play();
                        //set firstCard to false since next card would be first now
                        firstCard = false;
                        //winCount increment as user found a correct match
                        let win=0;
                        cards.forEach((crds)=>{
                            if(crds.classList.contains("matched")){
                                win=win+1;
                            }
                        })
                        if (win == cardValues.length) {
                            startButton.classList.add("hide");
                            memImg.classList.add("hide");
                            about.classList.add("hide");
                            music.classList.add("hide");
                            level.classList.add("hide");
                            play.classList.remove("hide");
                            menu.classList.remove("hide");
                            result.innerHTML = `<h2> You Win </h2>
                                              <h3>Moves: ${movesCount}</h3>
                                              <h3>Time Taken: ${str}</h3>`;
                            controls.classList.remove("hide");
                            stopButton.classList.add("hide");
                            clearInterval(interval);
                        }
                      }  
                      else if((levelContainer.getAttribute("value")=="Easy")||(levelContainer.getAttribute("value")=="Medium")){
                          //if the cards dont match
                          //flip the cards back to normal
                          console.log(levelContainer.getAttribute("value"));
                          let [tempFirst, tempSecond] = [firstCard, secondCard];
                          firstCard = false;
                          secondCard = false;
                          setTimeout(()=>{
                              tempFirst.classList.add("shake");
                              tempSecond.classList.add("shake");
                              wrongSound.play();
                          },300)
                          let delay = setTimeout(() => {
                              tempFirst.classList.remove("flipped");
                              tempSecond.classList.remove("flipped");
                              tempFirst.classList.remove("shake");
                              tempSecond.classList.remove("shake");
                          }, 600);
                      }
                      else{
                          firstCard = false;
                          secondCard = false;
                          setTimeout(()=>{
                            cards.forEach((crd)=>{
                              if(crd.classList.contains("flipped")){
                                  crd.classList.add("shake");
                                  wrongSound.play();
                              }
                              crd.classList.remove("matched");
                            })
                          },300)
                          let delay = setTimeout(()=>{
                              cards.forEach((crd)=>{
                                  crd.classList.remove("flipped");
                                  crd.classList.remove("shake");
                              })
                          },600);
                      }
                      
                }
            }
        }
     });
  });
};

//Start game
startButton.addEventListener("click",startGame= () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  levelStats.innerText=`LEVEL: ${levelContainer.getAttribute("value")}`;
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  let cardValues = generateRandom(row,col);
  console.log(cardValues);
  matrixGenerator(cardValues,row,col);
};

//Stop game
stopButton.addEventListener("click",(stopGame = () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
})
);

//About us
about.addEventListener("click",()=>{
    controls.classList.add("hide");
    aboutContainer.classList.remove("hide");
    wrapper.classList.add("hide");
      back.addEventListener("click",()=>{
        controls.classList.remove("hide");
        aboutContainer.classList.add("hide");
        wrapper.classList.remove("hide");
      })
})

//music
music.addEventListener("click",()=>{
    if(musicValue.getAttribute("value")=="OFF"){
        musicValue.setAttribute("value","ON");
        musicValue.innerText="ON";
        backgroundSound.play();
        backgroundSound.loop = true ; 
        backgroundSound.volume=0.4;
    }
    else{
      musicValue.setAttribute("value","OFF");
      backgroundSound.pause();
      musicValue.innerText="OFF";
    }
})

//exit
exit.addEventListener("click",()=>{
    if(confirm("Are you sure that? You want to exit the game")){
        window.close();
    }
})

//play again
play.addEventListener("click",()=>{
    startButton.classList.remove("hide");
    memImg.classList.remove("hide");
    about.classList.remove("hide");
    music.classList.remove("hide");
    level.classList.remove("hide");
    play.classList.add("hide");
    menu.classList.add("hide");
    startGame();
})

//menu
menu.addEventListener("click",()=>{
    result.innerHTML="";
    startButton.classList.remove("hide");
    memImg.classList.remove("hide");
    about.classList.remove("hide");
    music.classList.remove("hide");
    level.classList.remove("hide");
    play.classList.add("hide");
    menu.classList.add("hide");
})



//resposive for mobile
var mq = window.matchMedia( "(max-width: 500px)" );
if (mq.matches) {
  // window width is at less than 500px
    //select level
    level.addEventListener("click",()=>{
      controls.classList.add("hide");
      levelContainer.classList.remove("hide");
      wrapper.classList.add("hide");

      easy.addEventListener("click",()=>{
        row=4;
        col=4;
        controls.classList.remove("hide");
        levelContainer.classList.add("hide");
        wrapper.classList.remove("hide");
        wrapper.style.width="27em";
        level.innerHTML=`Level: <span id="level-value">Easy</span>`;
        levelContainer.setAttribute("value","Easy");
        levelStats.style.left = "-12.7em";
      })

      medium.addEventListener("click",()=>{
        row=6;
        col=4;
        controls.classList.remove("hide");
        levelContainer.classList.add("hide");
        wrapper.classList.remove("hide");
        wrapper.style.width="27em";
        level.innerHTML=`Level: <span id="level-value">Medium</span>`;
        levelContainer.setAttribute("value","Medium");
        levelStats.style.left = "-11.5em";
      })

      difficult.addEventListener("click",()=>{
        row=4;
        col=4;
        controls.classList.remove("hide");
        levelContainer.classList.add("hide");
        wrapper.classList.remove("hide");
        wrapper.style.width="27em";
        level.innerHTML=`Level: <span id="level-value">Difficult</span>`;
        levelContainer.setAttribute("value","Difficult");
        levelStats.style.left = "-11.2em";
      })
      
      impossible.addEventListener("click",()=>{
        row=6;
        col=4;
        controls.classList.remove("hide");
        levelContainer.classList.add("hide");
        wrapper.classList.remove("hide");
        wrapper.style.width="27em";
        level.innerHTML=`Level: <span id="level-value">Impossible</span>`;
        levelContainer.setAttribute("value","Impossible");
        levelStats.style.left = "-10.5em";
      })
    })
}
else{
      //select level
      level.addEventListener("click",()=>{
        controls.classList.add("hide");
        levelContainer.classList.remove("hide");
        wrapper.classList.add("hide");
  
        easy.addEventListener("click",()=>{
          row=4;
          col=4;
          controls.classList.remove("hide");
          levelContainer.classList.add("hide");
          wrapper.classList.remove("hide");
          wrapper.style.width="27em";
          level.innerHTML=`Level: <span id="level-value">Easy</span>`;
          levelContainer.setAttribute("value","Easy");
          levelStats.style.left = "-12.7em";
        })
  
        medium.addEventListener("click",()=>{
          row=4;
          col=6;
          controls.classList.remove("hide");
          levelContainer.classList.add("hide");
          wrapper.classList.remove("hide");
          wrapper.style.width="40em";
          level.innerHTML=`Level: <span id="level-value">Medium</span>`;
          levelContainer.setAttribute("value","Medium");
          levelStats.style.left = "-21.5em";
        })
  
        difficult.addEventListener("click",()=>{
          row=4;
          col=4;
          controls.classList.remove("hide");
          levelContainer.classList.add("hide");
          wrapper.classList.remove("hide");
          wrapper.style.width="27em";
          level.innerHTML=`Level: <span id="level-value">Difficult</span>`;
          levelContainer.setAttribute("value","Difficult");
          levelStats.style.left = "-11.3em";
        })
        
        impossible.addEventListener("click",()=>{
          row=4;
          col=6;
          controls.classList.remove("hide");
          levelContainer.classList.add("hide");
          wrapper.classList.remove("hide");
          wrapper.style.width="40em";
          level.innerHTML=`Level: <span id="level-value">Impossible</span>`;
          levelContainer.setAttribute("value","Impossible");
          levelStats.style.left = "-20em";
        })
      })
}