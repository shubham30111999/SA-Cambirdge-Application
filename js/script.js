var accessToken = "4c482f8feb244ed18a6b4bbadb05bdd8",
    baseUrl = "https://api.api.ai/v1/",
    $speechInput,
    recognition,
    $recbtn,
    //Listening reveal
    messageRecording = "<div class='listening'><span>Listening...</span></div>",
    messageCouldntHear = "Do I really have to?",
    messageInternalError = "Oh no, there has been an internal server error",
    messageSorry = "You really make me work",
    msg;

$(document).ready(function() {
    
    //PREPARE VOICE
    msg = new SpeechSynthesisUtterance();
    msg.default;
    msg.lang = "en-US";
    msg.rate = 0.9;

    $speechInput = $("#speech");
    $startBtn = $("#startspeaking");
    $stopBtn = $("#stopspeaking");
    $recBtn = $("#rec");

    $speechInput.keypress(function(event) {
        if (event.which == 13) {
              event.preventDefault();
              send();
        };
    });
    $(window).keydown(function(event) {
        if(event.which == 9) {
              event.preventDefault();	
              switchRecognition();
        };
    });  
    $startBtn.click(function() {
        startRecognition();
    });
    $stopBtn.click(function() {
        stopRecognition();
    });
});

function findImageURL(text) {

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
function displayImage(imageUrl) {

    console.log("CLICKED");
    imageUrl+=".jpg";
    document.querySelector('#myimage').src = "images/"+imageUrl;
    document.querySelector('#myimage').style.display = "block";
    requestAnimationFrame(opacity);
};

var x = 0;

function opacity() { 
    if (x < 1) {
        x += 0.02;   
        document.querySelector('#myimage').style.opacity = x;
        requestAnimationFrame(opacity);
    };
};

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
    document.querySelector('#myimage').style.display = "none";
    x = 0;
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

      var subString1 = "displaying";

      var text = spokenResponse.toLowerCase();
      console.log(" TEXT TO CHECK : " +text);
      
      //IMAGE  
      if (text.indexOf(subString1) != -1) {
            console.log("display found ");
            findImageURL.call(this, text);
      } else {
            console.log("display not found ");
      };

      respond(spokenResponse);
      debugRespond(debugJSON);
}

function debugRespond(val) {
      $("#response").text(val); 
}

function respond(val) {
      if (val == "") {
            val = messageSorry;
      }
      if (val !== messageRecording) {
            msg.text = val;
            window.speechSynthesis.speak(msg);
      };
      $("#spokenResponse").addClass("is-active").find(".spoken-response__text").html(val);
}
