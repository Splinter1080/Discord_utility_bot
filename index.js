const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const axios = require('axios');


const {
	prefix,
	token,
  weatherToken
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
        execute(message, serverQueue) ; 
        return ; 
    } 
    else if(message.content.startsWith(`${prefix}skip`)){
        skip(message, serverQueue) ; 
        return ; 
    } 
    else if(message.content.startsWith(`${prefix}stop`)){
        stop(message, serverQueue) ;
        return ;  
    } 
    else if(message.content.startsWith(`${prefix}weather`)){
      weather(message) ; 
    }
    else {
        message.channel.send("Enter a valid next time ! Lmao noob !")
    }
})

const queue = new Map() ; 

async function execute(message, serverQueue){
    const args = message.content.split(" ") ; 
    const voiceChannel = message.member.voice.channel ; 
    if(!voiceChannel)
        return message.channel.send(
            "You need to join a voice channel before playing music dumbass !"
        ) ; 
    const permissions = voiceChannel.permissionsFor(message.client.user) ; 
    if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I think you forgot to give me permission to speak or connect "
        ) ;
    }
    const songInfo = await ytdl.getInfo(args[1]) ;
    //console.log(songInfo) ; 
    const song = { title : songInfo.videoDetails.title , url: songInfo.videoDetails.video_url }; 
    //console.log(song) ; 
    if(!serverQueue){
        const queueConstruct = {
            textChannel : message.channel , 
            voiceChannel : voiceChannel , 
            connection : null , 
            songs: [] , 
            volume : 6 , 
            playing : true , 
        } ; 
        queue.set(message.guild.id , queueConstruct);
        queueConstruct.songs.push(song) ; 
        try{
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection; 
            play(message.guild , queueConstruct.songs[0]) ; 
        } catch(err) {  //if it fails to join the voice channel somehow
            console.log(err) ; 
            
            queue.delete(message.guild.id) ; 
            return message.channel.send(err) ; 
        }
    }
    else{
        serverQueue.songs.push(song) ; 
        console.log(serverQueue.songs) ; 
        return message.channel.send(`${song.title} has been to the queue`) ; 
    }
    
}
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music! Noob !"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }

  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
async function weather(message){
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
 