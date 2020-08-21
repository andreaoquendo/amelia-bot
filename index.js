const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = "/";
const version = '1.0';
const m_channel = '745824572477145198';
const amelia_id = '745753815374102600';
const master_id = '529855777645527073';
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
    else{
        if(message.content.startsWith('/report')){
            message.reply(' reports are handled in #rules.');
        }
    }
})

//welcome message
bot.on('guildMemberAdd', (member) =>{

    const w_channel = member.guild.channels.cache.find(ch => ch.name === 'welcomes');
    if(!w_channel) return;

    const welcome_msg = new Discord.MessageEmbed()
            .setTitle('Welcome to the server!')
            .setDescription(`${member}, be welcome to **Webtoon(ers)**, a server made for people who love webtoons to find and discuss webtoon with those who love it too, please introduce yourself in #introductions, set your role in #set-roles, and don't forget to read the rules. \nAmelia bot is here to help you (her prefix is /, but for reports, is %).\nFinally, **have fun!**`)
            .setColor(0xBE58DE)
            .setImage('https://i.pinimg.com/originals/9b/5a/ea/9b5aea26a167437a7e4ddde5b44c0e40.gif');
             
    w_channel.send(welcome_msg);
});

//set role handler
bot.on('message', message =>{

    if(message.channel.id === m_channel && message.author.id != amelia_id){
        if(message.content == 'set-role'){
            message.reply(' of course my dear. What role do you want? \n We have: true beauty, sweet home, lookism, yumi cells, space boy and spirit fingers. \nPlease be careful, just digit the name of the webtoon **in english**.');
            return;
        }
        else if(message.content.startsWith(PREFIX)){

        }
        else{
            let { cache } = message.guild.roles;
            let role = cache.find(role => role.name.toLowerCase() === message.content.toLowerCase());
            if(role){
                if(message.member.roles.cache.has(role.id)){
                    message.reply('you already have this role.');
                    return;
                }
                if (check_permissions(role)){
                    message.reply('sorry, you cannot add yourself this permission.');
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
                message.reply("please be sure that what you've wrote is a role, we don't take different commands here.")
                .then(msg => {msg.delete({timeout: 3000})})
                .then(message.delete({timeout: 3000}));
            }
        }
    }
});

//commands handler
bot.on('message', message=>{

        if(message.author.id == '717791990653386752')
            message.channel.send("la vem a carol dnv");

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
                    message.reply(' I am here to help you. Please use ?help and one of the following commands\:\n *bots* - and i will explain what my siblings do; \n *roles* - if you want to know more about roles; \n *report* - for more info about reporting people');
                switch(args[1]){
                    case 'bots':
                        message.reply('I am still alone and this universe. Just waiting til master create some siblings. I really wanted a sister to talk about whats been happening these days...');
                        break;
                    case 'roles':
                        message.reply('roles are meant for you to find your co-fellows to talk about your favorites webtoons, since there is a lot of webtoons, we just make roles for top webtoons, genres and a general discovery webtoons, if you like yo read webtoons after rising.');
                        break;
                    case 'report':
                        message.reply('if youve seen someone break the rules, you need to report them. The !report -user -info , will send the message immediately to master, so she can see if we need to kick the user from this server, it will be processed in less than 24hours. Replace user by the number code and info by the number of the rule they broke.');
                }
                break;
            case 'oi':
                message.reply('oi na casa da sya mae!!!!???!!!');
                break;
            case 'report':
                if(!args[1] || !args[1].startsWith(REPORT_PREFIX)){
                    message.channel.send('If you need more info about how to report, please type !help report.');        
                }
                else{
                    message.channel.send('User has been reported, master will warn you.');
                }
                    
                
                break;
        }
});





bot.login(process.env.token);