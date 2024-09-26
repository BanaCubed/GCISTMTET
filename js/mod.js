let modInfo = {
	name: "Grasshopper Conquest Incremental",
	id: "gcistmtet",
	author: "BanaCubed",
	pointsName: "grass",
	modFiles: [
		"tree.js",
		"layers/field/field.js", "layers/field/city.js", "layers/field/cult.js", "layers/field/cave.js", "layers/field/lab.js",
		"layers/forest/forest.js",
	],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: 0.11,
	name: "Evolution",
	build: 39,
}

let changelog = 
	`<h1>Changelog:</h1><br><br>
	<span style="text-align: left; position: absolute; left: 100px;">
		<h3>v0.11</h3><br>
			- Added <span style="color: var(--evo)">Evolution/Grassmasters</span><br>
			Endgame N/A<br><br>
		<h2>v0.1</h2><br>
			- Added <span style="color: var(--ghop)">Indoctrination/Grasshoppers</span><br>
			- Added <span style="color: var(--flow)">Flowers</span><br>
			- Added <span style="color: var(--rank)">Ranks</span><br>
			- Added <span style="color: var(--rank)">The Colosseum</span><br>
			- Added <span style="color: var(--rank)">Stages</span><br>
			- Added <span style="color: var(--leag)">Leagues</span><br>
			- Added <span style="color: var(--wood)">Wood</span><br>
			- Added <span style="color: var(--wood)">Naturality</span><br>
			- Added <span style="color: var(--lood)">The Cabin</span><br>
			- Added <span style="color: var(--rank)">Sacrifice/Sacrifice Rank</span><br>
			- Added <span style="color: var(--ghop)">Misc Features</span><br>
			- Revamped <span style="color: var(--ghop)">The Control Panel</span><br>
			- Removed <span style="color: var(--auto)">Automation</span><br>
			Endgame <span style="color: var(--leag)">League 5</span>, <span style="color: var(--level)">Level 1,000+</span><br><br>
		<h3>v0.0.3</h3><br>
			- Added <span style="color: var(--crys)">Crystallize</span><br>
			- Added <span style="color: var(--acomp)">Accomplishments</span><br>
			- Added <span style="color: var(--ghop)">The Control Panel</span><br>
			Endgame <span style="color: var(--level)">Level 241</span><br><br>
		<h3>v0.0.2</h3><br>
			- Added <span style="color: var(--pres)">The City</span><br>
			- Added <span style="color: var(--tier)">Tiers</span><br>
			- Added <span style="color: var(--plat)">Platinum</span><br>
			- Added <span style="color: var(--pres)">Prestige</span><br>
			- Added <span style="color: var(--auto)">Automation</span><br>
			Endgame <span style="color: var(--level)">Level 101</span><br><br>
		<h3>v0.0.1</h3><br>
			- Added <span style="color: var(--grass)">The Field</span><br>
			- Added <span style="color: var(--level)">Levels</span><br>
			- Added <span style="color: var(--level)">Perks</span><br>
			Endgame <span style="color: var(--level)">Level 31</span><br><br>
	</span>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	lastTabSwitch: Date.now(),
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
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
	if(oldVersion<0.103) {
		player.hop.points = player.hop.points.min(1000);
		player.hop.coloTier = player.hop.coloTier.min(50);
		player.hop.active = player.hop.active.min(1000);
	}
}