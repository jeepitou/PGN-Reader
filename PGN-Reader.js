/*
-----------------
ReadChessGame
-----------------
ReadChessGame function reads a PGN file string (see example below). In order to have this
function work:
- Chess notation must be in english:
    - Rook moves start with R (EG: Rh4)
    - Knight moves start with N (EG: Nh4)
    - Bishop moves start with B (EG: Bh4)
    - Queen moves start with Q (EG: Qh4)
    - King moves start with K (EG: Kh4)
    - Pawn moves only show the new coordinate of the pawn (EG: h4)
    - If a pieces if taken during the move, add a X after the piece type (EG: Qxh4)
    - If a pawn takes a piece, shown the previous file of the pawn before the x (EG: fxh4)
- Chess variation must be between parenthesis ()
- Chess comments must be between curly braces {}
- Clock timer must be between brackets []

Returns 4 new arrays:
  moveTable:moveTable, --> Table containing only the played moved during the game
  variationTable:variationTable --> Table containing the moved that were looked at during game analysis
  commentTable:commentTable --> Table containing the comments for each move or variation
  clockTable:clockTable --> Table containing the remaining time for each player after each move.

ReadChessGame("1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 Nc6
{This was a normal King's Indian Defense before I played this move. I
learned after the game that the regular move here is e5, hoping that
White closes the position with d5. Then I would need to start pushing
my kingside's pawn and go mate White's king. Unfortunately, I didn't
know this strategy.}
7.d5 Ne5 8.O-O b6
{I wanted to start to attack the c4 pawn... But why? He can defend it
easily with b3. I put too much work into attacking this pawn.}
9.h3 Qd7?
{I didn't realize in the game, but this move just removed the last
safe square for my e5 knight.}
10.Nd4 Ba6 11.b3 c5 12.Nc2 Rfb8??
{Wow this I really play this...? I wanted to play my b pawn, but why
did I bring THIS rook and not the other one? Or even better, bring the
queen to make a safe square for the knight!}
13.f4 Nc6 14.dxc6 Qxc6 15.Bf3
{Threatening e5! discovered attack on queen and pawn attack on the
knight}
15...e5 16.f5 Rd8 17.Ne3 g5??
{Another mistake, I thought I would have the time to protect it with
h6 since the bishop was blocked by the e3 knight.}
18.Ned5!
{Threatening the annoying Ne7+ forking my king and queen. My queen
really should have been chillin on another square.}
18...Nxd5 19.Nxd5 Re8 20.Bxg5
{Still threatening the fork... And up a pawn now}
20...Kh8 21.f6 Bf8
{And now he's got a huge attack on my king... it's pretty much over. I
still played it till the end.}
22.Qd2 Rab8 23.Bh5 Rb7 24.Bh6 Bxh6 25.Qxh6 Rg8 26.Rae1 Rg6 27.Bxg6 Qe8 28.
Qxh7#")
*/

function ReadChessGame(gameString){

var insideVariation = false; //insideVariation comment switch each time we see a parenthesis.
var insideComment = false; //insideComment switch each time we see a curly bracket.
var insideClock = false; //insideClock switch each time we see a bracket.

var letterTable = ['a','b','c','d','e','f','g','h','B','R','N','Q','K','o','O']; //Variable letterTable shows all the possible starting letter of a move.

//Initialize the Output tables
var moveTable = [];
var variationTable = [];
var commentTable = [];
var clockTable = [];
var clockString= [];
var clockObject=''

//Initialize the diifferent counter to keep track at which move we currently are
var idCounter=1; //idCounter counts the current move
var idVariationCounter=1; //idVariationCounter = idCounter but for variation, because variation might be multiple moves
var idStartVariation=1; //id at start of variation (to go back to start of variation when we get out of parenthesis)
var variationNumber=0; //variationNumber to differentiate if there is more than 1 variation for 1 move.


for (var i = 0, len = gameString.length; i<len-1; i++){

  //We verify if the character is a parenthesis, bracket, or curly bracket and change the bool variable if that's the case.
  if (gameString[i] === '(')
    {insideVariation = true;
    idStartVariation = idCounter-1;
    idVariationCounter = idCounter-1;
    variationNumber++
    if (idStartVariation%2===0)
    {
      colorStartVariation='black';
    }
    else {
      colorStartVariation='white';
    } }
  if (gameString[i] === ')')
    {insideVariation = false};
  if (gameString[i] === '{') {
    insideComment=true;
  }
  if (gameString[i] === '}') {
    insideComment=false;
  }
  if (gameString[i] === '[') {
    insideClock=true;
  }
  if (gameString[i] === ']') {
    insideComment=false;
  }


// We verify if the current character is in the liste of possible letter that start move and verify if that the next letter is not a "l" ("clk" for clock)
  if ((letterTable.indexOf(gameString[i]) != -1) && (gameString[i+1] != "l") && (insideVariation === false) && insideComment===false) {
         var j=0;
         var movestring = '';
         var  iCounter = 0; //counts the number f character in the move string
         while (gameString[i+j]!=' ')
            {
              movestring+=(gameString[i+j]); //we copy each character until we find a space
              j++;
              iCounter++;
            }
              i += iCounter; //we add the counter to i to continue the loop at the right location in the string.

              //We find which color was playing the move.
            if (idCounter%2===0)
            {
              color='black';
            }
            else {
              color='white';
            }

            //We create Move object.
            var move = {
            id:Math.round(idCounter/2),
            color:color,
            move:movestring,
            }

            //We add the move to the moveTable
            moveTable.push(move);
            idCounter++;
   }



 //We verify if there's a variation move.
else if ((letterTable.indexOf(gameString[i]) != -1) && (gameString[i+1] != "l") && (insideVariation === true)) {
  var j=0;
  var variationString = '';
  var  iCounter = 0;
  while (gameString[i+j]!=' ')
     {
       variationString+=(gameString[i+j]); //Copy each character until we find a space.
       j++;

       iCounter++;
     }
       i += iCounter;

       //Find which color played that move.
     if (idVariationCounter%2===0)
     {
       color='black';
     }
     else {
       color='white';
     }


     var variation = {
     id:Math.round(idVariationCounter/2),
     idStartVariation:Math.round(idStartVariation/2),
     color:color,
     colorStartVariation:colorStartVariation,
     move:variationString,
     variationNumber:variationNumber,
     listofMoves:function(moveTable1,variationTable1) { //fonction listofmoves create a table with all the move until the variation starts.
         var listOfMovesTable = [];
         if (this.colorStartVariation='white'){
           var length = this.idStartVariation*2-1;
         }
         else {
           var length = this.idStartVariation*2;
         }
         if (length!=0){
           listOfMovesTable = listOfMovesTable.concat(moveTable1.slice(0,length-1))
         }
         var i = 0;
         while (variationTable1[i]!=this){
           if (variationTable1[i].variationNumber==this.variationNumber)
            {
              listOfMovesTable = listOfMovesTable.concat(variationTable1[i]);
            }
            i++
         }
         listOfMovesTable = listOfMovesTable.concat(this);

         return listOfMovesTable;
     }
   }

     variationTable.push(variation);
     idVariationCounter+=1;
   }
   //If we are inside a comment, we find all the string before the comment is over.
   else if (insideComment===true && insideClock===false) {
     var j=0;
     var commentString = '';
     var  iCounter = 0;
     while (gameString[i+j]!='}')
        {
          if (gameString[i+j] ==='%') {
            clockString = gameString.slice(i+j+7,i+j+12);
            clockObject = {
              string:clockString,
              id:idCounter
            }
            clockTable.push(clockObject);
          }
          if (gameString[i+j]==='[') {
            insideClock=true;
          }
          else if (gameString[i+j]===']') {
            insideClock=false;
          }
          else if (insideClock===false&&gameString[i+j]!='{') {
          commentString+=(gameString[i+j]);
          }
        j++;
        iCounter++;
        }
          insideComment=false;
          if (commentString!='') {
            var commentObject= {

            comment:commentString+ '<br>',
            id:idCounter-1
            }
            commentTable.push(commentObject);
          }

          i += iCounter; 

   }
}

return {
     moveTable:moveTable,
     variationTable:variationTable,
     commentTable:commentTable,
     clockTable:clockTable
   }

}
