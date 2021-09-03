const Discord = require('discord.js');

module.exports.deleteMessage = async (message) => {
    const args = message.content.split(" ") ;
    if(!args[1]) return message.reply("You have not specified how many messages to delete") ;
    if(isNaN(args[1])) return message.reply("Please enter a proper number , don't try to break me !") ; 
    if(args[1] > 100) return message.reply("Enter number less than 100 pls , 100 is the limit !") ; 
    if(args[1] < 1) return message.reply("Wow , enter 1 atleast") ; 
    var flag = 0 ; 
    await message.channel.messages.fetch({limit : args[1]}).then(async messages => {
      await message.channel.bulkDelete(messages).catch(function (error){
        flag = 1 ;
        message.channel.send("Cannot delete messages older than 14 days") ;
        
        return ; 
      })
      
    })
    if(flag == 0)
      message.channel.send(`Successfully deleted last ${args[1]} messages`) ;
}

// async function deleteMessages(message){
//     const args = message.content.split(" ") ;
//     if(!args[1]) return message.reply("You have not specified how many messages to delete") ;
//     if(isNaN(args[1])) return message.reply("Please enter a proper number , don't try to break me !") ; 
//     if(args[1] > 100) return message.reply("Enter number less than 100 pls , 100 is the limit !") ; 
//     if(args[1] < 1) return message.reply("Wow , enter 1 atleast") ; 
  
//     await message.channel.messages.fetch({limit : args[1]}).then(messages => {
//       message.channel.bulkDelete(messages) ; 
//     })
//     message.channel.send(`Successfully deleted last ${args[1]} messages`) ; 
//   }