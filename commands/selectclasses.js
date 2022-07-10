const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

const all_roles = [
	"Partial IB",
	"Full IB",
	"Physics SL",
	"Biology SL",
	"Chemistry HL",
	"Math HL",
	"Math SL",
	"ELA HL",
	"Psychology SL",
	"World History HL",
	"Computer Science HL",
	"Business Management SL",
	"Economics HL",
	"Art HL",
	"Cantonese SL",
	"French SL",
	"French ab initio",
	"German ab initio",
	"Mandarin SL",
	"Mandarin ab initio",
	"Spanish ab initio",
];

const language_roles = [
	"Cantonese SL", 
	"French SL", "French ab initio", 
	"German ab initio", 
	"Mandarin SL", "Mandarin ab initio", 
	"Spanish ab initio"
]

const sciences_roles = [
	"Physics SL",
	"Biology SL",
	"Chemistry HL",
	"Computer Science HL"
]

const social_roles = [
	"World History HL",
	"Business Management SL",
	"Economics HL"
]

const conflicts = [
	["Physics SL", "Biology SL", "Business Management SL"],
	["German ab initio", "Math HL"],
	["World History HL", "Economics HL"],
	["Economics HL", "German ab initio", "Spanish ab initio", "Math HL"],
	["Psychology SL", "Computer Science HL", "Chemistry HL"],
	["Art HL", "French ab initio", "French SL"],
	["Math SL", "Math HL"],
	["Math SL", "Mandarin ab initio"],
	["French SL", "French ab initio"],
	["Mandarin SL", "Mandarin ab initio"],
];

const checkCourses = (courses, isfullIB) => {
	//Check conflicts
    for(conflict of conflicts){
        const common = conflict.filter((c) => courses.includes(c));
        if(common.length > 1){
            return { status: false, msg: `❌ Conflicts detected! (Between: ${conflict.join(", ")})` }
        }
    }

	if(isfullIB) {

		const socials = courses.filter((c) => social_roles.includes(c));
		const sciences = courses.filter((c) => sciences_roles.includes(c));

		//yes, its a else if heirarchy. screw you, laughing at my spagetti code like that
		if(!courses.includes("ELA HL")){
			return { status: false, msg: "❌ Full IB students must take ELA HL." };
		} else if (!courses.includes("Math HL") && !courses.includes("Math SL")){
			return { status: false, msg: "❌ Full IB students must choose either Math SL or HL." };
		} else if (courses.filter(c => language_roles.includes(c)).length !== 1){
			return { status: false, msg: "❌ Full IB students must take 1 language." };
		} else if (sciences.length > 2 || sciences.length < 1) {
			return { status: false, msg: "❌ Full IB students must take 1-2 sciences (Bio, Chem, Physics, Comp Sci)." };
		} else if (socials.length > 2 || socials.length < 1) {
			return { status: false, msg: "❌ Full IB students must take 1-2 courses in the social studies category. (World History HL, Economics HL, and Business Management SL)." };
		} else if (socials.length === 1 && sciences.length === 1){
			return {
				status: false,
				msg: "❌ Full IB students must 1 course from the social studies category (World History HL, Economics HL, and Business Management SL) and a science (Bio, Chem, Physics, Comp Sci), or vice versa.",
			};

		}
	}
	//Check Max/Min Courses
    return {status: true, msg: ""};
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('selectclasses')
        .setDescription('Allows you to select or reselect your classes.'),
    async execute(interaction, client) {
        let role_names = [];
        const programmeRand = Math.floor(Math.random() * 100000)
        const coursesRand = Math.floor(Math.random() * 100000);
        
        const fullOrPartialRow = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`select-full-or-partial-${programmeRand}`)
                .setPlaceholder('Select an IB Program')
                .addOptions([
                    {label: "Full IB", value: "Full IB"},
                    {label: "Partial IB", value: "Partial IB"}
                ])
        );

        const getCoursesRow = (ibProgram, rand) => (
            new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId(`select-courses-${rand}`)
					.setPlaceholder("Select your courses")
				    .setMinValues((ibProgram === "Full IB") ? 6 : 2)
				    .setMaxValues((ibProgram === "Full IB") ? 6 : 5)
					.addOptions([
						{ label: "Physics SL", value: "Physics SL" },
						{ label: "Biology SL", value: "Biology SL" },
						{ label: "Chemistry HL", value: "Chemistry HL" },
						{ label: "Math HL", value: "Math HL" },
						{ label: "Math SL", value: "Math SL" },
						{ label: "ELA HL", value: "ELA HL" },
						{ label: "Psychology SL", value: "Psychology SL" },
						{ label: "World History HL", value: "World History HL" },
						{ label: "Computer Science HL", value: "Computer Science HL" },
						{ label: "Business Management SL", value: "Business Management SL" },
						{ label: "Economics HL", value: "Economics HL" },
						{ label: "Art HL", value: "Art HL" },
						{ label: "Cantonese SL", value: "Cantonese SL" },
						{ label: "French SL", value: "French SL" },
						{ label: "French ab initio", value: "French ab initio" },
						{ label: "German ab initio", value: "German ab initio" },
						{ label: "Mandarin SL", value: "Mandarin SL" },
						{ label: "Mandarin ab initio", value: "Mandarin ab initio" },
						{ label: "Spanish ab initio", value: "Spanish ab initio" }
					])
				)
        )
        
        interaction.reply(client.simpleEmbed("Check your DMs.", "#a1edc3", true));
        await interaction.user.send(
			client.simpleEmbed(
				"First, choose either full or partial IB.",
				"#a1edc3",
				false,
				{ components: [fullOrPartialRow] }
			)
		);
        
        client.on('interactionCreate', async (i) => {
            if (!i.isSelectMenu()) return;
        
            if (i.customId === `select-full-or-partial-${programmeRand}`) {
				role_names = i.values;
				const coursesRow = getCoursesRow(role_names[0], coursesRand);
				i.update(
					client.simpleEmbed(
						"Great! Next, pick your courses. (IB courses only)",
						"#a1edc3",
						false,
						{ components: [coursesRow] }
					)
				);

			} else if (i.customId === `select-courses-${coursesRand}`){
                const courses = i.values;
                const { status, msg } = checkCourses(courses, role_names[0] === "Full IB");
                if(status){
                    i.update(
						client.simpleEmbed(
							"✅ Perfect, you're all set! If you don't get verified/don't recieve roles on server due to an error, contact an admin for manual verification.",
							"#a1edc3",
							false,
							{ components: [] }
						)
					);
					
					//ROLES CODE
					role_names.push(...courses)
					const guild = client.getGuildCache()
					const roles = guild.roles.cache.filter(r => role_names.includes(r.name))
					const cacheMember = guild.members.cache.get(interaction.user.id);
					await cacheMember.roles.remove(cacheMember.roles.cache.filter(r => all_roles.includes(r.name)));
					await cacheMember.roles.add(roles);
                } else {
                    const coursesRow = getCoursesRow(role_names[0], coursesRand);
                    i.update(
						client.simpleEmbed(
							`${msg} Please reselect valid courses.`,
							"#eb4261",
							false,
							{ components: [coursesRow] }
						)
					);
                }
                

            }
        });

		
    },
}





//ROLES
//Partial IB
//Full IB

// Physics SL
// Biology SL
// Chemistry HL
// Math HL
// Math SL
// ELA HL
// Psychology SL
// World History HL
// Computer Science HL
// Business Management SL
// Economics HL
// Art HL

// Cantonese SL
// French SL
// French ab initio
// German ab initio
// Mandarin SL
// Mandarin ab initio
// Spanish ab initio