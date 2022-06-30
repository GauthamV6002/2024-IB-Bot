const mongoose = require("mongoose");

//snowHealth, snowAttack, and snowSpeed are modified player base values => NOT CURRENT VALUES
// Current values stored in cache
const BASE_HEALTH = 30
const BASE_ATTACK = 10
const BASE_SPEED = 0.5;

const userSchema = new mongoose.Schema({
	discordID: {
		type: String,
		required: true,
	},
    discordTag: {
        type: String,
		default: "",
        required: true,
    },

	//SNOWSTATS
	snowCollects: {
		// Total Collects
		type: Number,
		default: 0,
	},
	snowThrown: {
		// Total Thrown
		type: Number,
		default: 0,
	},
	snowHits: {
		// Total Hits
		type: Number,
		default: 0,
	},
	snowKOs: {
		// Total KOs
		type: Number,
		default: 0,
	},
	snowHealth: {
		type: Number,
		default: BASE_HEALTH,
	},
	snowAttack: {
		type: Number,
		default: BASE_ATTACK,
	},
	snowSpeed: {
		type: Number,
		default: BASE_SPEED,
	},
	snowCurrentHealth: {
		type: Number,
		default: BASE_HEALTH,
	},
	snowCurrentSnowballs: {
		type: Number,
		default: 0,
	},
	snowPoints: {
		type: Number,
		default: 0,
	},
    isSnowMonarch: {
        type: Boolean,
        default: false
    },

	//MISC
	misc: Object,
});

module.exports = mongoose.model("User", userSchema);

