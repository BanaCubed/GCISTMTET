let modInfo = {
	name: "Grass Cutting Incremental's Scuffed TMT Evil Twin",
	id: "thisisnottreefromitalysalmon",
	author: "BanaCubed",
	pointsName: "grass",
	modFiles: ["field.js", "tree.js", "city.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.3.withoutAccomplishments",
	name: "Crystals but without accomplishments",
}

let changelog = 
	`<h1>Changelog:</h1><br><br>
	<span style="text-align: left; position: absolute; left: 30px;">
		<h3>v0.0.3</h3><br>
			- Added <span style="color: #FF69B4">Crystallize</span><br>
			- Added <span style="color: #BC48A8">Accomplishments</span><br>
			- Added <span style="color: #FF69B4">Crystal Upgrades</span><br>
			- Added More <span style="color: #237BEC">Perk Upgrades</span><br>
			Endgame <span style="color: #237BEC">Level 201</span><br><br>
		<h3>v0.0.2</h3><br>
			- Added <span style="color: #4BDCDC">The City</span><br>
			- Added <span style="color: #FFC000">Tiers</span><br>
			- Added <span style="color: #C5D4E2">Platinum</span> and <span style="color: #C5D4E2">Platinum Upgrades</span><br>
			- Added <span style="color: #4BDCDC">Prestige</span> and <span style="color: #4BDCDC">Prestige Points</span><br>
			- Added <span style="color: #DC4848">Automation</span><br>
			- Added <span style="color: #4BDCDC">Prestige Upgrades</span><br>
			Endgame <span style="color: #237BEC">Level 101</span><br><br>
		<h3>v0.0.1</h3><br>
			- Added <span style="color: #4BDC13">The Field</span><br>
			- Added <span style="color: #237BEC">Levels</span><br>
			- Added <span style="color: #237BEC">Perks</span><br>
			- Added <span style="color: #4BDC13">Grass</span> and <span style="color: #237BEC">Perk</span> Upgrades<br>
			Endgame <span style="color: #237BEC">Level 31</span>
	</span>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "addGrass"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = tmp.field.grassValue.times(tmp.field.autoCutRate)
	gain = gain.times(tmp.auto.buyables[12].effect)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.field.level.gte(201)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}