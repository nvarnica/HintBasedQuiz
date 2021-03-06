var currentQuestion						=0;
var score											=0;
var totalQuestions						=questions.length;
var optionOrder								=[2,0,1,3];
var numHintsCurrentQuestion		=0;
var currentHintNumber					=0;
var container									=document.getElementById('quizContainer');
var questionContainer					=document.getElementById('questionContainer');
var feedbackContainer					=document.getElementById('feedbackContainer');
var container									=document.getElementById('quizContainer');
var nextButton								=document.getElementById('nextButton');
var submitButton							=document.getElementById('submitButton');
var hintButton								=document.getElementById('hintButton');
var resultContainer						=document.getElementById('resultContainer');
var feedback									=document.getElementById('feedback');

function showAudioClips(){
	var para=document.createElement("p");
	var text='Here is a clip on Rainbows and how they are formed.'
	var node=document.createTextNode(text);
	para.appendChild(node);
	resultContainer.appendChild(para);
	resultContainer.innerHTML+= '<br> <audio controls><source src="audio/Rainbows.mp3" type="audio/mpeg">'+
	'Your browser does not support the audio element.</audio>';
	var para=document.createElement("p");
	var text='Here is a clip on Whales and how they evolved.'
	var node=document.createTextNode(text);
	para.appendChild(node);
	resultContainer.appendChild(para);
	resultContainer.innerHTML+= '<br> <audio controls><source src="audio/Whale.mp3" type="audio/mpeg">'+
	'Your browser does not support the audio element.</audio>';
}
function loadQuestion(questionIndex,optionOrder){
	/*Restting the hint number to 0*/
	currentHintNumber=0;
	/*Making question container visible and hiding feedback container*/
	questionContainer.style.display='';
	feedbackContainer.style.display='none';
	/*Loading the question*/
	var q=questions[questionIndex];
	var questionEl=document.getElementById('question');
	questionEl.textContent=q.question;
	/*Loading the question image if present*/
	var questionImage=document.getElementById("questionImage");
	var questionImageTable=document.getElementById("questionImageTable");
	questionImageTable.innerHTML='';
	var questionImageRow;
	/*Creating a new image table for current question, if present*/
	if(q.questionImage){
		if(q.questionImage.length>0){
			questionImage.style.display='';
		}
		else{
			questionImage.style.display='none';
		}
		questionImageRow=questionImageTable.insertRow(-1);
		for (var i=0;i<q.questionImage.length;i++){
			var questionImageCol=questionImageRow.insertCell(i);
			questionImageCol.innerHTML='<img  class="questionImage" src=img/'+q.questionImage[i]+'>';
		}
	}
	else{
		questionImage.style.display='none';
	}
	/*Displaying answer options with images, if present
	First, the old table is deleted. Then new rows are added based on the question*/
	var optionTable=document.getElementById('optionTable');
	var imageRow;
	var textRow;
	var imgsrc, imgid, imgcol, textCol;
	optionTable.innerHTML='';
	if(q.answerImages.length>0){
		imageRow=optionTable.insertRow(-1);
	}
	if(q.options.length>0){
		textRow=optionTable.insertRow(-1);
	}
	for (var i=0;i<q.answerImages.length;i++){
		imgsrc="img/"+q.answerImages[optionOrder[i]];
		imgid="img"+(i+1);
		imgcol=imageRow.insertCell(i);
		imgcol.innerHTML='<img  id='+imgid+' class="image" src='+imgsrc+'>';
	}
	for (var i=0;i<q.options.length;i++){
		textCol=textRow.insertCell(i);
		if(q.questionType){
			if(q.questionType=='True/False'){
				textCol.innerHTML='<input type="radio" id="option'+(i+1)+'" name="option"'+' value='+ (i+1)+ ' />'+q.options[optionOrder[i]];
			}
			else {
				textCol.innerHTML='<input type="checkbox" id="option'+(i+1)+'" name="option"'+' value='+ (i+1)+ ' />'+q.options[optionOrder[i]];
			}
		}
	}
	/* Displaying the hint button if hints are present for the current question.
	Deleting the previous hints*/
	numHintsCurrentQuestion=q.hints.length;
	if(numHintsCurrentQuestion>0){
		hintButton.style.display='';
	}
	else{
		hintButton.style.display='none';
	}
	var hintBox=document.getElementById('hintBox');
	hintBox.style.display='none';
	hintBox.innerHTML='';
};
function provideHint(){
	var q=questions[currentQuestion];
	var hintBox=document.getElementById('hintBox');
	hintBox.style.display='';
	insertText(q.hints[currentHintNumber],'hintBox');
	if(currentHintNumber==numHintsCurrentQuestion-1){
		hintButton.style.display='none';
	}
	currentHintNumber++;
}
function insertText(text,parentNode){
	var parent=document.getElementById(parentNode);
	var para=document.createElement("p");
	var node=document.createTextNode(text);
	para.appendChild(node);
	parent.appendChild(para);
}
function provideFeedback(){
	var checkedAnswers=[];
	var j=0;
	var id='';
	for(var i=0;i<questions[currentQuestion].options.length;i++){
		id='option'+(i+1);
		if(document.getElementById(id).checked){
			checkedAnswers[j]=i;
			j++;
		}
	}
	if(j==0){
		alert('Please select your answer!');
		return;
	}
	questionContainer.style.display='none';
	feedbackContainer.style.display='';
	hintButton.style.display='none';
	var answerIndex=-1;
	var match=0;
	for(var index=0;index<checkedAnswers.length;index++){
		answerIndex=checkedAnswers[index];
		for(var i=0;i<questions[currentQuestion].answer.length;i++){
			if(questions[currentQuestion].answer[i]==questions[currentQuestion].options[optionOrder[answerIndex]]){
				match++;
			}
		}
	}
	var correct=false;
	feedbackContainer.style.display='';
	if((match==checkedAnswers.length)&&(match==questions[currentQuestion].answer.length)){
		correct=true;
		score+=5;
		feedbackContainer.style.background="darkseagreen";
		insertText(questions[currentQuestion].response[0],'feedbackContainer');
	}
	else{
		insertText(questions[currentQuestion].response[1],'feedbackContainer');
		feedbackContainer.style.background="darksalmon";
	}
		if(questions[currentQuestion].feedback){
			if(questions[currentQuestion].feedbackType=='Correct/Incorrect')
			{
				if(correct){
					insertText(questions[currentQuestion].feedback[0],'feedbackContainer');
					}
				else {
					insertText(questions[currentQuestion].feedback[1],'feedbackContainer');
					}
			}
			if(questions[currentQuestion].feedbackType=='OptionBased'){
				insertText(questions[currentQuestion].feedback[optionOrder[checkedAnswers[0]]],'feedbackContainer');
				}
			}

	if(questions[currentQuestion].audioIntro){
		insertText(questions[currentQuestion].audioIntro,'feedbackContainer');
		feedbackContainer.innerHTML+= '<audio id="audio" controls><source src="audio/'+ questions[currentQuestion].audioClips
		+'" type="audio/mpeg" id="audioClip">'+
		'Your browser does not support the audio element.</audio>';
	}
	nextButton.style.display='';
	submitButton.style.display='none';
}

function loadNextQuestion(){
	feedbackContainer.style.display="none";
	feedbackContainer.innerHTML='';
	currentQuestion++;
	if(currentQuestion==totalQuestions-1){
		nextButton.textContent='Finish';
	}
	if(currentQuestion==totalQuestions){
		questionContainer.style.display='none';
		feedbackContainer.style.display='none';
		nextButton.style.display='none';
		resultContainer.style.display='';
		var text='Your score: '+ score;
	  insertText(text,'resultContainer');
		showAudioClips();
		return;
	}
	loadQuestion(currentQuestion,optionOrder);
	nextButton.style.display='none';
	submitButton.style.display='';
};

loadQuestion(currentQuestion,optionOrder);
