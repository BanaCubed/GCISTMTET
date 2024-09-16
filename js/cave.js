addLayer('crys', {
    row: 2,
    realm: 1,
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            done: false,
            flowers: new Decimal(0),
            flautomation: [],
        };
    },
    update(diff) {
        player.crys.flowers = player.crys.flowers.add(tmp.crys.flowersGain.mul(diff))
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
    requires: new Decimal(100),
    passiveGeneration() {
        let gain = Decimal.dZero;
        return gain;
    },
    prestigeButtonText() {
        return tmp.field.level.lt(100) ? `Reach Level 100 to Crystallize` : `Crystallize for ${formatWhole(getResetGain('crys'))} Crystals<br><br>Crystals gain is boosted by Tiers and PP`;
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
                ['raw-html', function () { return `You have <h2  class="overlayThing" id="points" style="color: var(--flow); text-shadow: var(--flow) 0px 0px 10px;">${formatWhole(player.crys.flowers.max(0))}</h2> Flowers`; }],
                ['raw-html', function () { return tmp.crys.flowersGain.gt(0) ? `(${format(tmp.crys.flowersGain)}/sec)` : ''; }],
                'blank',
                ['clickables', [1, 2, 3]],
                ['raw-html', function () { return `Flowers and Flautomation are kept on all resets before ${obfuscate('PLACEHOLDER NAME', true)}` }],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--flow)',
                'background-color': 'var(--flow)',
            },
            unlocked(){return player.crys.done},
        },
    },
    tooltip() { return `<h2>THE CAVE</h2><br>${formatWhole(player.crys.points)} Crystals<br>${formatWhole(player.crys.flowers)} Flowers`; },
    buyables: {

        // Crystal Upgrades
        11: {
            title: 'Crystal Flowers',
            cost(x) { return x.pow_base(1.15).mul(1).ceil(); },
            effect(x) { return x; },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
            buyMax() { let max = player[this.layer].points.floor().div(1).max(0.1).log(1.15).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
            display() {
                return `Increases base flower gain by +1/sec<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
            },
            purchaseLimit: new Decimal(1000),
        },

    },
    clickables: {

        // Flautomation
        11: {
            title: 'Neverending Grass',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(100),
            display() {
                return `Grass upgrades no longer spend grass<br><br>Cost: ${formatWhole(this.cost)}`
            },
            bgCol: "var(--flow)",
        }

    },
    doReset(layer) {
        if (tmp[layer].row <= tmp[this.layer].row) { return; }
        if (tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return; }
        let keep = ['done'];
        if (tmp[layer].realm != 0) { keep.push('flowers', 'flautomation') }
        layerDataReset(this.layer, keep);
    },
    onPrestige(gain) {
        player.crys.done = true;
    },
    branches: ['pres'],
    flowersGain() {
        let gain = Decimal.dZero;
        gain = gain.add(tmp.crys.buyables[11].effect)
        return gain;
    },
});
