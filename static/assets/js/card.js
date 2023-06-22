var $cc = {}
$cc.validate = function(e){
    //Retrieve the value of the input and remove all non-number characters
    var number = String(e.target.value);
    var cleanNumber = '';
    for (var i = 0; i<number.length; i++){
      if (/^[0-9]+$/.test(number.charAt(i))){
        cleanNumber += number.charAt(i);
      }
    }
  
    //Only parse and correct the input value if the key pressed isn't backspace.
    if (e.key != 'Backspace'){
      //Format the value to include spaces in the correct locations
      var formatNumber = '';
      for (var i = 0; i<cleanNumber.length; i++){
        if (i == 3 || i == 7 || i == 11 ){
            formatNumber = formatNumber + cleanNumber.charAt(i) + ' '
        }else{
          formatNumber += cleanNumber.charAt(i)
        }
      }
      e.target.value = formatNumber;
    }
  
    //run the Luhn algorithm on the number if it is at least equal to the shortest card length
    if (cleanNumber.length >= 12){
      var isLuhn = luhn(cleanNumber);
    }
  
    function luhn(number){
      var numberArray = number.split('').reverse();
      for (var i=0; i<numberArray.length; i++){
        if (i%2 != 0){
          numberArray[i] = numberArray[i] * 2;
          if (numberArray[i] > 9){
            numberArray[i] = parseInt(String(numberArray[i]).charAt(0)) + parseInt(String(numberArray[i]).charAt(1))
          }
        }
      }
      var sum = 0;
      for (var i=1; i<numberArray.length; i++){
        sum += parseInt(numberArray[i]);
      }
      sum = sum * 9 % 10;
      if (numberArray[0] == sum){
        return true
      }else{
        return false
      }
    }
  }
  
  $cc.expiry = function(e){
    if (e.key != 'Backspace'){
      var number = String(this.value);
  
      //remove all non-number character from the value
      var cleanNumber = '';
      for (var i = 0; i<number.length; i++){
        if (i == 1 && number.charAt(i) == '/'){
          cleanNumber = 0 + number.charAt(0);
        }
        if (/^[0-9]+$/.test(number.charAt(i))){
          cleanNumber += number.charAt(i);
        }
      }
  
      var formattedMonth = ''
      for (var i = 0; i<cleanNumber.length; i++){
        if (/^[0-9]+$/.test(cleanNumber.charAt(i))){
          //if the number is greater than 1 append a zero to force a 2 digit month
          if (i == 0 && cleanNumber.charAt(i) > 1){
            formattedMonth += 0;
            formattedMonth += cleanNumber.charAt(i);
            formattedMonth += '/';
          }
          //add a '/' after the second number
          else if (i == 1){
            formattedMonth += cleanNumber.charAt(i);
            formattedMonth += '/';
          }
          //force a 4 digit year
          else if (i == 2 && cleanNumber.charAt(i) <2){
            formattedMonth += '20' + cleanNumber.charAt(i);
          }else{
            formattedMonth += cleanNumber.charAt(i);
          }
  
        }
      }
      this.value = formattedMonth;
    }
  }
  