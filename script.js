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
    });
  });

function getSentiment(text) {

      $.ajax({
      method: "GET",
      url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/",
      headers:{"X-Mashape-Key": "PbStp7XTqcmshozwb4sA09AZRaTEp1qKVYHjsnE0LcKWj66qWd",
      "Accept": "application/json",
      },
      data: "text=" + text,
      success: analyzeSentiment,
      error: function() {
        alert("there has been an error with sentiment")
      }
    });
};

var counter = 0;
var positive = 0;
function analyzeSentiment(result) {
    positive = positive+result.score;
    $("#post" + counter).append("<div></div>" + "Positivity score: " + result.score);
    $("#post" + counter).append("<div></div>" + "Positivity type: " + result.type);
    counter++;
    $("#sentiment").html("Total Positivity: " + positive);
}



function handleResponse(response) {
     for (var i=0; i<response.data.length; i++) {
        var imageUrl = response.data[i].images.standard_resolution.url;
        var post = $("<div>"+"<img src='" + imageUrl + "' />" + response.data[i].caption.text +"</div>").addClass("posts").attr('id', 'post' + i);
        console.log(post);
        $("#list").append(post);
        getSentiment(response.data[i].caption.text);
    };
  countStats(response);
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
    $("#stats1").append("<div></div>", "Ego Percentage: " + selflikespercent + "%" );

    //Average Likes
    var totallikes=0;
    for (var i=0; i<response.data.length; i++) {
      totallikes+=response.data[i].likes.count;   
    };
    var averagelikes=totallikes/response.data.length;
    $("#stats2").append("<div></div>", "Average # Likes: " + averagelikes);

    //Most popular day of the week
    var dayList = [];
    var daySet = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (var i=0; i<response.data.length; i++) {
      var date = new Date(response.data[i].created_time * 1000);
      var day = date.getDay();
      dayList.push(day);
    };
    //console.log(dayList);
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
    $("#stats3").append("<div></div>", "Most Popular Day of the Week: " + daySet[daymode]);

    //Caption Brevity
    var totalCaptionLength = 0;
    for (var i=0; i<response.data.length; i++) {
      totalCaptionLength += response.data[i].caption.text.length;
    }
    var averageCaption = totalCaptionLength/response.data.length;
    $("#stats4").append("<div></div>", "Average Caption Length: " + averageCaption);

    //Avg. Number of Hashtags = who's thirsty baby
    var totalHashtags = 0;
    for (var i=0; i<response.data.length; i++) {
      totalHashtags += response.data[i].tags.length;
    };
    var averageHashtags = totalHashtags/response.data.length;
    $("#stats5").append("<div></div>", "Average # Hashtags (THIRST): " + averageHashtags);
  };


