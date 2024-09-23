addLayer('pres', {
    row: 1,
    realm: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        totalTp: new Decimal(0),
        done: false,
        platinum: new Decimal(0),
        autoPr: true,
        autoPl: true,
    }},
    update(diff) {
        if(player.pres.done) {
            player.pres.totalTp = player.pres.totalTp.add(tmp.pres.tpOnCut.mul(tmp.field.autoCut).mul(diff));
            player.pres.platinum = player.pres.platinum.add(tmp.pres.platOnCut.mul(tmp.field.autoCut).mul(diff));
        }
    },
    automate() {
        if(player.crys.flautomation.includes('22') && player.pres.autoPr) {
            buyMaxBuyable('pres', 11);
            buyMaxBuyable('pres', 12);
            buyMaxBuyable('pres', 13);
            buyMaxBuyable('pres', 14);
            buyMaxBuyable('pres', 15);
            buyMaxBuyable('pres', 16);
            buyMaxBuyable('pres', 17);
            buyMaxBuyable('pres', 18);
            buyMaxBuyable('pres', 19);
        }
        if(player.crys.flautomation.includes('23') && player.pres.autoPl) {
            buyMaxBuyable('pres', 21);
            buyMaxBuyable('pres', 22);
            buyMaxBuyable('pres', 23);
            buyMaxBuyable('pres', 24);
            buyMaxBuyable('pres', 25);
            buyMaxBuyable('pres', 26);
            buyMaxBuyable('pres', 27);
            buyMaxBuyable('pres', 28);
            buyMaxBuyable('pres', 29);
        }
    },
    color: 'var(--pres)',
    layerShown() { return true },
    image: 'resources/city-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
        'background-color': 'hsl(180, 65%, 30%)',
        'border-color': 'var(--pres)',
    },
    type: 'normal',
    resource: 'Prestige Points',
    gainMult() {
        let gain = tmp.field.level.sub(29).max(1).pow(0.6).pow_base(1.25);
        gain = gain.mul(player.field.points.max(1).log(10).pow(2).add(1));
        gain = gain.mul(tmp.field.buyables[28].effect);
        gain = gain.mul(tmp.field.buyables[16].effect);
        gain = gain.mul(tmp.pres.buyables[16].effect);
        gain = gain.mul(tmp.pres.buyables[24].effect);
        gain = gain.mul(tmp.crys.buyables[14].effect);
        gain = gain.mul(tmp.crys.milestones[2].effect[0]);
        return gain.floor();
    },
    baseResource: 'Levels',
    baseAmount() { return tmp.field.level },
    exponent() { return new Decimal(0) },
    requires: new Decimal(30),
    passiveGeneration() {
        let gain = Decimal.dZero;
        gain = gain.add(tmp.pres.buyables[15].effect);
        if(player.crys.flautomation.includes('32')) { gain = gain.add(0.05) };
        return gain;
    },
    prestigeButtonText() {
        return tmp.field.level.lt(30)?`Reach Level 30 to Prestige`:`Prestige for ${formatWhole(getResetGain('pres'))} Prestige Points<br><br>PP gain is boosted by Levels and Grass`
    },
    tabFormat: {
        'Prestige': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--pres); text-shadow: var(--pres) 0px 0px 10px;">${formatWhole(player.pres.points.max(0))}</h2> Prestige Points`}],
                'blank',
                'prestige-button',
                ['raw-html', function(){return tmp.pres.passiveGeneration.gt(0)?`(${format(tmp.pres.passiveGeneration.mul(getResetGain('pres')))}/sec)`:''}],
                'blank',
                ['bar', 'level'],
                ['raw-html', function(){return player.pres.done?`x${format(tmp.pres.tierEffect)} grass, EXP`:'First Prestige unlocks Tiers and Platinum'}],
                'blank',
                ['buyables', [1]],
                'blank',
            ],
            color: 'var(--pres)',
        },
        'Platinum': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--plat); text-shadow: var(--plat) 0px 0px 10px;">${formatWhole(player.pres.platinum.max(0))}</h2> platinum`}],
                ['raw-html', function(){return `(${format(tmp.pres.platOnCut)}/cut)` + (tmp.field.autoCut.gt(0)?` | (${format(tmp.pres.platOnCut.mul(tmp.field.autoCut))}/sec)`:'')}],
                'blank',
                ['buyables', [2]],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--plat)',
                'background-color': 'var(--plat)',
            },
            unlocked(){return player.pres.done},
            color: 'var(--plat)',
        },
    },
    bars: {
        level: {
            direction: RIGHT,
            width: 550,
            height: 70,
            progress() { return player.pres.totalTp.sub(layers.pres.tpForLevel()).div(tmp.pres.tpToLevel) },
            display() {
                return `Tier <h2 class="overlayThing" id="points" style="color: var(--tier); text-shadow: var(--tier) 0px 0px 10px, black 0px 0px 5px, black 0px 0px 5px, black 0px 0px 5px;">${formatWhole(tmp.pres.tier.max(0))}</h2><br>
                ${formatWhole(player.pres.totalTp.sub(tmp.pres.tpForLevel))}/${formatWhole(tmp.pres.tpToLevel)} TP<br>
                (${format(tmp.pres.tpOnCut)}/cut)` + (tmp.field.autoCut.gt(0)?` | (${format(tmp.pres.tpOnCut.mul(tmp.field.autoCut))}/sec)`:'')
            },
            fillStyle: { 'background-color': 'var(--tier)', },
            unlocked(){return player.pres.done},
        },
    },
    tooltip() { return `<h2>THE CITY</h2><br>${formatWhole(player.pres.points)} PP<br>Tier ${formatWhole(tmp.pres.tier)}<br>${formatWhole(player.pres.platinum)} Platinum` },
    buyables: {

        // PP Upgrades
        11: {
            title: 'PP Grass Value',
            cost(x) { return x.pow_base(1.15).mul(1).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1).max(0.1).log(1.15).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass gain by +100% per level<br>Every 25 doubles grass gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1000),
        },
        12: {
            title: 'PP Grass Quantity',
            cost(x) { return x.pow_base(2).mul(3).ceil() },
            effect(x) { return x.div(2).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(3).max(0.1).log(2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass cap and grass growth speed by +50% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(8),
        },
        13: {
            title: 'PP EXP',
            cost(x) { return x.pow_base(1.2).mul(5).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(5).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases experience gain by +100% per level<br>Every 25 doubles experience gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(250),
        },
        14: {
            title: 'PP TP',
            cost(x) { return x.pow_base(1.2).mul(5).ceil() },
            effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(5).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases tier progress gain by +100% per level<br>Every 25 doubles tier progress gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(500),
        },
        15: {
            title: 'PP Passive PP',
            cost(x) { return x.pow_base(1.15).mul(10000).ceil() },
            effect(x) { return x.div(100) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(10000).max(0.1).log(1.15).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases passive PP generation by +1% per level<br><br>Currently: ${formatWhole(tmp[this.layer].buyables[this.id].effect.mul(100))}%<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1e6),
        },
        16: {
            title: 'PPPP',
            cost(x) { return x.pow_base(1.05).mul(1e12).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e12).max(0.1).log(1.05).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases PP gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1e6),
            unlocked(){return tmp.crys.milestones[3].upgs[1]>=1},
        },
        17: {
            title: 'PPPlatinum',
            cost(x) { return x.pow_base(1.05).mul(1e25).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e25).max(0.1).log(1.05).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases platinum gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1e6),
            unlocked(){return tmp.crys.milestones[3].upgs[1]>=2},
        },
        18: {
            title: 'PPPrystals',
            cost(x) { return x.pow_base(1.05).mul(1e50).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e50).max(0.1).log(1.05).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases crystals gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1e6),
            unlocked(){return tmp.crys.milestones[3].upgs[1]>=3},
        },
        19: {
            title: 'PPPlowers',
            cost(x) { return x.pow_base(1.05).mul(1e80).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.floor().div(1e80).max(0.1).log(1.05).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('12')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases flowers gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1e6),
            unlocked(){return tmp.crys.milestones[3].upgs[1]>=4},
        },

        // Platinum Upgrades
        21: {
            title: 'Plat Autocut',
            cost(x) { return x.pow_base(1.6).mul(1).ceil() },
            effect(x) { return x },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(1).max(0.1).log(1.6).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases autocut by +1/sec per level<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(995),
            bgCol: 'var(--plat)',
        },
        22: {
            title: 'Plat Autocut 2',
            cost(x) { return x.pow_base(1.6).mul(25).ceil() },
            effect(x) { return x.div(4).add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(25).max(0.1).log(1.6).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases autocut by +25% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(96),
            bgCol: 'var(--plat)',
        },
        23: {
            title: 'Plat Platinum',
            cost(x) { return x.pow_base(1.15).mul(50).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(50).max(0.1).log(1.15).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases platinum gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(990),
            bgCol: 'var(--plat)',
        },
        24: {
            title: 'Plat PP',
            cost(x) { return x.pow_base(1.05).mul(500).ceil() },
            effect(x) { return x.pow_base(1.03) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(500).max(0.1).log(1.05).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases PP gain by +3% compounding per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1000),
            bgCol: 'var(--plat)',
        },
        25: {
            title: 'Plat Grow Speed',
            cost(x) { return x.pow_base(1.5).mul(500).ceil() },
            effect(x) { return x.add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(500).max(0.1).log(1.5).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass grow speed by +100% per level<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(9),
            bgCol: 'var(--plat)',
        },
        26: {
            title: 'Platinum Grass',
            cost(x) { return x.pow_base(1.12).mul(1000).ceil() },
            effect(x) { return x.add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(1000).max(0.1).log(1.12).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass gain by +100% per level<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(500),
            bgCol: 'var(--plat)',
            unlocked(){return tmp.crys.milestones[1].upgs[1]>=1},
        },
        27: {
            title: 'Platinum EXP',
            cost(x) { return x.pow_base(1.12).mul(5000).ceil() },
            effect(x) { return x.add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(5000).max(0.1).log(1.12).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases experience by +100% per level<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(500),
            bgCol: 'var(--plat)',
            unlocked(){return tmp.crys.milestones[1].upgs[1]>=2},
        },
        28: {
            title: 'Platinum TP',
            cost(x) { return x.pow_base(1.12).mul(5000).ceil() },
            effect(x) { return x.add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(5000).max(0.1).log(1.12).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases tier progress by +100% per level<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(500),
            bgCol: 'var(--plat)',
            unlocked(){return tmp.crys.milestones[1].upgs[1]>=3},
        },
        29: {
            title: 'Platinum Flowers',
            cost(x) { return x.pow_base(1.12).mul(5000).ceil() },
            effect(x) { return x.div(10).add(1) },
            canAfford() { return player[this.layer].platinum.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit) },
            buy() { if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].platinum.floor().div(5000).max(0.1).log(1.12).add(1).max(0).floor().min(this.purchaseLimit); if(max.lte(getBuyableAmount(this.layer, this.id))){return} if(!player.crys.flautomation.includes('13')){player[this.layer].platinum = player[this.layer].platinum.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)) },
            display() {
                return `Increases flowers gain by +10% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(500),
            bgCol: 'var(--plat)',
            unlocked(){return tmp.crys.milestones[1].upgs[1]>=4},
        },
        
    },
    doReset(layer) {
        if(tmp[layer].row <= tmp[this.layer].row) { return }
        if(tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return }
        layerDataReset(this.layer, ['done', 'autoPr', 'autoPl'])
    },
    onPrestige(gain) {
        player.pres.done = true
    },
    tier() { return player.pres.totalTp.floor().div(1500).max(0).add(1).log(1.5).pow(0.5).floor() },
    tpForLevel(x = tmp.pres.tier) { return x.pow(2).pow_base(1.5).sub(1).mul(1500).ceil() },
    tpToLevel() { return this.tpForLevel(tmp.pres.tier.add(1)).sub(this.tpForLevel(tmp.pres.tier)) },
    tierEffect() { return tmp.pres.tier.pow(1.25).pow_base(4.5) },
    tpOnCut() {
        if(!player.pres.done){return Decimal.dZero}
        let gain = Decimal.dOne;
        gain = gain.mul(tmp.field.buyables[27].effect);
        gain = gain.mul(tmp.pres.buyables[14].effect);
        gain = gain.mul(tmp.pres.buyables[28].effect);
        gain = gain.mul(tmp.crys.buyables[14].effect);
        gain = gain.mul(tmp.crys.milestones[0].effect[1]);
        if(hasMilestone('hop', 1)) { gain = gain.mul(tmp.hop.milestones[1].effect); }
        return gain;
    },
    platOnCut() {
        if(!player.pres.done){return Decimal.dZero}
        let gain = Decimal.dOne.div(10);
        gain = gain.mul(tmp.pres.buyables[17].effect);
        gain = gain.mul(tmp.pres.buyables[23].effect);
        gain = gain.mul(tmp.crys.buyables[13].effect);
        gain = gain.mul(tmp.crys.milestones[2].effect[1]);
        return gain;
    },
    branches: ['field'],
})

