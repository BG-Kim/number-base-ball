/**************************************************************************************************
    baseball.js    
    Number Base ball game

    Create 		BGKim 		2020.10.21
**************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////
// 									Constants													 //
///////////////////////////////////////////////////////////////////////////////////////////////////
const assert = console.assert;
const FINAL_INNING = 9;
const _arrAnswerNum = generateNumberBaseballAnswer();
let   _currentInning = 1;
let   _time_second = 0;
let   _is_playing_game = false;

///////////////////////////////////////////////////////////////////////////////////////////////////
// 									Variables 											 	 	 //
///////////////////////////////////////////////////////////////////////////////////////////////////
// getParticleTextInstance() from ParticleText.js
let   particleText = getParticleTextInstance();
const txtUserInput1 = document.getElementById("txtUserInput1");
const txtUserInput2 = document.getElementById("txtUserInput2");
const txtUserInput3 = document.getElementById("txtUserInput3");
const btnInput = document.getElementById("btnInput");
const btnReset = document.getElementById("btnReset");



(function onInit() {
	window.onload = particleText.init;
	setTimeout(()=>{
	  particleText.setText("PLAY")  ;
	}, 0);

	// Do not add event event key down. 
	// Because KeyCode of android mobile is always 229 (except special key - enter, space etc.)
	// So, It should be check change word
	txtUserInput1.addEventListener('input', onChangeUserInput1);
	txtUserInput2.addEventListener('input', onChangeUserInput2);
	txtUserInput3.addEventListener('input', onChangeUserInput3);
	btnInput.addEventListener('click', onInputClick);
	btnReset.addEventListener('click', onResetClick);

})();




///////////////////////////////////////////////////////////////////////////////////////////////////
// 									Events 		   												 //
///////////////////////////////////////////////////////////////////////////////////////////////////
function onChangeUserInput1() {   
    checkInputValueAndFocusNextElement(this, null, txtUserInput2);
}
function onChangeUserInput2() {   
    checkInputValueAndFocusNextElement(this, txtUserInput1, txtUserInput3);
}
function onChangeUserInput3() {   
    checkInputValueAndFocusNextElement(this, txtUserInput2, btnInput);
}

function onInputClick() {
	addInning();

    txtUserInput1.value = "";
    txtUserInput2.value = "";
    txtUserInput3.value = "";
    txtUserInput1.focus();    
}

function onResetClick() {
	particleText.setText("PLAY");
	setPlayGame(false);
	btnReset.classList.remove("visible");
	initTime();
	initInning();
	txtUserInput1.disabled = false;
	txtUserInput2.disabled = false;
	txtUserInput3.disabled = false;
	txtUserInput1.focus();
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// 									Functions 											 		 //
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
// User Input
function checkInputValueAndFocusNextElement(input, preElement, nextElement) {    
    function isNumber(num) {
        return ( !isNaN(num) && !isNaN(parseInt(num)) );
    }
    function isHasDuplicate(v1, v2, v3) {        
        return (
            v1 && v2 && (v1 === v2) ||  
            v1 && v3 && (v1 === v3) || 
            v2 && v3 && (v2 === v3) 
        );
    }

    if( FINAL_INNING < getCurrentInning() ) 
    	return ;  

    // some mobile device can be input overflow maxlength
    // for example android chrome - it can input 1안녕 (2020.10.19, Letter limits will be english is work nice, but other language is not work.)
    // so, should to check input length    
    if( 1 < input.value.length )
        input.value = input.value[0];

    
    // check number
    if( isNumber(input.value[0]) === false )  {
        input.value = "";
    }

    if( isHasDuplicate(txtUserInput1.value, txtUserInput2.value, txtUserInput3.value) === true ) {
        input.value = "";
        return ;
    }


    btnInput.disabled = !(0 < txtUserInput1.value.length  && 0 < txtUserInput2.value.length  && 0 < txtUserInput3.value.length);

    if( nextElement && 0 < input.value.length )
        nextElement.focus();    
    else if( preElement && 0 === input.value.length )
        preElement.focus();    
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// Answer
function generateNumberBaseballAnswer() {
    const MAX_ANS_DIGIT = 3;
    const answer = [];
    const candidate = [0,1,2,3,4,5,6,7,8,9];

    let idxCandidate = -1;
    for( let i = 0;    i < MAX_ANS_DIGIT;    ++i ) {
        idxCandidate = Math.floor(Math.random()*candidate.length);
        answer.push(candidate[idxCandidate]);
        candidate.splice(idxCandidate, 1);        
    }
    return answer;
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Inning
function addInning() {
    function appendDiv(parent, className, value) {
    	assert(parent!==null && parent!==undefined);
        const element = document.createElement("div");
        element.classList.add(className);
        element.innerHTML = value;
        parent.appendChild(element);
    }
    function checkAnswer(arrInput) {
    	assert(arrInput !==null && arrInput !== undefined && arrInput.length === 3);
    	let strikeCount = 0;
    	let ballCount = 0;
        for( let idxAns = 0;    idxAns < _arrAnswerNum.length;    ++idxAns  ) {
            for( let idxInput = 0; 	idxInput < arrInput.length;	++idxInput ) {
            	if( _arrAnswerNum[idxAns] === arrInput[idxInput] ) {
            		if( idxAns === idxInput )
            			++strikeCount;
            		else 
            			++ballCount;
            		break;
            	}
            }
        }
        return {strikeCount, ballCount};
    }
    function resultToString(json) {
    	if( json.strikeCount === 0 && json.ballCount ===0 )
    		return "OUT";
    	else 
    		return `${json.strikeCount}S ${json.ballCount}B`;
    }


    if( isPlayGame() === false ) 
    	startGame();
    

    const arrUserInput = [];
    assert(txtUserInput1.value);
    assert(txtUserInput2.value);
    assert(txtUserInput3.value);
    arrUserInput.push( parseInt(txtUserInput1.value) );
    arrUserInput.push( parseInt(txtUserInput2.value) );
    arrUserInput.push( parseInt(txtUserInput3.value) );
    const jsonCheckResult = checkAnswer(arrUserInput);
    const resultString = resultToString(jsonCheckResult);
    

    /*
    <div class="inning-panel">
        <div class="lblInning">1</div>
        <div class="lblInnings">Inning</div>
        <div class="inputValue">432</div>
        <div class="result">1S 1B</div>
    </div>
    */
    const inningContainer = (document.getElementsByClassName("innings-container")[0]);
    const inningPanel = document.createElement("div");
    inningPanel.classList.add("inning-panel");
    appendDiv(inningPanel, "lblInning", _currentInning);
    appendDiv(inningPanel, "lblInnings", "Inning");
    appendDiv(inningPanel, "inputValue", arrUserInput.join(""));
    appendDiv(inningPanel, "result", resultString);
    inningContainer.appendChild(inningPanel);
    inningPanel.classList.add("inning-panel");

    if( jsonCheckResult.strikeCount === 3 ) 
    	winGame();
    else if ( _currentInning === 9 && jsonCheckResult.strikeCount < 3 )
    	loseGame();    
    else 
    	particleText.setText(resultString);

    ++_currentInning;
}

function initInning() {
	const inningContainer = (document.getElementsByClassName("innings-container")[0]);
	inningContainer.innerHTML = "";
	_currentInning = 1;

}

function getCurrentInning() {
	return _currentInning;
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// Game Control
function startGame() {
	setPlayGame(true);
	updateTime();
	btnReset.classList.remove("visible");	
}

function winGame() {
	particleText.setText("WIN");
	terminateGame();
}

function loseGame() {
	particleText.setText("LOSE");
	terminateGame();
}

function terminateGame() {
	setPlayGame(false);
	btnReset.classList.add("visible");
	btnInput.disabled = true;
	txtUserInput1.disabled = true;
	txtUserInput2.disabled = true;
	txtUserInput3.disabled = true;
}



///////////////////////////////////////////////////////////////////////////////////////////////////
// Game Time
function initTime() {
	_time_second = 0;
	(document.getElementsByClassName("timer")[0]).innerHTML = "00:00"; 
}

function increseTime() {
    (document.getElementsByClassName("time-panel")[0]).innerHTML = count++;
}

function setPlayGame(bool) {
	_is_playing_game = bool;
}

function isPlayGame() {
	return _is_playing_game;
}

function updateTime() {
    const ONE_MIN_SECONDS = 60;
    setTimeout(()=>{
        ++_time_second;        
        let time = "";
        let min = Math.floor(_time_second / ONE_MIN_SECONDS);
        let second = _time_second - (min*ONE_MIN_SECONDS);

        // display 00:00
        if( min < 10) 
            time += "0";
        time += min;
        time += ":";
        if( second < 10) 
            time += "0";
        time += second;
        (document.getElementsByClassName("timer")[0]).innerHTML = time; 
        if( _is_playing_game === true )
        	setTimeout(updateTime, 1000);
    }, 1000);
}

