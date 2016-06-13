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

  // $.ajax({
  //  method: "GET",
  //  url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=great+value+in+its+price+range!",
  //  headers:{"X-Mashape-Key": "PbStp7XTqcmshozwb4sA09AZRaTEp1qKVYHjsnE0LcKWj66qWd",
  //  "Accept": "application/json",
  //  },
  //  success: analyzeSentiments,
  //   error: function() {
  //     alert("there has been an error...")
  // }
  // });
});

function handleResponse(response) {
   console.log(response);
   for (var i=0; i<response.data.length; i++) {
      var imageUrl = response.data[i].images.standard_resolution.url;
      var post = $("<div>"+"<img src='" + imageUrl + "' />" + response.data[i].caption.text +"</div>").addClass("posts").attr('id', 'post' + i);
      console.log(post);
      $("#list").append(post);

    // $("#list").append('<img src=' + response.data[i].images.standard_resolution.url + '>' )
    // $("#list").append(response.data[i].caption.text)
    
       
  }
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

// function analyzeSentiments(data) {
//       $.each(data, function(index, value) {
//         var phrase = value.caption.text;
//         var SENTIMENT_API_BASE_URL =
//         "https://twinword-sentiment-analysis.p.mashape.com/analyze/";
//         $.ajax({
//           method: "POST",
//           url: SENTIMENT_API_BASE_URL,
//           headers: {
//             "X-Mashape-Key": "PZhVoSU58ZmshQLuImiWrQy04U3Rp1DYjXDjsnkodgl0Yg6Pwp"
//           },
//           data: {text: phrase},
//           success: function(response) {
//             console.log(response);
//             addSentiment(response.type, response.score, index);
//           }
//         });
//       });
//     }

//     function addSentiment(type, score, picNum) {
//   // Find the post the corresponds to this sentiment
//   var picDiv = $("#images" + picNum);
//   // Create a sentiment div
//   var sentimentDiv = $("<div></div>");
//   var sentimentI = $("<i></i>");
//   sentimentI.addClass("fa");
//   // Add the appropriate smiley using FontAwesome
//   var faClass = "fa-meh-o";
//   if (type === "positive") {
//     sentimentDiv.addClass("positive");
//     faClass = "fa-smile-o";
//   } else if (type === "negative") {
//     sentimentDiv.addClass("negative");
//     faClass = "fa-frown-o";
//   }
//   sentimentI.addClass(faClass);

//   sentimentDiv.append("Sentiment: ").append(sentimentI)
//   .append(" (score: " + score.toFixed(2) + ")");
//   picDiv.append(sentimentDiv);
 
//   updateTotalSentiment(score);
// }

// var allSentimentScores = []; // Aggregator for all sentiments so far.
// function updateTotalSentiment(score) {
//   allSentimentScores.push(score);
//   console.log(allSentimentScores, score);
//   // Calculate the average sentiment.
//   var sum = 0;
//   for (var i=0; i<allSentimentScores.length; i++) {
//     sum += allSentimentScores[i];
//   }
//   var avg = sum / allSentimentScores.length;

//   // Add nice text and colors.
//   var text = "Neutral"
//   var textClass = "";
//   if (avg > 0) {
//     text = "Positive!";
//     textClass = "positive";
//   } else if (avg < 0) {
//     text = "Negative :(";
//     textClass = "negative";
//   }

//   $("#mood").html(text + " (score: " + avg + ")");
//   $("#mood").addClass(textClass);
// }
// }
// var mode = function mode(arr) {
//  var numMapping = {};
//  var greatestFreq = 0;
//  var mode;
//  arr.forEach(function findMode(number) {
//    numMapping[number] = (numMapping[number] || 0) + 1;

//    if (greatestFreq < numMapping[number]) {
//      greatestFreq = numMapping[number];
//      mode = number;
//    }
//  });
//  return +mode;
// }