addLayer('crys', {
    row: 2,
    realm: 1,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            done: false,
        };
    },
    update(diff) {
    },
    color: 'var(--crys)',
    layerShown() { return player.pres.done; },
    image: 'resources/cave-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
    },
    type: 'normal',
    resource: 'Crystals',
    gainMult() {
        let gain = tmp.pres.tier.max(0).pow(1.2).pow_base(1.35);
        gain = gain.mul(player.pres.points.max(1).log(10).pow(1.25).add(1));
        return gain;
    },
    baseResource: 'Levels',
    baseAmount() { return tmp.field.level; },
    exponent() { return new Decimal(0); },
    requires: new Decimal(10000),
    passiveGeneration() {
        let gain = Decimal.dZero;
        return gain;
    },
    prestigeButtonText() {
        return tmp.field.level.lt(10000) ? `Crystallize Under Construction<br><br>Reach Level 100 to complete, for now` : `Crystallize for ${formatWhole(getResetGain('crys'))} Crystals<br><br>Crystals gain is boosted by Tiers and PP`;
    },
    tabFormat: {
        'Crystallize': {
            content: [
                ['raw-html', function () { return `You have <h2  class="overlayThing" id="points" style="color: var(--crys); text-shadow: var(--crys) 0px 0px 10px;">${formatWhole(player.crys.points.max(0))}</h2> Crystals`; }],
                'blank',
                'prestige-button',
                ['raw-html', function () { return tmp.crys.passiveGeneration.gt(0) ? `(${format(tmp.crys.passiveGeneration.mul(getResetGain('crys')))}/sec)` : ''; }],
                'blank',
                ['raw-html', function () { return player.crys.done ? `` : 'First Crystallize unlocks Accomplishments and Flowers'; }],
                'blank',
                ['buyables', [1]],
                'blank',
            ],
        },
        'Accomplishments': {
            content: [
                ['raw-html', function () { return `You have <h2  class="overlayThing" id="points" style="color: var(--crys); text-shadow: var(--crys) 0px 0px 10px;">${formatWhole(player.crys.points.max(0))}</h2> Crystals`; }],
                'blank',
                'prestige-button',
                ['raw-html', function () { return tmp.crys.passiveGeneration.gt(0) ? `(${format(tmp.crys.passiveGeneration.mul(getResetGain('crys')))}/sec)` : ''; }],
                'blank',
                ['raw-html', function () { return player.crys.done ? `` : 'First Crystallize unlocks Accomplishments and Flowers'; }],
                'blank',
                ['buyables', [1]],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--acomp)',
                'background-color': 'var(--acomp)',
            },
            unlocked(){return player.crys.done},
        },
        'Flowers': {
            content: [
                ['raw-html', function () { return `You have <h2  class="overlayThing" id="points" style="color: var(--crys); text-shadow: var(--crys) 0px 0px 10px;">${formatWhole(player.crys.points.max(0))}</h2> Crystals`; }],
                'blank',
                'prestige-button',
                ['raw-html', function () { return tmp.crys.passiveGeneration.gt(0) ? `(${format(tmp.crys.passiveGeneration.mul(getResetGain('crys')))}/sec)` : ''; }],
                'blank',
                ['raw-html', function () { return player.crys.done ? `` : 'First Crystallize unlocks Accomplishments and Flowers'; }],
                'blank',
                ['buyables', [1]],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--flow)',
                'background-color': 'var(--flow)',
            },
            unlocked(){return player.crys.done},
        },
    },
    tooltip() { return `<h2>THE CAVE</h2><br>${formatWhole(player.crys.points)} Crystals`; },
    buyables: {

        // Crystal Upgrades
        // 11: {
        //     title: 'Crystal Flowers',
        //     cost(x) { return x.pow_base(1.15).mul(1).ceil(); },
        //     effect(x) { return x.add(1).mul(x.div(25).floor().pow_base(2)); },
        //     canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
        //     buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
        //     buyMax() { let max = player[this.layer].points.floor().div(1).max(0.1).log(1.15).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
        //     display() {
        //         return `Increases grass gain by +100% per level<br>Every 25 doubles grass gain<br><br>Currently: x${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
        //     },
        //     purchaseLimit: new Decimal(1000),
        // },

    },
    doReset(layer) {
        if (tmp[layer].row <= tmp[this.layer].row) { return; }
        if (tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return; }
        layerDataReset(this.layer, ['done']);
    },
    onPrestige(gain) {
        player.crys.done = true;
    },
    branches: ['pres'],
});
