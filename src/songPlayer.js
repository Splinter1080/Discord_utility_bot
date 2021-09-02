const ytdl = require('ytdl-core');
const ytSearch = require("yt-search") ; 


const queue = new Map() ; 

module.exports.execute = async (message, serverQueue) => {
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
    // if(args.length > 2)
    //   console.log(args.length) ;
    var songName = ""; 
    for(let i = 1 ; i < args.length ; ++i)
    {
      songName += args[i] + " "; 
    } 
    console.log(songName);
    const songInfo = await ytSearch(songName) ;
    //console.log(songInfo[0]) ; 
    const song = { title : songInfo.all[0].title , url: songInfo.all[0].url }; 
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
module.exports.skip = async (message, serverQueue) => {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music! Noob !"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }

module.exports.stop = async (message, serverQueue) => {
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
    serverQueue.textChannel.send(`Now Playing : **${song.title}**`);
  }
// //new trying
// const songInfo = await ytSearch(args[1]) ;
//     console.log(songInfo[0]) ; 
//     const song = { title : songInfo[0].title , url: songInfo[0].video_url }; 



//     //OG that works

//     const songInfo = await ytdl.getInfo(args[1]) ;
//     //console.log(songInfo) ; 
//     const song = { title : songInfo.videoDetails.title , url: songInfo.videoDetails.video_url }; 