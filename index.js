const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ytSearch = require("yt-search") ; 
const weather = require('./src/weather')
const deleteMsg = require('./src/deleteMsg') ; 
const songPlayer = require('./src/songPlayer');
const dotenv = require('dotenv');
dotenv.config();
console.log(`${process.env.PREFIX}`)
// const {
// 	prefix,
// 	token,
// } = require('./config.json');
const prefix = process.env.PREFIX ; 
const token = process.env.DISCORDTOKEN ; 
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
    if(message.content.startsWith(`${prefix}play`) || message.content.startsWith(`${prefix}p`)){
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
    else if(message.content.startsWith(`${prefix}weather`) || message.content.startsWith(`${prefix}w`) ){
      //weather(message) ; 
      weather.weatherGet(message) ; 
    }
    else if(message.content.startsWith(`${prefix}delete`) || message.content.startsWith(`${prefix}d`)){
      deleteMsg.deleteMessage(message) ; 
    }
    else if(message.content.startsWith(`${prefix}help`) || message.content.startsWith(`${prefix}h`)){
        message.channel.send(`Hi !!
        use **!play** or **!p** for playing music
                **!skip** for skipping a song
                **!stop** to stop the bot from playing music
                **!weather** or **!w** *<cityname>* to get weather updates
                **!delete** or **!d** *<number>* to delete messages from the thread`)
    }
    else {
        message.channel.send("Enter a valid query next time ! Lmao noob !")
    }
})

const queue = new Map() ; 