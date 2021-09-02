const axios = require('axios');
const {
  weatherToken
} = require('../config.json');
// async function weather(message){
//     const args = message.content.split(" ") ;
//     // console.log(args[1]) ; 
//     if(args[1]){
//       const url = `http://api.weatherapi.com/v1/current.json?key=${weatherToken}&q=${args[1]}&aqi=no` ; 
//       axios.get(url)
//       .then(function (response) {
//         console.log(response.data) ; 
//          message.channel.send(
//           ` Current temperature is : ${response.data.current.temp_c}°C
//            *${response.data.current.condition.text}*` 
//         );
//       })
//       .catch(function (error) {
//         // handle error
//         console.log(error);
//       })
//     }
//     else{
//       message.channel.send("Please enter the city/region that you are looking for !"); 
//       return ; 
//     }
  
    
//   }

module.exports.weatherGet = async (message) => {
    const args = message.content.split(" ") ;
    // console.log(args[1]) ; 
    if(args[1]){
      const url = `http://api.weatherapi.com/v1/current.json?key=${weatherToken}&q=${args[1]}&aqi=no` ; 
      axios.get(url)
      .then(function (response) {
        console.log(response.data) ; 
         message.channel.send(
          ` Current temperature is : ${response.data.current.temp_c}°C
           *${response.data.current.condition.text}*` 
        );
        if(!response.data.current.temp_c)
        {
          message.channel.send("Error Finding your request!") ; 
        }
      })
      .catch(function (error) {
        // handle error
       
        console.log(error);
      })
  
    }
    else{
      message.channel.send("Please enter the city/region that you are looking for !"); 
      return ; 
    }
}