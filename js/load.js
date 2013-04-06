
//Function to pull in all of the reddits using JSON
//And add the proper information to the reddit array
function letThereBeLight(){
  console.log(arguments);    
 
  for(var i =0; i<subReddits.length; i++){
      loadSubreddit(i);
  }
}

function loadSubreddit(i){
 var urlToLoad = "http://www.reddit.com/r/"+subReddits[i]+".json?limit="+redditBufferNumber+"&jsonp=?"
    var subredditName = subReddits[i]
  
      $.getJSON(urlToLoad,function(data){
        loaded += 1
        //console.log(subredditName)
        $.each(data.data.children,function(key,value){
         // console.log(value.data.over_18);
          if(value.data.over_18 == false && value.data.domain == 'i.imgur.com'){
         

          //console.log(value.data);

            var title = value.data.title
            var img = value.data.thumbnail
            var score = value.data.score
            var created = value.data.created
            var url = value.data.url
            var subreddit = subReddits[i]
            var toPush = {
                            title:title,
                            image:img,
                            score:score,
                            created:created,
                            subreddit:subreddit,
                            url:url

                        }
          //  console.log(subreddit)
            reddit.push(toPush)
          //console.log(value.data.over_18);
          }else{
              console.log('nsfw avoided')

          }
        });
        if(loaded == subReddits.length){
          //console.log(loaded);
       
          init();

          console.log('LOADED')
          allLoaded = true
        }
      });
}



