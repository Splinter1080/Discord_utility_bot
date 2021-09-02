const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ytSearch = require("yt-search") ; 
const weather = require('./src/weather')
const deleteMsg = require('./src/deleteMsg') ; 
const songPlayer = require('./src/songPlayer');
const {
	prefix,
	token,
} = require('./config.json');
const client = new Discord.Client();
client.login(token);

client.once('ready', () => {
    console.log('Ready!');
   });
client.once('reconnecting', () => {
    console.log('Reconnecting!');
   });
client.once('disconnect', () => {
    console.log('Disconnect!');
   });

client.on('message' , async message => {
    if(message.author.bot) //checking our own message 
        return ;
    if(!message.content.startsWith(prefix)) return ; 
    const serverQueue = queue.get(message.guild.id) ; 
    if(message.content.startsWith(`${prefix}play`)){
      songPlayer.execute(message, serverQueue) ; 
        return ; 
    } 
    else if(message.content.startsWith(`${prefix}skip`)){
       songPlayer.skip(message, serverQueue) ; 
        return ; 
    } 
    else if(message.content.startsWith(`${prefix}stop`)){
        songPlayer.stop(message, serverQueue) ;
        return ;  
    } 
    else if(message.content.startsWith(`${prefix}weather`)){
      //weather(message) ; 
      weather.weatherGet(message) ; 
    }
    else if(message.content.startsWith(`${prefix}delete`)){
      deleteMsg.deleteMessage(message) ; 
    }
    else {
        message.channel.send("Enter a valid query next time ! Lmao noob !")
    }
})

const queue = new Map() ; 