const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = "?";
const version = '1.0';
const m_channel = '745824572477145198';
const amelia_id = '745753815374102600';
const master_id = '529855777645527073';
const rules_channel = '746081382836600928';
const REPORT_PREFIX = "%";


const check_permissions = (role) => {role.permissions.has('KICK_MEMBERS') ||
role.permissions.has('BAN_MEMBERS') ||
role.permissions.has('MANAGE_GUILD') ||
role.permissions.has('MANAGE_CHANNELS') ||
role.permissions.has('ADMINISTRATOR')};

bot.on('ready', ()=>{
    console.log('Amelia is online!')

})

//report processing
bot.on('message', message =>{

    if(message.channel.id === rules_channel){
        let master = bot.users.cache.get(master_id);
        let args = message.content.substring(REPORT_PREFIX.length).split(" ");
        if(message.author.id != amelia_id){
            if (!message.content.startsWith(REPORT_PREFIX) || 
            !message.mentions.users.size ||
            !args[0] || !args[1] || !args[2]){
                            
                message.channel.send('Please, use the right format.')
                .then(msg => {msg.delete({timeout: 3000})})
                .then(message.delete({timeout: 3000}));

            }
            else{
                message.author.send('Your report will be processed.');
                master.send(message.author.id + ' sent a report:\n' + message.content);
                message.delete({timeout:3000})
            }
        }
        else return;
    }
    else return;
})

//welcome message
bot.on('guildMemberAdd', (member) =>{

    const w_channel = member.guild.channels.cache.find(ch => ch.name === 'welcomes');
    if(!w_channel) return;

    const welcome_msg = new Discord.MessageEmbed()
            .setTitle('Welcome to the server!')
            .setDescription(`${member}, be welcome to **Webtoon(ers)**, a server made for people who love webtoons. As a newcomer, please introduce yourself in #introductions, set your role in #set-roles, and don't forget to read the rules. If you want more info about an specific channel, please read it's pinned message.\nWe have 2 exclusive bots here: Amelia and Jem, amelia's prefix is "?", and some of her commands are in #general's pinned message; Jem just gives out recommendations, so just type 'jem recommendation' and he will give you one heh.n\nFinally, **have fun!**`)
            .setColor(0xBE58DE)
            .setImage('https://i.pinimg.com/originals/9b/5a/ea/9b5aea26a167437a7e4ddde5b44c0e40.gif');
             
    w_channel.send(welcome_msg);
});

//set role handler
bot.on('message', message =>{

    if(message.channel.id === m_channel && message.author.id != amelia_id){
        if(message.content == 'set-role'){
            message.reply(' of course my dear. What role do you want? You can see current roles in pinned message.**.');
            return;
        }
        else if(message.content.startsWith(PREFIX)){

        }
        else{
            let { cache } = message.guild.roles;
            let role = cache.find(role => role.name.toLowerCase() === message.content.toLowerCase());
            if(role){
                if(message.member.roles.cache.has(role.id)){
                    message.member.roles.remove(role);
                    message.reply('you were removed from this role.');
                    return;
                }
                if (check_permissions(role) || role.id === '746580628363018400'){
                    message.reply('sorry, you cannot add yourself this role.')
                    .then(msg => {msg.delete({timeout: 4000})})
                    .then(message.delete({timeout: 3000}));
                }
                else{
                    message.member.roles.add(role)
                    .then(member => message.channel.send('you were added to this role'))
                    .catch(err =>{
                        console.log(err);
                        message.channel.send('Something Went Wrong');
                    });
                return;
                }
            }else{
                message.reply("please be sure that what you've wrote is a role, we don't take different commands here. See roles in pinned message.")
                .then(msg => {msg.delete({timeout: 4000})})
                .then(message.delete({timeout: 3000}));
            }
        }
    }
});

//commands handler
bot.on('message', message=>{

        if(message.channel.id === rules_channel) return;
        let args = message.content.substring(PREFIX.length).split(" ");
        if (!message.content.startsWith(PREFIX)) return;
        if (message.channel.id == m_channel && message.author.id != master_id){
            message.reply("you can't use commands here.")
            .then(msg => {msg.delete({timeout: 3000})})
            .then(message.delete({timeout: 3000}));
            return;
        }

        switch(args[0]){
            case 'ping':
                message.reply('pong!'); //message.channel.sendMessage('pong!')
                break;
            case 'info':
                if(args[1] == 'version'){
                    message.channel.send(version);
                }else if(args[1] == 'git'){
                    message.channel.send('https://github.com/andreaoquendo/amelia-bot');
                }
                else{
                    message.channel.send('Invalid request.');
                }
                break;
            case 'clear':
                if(message.author.id == master_id){
                    if(!args[1]) return message.reply('Error please define second arg');
                    message.channel.bulkDelete(args[1]);
                }
                else{
                    message.reply("I'm sorry, but you can't use this command")
                    .then(msg => {msg.delete({timeout: 3000})})
                    .then(message.delete({timeout: 3000}));
                }
                break;
            case 'help':
                if(!args[1])
                    message.reply(' I am here to help you. Please use ?help and one of the following commands\:\n*bots* - and i will explain what my siblings do; \n*roles* - if you want to know more about roles; \n*report* - for more info about reporting people');
                switch(args[1]){
                    case 'bots':
                        message.reply(" my brother is **jem**, and he gives people recommendations (just type 'jem recommendation'), **rythm bot** is a music bot and he takes commands just in #music-bot channel, **dyno** bot just takes master commands.");
                        break;
                    case 'roles':
                        message.reply('roles are meant for you to find your co-fellows, since there is a lot of webtoons, we just make roles for top webtoons, genres and a general discovery webtoons, if you want a new role to be created, send it in #request-role channel.');
                        break;
                    case 'report':
                        message.reply('if youve seen someone break the rules, you need to report them. #rules is the channel that handles reports. Dont worry, they keep your report anon.');
                        break;
                }
                break;
        }
});





bot.login(process.env.token);