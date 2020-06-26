//GLOBAL VARIABLES========================================================================
const container=document.querySelector('.container')
const startBtn=document.querySelector('.start')
const audioDiv=document.querySelector('.audio')
const audioTag=document.querySelector('audio')
const bulletSpan=document.querySelector('.bulletCnt span')
const lossBox=document.querySelector('.lossBox')

//MUTABLE VARIABLES========================================================================
let bullets=0
let mainMus=''
let startMus=''
let bossMus=''
let victoryMus=''
let shotSound=''
let bossShotSound=''
let bossScreech=''
let barker=''
let amountKarens=0
let karens=[]
let karenRate=0
let widthLim=0
let priceFail=''

//TIMERS=========================================================================================
let time=0
let timeCnt=0
let minutes=0
let seconds=0

function timerOff(time){
    clearInterval(time)
    minutes=Math.floor(timeCnt/60)
    seconds=timeCnt%60;
    if(seconds<10)seconds='0'+seconds;
}

//AUDIO AND DIFFICULTY===========================================================================
//function to reset innerHTML of audio
let vol= (file) =>{
    audioDiv.innerHTML=`<audio controls loop autoplay>  
                        <source src="${file}" type="audio/mpeg">
                        </audio>`
    document.querySelector('audio').volume=0.3;
}
//asks user if they would like to mute
if(confirm("This game contains music and sounds. Press cancel to mute.")){
    mainMus='/profile/Karen/assets/sounds/menuScreen2.mp3'
    startMus='/profile/Karen/assets/sounds/zomWave.mp3'
    bossMus='/profile/Karen/assets/sounds/finalBoss.mp3'
    victoryMus='/profile/Karen/assets/sounds/victory.mp3'
    shotSound='/profile/Karen/assets/sounds/shot.mp3'
    bossShotSound='/profile/Karen/assets/sounds/bossHit.mp3'
    bossScreech='/profile/Karen/assets/sounds/screech.mp3'
    barker='/profile/Karen/assets/sounds/bobBarker.mp3'
    priceFail='/profile/Karen/assets/sounds/priceRightFail.mp3'
}


vol(mainMus)
startBtn.onclick = () =>{
    setDif()
    document.querySelector('button').disabled=true
    document.querySelector('select').disabled=true
    let time=setInterval(() => { 
        timeCnt++
    }, 1000);
    populateKarens()
    animate()
    vol(startMus)
    container.addEventListener('click',mouseListen)
} 

function setDif(){
    let mySelect=document.querySelector('#difficulty')
    let dif=mySelect.options[mySelect.selectedIndex].value; 
    switch(dif){
        case '1':
            karenRate=1500
            amountKarens=10
            bossKaren.hp=17
            bullets=6
            widthLim=110
            break;
        case '2':
            karenRate=900
            amountKarens=20
            bossKaren.hp=27
            bullets=3
            widthLim=50
            break;
        case '3':
            karenRate=500
            amountKarens=30
            bossKaren.hp=35
            widthLim=30
            break;
    }
    bulletSpan.innerHTML=bullets
}
function mouseListen(){
    new Audio(shotSound).play();
    bullets--
    bulletSpan.innerHTML=bullets
    if(bullets<0)return loss()
}

    
//KARENS=======================================================================================
class Karen {
    constructor(x,img,width,y){
        this.y=y, //Same TOP CSS position for all.
        this.x=x //To be determined by random assign. Between 60-517
        this.width=width, 
        this.hp=1, //Hit Points for each Karen
        this.img=img //Image for Karen
    }
}//end Karen class

let bossKaren={
    img: '/profile/Karen/assets/boss.png',
    hp: 0
}//end boss Karen

function populateKarens(){
    //10 Karens...
    for(i=0;i<amountKarens;i++){
        let ranY=Math.floor((Math.random()*420)+10)
        let ranIm='kar'+Math.floor((Math.random()*5)+1)+'.png'
        let ranX=Math.floor((Math.random()*605)+10)
        let ranWidth=Math.floor((Math.random()*40)+widthLim)
        let karen=new Karen(ranX,ranIm,ranWidth,ranY)
        karens.push(karen)
    }
}//end funct

//Function to shoot and eliminate Karens. 
//Counter used to track the dead instead of array methods to maintain properties.
let count=0
function karenShot(element){
    bullets++
    let width=element.width
    // new Audio(shotSound).play();
    //grab number from id and eliminate the 'karen'
    var currKaren = element.id.match(/\d/g).join('');
    karens[currKaren].hp--
    if(karens[currKaren].hp<1)
        return deadKaren(element,width)        
    gsap.to(`#${element.id}`,{ width:(width-35)})
    gsap.to(`#${element.id}`,{ left:(Math.floor((Math.random()*110)+20))})
}//end karen shot


function deadKaren(element,width){
    count++
    element.remove()
    if(count==karens.length) levelChange()
}// end deadKaren

function bossShot(element){
    bullets++
    new Audio(shotSound).play();
    new Audio(bossShotSound).play();
    let karen=document.querySelector('.karenBoss')
    let ranX=Math.floor((Math.random()*510)+80)+'px'
    let ranY=Math.floor((Math.random()*317)+10)+'px'
    karen.style.left=ranX
    karen.style.top=ranY
    bossKaren.hp--
    document.getElementById("lifeCnt").innerHTML=bossKaren.hp
    if(bossKaren.hp<1){ 
        timerOff(time);
        return bossDeath()
    }
}//end bossShot

//ANIMATION GSAP=========================================================================================
//function to set a delay on Zombie Spawn
function delay(i) { 
    setTimeout(function() { 
        container.innerHTML+=`<img src="/profile/Karen/assets/${karens[i].img}" class="karen" id="karen${i}" style="top:${karens[i].y}px;width:${karens[i].width}px; margin-left:${karens[i].x}px;" onclick='karenShot(this)'>`;
        setTimeout(function(){//increases karen width after spawn
            document.querySelector(`#karen${i}`).style.width = (karens[i].width+=80)+'px'
        }, 100)
    }, karenRate * i); 
}//end delay

//Animate starts on start button click.
function animate(){
    for(i=0;i<karens.length;i++){
        delay(i)
    }//end for
}//end animate

//animated level change to boss
function levelChange(){
    container.innerHTML+=`<h3>The park darkens as something approaches..</h3><p id="message">(Go for the eyes)</p>`
    container.innerHTML+=`<div class="karenBoss"><div class="leftEye" onclick='bossShot(this)'></div><div class="rightEye"  onclick='bossShot(this)'></div>"</div>`
    transitionBg()
    bossCount()
}

//function that fills HP meter on screen and delays boss appearance
function bossCount(){
        var tl=gsap.timeline({defaults:{duration: 1}})
        var Cont={val:0} , NewVal = bossKaren.hp ;
        gsap.to('h2',{opacity: 1, duration: 40})
        gsap.to(Cont,1,{delay:20,val:NewVal,roundProps:"val",onUpdate:function(){
            document.getElementById("lifeCnt").innerHTML=Cont.val
        }});

        //Delays the song change until appropriate time
        TweenMax.delayedCall(17,vol,[bossMus])
        if(bossKaren.hp<1) {
            timerOff()   
            return bossDeath()
        }
}

//Function that transitions to final boss
function transitionBg(){
    var tl=gsap.timeline({defaults:{duration: 1}})
    tl.to('.square',{opacity: 1, duration: 5})
      .to('h3',{opacity: 1, duration: 6},"-=2.2")
      .to('p',{opacity: 1, duration: 1},"-=2.2")
      .to(".container",{backgroundImage:'url(/profile/Karen/assets/FinalBossHell.jpg)'})
      .to('h3',{opacity: 0, duration: 5})
      .to('p',{opacity: 0, duration: .5},"-=3")
      .to('audio',{duration:5,volume:0},"-=5.5")
      .to('.square',{opacity: 0, duration: 6},"-=2.2")
      .to('.karenBoss',{opacity: 1, duration: 0.2})
      .to('.karenBoss',{opacity: 0, duration: 0.1})
      .to('.karenBoss',{opacity: 1, duration: 0.2})
      .to('.karenBoss',{opacity: 0, duration: 0.1})
      .to('.karenBoss',{opacity: 1, duration: 0.2});
}//end transitionBg

function bossDeath(){
    let tl= new TimelineMax()
    container.innerHTML+=`<img src='/profile/Karen/assets/thumbUp.png' id="arnold">`
    document.querySelector('.victoryMessage').innerHTML=`<h4>CONGRATULATIONS</h4><hr><span id="victory">Arnold thanks you for keeping our parks safe</span><button id="retry" onClick="window.location.reload();">Retry</button><div class="time"><h4>TIME: <span class="timeTotal">${minutes}:${seconds}</span></h4></div>`

    new Audio(bossScreech).play();
    gsap.to('.karenBoss',3,{rotation:2000})
    gsap.to('.karenBoss',4,{opacity: 0})
    tl.to('h2',{display:'none'})  
      .to('.karenBoss',4,{backgroundSize:0})
      .to('audio',{duration:3,volume:0},"-=2.5")  
      .to('.square',2,{opacity:1, backgroundImage:'url(/profile/Karen/assets/victoryPark.png)'})
      .add(vol(victoryMus),"+=3")
      .to('#arnold',5,{opacity:1})
      .to('.victoryMessage',{opacity:1},"-=3");
}//end bossDeath


function loss(){
    container.removeEventListener('click',mouseListen)
    gsap.to('audio',{volume:0});
    new Audio(priceFail).play();
    lossBox.style.display='block'
    lossBox.innerHTML+=`<p>The cops have shown up. Your picnic is ruined and Karen is sharing a video of you on Instagram</p><button id="retryLoss" onClick="window.location.reload();">Retry</button><img class="copCar" src="/profile/Karen/assets/copCar.png">`
    let tl=new TimelineMax()
    tl.to('.container',2,{opacity: 0})
      .to('.lossBox p',3,{opacity: 1})
      .to('#retryLoss',3,{opacity: 1},"-=2.5")
      .add(function(){new Audio(barker).play();},"-=2")
      .to('.copCar',2,{opacity: 1},"-=4.5")   

}


