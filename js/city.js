addLayer('city', {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        tier: new Decimal(1),
        tp: new Decimal(0),
        resetTime: 0,
        totalGrasses: new Decimal(0),
    }},
    color: "#4BDCDC",
    resource: "prestige points", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    nodeStyle: {
        'background-image': 'url(resources/city-icon.webp)',
        'background-size': 'contain',
    },
    tooltip() {
        let text = `<h2>THE CITY</h2><br>${formatWhole(player.city.points)} prestige points`
        if(hasMilestone('misc', 2)) text = text + `,<br>${formatWhole(player.crystal.points)} crystals`
        return text
    },
    baseResource: 'levels',
    baseAmount() {return player.field.level},
    requires: new Decimal(31),
    getResetGain() {
        return player.field.level.div(10).pow_base(1.4).times(player.field.bestGrass.max(1).log(10).floor().pow_base(1.15)).times(9).times(tmp.city.gainMult).floor()
    },
    getNextAt(){return new Decimal(31)},
    prestigeButtonText() {
        return `Reach level 31 to prestige<br><br>
        You will earn ${formatWhole(tmp.city.getResetGain)} prestige points`
    },
    canReset() {
        return player.field.level.gte(31)
    },
    tabFormat: {
        "Automation": {
            content: [
                ['layer-proxy', ['field', [
                    'main-display'
                ]]],
                ['layer-proxy', ['city', [
                    function(){return hasMilestone('misc', 0)?'main-display':''}
                ]]],
                ['layer-proxy', ['crystal', [
                    function(){return hasMilestone('misc', 2)?'main-display':''}
                ]]],
                ['layer-proxy', ['auto', [
                    'buyables'
                ]]]
            ],
            buttonStyle: {
                "background-color": "#371212",
                "border-color": "#DC4848",
            }
        },
        "Prestige": {
            content: [
                'main-display',
                'prestige-button',
                'blank',
                'buyables',
            ],
            buttonStyle: {
                "background-color": "#123737"
            }
        },
        "Crystallize": {
            content: [
                ['layer-proxy', ['crystal', [
                    'main-display',
                    'prestige-button',
                    'blank',
                    'buyables',
                ]]]
            ],
            buttonStyle: {
                "background-color": "#3F1A2D",
                "border-color": "#FF69B4",
            }
        },
        "Accomplishments": {
            content: [
                ['layer-proxy', ['accomp', [
                    'milestones',
                ]]]
            ],
            buttonStyle: {
                "background-color": "#2F122A",
                "border-color": "#BC48A8",
            },
            unlocked(){return hasMilestone('misc', 2)}
        },
    },
    branches: ['field'],
    tierReq() {   // UP TO TIER 30
        const tier = player.city.tier //for easier access, as there are a lot of manually inputted reqs
        if(tier.lte(1)){return new Decimal(300)}
        if(tier.lte(2)){return new Decimal(900)}
        if(tier.lte(3)){return new Decimal(2700)}
        if(tier.lte(4)){return new Decimal(10800)}
        if(tier.lte(5)){return new Decimal(54000)}
        if(tier.lte(6)){return new Decimal(216000)}
        if(tier.lte(7)){return new Decimal(864000)}
        if(tier.lte(8)){return new Decimal(2.592e6)}
        if(tier.lte(9)){return new Decimal(7777777)}
        if(tier.lte(10)){return new Decimal(3.11e7)}
        if(tier.lte(11)){return new Decimal(1.555e8)}
        if(tier.lte(12)){return new Decimal(7.776e8)}
        if(tier.lte(13)){return new Decimal(3.11e9)}
        if(tier.lte(14)){return new Decimal(3.11e10)}
        if(tier.lte(15)){return new Decimal(4.666e11)}
        if(tier.lte(16)){return new Decimal(9.331e12)}
        if(tier.lte(17)){return new Decimal(9.331e14)}
        if(tier.lte(18)){return new Decimal(2.799e16)}
        if(tier.lte(19)){return new Decimal(8.398e17)}
        if(tier.lte(20)){return new Decimal(2.519e19)}
        if(tier.lte(21)){return new Decimal(7.558e20)}
        if(tier.lte(22)){return new Decimal(2.267e22)}
        if(tier.lte(23)){return new Decimal(6.802e23)}
        if(tier.lte(24)){return new Decimal(2.041e25)}
        if(tier.lte(25)){return new Decimal(6.122e26)}
        if(tier.lte(26)){return new Decimal(6.121e29)}
        if(tier.lte(27)){return new Decimal(6.121e32)}
        if(tier.lte(28)){return new Decimal(6.122e35)}
        if(tier.lte(29)){return new Decimal(6.121e37)}
        if(tier.lte(30)){return new Decimal('1e1e100')}
    },
    tierEffect() {// UP TO TIER 30
        const tier = player.city.tier //see comment in tierReq()
        if(tier.lte(1)){return new Decimal(1)}
        if(tier.lte(2)){return new Decimal(5)}
        if(tier.lte(3)){return new Decimal(7.5)}
        if(tier.lte(4)){return new Decimal(11.25)}
        if(tier.lte(5)){return new Decimal(16.88)}
        if(tier.lte(6)){return new Decimal(25.31)}
        if(tier.lte(7)){return new Decimal(37.97)}
        if(tier.lte(8)){return new Decimal(56.95)}
        if(tier.lte(9)){return new Decimal(85.43)}
        if(tier.lte(10)){return new Decimal(128)}
        if(tier.lte(11)){return new Decimal(192)}
        if(tier.lte(12)){return new Decimal(288)}
        if(tier.lte(13)){return new Decimal(432)}
        if(tier.lte(14)){return new Decimal(649)}
        if(tier.lte(15)){return new Decimal(973)}
        if(tier.lte(16)){return new Decimal(1459)}
        if(tier.lte(17)){return new Decimal(2189)}
        if(tier.lte(18)){return new Decimal(3284)}
        if(tier.lte(19)){return new Decimal(9852)}
        if(tier.lte(20)){return new Decimal(29557)}
        if(tier.lte(21)){return new Decimal(88673)}
        if(tier.lte(22)){return new Decimal(266020)}
        if(tier.lte(23)){return new Decimal(798016)}
        if(tier.lte(24)){return new Decimal(2.394e6)}
        if(tier.lte(25)){return new Decimal(7.182e6)}
        if(tier.lte(26)){return new Decimal(2.155e7)}
        if(tier.lte(27)){return new Decimal(6.464e7)}
        if(tier.lte(28)){return new Decimal(1.939e8)}
        if(tier.lte(29)){return new Decimal(3.879e8)}
        if(tier.lte(30)){return new Decimal(7.757e8)}
    },
    tierName() {  // UP TO TIER 30
        const tier = player.city.tier //see comment in tierReq()
        if(tier.lte(1)){return "Normal Grass"}
        if(tier.lte(2)){return "Light Grass"}
        if(tier.lte(3)){return "Copper Grass"}
        if(tier.lte(4)){return "Tin Grass"}
        if(tier.lte(5)){return "Bronze Grass"}
        if(tier.lte(6)){return "Silver Grass"}
        if(tier.lte(7)){return "Gold Grass"}
        if(tier.lte(8)){return "Diamond Grass"}
        if(tier.lte(9)){return "White Crystal Grass"}
        if(tier.lte(10)){return "Green Crystal Grass"}
        if(tier.lte(11)){return "Blue Crystal Grass"}
        if(tier.lte(12)){return "Indigo Crystal Grass"}
        if(tier.lte(13)){return "Purple Crystal Grass"}
        if(tier.lte(14)){return "Pink Crystal Grass"}
        if(tier.lte(15)){return "Red Crystal Grass"}
        if(tier.lte(16)){return "Orange Crystal Grass"}
        if(tier.lte(17)){return "Yellow Crystal Grass"}
        if(tier.lte(18)){return "Zebra Grass"}
        if(tier.lte(19)){return "Polka Dot Grass"}
        if(tier.lte(20)){return "Checker Board Grass"}
        if(tier.lte(21)){return "Triangle Grass"}
        if(tier.lte(22)){return "Hexagon Grass"}
        if(tier.lte(23)){return "Fractal Grass"}
        if(tier.lte(24)){return "Arrow Grass"}
        if(tier.lte(25)){return "Puzzle Grass"}
        if(tier.lte(26)){return "Grassman #1337 Grass"}
        if(tier.lte(27)){return "Plated Grass"}
        if(tier.lte(28)){return "Template Grass"}
        if(tier.lte(29)){return "Space White Grass"}
        if(tier.lte(30)){return "Vibrant Grass"}
    },
    tierColor() { // UP TO TIER 17
        if(!options.tierColors) return '#4BDC13'
        const tier = player.city.tier //see comment in tierReq()
        if(tier.lte(1)){return "#4BDC13"}
        if(tier.lte(2)){return "#CBFF93"}
        if(tier.lte(3)){return "#B87333"}
        if(tier.lte(4)){return "#C3D4B5"}
        if(tier.lte(5)){return "#CD7F32"}
        if(tier.lte(6)){return "#C0C0C0"}
        if(tier.lte(7)){return "#FFD700"}
        if(tier.lte(8)){return "#B9F2FF"}
        if(tier.lte(9)){return "#FFFFFF"}
        if(tier.lte(10)){return "#00FF00"}
        if(tier.lte(11)){return "#0000FF"}
        if(tier.lte(12)){return "#4400FF"}
        if(tier.lte(13)){return "#8800DD"}
        if(tier.lte(14)){return "#FF10F0"}
        if(tier.lte(15)){return "#FF0000"}
        if(tier.lte(16)){return "#FF5F15"}
        if(tier.lte(17)){return "#FFC000"}
        if(tier.lte(18)){return "Zebra Grass"}
        if(tier.lte(19)){return "Polka Dot Grass"}
        if(tier.lte(20)){return "Checker Board Grass"}
        if(tier.lte(21)){return "Triangle Grass"}
        if(tier.lte(22)){return "Hexagon Grass"}
        if(tier.lte(23)){return "Fractal Grass"}
        if(tier.lte(24)){return "Arrow Grass"}
        if(tier.lte(25)){return "Puzzle Grass"}
        if(tier.lte(26)){return "Grassman #1337 Grass"}
        if(tier.lte(27)){return "Plated Grass"}
        if(tier.lte(28)){return "Template Grass"}
        if(tier.lte(29)){return "Space White Grass"}
        if(tier.lte(30)){return "Vibrant Grass"}
    },
    update(diff) {
        if(player.city.tp.gte(tmp.city.tierReq)) {
            player.city.tp = player.city.tp.sub(tmp.city.tierReq)
            player.city.tier = player.city.tier.add(1)
        }
        player.city.points = player.city.points.add(this.getResetGain().times(diff).times(tmp.auto.buyables[22].effect))
    },
    gainMult() {
        let gain = tmp.field.buyables[22].effect
        gain = gain.times(tmp.plat.buyables[14].effect)
        gain = gain.times(tmp.crystal.buyables[14].effect)
        gain = gain.times(tmp.perks.buyables[23].effect)
        gain = gain.times(tmp.accomp.milestones[3].effect)
        return gain
    },
    buyables: {
        11: {
            display() {
                return `<h2>Grass Value II</h2><br>
                Increases grass value by <b>+50%</b> per level<br>
                Grass value is increased by <b>50%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(2).add(1).times(y.pow_base(1.5))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        12: {
            display() {
                return `<h2>XP II</h2><br>
                Increases experience gained by <b>+50%</b> per level<br>
                Experience gained is increased by <b>50%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).times(3).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(2).add(1).times(y.pow_base(1.5))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        13: {
            display() {
                return `<h2>TP</h2><br>
                Increases experience gained by <b>+100%</b> per level<br>
                Experience gained is <b>Doubled</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).times(50).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.add(1).times(y.pow_base(2))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        14: {
            display() {
                return `<h2>Crystals</h2><br>
                Increases crystals earned by <b>+20%</b> per level<br>
                Increases crystals earned by <b>25%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/150
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.15)).times(150).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(5).add(1).times(y.pow_base(1.25))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(150)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(150),
        },
    },
    grassTP() {
        let gain = new Decimal(1)
        gain = gain.times(tmp.city.buyables[13].effect)
        gain = gain.times(tmp.crystal.buyables[13].effect)
        gain = gain.times(tmp.perks.buyables[22].effect)
        gain = gain.times(tmp.accomp.milestones[2].effect)
        return gain
    },
    doReset(layer) {
        if(layer === "crystal") {
            if(player.city.tier.gte(tmp.accomp.milestones[4].goal[0])){player.accomp.crys1 = tmp.accomp.milestones[4].goal[1]}
            if(player.city.tier.gte(tmp.accomp.milestones[5].goal[0]) && tmp.city.totalUpgrades.lte(10)){player.accomp.crys2 = tmp.accomp.milestones[5].goal[1]}
            if(player.city.tier.gte(tmp.accomp.milestones[6].goal[0]) && tmp.city.totalUpgrades.lte(0)){player.accomp.crys3 = tmp.accomp.milestones[6].goal[1]}
            if(player.city.tier.gte(tmp.accomp.milestones[7].goal[0]) && player.city.totalGrasses.add(tmp.field.totalUpgrades).lte(25)){player.accomp.crys4 = tmp.accomp.milestones[7].goal[1]}
            if(player.city.tier.gte(tmp.accomp.milestones[8].goal[0]) && player.crystal.resetTime<=600){player.accomp.crys5 = tmp.accomp.milestones[8].goal[1]}
        }
        layerDataReset('city', [])
    },
    totalUpgrades() {
        let amt = new Decimal(0)
        amt = amt.add(getBuyableAmount('city', 11))
        amt = amt.add(getBuyableAmount('city', 12))
        amt = amt.add(getBuyableAmount('city', 13))
        amt = amt.add(getBuyableAmount('city', 14))
        return amt
    },
})

addLayer('auto', {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        platinum: new Decimal(0),
    }},
    color: "#DC4848",
    resource: "prestige points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 20, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false},
    buyables: {
        11: {
            display() {
                return `<h2>Autocut</h2><br>
                Autocuts <b>3%</b> of the grass that spawns<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5
                Effect: ${format(buyableEffect(this.layer, this.id)*100)}%
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} grass`
            },
            cost(x) {
                return x.pow_base(10).times(1000)
            },
            effect(x) {
                return x.div(100).times(3).toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(5)) return false
                else return player.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(5),
        },
        12: {
            display() {
                return `<h2>Autocut Value</h2><br>
                Autocut grass is worth <b>+100%</b> more grass, XP and TP<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5
                Effect: x${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} PP`
            },
            cost(x) {
                return x.pow_base(4).times(10)
            },
            effect(x) {
                return x.add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(5)) return false
                else return player.city.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.city.points = player.city.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(5),
            unlocked(){return hasMilestone('misc', 0)},
        },
        13: {
            display() {
                return `<h2>Grass Upgrade Autobuy</h2><br>
                Autobuys levels of the <b>Grass Value, More Grass and Grow Speed</b> upgrades<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/1
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} PP`
            },
            cost(x) {
                return new Decimal(100)
            },
            effect(x) {
                return x.gte(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(1)) return false
                else return player.city.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.city.points = player.city.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return hasMilestone('misc', 0)},
        },
        14: {
            display() {
                return `<h2>Grass Upgrade Autobuy II</h2><br>
                Autobuys levels of the <b>XP, Range and PP</b> upgrades<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/1
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} PP`
            },
            cost(x) {
                return new Decimal(1000)
            },
            effect(x) {
                return x.gte(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(1)) return false
                else return player.city.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.city.points = player.city.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return hasMilestone('misc', 0)},
        },
        21: {
            display() {
                return `<h2>Perk Save P</h2><br>
                Lets you keep perks and perk upgrades when you prestige, you will only earn perks if you go past your best perks earned<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/1
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} PP`
            },
            cost(x) {
                return new Decimal(500)
            },
            effect(x) {
                return x.gte(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(1)) return false
                else return player.city.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.city.points = player.city.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return hasMilestone('misc', 0)},
        },
        22: {
            display() {
                return `<h2>Prestige Generation</h2><br>
                Passively generate <b>1%</b> of PP earned on prestige each second<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10
                Effect: ${formatWhole(buyableEffect(this.layer, this.id)*100)}%
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} PP`
            },
            cost(x) {
                return x.div(5).add(1).times(10000).times(x.pow_base(1.35))
            },
            effect(x) {
                return x.div(100)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(10)) return false
                else return player.city.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.city.points = player.city.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(10),
            unlocked(){return hasMilestone('misc', 0)},
        },
        23: {
            display() {
                return `<h2>Perk Save C</h2><br>
                Keep perks on crystallize similar to Perk Save P<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/1
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} crystals`
            },
            cost(x) {
                return new Decimal(750)
            },
            effect(x) {
                return x.gte(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(1)) return false
                else return player.crystal.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.crystal.points = player.crystal.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return hasMilestone('misc', 2)},
        },
        24: {
            display() {
                return `<h2>Crystal Generation</h2><br>
                Passively generate <b>1%</b> of crystals earned on crystallize each second<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10
                Effect: ${formatWhole(buyableEffect(this.layer, this.id)*100)}%
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)} grass`
            },
            cost(x) {
                return x.div(5).add(1).times(10000).times(x.pow_base(1.35))
            },
            effect(x) {
                return x.div(100)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(10)) return false
                else return player.crystal.points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.crystal.points = player.crystal.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(10),
            unlocked(){return hasMilestone('misc', 2)},
        },
    },
})

addLayer('misc', {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FCDC1B",
    resource: "prestige points", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1000, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    nodeStyle: {
        'background-image': 'url(resources/unlocks-icon.webp)',
        'background-size': 'contain',
    },
    tooltip() {
        return `<h2>UNLOCKS</h2><br>${formatWhole(player.misc.milestones.length / Object.keys(tmp.misc.milestones).length * 100)}%`
    },
    tabFormat: [
        ['display-text', 'Unlocks here are <u>not reset ever</u>'],
        'blank',
        'milestones'
    ],
    milestones: {
        0: {
            requirementDescription: "Prestige",
            effectDescription: "Unlock Tiers and Crystallize",
            done() { return player.city.points.gte(1) },
            style: {
                "width": "600px",
            },
        },
        1: {
            requirementDescription: "Tier 3",
            effectDescription: "Unlock Platinum",
            done() { return player.city.tier.gte(3) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 0)},
        },
        2: {
            requirementDescription: "Crystallize",
            effectDescription: "Unlock Accomplishments and more perks",
            done() { return player.crystal.points.gte(1) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 0)},
        },
        3: {
            requirementDescription: "Level 201",
            effectDescription: "Unlock Industrial Zone",
            done() { return player.field.level.gte(201) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 2)},
        },
        4: {
            requirementDescription: "400 Max Grass in Field",
            effectDescription: "Max grass past 400 doesn't increase max grass, but instead increases all gains from manually cut grass",
            done() { return tmp.field.maxGrass >= 400 },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 2)},
        },
        5: {
            requirementDescription: "Level 241",
            effectDescription: "Unlock the Control Panel",
            done() { return player.field.level.gte(241) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 2)},
        },
        6: {
            requirementDescription: "1 Grasshop",
            effectDescription: "Unlock prestige upgrade autobuyer upgrades",
            done() { return player.indus.points.gte(1) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 2)},
        },
        7: {
            requirementDescription: "5 Grasshops",
            effectDescription: "Unlock crystal upgrade autobuyer upgrades",
            done() { return player.indus.points.gte(5) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 6)},
        },
        8: {
            requirementDescription: "6 Grasshops",
            effectDescription: "Unlock perk autobuyer upgrades",
            done() { return player.indus.points.gte(6) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 7)},
        },
        9: {
            requirementDescription: "8 Grasshops",
            effectDescription: "Unlock steelie and steelie accomplishments",
            done() { return player.indus.points.gte(8) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 8)},
        },
        10: {
            requirementDescription: "9 Grasshops",
            effectDescription: "Unlock factory related perks",
            done() { return player.indus.points.gte(9) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 9)},
        },
        11: {
            requirementDescription: "11 Grasshops",
            effectDescription: "Unlock two more generator upgrades related to charge",
            done() { return player.indus.points.gte(11) },
            style: {
                "width": "600px",
            },
            unlocked(){return hasMilestone('misc', 10)},
        },
    },
    branches: ['field'],
})

addLayer('crystal', {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        resetTime: 0,
    }},
    color: "#FF69B4",
    resource: "crystals", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false},
    baseResource: 'levels',
    baseAmount() {return player.field.level},
    requires: new Decimal(31),
    getResetGain() {
        return player.city.tier.times(4).times(player.city.tier.pow_base(1.1)).times(tmp.crystal.gainMult).floor()
    },
    getNextAt(){return new Decimal(31)},
    prestigeButtonText() {
        return `Reach level 101 to crystallize<br><br>
        You will earn ${formatWhole(tmp.crystal.getResetGain)} crystals`
    },
    canReset() {
        return player.field.level.gte(101)
    },
    gainMult() {
        let gain = new Decimal(1)
        gain = gain.times(tmp.plat.buyables[21].effect)
        gain = gain.times(tmp.city.buyables[14].effect)
        gain = gain.times(tmp.perks.buyables[24].effect)
        gain = gain.times(tmp.accomp.milestones[5].effect)
        gain = gain.times(tmp.accomp.milestones[8].effect)
        return gain
    },
    buyables: {
        11: {
            display() {
                return `<h2>Grass Value III</h2><br>
                Increases grass value by <b>+50%</b> per level<br>
                Grass value is increased by <b>50%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).times(4).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(2).add(1).times(y.pow_base(1.5))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        12: {
            display() {
                return `<h2>XP III</h2><br>
                Increases experience gained by <b>+50%</b> per level<br>
                Experience gain is increased by <b>50%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).times(5).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(2).add(1).times(y.pow_base(1.5))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        13: {
            display() {
                return `<h2>TP II</h2><br>
                Increases TP gained by <b>+100%</b> per level<br>
                TP gain is <b>Doubled</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).times(6).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.add(1).times(y.pow_base(2))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        14: {
            display() {
                return `<h2>PP II</h2><br>
                Increases prestige points earned by <b>+25%</b> per level<br>
                Increases prestige points earned by <b>25%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.div(5).add(1).times(x.pow_base(1.12)).times(11).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(4).add(1).times(y.pow_base(1.25))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(500),
        },
        21: {
            display() {
                return `<h2>Grow Amount</h2><br>
                Increases grass grow amount by <b>1</b><br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/1
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(20)
            },
            effect(x) {
                return x.toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(1)) return false
                else return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(1),
        },
    },
    update(diff) {
        player.crystal.points = player.crystal.points.add(this.getResetGain().times(tmp.auto.buyables[24].effect).times(diff))
    },
})

addLayer('accomp', {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        pres1: new Decimal(0),
        pres2: new Decimal(0),
        pres3: new Decimal(0),
        pres4: new Decimal(0),
        crys1: new Decimal(0),
        crys2: new Decimal(0),
        crys3: new Decimal(0),
        crys4: new Decimal(0),
        crys5: new Decimal(0),
        steel1: new Decimal(0),
        steel2: new Decimal(0),
        steel3: new Decimal(0),
        steel4: new Decimal(0),
        anon1: new Decimal(0),
        anon2: new Decimal(0),
        impossible: new Decimal(0),
    }},
    color: "#BC48A8",
    resource: "nuh uhs", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 9, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return false},
    milestones: {
        0: {
            requirementDescription: "Just Prestige",
            effectDescription() {return `Just prestige at the goal | Multiplies grass gain<br>Goal: Level ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | Effect: x${formatWhole(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.pres1)}/8 times`},
            done() { return player.accomp.pres1.gte(8) },
            effect() { return player.accomp.pres1.pow_base(3) },
            goal() {
                const num = player.accomp.pres1
                if(num.lt(1)){return [new Decimal(101), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(141), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(181), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(221), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(261), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(301), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(361), new Decimal(7)]}
                if(num.lt(8)){return [new Decimal(441), new Decimal(8)]}
                else return [new Decimal(541), new Decimal(8)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.pres1.gte(8)?'4BDCDC':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.pres1.gte(8)?'BC48A8':''}`
                }
            },
        },
        1: {
            requirementDescription: "Less Grass",
            effectDescription() {return `Prestige with 100 or less grass upgrades | Multiplies experience gain<br>Goal: Level ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${formatWhole(tmp.field.totalUpgrades)}/100 Upgrades | Effect: x${formatWhole(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.pres2)}/8 times`},
            done() { return player.accomp.pres2.gte(8) },
            effect() { return player.accomp.pres2.pow_base(2) },
            goal() {
                const num = player.accomp.pres2
                if(num.lt(1)){return [new Decimal(51), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(91), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(131), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(171), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(231), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(291), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(351), new Decimal(7)]}
                if(num.lt(8)){return [new Decimal(411), new Decimal(8)]}
                else return [new Decimal(471), new Decimal(8)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.pres2.gte(8)?'4BDCDC':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.pres2.gte(8)?'BC48A8':''}`
                }
            },
        },
        2: {
            requirementDescription: "Grassless",
            effectDescription() {return `Prestige without any grass upgrades | Multiplies TP gain<br>Goal: Level ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${formatWhole(tmp.field.totalUpgrades)}/0 Upgrades | Effect: x${formatWhole(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.pres3)}/8 times`},
            done() { return player.accomp.pres3.gte(8) },
            effect() { return player.accomp.pres3.pow_base(2) },
            goal() {
                const num = player.accomp.pres3
                if(num.lt(1)){return [new Decimal(51), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(71), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(91), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(121), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(161), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(221), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(281), new Decimal(7)]}
                if(num.lt(8)){return [new Decimal(341), new Decimal(8)]}
                else return [new Decimal(401), new Decimal(8)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.pres3.gte(8)?'4BDCDC':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.pres3.gte(8)?'BC48A8':''}`
                }
            },
        },
        3: {
            requirementDescription: "Prestige Speedrun",
            effectDescription() {return `Prestige in under a minute | Multiplies PP gain<br>Goal: Level ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${formatWhole(player.city.resetTime)}/60s | Effect: x${format(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.pres4)}/8 times`},
            done() { return player.accomp.pres4.gte(8) },
            effect() { return player.accomp.pres4.pow_base(1.5) },
            goal() {
                const num = player.accomp.pres4
                if(num.lt(1)){return [new Decimal(51), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(91), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(131), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(171), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(211), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(271), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(331), new Decimal(7)]}
                if(num.lt(8)){return [new Decimal(361), new Decimal(8)]}
                else return [new Decimal(401), new Decimal(8)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.pres4.gte(8)?'4BDCDC':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.pres4.gte(8)?'BC48A8':''}`
                }
            },
        },
        4: {
            requirementDescription: "Just Crystallize",
            effectDescription() {return `Just crystallize at the goal | Adds perk gain per level<br>Goal: Tier ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | Effect: +${formatWhole(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.crys1)}/9 times`},
            done() { return player.accomp.crys1.gte(9) },
            effect() { return player.accomp.crys1 },
            goal() {
                const num = player.accomp.crys1
                if(num.lt(1)){return [new Decimal(9), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(13), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(15), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(17), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(19), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(21), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(23), new Decimal(7)]}
                if(num.lt(8)){return [new Decimal(25), new Decimal(8)]}
                if(num.lt(9)){return [new Decimal(27), new Decimal(9)]}
                else return [new Decimal(29), new Decimal(9)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.crys1.gte(9)?'FF69B4':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.crys1.gte(9)?'BC48A8':''}`
                }
            },
        },
        5: {
            requirementDescription: "Less Prestige",
            effectDescription() {return `Crystallize with 10 or less prestige upgrades | Multiplies crystal gain<br>Goal: Tier ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${formatWhole(tmp.city.totalUpgrades)}/10 Upgrades | Effect: x${format(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.crys2)}/5 times`},
            done() { return player.accomp.crys2.gte(5) },
            effect() { return player.accomp.crys2.pow_base(1.2) },
            goal() {
                const num = player.accomp.crys2
                if(num.lt(1)){return [new Decimal(9), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(11), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(13), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(15), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(17), new Decimal(5)]}
                else return [new Decimal(19), new Decimal(5)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.crys2.gte(5)?'FF69B4':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.crys2.gte(5)?'BC48A8':''}`
                }
            },
        },
        6: {
            requirementDescription: "Prestigeless",
            effectDescription() {return `Crystallize without any prestige upgrades | Multiplies grass gain<br>Goal: Tier ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${formatWhole(tmp.city.totalUpgrades)}/0 Upgrades | Effect: x${format(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.crys3)}/5 times`},
            done() { return player.accomp.crys3.gte(5) },
            effect() { return player.accomp.crys3.pow_base(1.4) },
            goal() {
                const num = player.accomp.crys3
                if(num.lt(1)){return [new Decimal(9), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(11), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(13), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(15), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(17), new Decimal(5)]}
                else return [new Decimal(19), new Decimal(5)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.crys3.gte(5)?'FF69B4':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.crys3.gte(5)?'BC48A8':''}`
                }
            },
        },
        7: {
            requirementDescription: "Less Grass II",
            effectDescription() {return `Crystallize with 25 or less grass upgrades total | Increases platinum spawn chance<br>Goal: Tier ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${formatWhole(player.city.totalGrasses.add(tmp.field.totalUpgrades))}/25 Upgrades | Effect: +${format(tmp.accomp.milestones[this.id].effect * 10)}%<br>Completed ${formatWhole(player.accomp.crys4)}/9 times`},
            done() { return player.accomp.crys4.gte(9) },
            effect() { return player.accomp.crys4.div(1000).toNumber() },
            goal() {
                const num = player.accomp.crys4
                if(num.lt(1)){return [new Decimal(9), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(15), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(18), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(21), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(24), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(26), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(27), new Decimal(7)]}
                if(num.lt(8)){return [new Decimal(28), new Decimal(8)]}
                if(num.lt(9)){return [new Decimal(29), new Decimal(9)]}
                else return [new Decimal(30), new Decimal(9)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.crys4.gte(9)?'FF69B4':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.crys4.gte(9)?'BC48A8':''}`
                }
            },
        },
        8: {
            requirementDescription: "Crystallize Speedrun",
            effectDescription() {return `Crystallize within 10 minutes | Multiplies crystal gain<br>Goal: Tier ${formatWhole(tmp.accomp.milestones[this.id].goal[0])} | ${format(player.crystal.resetTime)}/600s | Effect: x${format(tmp.accomp.milestones[this.id].effect)}<br>Completed ${formatWhole(player.accomp.crys5)}/7 times`},
            done() { return player.accomp.crys5.gte(7) },
            effect() { return player.accomp.crys5.pow_base(1.2) },
            goal() {
                const num = player.accomp.crys5
                if(num.lt(1)){return [new Decimal(9), new Decimal(1)]}
                if(num.lt(2)){return [new Decimal(11), new Decimal(2)]}
                if(num.lt(3)){return [new Decimal(13), new Decimal(3)]}
                if(num.lt(4)){return [new Decimal(15), new Decimal(4)]}
                if(num.lt(5)){return [new Decimal(17), new Decimal(5)]}
                if(num.lt(6)){return [new Decimal(19), new Decimal(6)]}
                if(num.lt(7)){return [new Decimal(21), new Decimal(7)]}
                else return [new Decimal(23), new Decimal(7)]
            },
            style() {
                return {
                    "background-color": `#${player.accomp.crys5.gte(9)?'FF69B4':''}`,
                    "box-shadow": `0 0 10px #${player.accomp.crys5.gte(9)?'BC48A8':''}`
                }
            },
        },
    },
    update(diff) {
        if(hasMilestone('misc', 2)){player.accomp.unlocked = true}
    }
})
