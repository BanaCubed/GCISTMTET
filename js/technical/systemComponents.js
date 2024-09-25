var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
					v-bind:style="[{'border-color': tmp[layer].color}, {'background-color': tmp[layer].color}, {'box-shadow': 'inset 0 0 0px 100px #00000088' + (player.subtabs[layer].mainTabs==tab?', 0 0 10px '+tmp[layer].tabFormat[tab].color:'')}, tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.lastTabSwitch = Date.now(); player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'Reach ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="back" v-bind:style="{'position': 'fixed', 'width': '90px', 'height': buttonsHeightFunction(), 'background-color': '#0f0f0f', 'left': '0px', 'top': '0px', 'z-index': '99', 'direction': 'rtl', 'max-height': '100vh', 'overflow-y': 'auto', 'transition': 'none'}">
		<div style="width: 100%; height: 100%; direction: ltr;">
			<button v-if="tmp.field.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('options-tab', 'tree')" style="border-color: var(--ghop); background-color: hsl(0, 0%, 29.15%);          margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/options-icon.webp);background-size: contain; top: 10px;" v-bind:style="{'box-shadow': player.tab=='options-tab'?'0 0 10px var(--ghop)':''}"></button>
			<button v-if="tmp.field.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('info-tab', 'tree')" style="border-color: hsl(180, 100%, 50%); background-color: hsl(180, 100%, 26.5%);  margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/info-icon.webp);   background-size: contain; top: 20px;" v-bind:style="{'box-shadow': player.tab=='info-tab'?'0 0 10px cyan':''}"></button>
			<button v-if="tmp.field.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('field', 'tree')" style="border-color: var(--grass); background-color: hsl(105, 85%, 23.85%);            margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/field-icon.webp);  background-size: contain; top: 30px;" v-bind:style="{'box-shadow': player.tab=='field'?'0 0 10px var(--grass)':''}"></button>
			<button v-if="tmp.pres.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('pres', 'tree')" style="border-color: var(--pres); background-color: hsl(180, 34.45%, 31.8%);             margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/city-icon.webp);   background-size: contain; top: 40px;" v-bind:style="{'box-shadow': player.tab=='pres'?'0 0 10px var(--pres)':''}"></button>
			<button v-if="tmp.crys.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('crys', 'tree')" style="border-color: var(--crys); background-color: hsl(330, 53%, 37.1%);                margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/cave-icon.webp);   background-size: contain; top: 50px;" v-bind:style="{'box-shadow': player.tab=='crys'?'0 0 10px var(--crys)':''}"></button>
			<button v-if="tmp.hop.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('hop', 'tree')" style="border-color: var(--ghop); background-color: hsl(0, 0%, 29.15%);                    margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/cult-icon.webp);   background-size: contain; top: 60px;" v-bind:style="{'box-shadow': player.tab=='hop'?'0 0 10px var(--ghop)':''}"></button>
			<button v-if="tmp.forest.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('forest', 'tree')" style="border-color: var(--wood); background-color: hsl(15, 60%, 14.6%);             margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/forest-icon.webp); background-size: contain; top: 70px;" v-bind:style="{'box-shadow': player.tab=='forest'?'0 0 10px var(--wood)':''}"></button>
			<button v-if="tmp.evo.layerShown" v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="showTab('evo', 'tree')" style="border-color: var(--evo); background-color: hsl(130, 100%, 14.6%);                  margin-right: 20px; margin-left: 0; width: 50px; height: 50px; background-image: url(resources/lab-icon.webp);    background-size: contain; top: 80px;" v-bind:style="{'box-shadow': player.tab=='evo'?'0 0 10px var(--evo)':''}"></button>
		</div>
		</div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat" style="margin-left: 90px;">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '-20px'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'" style="width: calc(100% - 70px);"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `			
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<br>
		<span v-if="player.points.lt('1e1000')"  class="overlayThing">You have </span>
		<h2  class="overlayThing" id="points" style="color: var(--grass); text-shadow: var(--grass) 0px 0px 10px;">{{formatWhole(player.field.points.max(0))}}</h2>
		<span v-if="player.points.lt('1e1e6')"  class="overlayThing"> {{modInfo.pointsName}}</span>
		<br>
		<span v-if="tmp.field.autoCut.gt(0)"  class="overlayThing">({{ format(tmp.field.autoCut.mul(tmp.field.grassOnCut)) }}/sec)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3><br>
		<h4>Build {{VERSION.build}}</h4>
        <span v-if="modInfo.author">
            <br>
            Made by {{modInfo.author}}	
        </span>
        <br>
        The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
        <br>
        The Prestige Tree made by Jacorb and Aarex
		<br>
        Inspired by Grass Cutting Incremental
		<br>
        Sprites taken from the Grass Cutting Incremental wiki
		<br><br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
		<br><br>
        <h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span></div>
    `
    },

    'options-tab': {
        template: `
        <table>
            <tr>
                <td><button class="opt" onclick="save()">Save</button></td>
                <td><button class="opt" onclick="exportSave()">Export to clipboard</button></td>
                <td><button class="opt" onclick="importSave()">Import</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{ options.autosave?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('science')">Scientific Notation: {{ options.science?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('hideMaxed')">Maxed Upgrades: {{ options.hideMaxed?"HIDDEN":"SHOWN" }}</button></td>
			</tr>
            <tr>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ options.offlineProd?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('slowMode')">Performance Mode: {{ options.slowMode?"ON":"OFF" }}</button></td>
            </tr>
        </table>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

