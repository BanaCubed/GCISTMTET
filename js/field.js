addLayer('field', {
    row: 0,
    realm: 1,
    startData() { return {
        unlocked: true,
        grass: new Decimal(0),
        totalExp: new Decimal(0),
        growTime: new Decimal(1),
        points: new Decimal(0),
        bestPerks: new Decimal(0),
    }},
    update(diff) {
        player.field.points = player.field.points.add(tmp.field.autoCut.mul(tmp.field.grassOnCut).mul(diff));
        player.field.totalExp = player.field.totalExp.add(tmp.field.expOnCut.mul(tmp.field.autoCut).mul(diff));
        if(player.field.grass.lt(tmp.field.maxGrass || player.field.growTime.gt(0))) { player.field.growTime = player.field.growTime.sub(tmp.field.grassSpeed.mul(diff)); }
        if(player.field.grass.gte(tmp.field.maxGrass)) { player.field.growTime  = player.field.growTime.max(1); }
        if(player.field.growTime.lt(0)) { player.field.grass = player.field.grass.add(player.field.growTime.ceil().mul(-1).mul(tmp.field.grassPerGrow)).min(tmp.field.maxGrass); player.field.growTime = player.field.growTime.add(player.field.growTime.ceil().mul(-1)); }
        if(tmp.field.level.sub(1).mul(tmp.field.perksPerLevel).gt(player.field.bestPerks)) { player.field.bestPerks = tmp.field.level.sub(1).mul(tmp.field.perksPerLevel) }
    },
    automate() {
        if(player.crys.flautomation.includes('21')) {
            buyMaxBuyable('field', 11);
            buyMaxBuyable('field', 12);
            buyMaxBuyable('field', 13);
            buyMaxBuyable('field', 14);
            buyMaxBuyable('field', 15);
            buyMaxBuyable('field', 16);
            buyMaxBuyable('field', 17);
            buyMaxBuyable('field', 18);
            buyMaxBuyable('field', 19);
        }
        if(player.crys.flautomation.includes('31')) {
            buyMaxBuyable('field', 21);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 22);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 23);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 24);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 25);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 26);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 27);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 28);
            tmp.field.unspentPerks = layers.field.unspentPerks();
            buyMaxBuyable('field', 29);
        }
    },
    hotkeys: [{
            key: "g",
            description: "G: Cut grass",
            onPress() { clickClickable('field', 11) },
            unlocked() {return true},
        }, {
            key: "p",
            description: "P: Prestige",
            onPress() { doReset('pres') },
            unlocked() {return player.pres.done},
        }, {
            key: "c",
            description: "C: Crystallize",
            onPress() { doReset('crys') },
            unlocked() {return player.crys.done},
        },
    ],
    color: 'var(--grass)',
    layerShown() { return true },
    image: 'resources/field-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
    },
    tabFormat: {
        'Grass': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--grass); text-shadow: var(--grass) 0px 0px 10px;">${formatWhole(player.field.points.max(0))}</h2> grass`}],
                ['raw-html', function(){return `(${format(tmp.field.grassOnCut)}/cut)` + (tmp.field.autoCut.gt(0)?` | (${format(tmp.field.grassOnCut.mul(tmp.field.autoCut))}/sec)`:'')}],
                'blank',
                ['bar', 'level'],
                ['raw-html', function(){return `x${format(tmp.field.levelEffect)} grass`}],
                ['layer-proxy', ['pres', [
                    'blank',
                    ['bar', 'level'],
                    ['raw-html', function(){return player.pres.done?`x${format(tmp.pres.tierEffect)} grass, EXP`:''}],
                ]]],
                'blank',
                ['clickable', 11],
                'blank',
                ['buyables', [1]],
                ['display-text', 'Hold on an upgrade to max'],
                'blank',
            ],
        },
        'Perks': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--level); text-shadow: var(--level) 0px 0px 10px;">${formatWhole(tmp.field.unspentPerks.max(0))}</h2> perks`}],
                ['raw-html', function(){return `(${format(tmp.field.perksPerLevel)}/level)`}],
                'blank',
                ['bar', 'level'],
                'blank',
                ['buyables', [2]],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--level)',
                'background-color': 'var(--level)',
            }
        },
        'Platinum': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--plat); text-shadow: var(--plat) 0px 0px 10px;">${formatWhole(player.pres.platinum.max(0))}</h2> platinum`}],
                ['raw-html', function(){return `(${format(tmp.pres.platOnCut)}/cut)` + (tmp.field.autoCut.gt(0)?` | (${format(tmp.pres.platOnCut.mul(tmp.field.autoCut))}/sec)`:'')}],
                'blank',
                ['layer-proxy', ['pres', [
                    ['buyables', [2]]
                ]]],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--plat)',
                'background-color': 'var(--plat)',
            },
            unlocked(){return player.pres.done},
        },
    },
    bars: {
        level: {
            direction: RIGHT,
            width: 550,
            height: 70,
            progress() { return player.field.totalExp.sub(layers.field.expForLevel()).div(tmp.field.expToLevel) },
            display() {
                return `Level <h2 class="overlayThing" id="points" style="color: var(--level); text-shadow: var(--level) 0px 0px 10px, black 0px 0px 5px, black 0px 0px 5px, black 0px 0px 5px;">${formatWhole(tmp.field.level.max(0))}</h2><br>
                ${formatWhole(player.field.totalExp.sub(tmp.field.expForLevel))}/${formatWhole(tmp.field.expToLevel)} EXP<br>
                (${format(tmp.field.expOnCut)}/cut)` + (tmp.field.autoCut.gt(0)?` | (${format(tmp.field.expOnCut.mul(tmp.field.autoCut))}/sec)`:'')
            },
            fillStyle: { 'background-color': 'var(--level)', }
        },
    },
    tooltip() { return `<h2>THE FIELD</h2><br>${formatWhole(player.field.points)} grass<br>Lv ${formatWhole(tmp.field.level)}` },
    clickables: {
        11: {
            title: 'Cut Grass',
            display() {
                return `There is ${formatWhole(player.field.grass)}/${formatWhole(tmp.field.maxGrass)} grass<br>Multicut: ${formatWhole(tmp.field.multiCut)}/click<br>Autocut: ${formatWhole(tmp.field.autoCut)}/sec<br>` + (player.field.grass.gte(tmp.field.maxGrass)?`Field is full`:(tmp.field.grassSpeed.gte(10)?`(${format(tmp.field.grassPerGrow.mul(tmp.field.grassSpeed))}/sec)`:`+${formatWhole(tmp.field.grassPerGrow)} in ${formatTime(player.field.growTime.div(tmp.field.grassSpeed))}`))
            },
            canClick() { return player.field.grass.gte(1) },
            onClick() {
                let cuts = player.field.grass.min(tmp.field.multiCut);
                player.field.grass = player.field.grass.sub(tmp.field.multiCut).max(0);
                player.field.points = player.field.points.add(tmp.field.grassOnCut.mul(cuts));
                player.field.totalExp = player.field.totalExp.add(tmp.field.expOnCut.mul(cuts));
                if(player.pres.done) {
                    player.pres.totalTp = player.pres.totalTp.add(tmp.pres.tpOnCut.mul(cuts));
                    player.pres.platinum = player.pres.platinum.add(tmp.pres.platOnCut.mul(cuts));
                }
            },
            style: {
                width: '150px',
                height: '150px',
            },
            onHold() { this.onClick() },
        },
    },
    buyables: {

        // Grass Upgrades
        11: {
            title: 'Grass Value',
            cost(x) { return x.pow_base(1.17).mul(10).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(10).max(0.1).log(1.17).add(1).max(0).floor().min(this.purchaseLimit()); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit())) },
            display() {
                return `Increases grass gain by +100% per level<br>Every 25 doubles grass gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit())}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit() {return Decimal.add(700, tmp.field.buyables[19].effect)},
        },
        12: {
            title: 'More Grass',
            cost(x) { return x.pow_base(1.2).mul(25).ceil() },
            effect(x) { return x },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(25).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass cap by 1 per level<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(495),
        },
        13: {
            title: 'Grow Speed',
            cost(x) { return x.pow_base(1.25).mul(100).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(100).max(0.1).log(1.25).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass grow speed by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(240),
        },
        14: {
            title: 'EXP',
            cost(x) { return x.pow_base(1.17).mul(1000).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit()) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1000).max(0.1).log(1.17).add(1).max(0).floor().min(this.purchaseLimit()); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit())) },
            display() {
                return `Increases experience gain by +100% per level<br>Every 25 doubles experience gain<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit())}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit() {return Decimal.add(300, tmp.field.buyables[19].effect)},
        },
        15: {
            title: 'Multicut',
            cost(x) { return x.pow_base(1.5).mul(2000).ceil() },
            effect(x) { return x },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(2000).max(0.1).log(1.5).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases multicut by +1 per level<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(99),
        },
        16: {
            title: 'Prestige Points',
            cost(x) { return x.pow_base(1.2).mul(1e24).ceil() },
            effect(x) { return x.div(4).add(1).mul(x.div(25).floor().pow_base(1.5)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e24).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases PP gain by +25% per level<br>Every 25 increases PP gain by +50%<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1000),
            unlocked(){return tmp.crys.milestones[2].upgs[1]>=1},
        },
        17: {
            title: 'Grass Grass Grass Grass Grass',
            cost(x) { return x.pow_base(1.2).mul(1e18).ceil() },
            effect(x) { return x.div(4).add(1).mul(x.div(25).floor().pow_base(1.5)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e18).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass gain by +25% per level<br>Every 25 increases grass gain by +50%<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(3500),
            unlocked(){return tmp.crys.milestones[2].upgs[1]>=2},
        },
        18: {
            title: 'EXP II',
            cost(x) { return x.pow_base(1.2).mul(1e50).ceil() },
            effect(x) { return x.div(4).add(1).mul(x.div(25).floor().pow_base(1.5)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e50).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases experience gain by +25% per level<br>Every 25 increases experience gain by +50%<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(10000),
            unlocked(){return tmp.crys.milestones[2].upgs[1]>=3},
        },
        19: {
            title: 'Unlimiter',
            cost(x) { return x.pow_base(2).mul(1e100).ceil() },
            effect(x) { return x.mul(5) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost)}; setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e100).max(0.1).log(2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return}if(!player.crys.flautomation.includes('11')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases cap of Grass Value and EXP by +5 per level<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1000),
            unlocked(){return tmp.crys.milestones[2].upgs[1]>=3},
        },

        // Perk Upgrades
        21: {
            title: 'Grass Perk',
            cost(x) { return Decimal.dOne },
            effect(x) { return x.add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases grass gain by +100% per level<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(150),
            bgCol: 'var(--level)',
        },
        22: {
            title: 'Multicut Perk',
            cost(x) { return Decimal.dOne },
            effect(x) { return x.div(5).add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases multicut by +20% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(10),
            bgCol: 'var(--level)',
        },
        23: {
            title: 'Grow Speed Perk',
            cost(x) { return Decimal.dOne },
            effect(x) { return x.div(5).add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases grass grow speed by +20% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(10),
            bgCol: 'var(--level)',
        },
        24: {
            title: 'Autocut Perk',
            cost(x) { return Decimal.dOne },
            effect(x) { return x },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases autocut by +1/sec per level<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(5),
            bgCol: 'var(--level)',
        },
        25: {
            title: 'Cap Perk',
            cost(x) { return Decimal.dOne },
            effect(x) { return x.div(5).add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases grass cap by +20% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(15),
            bgCol: 'var(--level)',
        },
        26: {
            title: 'EXP Perk',
            cost(x) { return new Decimal(1) },
            effect(x) { return x.add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases experience gain by +100% per level<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(250),
            bgCol: 'var(--level)',
            unlocked(){return tmp.crys.milestones[0].upgs[1]>=1},
        },
        27: {
            title: 'TP Perk',
            cost(x) { return new Decimal(3) },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases tier progress gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(50),
            bgCol: 'var(--level)',
            unlocked(){return tmp.crys.milestones[0].upgs[1]>=2},
        },
        28: {
            title: 'PP Perk',
            cost(x) { return new Decimal(5) },
            effect(x) { return x.div(4).add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases PP gain by +25% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(50),
            bgCol: 'var(--level)',
            unlocked(){return tmp.crys.milestones[0].upgs[1]>=3},
        },
        29: {
            title: 'Crystals Perk',
            cost(x) { return new Decimal(10) },
            effect(x) { return x.div(4).add(1) },
            canAfford() { return tmp.field.unspentPerks.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(tmp.field.unspentPerks).min(this.purchaseLimit)) },
            display() {
                return `Increases crystals gain by +25% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(50),
            bgCol: 'var(--level)',
            unlocked(){return tmp.crys.milestones[0].upgs[1]>=4},
        },

    },
    doReset(layer) {
        if(tmp[layer].row <= tmp[this.layer].row) { return }
        if(tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return }
        let keep = []
        if(tmp[layer].row <= 2) { keep.push('bestPerks') }
        layerDataReset(this.layer)
    },
    level() { return player.field.totalExp.floor().div(245).max(0).add(1).pow(0.5).log(1.15).add(1).floor() },
    expForLevel(x = tmp.field.level) { return x.sub(1).pow_base(1.15).pow(2).sub(1).mul(245).ceil() },
    expToLevel() { return this.expForLevel(tmp.field.level.add(1)).sub(this.expForLevel(tmp.field.level)) },
    levelEffect() { return tmp.field.level.sub(1).pow_base(1.15) },
    maxGrass() {
        let max = new Decimal(5);
        max = max.add(tmp.field.buyables[12].effect);
        max = max.mul(tmp.field.buyables[25].effect);
        max = max.mul(tmp.pres.buyables[12].effect);
        return max;
    },
    grassPerGrow() {
        let gain = Decimal.dOne;
        gain = gain.add(tmp.crys.buyables[15].effect);
        return gain;
    },
    multiCut() {
        let cuts = Decimal.dOne;
        cuts = cuts.add(tmp.field.buyables[15].effect);
        cuts = cuts.mul(tmp.field.buyables[22].effect);
        cuts = cuts.mul(tmp.crys.buyables[12].effect);
        return cuts.floor().max(1);
    },
    grassOnCut() {
        let gain = tmp.field.levelEffect;
        gain = gain.mul(tmp.pres.tierEffect);
        gain = gain.mul(tmp.field.buyables[11].effect);
        gain = gain.mul(tmp.field.buyables[17].effect);
        gain = gain.mul(tmp.field.buyables[21].effect);
        gain = gain.mul(tmp.pres.buyables[11].effect);
        gain = gain.mul(tmp.pres.buyables[26].effect);
        gain = gain.mul(tmp.crys.milestones[0].effect[0]);
        return gain;
    },
    expOnCut() {
        let gain = new Decimal(1);
        gain = gain.mul(tmp.field.buyables[14].effect);
        gain = gain.mul(tmp.field.buyables[18].effect);
        gain = gain.mul(tmp.field.buyables[26].effect);
        gain = gain.mul(tmp.pres.tierEffect);
        gain = gain.mul(tmp.pres.buyables[13].effect);
        gain = gain.mul(tmp.pres.buyables[27].effect);
        gain = gain.mul(tmp.crys.buyables[14].effect);
        gain = gain.mul(tmp.crys.milestones[1].effect[1]);
        return gain;
    },
    grassSpeed() {
        let gain = Decimal.dOne;
        gain = gain.mul(tmp.field.buyables[13].effect);
        gain = gain.mul(tmp.field.buyables[23].effect);
        gain = gain.mul(tmp.pres.buyables[12].effect);
        gain = gain.mul(tmp.pres.buyables[25].effect);
        return gain;
    },
    unspentPerks() {
        let perks = player.field.bestPerks;
        let perkSpends = [21, 22, 23, 24, 25, 26, 27, 28, 29]
        for (let i = 0; i < perkSpends.length; i++) {
            const id = perkSpends[i];
            perks = perks.sub(getBuyableAmount('field', id).mul(tmp.field.buyables[id].cost))
        }
        return perks;
    },
    perksPerLevel() {
        let gain = Decimal.dOne;
        gain = gain.mul(tmp.crys.milestones[1].effect[0]);
        return gain
    },
    autoCut() {
        let cuts = Decimal.dZero;
        cuts = cuts.add(tmp.field.buyables[24].effect);
        cuts = cuts.add(tmp.pres.buyables[21].effect);
        cuts = cuts.mul(tmp.pres.buyables[22].effect);
        cuts = cuts.mul(tmp.crys.buyables[12].effect);
        if(getBuyableAmount('crys', 12).gte(1)) { cuts = cuts.max(1) };
        return cuts;
    },
})