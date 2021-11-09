const Discord = require("discord.js");
const { Mongoose } = require("mongoose");

/**
 * Verify that the server allows this course.
 * @param {Array<String>} courseSplit
 * @param {Mongoose.module} serverData 
 * @returns {Discord.MessageEmbed.fields} Formatted fields.
 */
function verifyAllClassesSupport( interaction, userData, serverData ) {

    if ( !userData.classes || userData.classes.size < 1 )
        return "> **Woah!** You are currently not in any classes!\n" +
        "> __**[Check out the currently supported list of classes here](https://github.com/robertvargas-irq/university-course-sync-discord-bot/blob/master/Supported%20Courses/readme.md)**__,\n" +
        "> then started by clicking/tapping '`Add`' below!\n";
    



    let classes = [];

    // format
    
    // if any are allowed, do not check
    if ( serverData.any )
        for ( const key of userData.classes.keys() ) {
            classes.push({
                name: key.toUpperCase() + "\n=======\n",
                value: userData.classes.get( key ).map( ( value ) => `৹ **${key.toUpperCase()}** ${value} ${interaction.client.courses.get(key).get(value).name}`).join('\n'),
                inline: true,
            });
            userData.classes.get( key ).forEach( value => console.log( interaction.client.courses.get(key).get(value) ) );
        }
    // if any is not enabled, check
    else
        for ( const key of userData.classes.keys() ) {

            let courseBloc = userData.classes.get( key ).map( ( value ) => {
                
                if ( quickCheck( key, value, serverData ) )
                    return `৹ **${key.toUpperCase()}** ${value} ${interaction.client.courses.get(key).get(value).name}`;
                else
                    return `৹ ~~${key.toUpperCase()} ${value} ${interaction.client.courses.get(key).get(value).name}~~`;
                
            });

            classes.push({
                name: key.toUpperCase() + "\n======\n",
                value: courseBloc.join('\n'),
                inline: true,
            });
            console.log(classes);

        }
    
    return classes;
    
}

function quickCheck( key, value, serverData ) {
    
    // check blacklist
    if ( serverData.courseBlacklist.has( key ) && serverData.courseBlacklist.get( key ).has( value ) )
        return false;
    
    // check course specific type
    if ( serverData.courseSpecific.has( key ) && serverData.courseSpecific.get( key ).includes( value ) )
        return true;
    
    // else check course global type as specific overrides
    else if ( !serverData.courseSpecific.has( key ) && serverData.courseType.has( key ) )
        return true;
    
    // if all checks fail, return false
    else
        return false;
    
}

module.exports = verifyAllClassesSupport;