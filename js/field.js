addLayer("field", {
    name: "grass", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        fieldGrass: 0,
        timeToGrass: 1,
        autoCutTime: 1,
        level: new Decimal(1),
        exp: new Decimal(0),
        bestGrass: new Decimal(0),
    }},
    color: "#4BDC13",
    resource: "grass", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    update(diff) {
        player.field.points = player.points
        if (tmp.field.grassPerSec <= 1 / diff) {
            player.field.timeToGrass -= diff
            if(player.field.timeToGrass <= 0) {
                layers.field.addGrass(tmp.field.grassPerGrow)
                player.field.timeToGrass = Math.max(player.field.timeToGrass + tmp.field.grassTimer, 0)
            }
        } else {
            layers.field.addGrass(Math.floor(tmp.field.grassPerSec * diff * tmp.field.grassPerGrow))
        }
        if(player.field.exp.gte(layers.field.expToNextLevel())) {
            player.field.exp = player.field.exp.sub(layers.field.expToNextLevel())
            player.field.level = player.field.level.add(1)
        }
        player.field.exp = player.field.exp.add(tmp.field.grassXP.times(tmp.field.autoCutRate).times(diff).times(tmp.auto.buyables[12].effect))
        if(hasMilestone('misc', 0)) player.city.tp = player.city.tp.add(Decimal.times(tmp.field.autoCutRate, diff).times(tmp.city.grassTP).times(tmp.auto.buyables[12].effect))
        if(player.points.gte(player.field.bestGrass)){player.field.bestGrass = player.points}
        if(hasMilestone('misc', 1)) {
            player.auto.platinum = player.auto.platinum.add(Decimal.times(diff, 0.004).times(3).times(tmp.auto.buyables[12].effect))
        }
    },
    automate() {
        if(tmp.auto.buyables[13].effect) {
            if(tmp.field.buyables[11].canAfford){layers.field.buyables[11].buy()}
            if(tmp.field.buyables[12].canAfford){layers.field.buyables[12].buy()}
            if(tmp.field.buyables[13].canAfford){layers.field.buyables[13].buy()}
        }
        if(tmp.auto.buyables[14].effect) {
            if(tmp.field.buyables[14].canAfford){layers.field.buyables[14].buy()}
            if(tmp.field.buyables[21].canAfford){layers.field.buyables[21].buy()}
            if(tmp.field.buyables[22].canAfford){layers.field.buyables[22].buy()}
        }
    },
    grid: {
        rows: 20, // If these are dynamic make sure to have a max value as well!
        cols: 20,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id, iteration = 0) { 
            if (data != 0) {
                const grassMult = layers.field.maxGrass(true)
                player.points = player.points.add(tmp.field.grassValue.times(grassMult))
                player.field.exp = player.field.exp.add(tmp.field.grassXP.times(grassMult))
                if(hasMilestone('misc', 0)) player.city.tp = player.city.tp.add(tmp.city.grassTP.times(grassMult))
                if(data >= 2) player.auto.platinum = player.auto.platinum.add(3 * grassMult)
                setGridData(this.layer, id, 0)
                player.field.fieldGrass -= 1
            }
            if(iteration <= tmp.field.range - 2) {
                const modifiers = [
                    -101, -100, -99,
                    -1, 1,
                    99, 100, 101
                ]
                setTimeout(() => {
                    for (let index = 0; index < modifiers.length; index++) {
                        const modifier = modifiers[index];
                        if(id + modifier <= 2020 && id + modifier >= 101 && (id + modifier) % 100 <= 20 && (id + modifier) % 100 >= 1) {
                            layers.field.grid.onClick(getGridData(this.layer, id + modifier), id + modifier, iteration + 1)
                        }
                    }
                }, 50);
            }
        },
        getDisplay(data, id) {
            return ''
        },
        getStyle(data, id) {
            let colorOfGrid = function() {
                if(data >= 2) return "#C5D4E2"
                if(data >= 1) return tmp.city.tierColor
                else return '#256C0B'
            }
            let border = function() {
                return (id == 101 ? '15px ' : '0px ') + (id == 120 ? '15px ' : '0px ') + (id == 2020 ? '15px ' : '0px ') + (id == 2001 ? '15px' : '0px')
            }
            let borderWidth = function(pos) {
                const x = pos % 100
                const y = Math.floor(pos / 100)
                let width = (y == 1 ? '4px' : '0px') + ' ' + (x == 20 ? '4px' : '0px') + ' ' + (y == 20 ? '4px' : '0px') + ' ' + (x == 1 ? '4px' : '0px')
                return width
            }
            return {
                'width': '30px',
                'height': '30px',
                'background-color': colorOfGrid(),
                'border-radius': border(),
                'border-width': borderWidth(id),
            }
        }
    },
    tabFormat: {
        "The Field": {
            content: [
                'main-display',
                ['bar', 'level'],
                ['bar', 'tier'],
                'blank',
                ['display-text', function() {
                    let text = `You have <h2 style="color: rgb(35, 123, 236); text-shadow: rgb(35, 123, 236) 0px 0px 10px;">${formatWhole(player.perks.points)}</h2> perks`
                    if(hasMilestone('misc', 1)) text = text + `, <h2 style="color: #C5D4E2; text-shadow: #C5D4E2 0px 0px 10px;">${formatWhole(player.auto.platinum)}</h2> platinum`
                    return text
                }],
                'blank',
                ['display-text', function() {
                    return `Grass: ${formatWhole(player.field.fieldGrass)}/${formatWhole(tmp.field.maxGrass)} |
                    +${formatWhole(tmp.field.grassPerGrow)} in: ${formatTime(player.field.timeToGrass)} |
                    +${format(tmp.field.grassPerSec)}/sec<br>
                    Range: ${formatWhole(tmp.field.range)} |
                    AC: ${format(tmp.field.autoCutRate)}/sec`
                }],
                'blank',
                'grid',
                'blank',
            ],
            buttonStyle: {
                "background-color": "#123704",
            },
        },
        "Grass Upgrades": {
            content: [
                'main-display',
                ['bar', 'level'],
                ['bar', 'tier'],
                'blank',
                'buyables',
                'blank',
            ],
            buttonStyle: {
                "background-color": "#123704",
            },
        },
        "Perk Upgrades": {
            content: [
                'main-display',
                ['bar', 'level'],
                ['bar', 'tier'],
                'blank',
                ['layer-proxy', ['perks', [
                    'main-display',
                    'blank',
                    'buyables',
                    'blank',
                ]]]
            ],
            buttonStyle: {
                "background-color": "#081D3B",
                "border-color": "#237BEC"
            },
        },
        "Plat Upgrades": {
            content: [
                'main-display',
                ['bar', 'level'],
                ['bar', 'tier'],
                'blank',
                ['display-text', function() {
                    return `You have <h2 style="color: #C5D4E2; text-shadow: #C5D4E2 0px 0px 10px;">${formatWhole(player.auto.platinum)}</h2> platinum<br>Platinum spawns instead of grass 0.40% of the time`
                }],
                'blank',
                ['layer-proxy', ['plat', [
                    'buyables',
                ]]]
            ],
            buttonStyle: {
                "background-color": "#313538",
                "border-color": "#C5D4E2"
            },
        },
    },
    buyables: {
        11: {
            display() {
                return `<h2>Grass Value</h2><br>
                Increases grass value by <b>+100%</b> per level<br>
                Grass value is <b>Doubled</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/700
                Effect: x${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.add(1).times(10).times(x.pow_base(1.12)).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.add(1).times(y.pow_base(2))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(700)) return false
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
            purchaseLimit: new Decimal(700),
        },
        12: {
            display() {
                return `<h2>More Grass</h2><br>
                Increases grass cap by <b>1</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/500
                Effect: +${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.add(1).times(25).times(x.pow_base(1.16)).floor()
            },
            effect(x) {
                return x.toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(500)) return false
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
            purchaseLimit: new Decimal(500),
        },
        13: {
            display() {
                return `<h2>Grow Speed</h2><br>
                Increases grass grow speed by <b>10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/250
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.add(1).times(100).times(x.pow_base(1.35)).floor()
            },
            effect(x) {
                return x.toNumber()/10 + 1
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(250)) return false
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
            purchaseLimit: new Decimal(250),
        },
        14: {
            display() {
                return `<h2>XP Bonus</h2><br>
                Increases experience (XP) gained by <b>+100%</b> per level<br>
                Experience gain is <b>Doubled</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/600
                Effect: x${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.add(1).times(100).times(x.pow_base(1.12)).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.add(1).times(y.pow_base(2))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(600)) return false
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
            purchaseLimit: new Decimal(600),
        },
        21: {
            display() {
                return `<h2>Range</h2><br>
                Increases grass cut range by <b>1</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/3
                Effect: +${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.add(1).times(5000).times(x.pow_base(10)).floor()
            },
            effect(x) {
                return x.toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(3)) return false
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
            purchaseLimit: new Decimal(3),
        },
        22: {
            display() {
                return `<h2>PP</h2><br>
                Increases prestige points earned by <b>+10%</b><br>
                Increases prestige points earned by <b>+25%</b> every 25 levels<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/250
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return x.add(1).times(1e10).times(x.pow_base(1.4)).floor()
            },
            effect(x) {
                let y = x.div(25).floor()
                return x.div(10).add(1).times(y.pow_base(1.25))
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(250)) return false
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
            purchaseLimit: new Decimal(250),
        },
    },
    addGrass(amount) {
        for (let grass = 0; grass < amount; grass++) {
            if (player.field.fieldGrass + 1 <= tmp.field.maxGrass && player.field.fieldGrass + 1 <= 400) {
                let tileID = Math.ceil(Math.random() * 20) + Math.ceil(Math.random() * 20) * 100
                while (getGridData(this.layer, tileID) != 0) {
                    tileID = Math.ceil(Math.random() * 20) + Math.ceil(Math.random() * 20) * 100
                }
                let grassType = 1
                if(hasMilestone('misc', 1) && Math.random() <= 0.004) grassType++
                setGridData(this.layer, tileID, grassType)
                player.field.fieldGrass += 1
            }
        }
    },
    bars: {
        level: {
            width: 600,
            height: 40,
            direction: RIGHT,
            progress() {
                return player.field.exp.div(tmp.field.expToNextLevel)
            },
            display() {
                return `Level ${formatWhole(player.field.level)}<br>
                XP: ${formatWhole(player.field.exp)} / ${formatWhole(tmp.field.expToNextLevel)}`
            },
            fillStyle: {
                'background-color': '#237BEC',
            },
            baseStyle: {
                'background-color': '#081D3B',
            },
            textStyle: {
                "text-shadow": '0 0 7px black, 0 0 5px black'
            },
            instant: true,
        },
        tier: {
            width: 600,
            height: 40,
            direction: RIGHT,
            progress() {
                return player.city.tp.div(tmp.city.tierReq)
            },
            display() {
                return `Tier ${formatWhole(player.city.tier)} | ${tmp.city.tierName} | x${format(tmp.city.tierEffect)}<br>
                TP: ${formatWhole(player.city.tp)} / ${formatWhole(tmp.city.tierReq)}`
            },
            fillStyle: {
                'background-color': function(){return options.tierColors?tmp.city.tierColor:'#FFC000'},
            },
            baseStyle: {
                'background-color': '#1D1D1D',
            },
            unlocked(){return hasMilestone('misc', 0)},
            textStyle: {
                "text-shadow": '0 0 7px black, 0 0 5px black'
            },
            instant: true,
        }
    },
    expToNextLevel(level = player.field.level) {
        let req = level.times(50).times(level.sub(1).pow_base(1.1))
        req = req.times(level.div(10).floor().pow_base(1.8))
        if(level.gte(201)) req = req.times(level.sub(191).div(10).floor().pow_base(3))
        return req.floor()
    },
    grassTimer() {
        let time = 1 / ((tmp.field.grassPerSec / tmp.field.grassPerGrow) - tmp.field.autoCutRate)
        if(time <= 0) time = 120
        return time
    },
    maxGrass(forCalc = false) {
        if(!forCalc) return Math.min(5 + tmp.field.buyables[12].effect + tmp.perks.buyables[12].effect, 400)
        else return (5 + tmp.field.buyables[12].effect + tmp.perks.buyables[12].effect) / 400
    },
    nodeStyle: {
        'background-image': 'url(resources/field-icon.webp)',
        'background-size': 'contain',
    },
    tooltip() {
        let text = `<h2>THE FIELD</h2><br>${formatWhole(player.field.points)} grass,<br>
        ${formatWhole(player.perks.points)} perks`
        if(hasMilestone('misc', 1)) {text = text + `,<br>
        ${formatWhole(player.auto.platinum)} platinum`}
        return text
    },
    grassValue() {
        let gain = new Decimal(1)
        gain = gain.times(tmp.field.buyables[11].effect)
        gain = gain.times(tmp.perks.buyables[13].effect)
        gain = gain.times(tmp.city.tierEffect)
        gain = gain.times(tmp.plat.buyables[13].effect)
        gain = gain.times(tmp.city.buyables[11].effect)
        gain = gain.times(tmp.crystal.buyables[11].effect)
        return gain
    },
    grassXP() {
        let gain = new Decimal(1)
        gain = gain.times(tmp.field.buyables[14].effect)
        gain = gain.times(tmp.perks.buyables[14].effect)
        gain = gain.times(tmp.city.tierEffect)
        gain = gain.times(tmp.plat.buyables[12].effect)
        gain = gain.times(tmp.city.buyables[12].effect)
        gain = gain.times(tmp.crystal.buyables[12].effect)
        return gain
    },
    range() {
        let range = 2
        range += tmp.field.buyables[21].effect
        return Math.min(range, 10)
    },
    grassPerSec() {
        return tmp.field.buyables[13].effect * tmp.perks.buyables[11].effect * tmp.field.grassPerGrow
    },
    grassPerGrow() {
        return 1 + tmp.perks.buyables[21].effect + tmp.crystal.buyables[21].effect
    },
    autoCutRate() {
        return (tmp.auto.buyables[11].effect + tmp.plat.buyables[11].effect) * tmp.field.grassPerSec
    }
})

addLayer('perks', {
    type: 'none',
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        total: new Decimal(0),
    }},
    row: 0,
    buyables: {
        11: {
            display() {
                return `<h2>Grow Speed Perk</h2><br>
                Increases grass grow speed by <b>25%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(1)
            },
            effect(x) {
                return x.div(4).add(1).toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(10)) return false
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
            purchaseLimit: new Decimal(10),
        },
        12: {
            display() {
                return `<h2>Cap Perk</h2><br>
                Increases grass cap by <b>10</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10
                Effect: +${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(1)
            },
            effect(x) {
                return x.times(10).toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(10)) return false
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
            purchaseLimit: new Decimal(10),
        },
        13: {
            display() {
                return `<h2>Grass Value Perk</h2><br>
                Increases grass value by <b>+100%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/100
                Effect: x${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(1)
            },
            effect(x) {
                return x.add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(100)) return false
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
            purchaseLimit: new Decimal(100),
        },
        14: {
            display() {
                return `<h2>XP Perk</h2><br>
                Increases experience gained by <b>+10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/50
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(1)
            },
            effect(x) {
                return x.div(10).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(50)) return false
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
            purchaseLimit: new Decimal(50),
            unlocked(){return hasMilestone('misc', 2)}
        },
        21: {
            display() {
                return `<h2>Grow Amount Perk</h2><br>
                Increases grass grow amount by <b>1</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/1
                Effect: +${formatWhole(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(10)
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
        22: {
            display() {
                return `<h2>TP Perk</h2><br>
                Increases TP gained by <b>+10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/50
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(1)
            },
            effect(x) {
                return x.div(10).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(50)) return false
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
            purchaseLimit: new Decimal(50),
            unlocked(){return hasMilestone('misc', 2)}
        },
        23: {
            display() {
                return `<h2>PP Perk</h2><br>
                Increases prestige points earned by <b>+10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/25
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(2)
            },
            effect(x) {
                return x.div(10).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(25)) return false
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
            purchaseLimit: new Decimal(25),
            unlocked(){return hasMilestone('misc', 2)}
        },
        24: {
            display() {
                return `<h2>Crystal Perk</h2><br>
                Increases crystals earned by <b>+10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/25
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(4)
            },
            effect(x) {
                return x.div(10).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(25)) return false
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
            purchaseLimit: new Decimal(25),
            unlocked(){return hasMilestone('misc', 2)}
        },
    },
    update(diff) {
        player.perks.total = player.field.level.sub(1).max(player.perks.total)
        player.perks.points = player.perks.total.sub(
            getBuyableAmount('perks', 11).add(
                getBuyableAmount('perks', 12)).add(
                    getBuyableAmount('perks', 13)).add(
                        getBuyableAmount('perks', 14)).add(
                            getBuyableAmount('perks', 21).times(10)).add(
                                getBuyableAmount('perks', 22).add(
                                    getBuyableAmount('perks', 23).times(2))).add(
                                        getBuyableAmount('perks', 24).times(4))
        )
    },
    color: "#237BEC",
    resource: 'perks',
    layerShown(){return false},
    doReset(layer) {
        let saved = []
        if(layer === 'city' && tmp.auto.buyables[21].effect) saved.push('buyables', 'total', 'points')
        layerDataReset('perks', saved)
    }
})

addLayer('plat', {
    type: 'none',
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    row: 20,
    color: "#C5D4E2",
    resource: 'platinum',
    layerShown(){return false},
    buyables: {
        11: {
            display() {
                return `<h2>Starter AC</h2><br>
                Increases autocut percentage by <b>+2%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5
                Effect: +${formatWhole(buyableEffect(this.layer, this.id) * 100)}%
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(3)
            },
            effect(x) {
                return x.div(100).times(2).toNumber()
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(5)) return false
                else return player.auto.platinum.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.auto.platinum = player.auto.platinum.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(5),
        },
        12: {
            display() {
                return `<h2>Plat XP</h2><br>
                Increases experience gained by <b>+10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/50
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(10)
            },
            effect(x) {
                return x.div(10).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(50)) return false
                else return player.auto.platinum.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.auto.platinum = player.auto.platinum.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(50),
        },
        13: {
            display() {
                return `<h2>Plat GV</h2><br>
                Increases grass value by <b>+10%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/50
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(10)
            },
            effect(x) {
                return x.div(10).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(50)) return false
                else return player.auto.platinum.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.auto.platinum = player.auto.platinum.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(50),
        },
        14: {
            display() {
                return `<h2>Starter PP</h2><br>
                Increases prestige points earned by <b>+20%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(50)
            },
            effect(x) {
                return x.div(5).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(5)) return false
                else return player.auto.platinum.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.auto.platinum = player.auto.platinum.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(5),
        },
        21: {
            display() {
                return `<h2>Starter Crystals</h2><br>
                Increases crystals earned by <b>+20%</b> per level<br>
                Count: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5
                Effect: x${format(buyableEffect(this.layer, this.id))}
                Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            cost(x) {
                return new Decimal(50)
            },
            effect(x) {
                return x.div(5).add(1)
            },
            canAfford() {
                if(getBuyableAmount(this.layer, this.id).gte(5)) return false
                else return player.auto.platinum.gte(tmp[this.layer].buyables[this.id].cost)
            },
            style: {
                'height': '150px',
                'width': '150px',
            },
            buy() {
                player.auto.platinum = player.auto.platinum.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit: new Decimal(5),
        },
    },
})
