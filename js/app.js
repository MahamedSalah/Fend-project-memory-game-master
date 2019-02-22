

//  variables to save some of information
var LastOpenCellName="",open=0,LastOpenCell,moves=0,stars=3,TotalMoves = 0 , check = true , firstClick = 0 , interval;
// this variables for timer 
var sec=0,minuts=0,hour=0;

// list of cards
var CardList = ["fa fa-diamond" , "fa fa-paper-plane-o" , "fa fa-anchor" , "fa fa-bolt" , "fa fa-cube" , "fa fa-anchor" , "fa fa-leaf" , "fa fa-bicycle" , "fa fa-diamond" , "fa fa-bomb" , "fa fa-leaf" , "fa fa-bomb" , "fa fa-bolt" , "fa fa-bicycle" , "fa fa-paper-plane-o" , "fa fa-cube" ];
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
this function to set cards and all variables in the begining of the game 
,when restart and play again
*/
function Prepare_Game(){
	// initialize  all variables 
     sec = 0, minuts = 0, hour = 0;
	 moves = 0 , stars = 3 ;
	 TotalMoves = 0 ,open = 0 , firstClick = 0; 
	
    $(".card").remove(); //  use when start another game
    CardList = shuffle(CardList);
	var i = 0;
    while(i<16){ // create cards 
    var Li = "<li class = " + "card" + "><i class =" + "'" + CardList[i++] + "'" + "></i></li";
    $(".deck").append(Li);
    }
    i=0;
    while(i++<3){ // set 3 stars
        var star = "<li><i class =" +  "'" + "fa fa-star"  + "'" + "></i></li";
        $(".score-panel .stars").append(star);
    }
    $(".deck .card").click(WhenClick); // add Event(click)
    $(".moves").text(0); // set moves
    $(".timer").text("00:00:00"); // set timer
    $(".score-panel .stars").children("li").remove();
    clearInterval(interval);
}
// Time function
function SetTimer(){
    
    interval = setInterval(function(){
       sec++;
       if(sec==60){
           sec %= 60; // 0
           minuts++;
           if(minuts==60){
                minuts %= 60; // 0
				hour++;
           }
       }
       var se  = sec , mi = minuts , ho = hour , timer;
       if(sec<10)
			se = "0"+sec;
       if(minuts < 10)
			mi = "0"+minuts;
       if(hour<10)
			ho = "0"+hour;
        timer = ho+":"+mi+":"+se;
        $(".timer").text(timer);
    },1000);

}
/*
This for cards if click on the first card ignore till another card
when click on the second card 
match the two cards if equal and wrong if not

*/
function WhenClick(){
    if(!firstClick){
        SetTimer();
        firstClick = 1;
    }
    if(open===0 && !$(this).hasClass("match")){ // check if no cards open
         check =true;
         $(".deck .card").each(function(){
             if($(this).hasClass("wrong")) // check if no cards with wrong class
                 check = false;
         });
         if(check){  // for open the selected card
             $(this).addClass("show open"); 
             LastOpenCellName =  $(this);
             var li = $(this).children("i");
             LastOpenCell = li.attr("class");
             open = 1;
         }
    }
    else if(!$(this).hasClass("match") && !$(this).hasClass("open")){ // check if card open and didn't match
        var Name, li;
        li = $(this).children("i");
        Name = li.attr("class");
        if(Name === LastOpenCell) // check if this card equal the prviou open card
        {
            $(this).addClass("show match");
            LastOpenCellName.removeClass("open");
            LastOpenCellName.addClass("match");
            LastOpenCellName.shakeUp();
            $(this).shakeUp();
            TotalMoves++;
        }
        else // if two cards not identical
        {
             var ThisElem = $(this);
             // add class open and show and wrong
             ThisElem .addClass("show wrong open");
             LastOpenCellName.addClass("wrong");
            
             // make shake for two cards
             setTimeout(function(){
                   LastOpenCellName.shakeLeft();
                   ThisElem .shakeLeft();
                 
             },1000);
              // delete class open and show and wrong
             setTimeout(function(){     
             LastOpenCellName.removeClass("show wrong open");
             ThisElem.removeClass("show wrong open");     
             },1500);
             
        } 
        $(".moves").text(++moves);
        // if number of moves reach to 10 or 15 decrement number of stars
        if(moves==10 || moves==15)
        {
            $(".score-panel .stars").children("li:first-child").remove();
            stars--;
        }
        // check if finish the game when open all cards
        if(TotalMoves == 8)
        {
          setTimeout(function(){
            var timeandmoves;
            clearInterval();
            $(".Game").hide();
            timeandmoves = "With " + moves + " moves " + "and " + stars  +" stars in " + hour+":"+minuts+":"+sec;
            $(".finalscore").text(timeandmoves);
            $(".congratulations").show();
          },1000);
        }
        open = 0;
    }
    
}
// this function to shake the cards 

jQuery.fn.shakeLeft = function(interval,distance,times){
   var jTarget = $(this);
   jTarget.css('position','relative');
   var i=0;
   while(i<5){
      jTarget.animate({ left: ((i%2==1 ? 300 : -300))}, 300); // move to left when odd to right when even
	  i++;
   }
   return jTarget.animate({left:0},100); // return the card to it's position 
}

jQuery.fn.shakeUp = function(){
   
   var jTarget = $(this);
   jTarget.css('position','relative');
   var i=0;
   while(i<5){
      jTarget.animate({ top: ((i%2==1 ? 300 : -300))}, 300);// move to top when odd to bottom when even
	  i++;
   }
   return jTarget.animate({ top: 0},100); // return the card to it's position
};

Prepare_Game();
$(".restart").click(Prepare_Game);

// for congratulation model

// when resize the window
$(window).resize(function(){
var hight = ($(window).height() - $(".congratulations").height())/2;
$(".congratulations").css("padding-top",hight);
});

// to make model of congratulation on the middle of the page
var hight = ($(window).height() - $(".congratulations").height())/2;
$(".congratulations").css("padding-top",hight);

// when click play again , hide congratulation section and show game section , start the game  
$(".playagain").click(function(){
   
     $(".congratulations").hide();
     $(".Game").show();
     Prepare_Game();
});
