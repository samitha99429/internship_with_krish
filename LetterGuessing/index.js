
const prompt = require ("prompt-sync")();


function getRandomLetter(){
  const alphabets  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";  
  
  
  const randomIndex = Math.floor(Math.random() * alphabets.length);
  
  let RandomLetter = alphabets.charAt(randomIndex);
  return RandomLetter;

  console.log(RandomLetter);

}
  
  function compareLetter(){
      
        const alphabets  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
        const RandomLetter = getRandomLetter();
        
        console.log("randome Letter:",RandomLetter);
        let attempts=0;
        

        
       
         
        while(true){
                    
             let userinputletter = prompt("Please input a English letter in between A-Z :").toUpperCase();
             attempts++;
             console.log("Number of Attempts: ",attempts);
             
     const userinputindex = alphabets.indexOf(userinputletter);
        const RandomLetterindex = alphabets.indexOf(RandomLetter);
         const gap = Math.abs(userinputindex-RandomLetterindex);
         
             if(gap === 0){
                 
                 console.log("You got it exactly!")
                 break;
             }else
                 if(gap <= 1){
                     console.log("Hot");
                 }else if(gap <= 3){
                     console.log("Warmer");
                 }else if(gap <= 10){
                     console.log("Cool");
                 }else 
                     {
                     console.log("ice");
                 }
            
        }
  }
  
compareLetter();
  
  