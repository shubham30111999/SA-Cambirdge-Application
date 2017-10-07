      
var accessToken = "6167d3529aad44ab93de131a44ef07a1",
      baseUrl = "https://api.api.ai/v1/",
      $speechInput,
      $recBtn,
      recognition,
      //Listening reveal
      messageRecording = "<div class='listening'><span>Listening</span><img src='images/wave.gif'></div>",
      messageCouldntHear = "Do I really have to?",
      messageInternalError = "Oh no, there has been an internal server error",
      messageSorry = "You really make me work";
//var modal;
//var modalImg;
//var captionText;
//var modal2;
//var modalVid;
//var modal3, modal4;
//var modal5, modal6, modal7, modal8;
var msg;
//var check = false;

$(document).ready(function() {

      /*** FUNCTION TO DISPLAY APPROPRIATE IMAGE ON THE MODAL ***/
      /*modal = document.getElementById('myModal');
      modal2 = document.getElementById('myModal2');
      modal3 = document.getElementById('myModal3');
      modal4 = document.getElementById('myModal4');
      modal5 = document.getElementById('myModal5');
      modal6 = document.getElementById('myModal6');
      modal7 = document.getElementById('myModal7');
      modal8 = document.getElementById('myModal8');  
      modalImg = document.getElementById("img01"); 
      modalVid = document.getElementById("vid01");
      captionText = document.getElementById("caption"); */

      //PREPARE VOICE
      msg = new SpeechSynthesisUtterance();
      msg.default;
      //msg.URI = 'native';
      msg.lang = "en-US";
      msg.rate = 0.9;

      $speechInput = $("#speech");
      $recBtn = $("#rec");

      $speechInput.keypress(function(event) {
            if (event.which == 13) {
                  event.preventDefault();
                  send();
            }
      });
      $(window).keydown(function(event) {
            if(event.which == 190 || event.which == 9) {
                  event.preventDefault();	
                  switchRecognition();
            };
      });
      $(".debug__btn").on("click", function() {
            $(this).next().toggleClass("is-active");
            return false;
      });

});

/*function findImageURL(text) {

      console.log("TEXT IS : " + text);
      var arr = text.split(" ");
      console.log("A 0 " + arr[0]);
      console.log("A 1 " + arr[1]);
      console.log("A 2 " + arr[2]);

      var imageValue = arr[1]+arr[2];
      console.log("IMAGE VALUE " + imageValue);
      displayImage.call(this,imageValue);
}

/*** FUNCTION TO DISPLAY APPROPRIATE IMAGE ON THE MODAL ***/
/*function displayImage(imageUrl) {

      modal.style.display = "block";
      console.log("CLICKED");
      imageUrl+=".jpg";
      modalImg.src = "images/"+imageUrl;
      setTimeout(function() {
            modal.style.display = "none";
      }, 10000);
}

// When the user clicks on the clicker, close any modal
window.onkeydown = function() { 
      var keyCode = event.keyCode;
      if (keyCode == 116 || keyCode == 27) {
            event.preventDefault();
            document.querySelector('video').src = "";
            modal.style.display = "none";
            modal2.style.display = "none";
            modal3.style.display = "none";
            modal4.style.display = "none";
            modal5.style.display = "none";
            modal6.style.display = "none";
            modal7.style.display = "none";
            modal8.style.display = "none";
      }
      if (keyCode == 33) {
            document.getElementById('vid01').pause();
      }
      if (keyCode == 34) {
            document.getElementById('vid01').play();
      }
}

function findVideoURL(text) {

      console.log("TEXT IS : " + text);
      var arr = text.split(" ");
      console.log("A 0 " + arr[0]);
      console.log("A 1 " + arr[1]);
      console.log("A 2 " + arr[2]);

      var videoValue = arr[1]+arr[2];
      console.log("IMAGE VALUE " + videoValue);
      displayVideo.call(this, videoValue);
}*/

/*** FUNCTION TO DISPLAY APPROPRIATE IMAGE ON THE MODAL ***/
/*function displayVideo(videoUrl) {

      modal2.style.display = "block";
      console.log("CLICKED again");
      videoUrl+=".webm";
      modalVid.src = "videos/"+videoUrl;
      /** Video will play after three seconds **/
      /*setTimeout(function() {
            document.getElementById('vid01').play();
            console.log("video played");
      }, 3000) ;
}

//POWERPOINT 1
function showPpt(text) {

      if(text == "welcome to my digital world!"){
            modal3.style.display = "block";
            console.log("CLICKED again and again");
      };
      if(text == "here you go ram"){
            modal4.style.display = "block";
            console.log("CLICKED again and again");
      };
      if(text == "that’s a good idea sir!"){
            modal5.style.display = "block";
            console.log("CLICKED again and again");
      };
      if(text == "here are the [solution name] slides"){
            modal6.style.display = "block";
            console.log("CLICKED again and again");
      }; 
      if(text == "here are the [solution name] slides"){
            modal7.style.display = "block";
            console.log("CLICKED again and again");
      };
      if(text == "here are the [solution name] slides"){
            modal8.style.display = "block";
            console.log("CLICKED again and again");
      };
} */

//ALL CODE FROM HERE ON IS NOT TO BE EDITED AS IT IS WHAT CONNECTS US TO API.AI
function startRecognition() {

      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = function(event) {
            respond(messageRecording);
            updateRec();
      };
      recognition.onresult = function(event) {
            recognition.onend = null;

            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
            }
            setInput(text);          
            stopRecognition();
      };
      recognition.onend = function() {
            respond(messageCouldntHear);
            stopRecognition();
      };
      recognition.lang = "en-US";
      recognition.start();
}


function stopRecognition() {
      if (recognition) {
            recognition.stop();
            recognition = null;
      };
      updateRec();
};

function switchRecognition() {
      if (recognition) {
            stopRecognition();
      } else {
            startRecognition();
      };
}

function setInput(text) {
      $speechInput.val(text);
      send();
}

function updateRec() {
      //$recBtn.text(recognition ? "Stop" : "Speak");
      if (recognition) {
            $recBtn.addClass("btn-sonar");
      } else {
            $recBtn.removeClass("btn-sonar");
      };
}

function send() {
      var text = $speechInput.val();
      $.ajax({
            type: "POST",
            url: baseUrl + "query",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                  "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({query: text, lang: "en", sessionId: "yaydevdiner"}),
                  success: function(data) {
                  prepareResponse(data);
            },
            error: function() {
                  respond(messageInternalError);
            }
      });
}

function prepareResponse(val) {
      var debugJSON = JSON.stringify(val, undefined, 2),
      spokenResponse = val.result.speech;
      console.log("SPOKEN RESPONSE IS : " + spokenResponse);
      console.log("SPOKEN RESPONSE IS : " + val.result.speech);

      /*var subString1 = "alright";
      var subString2 = "loading";
      var subString3 = "displaying";
      var subString4 = "welcome";
      var subString5 = "that";*/

      var text = spokenResponse.toLowerCase();
      console.log(" TEXT TO CHECK : " +text);
      
      /*IMAGE  
      if (text.indexOf(subString1) != -1) {
            console.log("display found ");
            findImageURL.call(this,text);
            check = true;
            console.log(check);
      } else {
            console.log("display not found ");
            check = false;
            console.log(check);
      };

      //VIDEO
      if (text.indexOf(subString2) != -1) {
            console.log("video found");
            findVideoURL.call(this,text);
            check = true;
            console.log(check);
      } else {
            console.log("video not found ");
            check = false;
            console.log(check);
      };

      //POWERPOINT
      if (text.indexOf(subString3) != -1 || text.indexOf(subString4) != -1 || text.indexOf(subString5) != -1) {
            console.log("powerpoint found");
            showPpt.call(this,text);
            //check = true;
            //console.log(check);
      } else {
            console.log("ppt not found ");
            //check = false;
            //console.log(check);
      };*/

      respond(spokenResponse);
      debugRespond(debugJSON);
} /// accha hoga sorry

function debugRespond(val) {
      $("#response").text(val); 
}

function respond(val) {
      if (val == "") {
            val = messageSorry;
      }
      if (val !== messageRecording) {
            /*console.log(check);
            if(check === true){
                  msg.text = "Here you go sir"
            };
            if(check === false){
                  msg.text = val;
            };*/
            msg.text = val;
            window.speechSynthesis.speak(msg);
            //check = false;
      };
      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
}
