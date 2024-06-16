const { SlashCommandBuilder } = require('discord.js');
const passworddata = require ("../../password.json")
const fs = require('node:fs');
const db = require ("quick.db")

module.exports = {
	category: 'developer',
	data: new SlashCommandBuilder()
	.setName('login')
	.setDescription('Login facebooks.'),
    async execute(message, args) {

    //if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You must have permission ** Manage Messages ** to use this request.");


//jika Anda belum memiliki kata sandi
if(!passworddata[message.author.id]) return message.channel.send("You do not have a password :tickred: register with ``ra!register`` [password]").then(x => x.delete({timeout:1000}))
//jika Anda sudah masuk

     if(passworddata[message.author.id].login == "iya")return message.channel.send("You have entered <a:tickgreen:781575863690723348> .").then(x => x.delete({timeout:10000}))

//mendefinisikan kata sandi

    let password = message.content.split(' ').slice(1).join(' ');

//jika kata sandi salah

     if(password != passworddata[message.author.id].password){
         message.channel.send("Your password is incorrect! <a:tickred:781575891704217650> ").then(x => x.delete({timeout:10000}))
     } else{//jika kata sandinya benar

 //temukan perannya
          let role = message.member.guild.roles.cache.find(r => r.name === "facebook");
         if(!role) return message.channel.send("no ``facebook`` roles please make it first <a:tickred:781575891704217650> ")
          
         
         message.member.roles.add(role)
         message.channel.send("Welcome to Facebook <a:doge:781578112504037416> " + message.author.tag).then(x => x.delete({timeout:10000}))

//Ubah status login

 passworddata[message.author.id] = {
    password,
    login: "iya"
}

const logins = passworddata[message.author.id].login;

const embed = new Discord.MessageEmbed()

  .setColor("GREEN")
  .setTitle("System Facebook Logging")
  .addField("Nickname Username: ", message.author.username)
  .addField("Status Login :", `${logins}`)
  .addField("User Id: ", message.member.id)
  .setFooter("aditya coding!:D")
  .setTimestamp();
//713507170460762155
let channel = message.guild.channels.cache.find(ch=>ch.name ==="log-fb")
if(!channel)return;
channel.send(embed)

//khusus channel pesan mengirim
//let channelfb = message.guild.channels.find(`name`, "aditya-facebook-cmd");
  //  if(!channelfb ) return message.channel.send("**Can't find `aditya-facebook-cmd` channel.**").then(msg=>msg.delete(5000))

//Tulis status login

   fs.writeFile("./password.json", JSON.stringify(passworddata), err => {
           if(err) console.log(err)
       })

}
   }
}