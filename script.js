var API_DOMAIN = "https://api.instagram.com/v1";
var RECENT_MEDIA_PATH = "/users/self/media/recent";
// what do you think a variable in all caps means?

$(document).ready(function() {
  var token = window.location.hash;
  if (!token) {
    window.location.replace("./login.html");
  }
  token = token.replace("#", "?"); // Prepare for query parameter
  var mediaUrl = API_DOMAIN + RECENT_MEDIA_PATH + token;

  $.ajax({
    method: "GET",
    url: mediaUrl,
    dataType: "jsonp",
    success: handleResponse,
    error: function() {
      alert("there has been an error...")
    }
  })
  // $.ajax({
  //   method: "GET",
  //   url: mediaUrl,
  //   dataType: "jsonp",
  //   success: countStats,
  //   error: function() {
  //     alert("there has been an error...")
  //   }
  // })
  // var sentUrl = "https://community-sentiment.p.mashape.com/text/";
  // $.ajax({
  //   method: "GET",
  //   url: sentUrl,
  //   data: {

  //   }
  //   dataType: "json",
  //   success: handleSentiment,
  //   error: function() {
  //     alert("there has been an error...")
  //   }

  // })
});

function handleResponse(response) {
   console.log(response);
   for (var i=0; i<response.data.length; i++) {
    $("#list").append('<img src=' + response.data[i].images.standard_resolution.url + '>' )
    $("#list").append(response.data[i].caption.text)
    countStats(response);
       
  }
};

function countStats(response) {
  //Self Likes
  var selflikes=0;
  for (var i=0; i<response.data.length; i++) {
    if (response.data[i].user_has_liked === true) {
      selflikes++;
    }
  };
  var selflikespercent = selflikes/response.data.length;
  $("#stats").append("<div></div>", "Ego Percentage: " + selflikespercent + "%" );

  //Average Likes
  var totallikes=0;
  for (var i=0; i<response.data.length; i++) {
    totallikes+=response.data[i].likes.count;   
  }
  var averagelikes=totallikes/response.data.length;
  $("#stats").append("<div></div>", "Average # Likes: " + averagelikes);

  //Most popular day of the week
  var dayList = [];
  var daySet = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (var i=0; i<response.data.length; i++) {
    var date = new Date(response.data[i].created_time * 1000);
    var day = date.getDay();
    dayList.push(day);
  };
  console.log(dayList);
  var mode = function mode(arr) {
    var numMapping = {};
    var greatestFreq = 0;
    var mode;
    arr.forEach(function findMode(number) {
        numMapping[number] = (numMapping[number] || 0) + 1;

        if (greatestFreq < numMapping[number]) {
            greatestFreq = numMapping[number];
            mode = number;
        }
    });
    return +mode;
  }
  var daymode = mode(dayList);
  console.log(daymode);
  $("#stats").append("<div></div>", "Most Popular Day of the Week: " + daySet[daymode]);

  //Caption Brevity
  var totalCaptionLength = 0;
  for (var i=0; i<response.data.length; i++) {
    totalCaptionLength += response.data[i].caption.text.length;
  }
  var averageCaption = totalCaptionLength/response.data.length;
  $("#stats").append("<div></div>", "Average Caption Length: " + averageCaption);

  //Avg. Number of Hashtags = who's thirsty baby
  var totalHashtags = 0;
  for (var i=0; i<response.data.length; i++) {
    totalHashtags += response.data[i].tags.length;
  }
  var averageHashtags = totalHashtags/response.data.length;
  $("#stats").append("<div></div>", "Average # Hashtags (THIRST): " + averageHashtags);
};