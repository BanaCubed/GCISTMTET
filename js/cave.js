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
            maxLevel: new Decimal(0),
            maxTier: new Decimal(0),
            maxGrass: new Decimal(0),
            maxPres: new Decimal(0),
            maxCrys: new Decimal(0,)
        };
    },
    update(diff) {
        player.crys.flowers = player.crys.flowers.add(tmp.crys.flowersGain.mul(diff))
        if(player.crys.done) {
            player.crys.maxLevel = player.crys.maxLevel.max(tmp.field.level)
            player.crys.maxTier = player.crys.maxTier.max(tmp.pres.tier)
            player.crys.maxGrass = player.crys.maxGrass.max(player.field.points)
            player.crys.maxPres = player.crys.maxPres.max(player.pres.points)
            if(hasMilestone('hop', 1)) { player.crys.maxCrys = player.crys.maxCrys.max(player.crys.points) }
        }
    },
    automate() {
        if(player.crys.flautomation.includes('51')) {
            buyMaxBuyable('crys', 11);
            buyMaxBuyable('crys', 12);
            buyMaxBuyable('crys', 13);
            buyMaxBuyable('crys', 14);
            buyMaxBuyable('crys', 15);
        }
    },
    color: 'var(--crys)',
    layerShown() { return player.pres.done; },
    image: 'resources/cave-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
        'margin-left': '60px',
        'background-color': 'hsl(330, 100%, 35%)',
        'border-color': 'var(--crys)',
    },
    type: 'normal',
    resource: 'Crystals',
    gainMult() {
        let gain = tmp.pres.tier.max(0).pow(1.2).pow_base(1.35);
        gain = gain.mul(player.pres.points.max(1).log(10).pow(1.25).add(1));
        gain = gain.mul(tmp.field.buyables[29].effect);
        gain = gain.mul(tmp.pres.buyables[18].effect);
        gain = gain.mul(tmp.crys.milestones[3].effect[0]);
        if(hasMilestone('hop', 0)) { gain = gain.mul(tmp.hop.milestones[0].effect); }
        return gain.floor();
    },
    baseResource: 'Levels',
    baseAmount() { return tmp.field.level; },
    exponent() { return new Decimal(0); },
    requires: new Decimal(100),
    passiveGeneration() {
        let gain = Decimal.dZero;
        if(player.crys.flautomation.includes('41')) { gain = gain.add(0.01); }
        gain = gain.add(tmp.hop.clickables[23].effect.div(100));
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
            color: 'var(--crys)',
        },
        'Accomplishments': {
            content: [
                ['row', [
                    ['column', [['milestone', 0], 'blank']],
                    ['column', [['milestone', 1], 'blank']],
                    ['column', [['milestone', 2], 'blank']],
                    ['column', [['milestone', 3], 'blank']],
                    ['column', [['milestone', 4], 'blank']],
                ]],
            ],
            buttonStyle: {
                'border-color': 'var(--acomp)',
                'background-color': 'var(--acomp)',
            },
            unlocked(){return player.crys.done},
            color: 'var(--acomp)',
        },
        'Flowers': {
            content: [
                ['raw-html', function () { return `You have <h2  class="overlayThing" id="points" style="color: var(--flow); text-shadow: var(--flow) 0px 0px 10px;">${formatWhole(player.crys.flowers.max(0))}</h2> Flowers`; }],
                ['raw-html', function () { return tmp.crys.flowersGain.gt(0) ? `(${format(tmp.crys.flowersGain)}/sec)` : ''; }],
                'blank',
                ['raw-html', function () { return `Flower upgrades are kept on all resets before ${obfuscate('interplanetary', true)}` }],
                'blank',
                ['clickable-tree', [
                    [11, 12, 13],
                    [21, 22, 23],
                    [31, 32],
                    [41, 42],
                    [51],
                ]],
                'blank',
            ],
            buttonStyle: {
                'border-color': 'var(--flow)',
                'background-color': 'var(--flow)',
            },
            unlocked(){return player.crys.done},
            color: 'var(--flow)',
        },
    },
    tooltip() { return `<h2>THE CAVE</h2><br>${formatWhole(player.crys.points)} Crystals<br>${formatWhole(player.crys.flowers)} Flowers`; },
    milestones: {

        0: {
            requirementDescription() { return `Best Level` },
            effectDescription() { return `
                Highest level reached since last<br>
                ${obfuscate('indoctrination', !player.hop.done)} reset is Level ${formatWhole(player.crys.maxLevel)}<br><br>
                Effect: x${format(tmp[this.layer].milestones[this.id].effect[0])} grass, x${format(tmp[this.layer].milestones[this.id].effect[1])} TP<br><br>
                ${tmp[this.layer].milestones[this.id].upgs[1]<4?`Unlocks another upgrade at Level ${formatWhole(tmp[this.layer].milestones[this.id].upgs[0])}<br>`:''}
                Currently adding ${formatWhole(tmp[this.layer].milestones[this.id].upgs[1])} more perk upgrades` },
            done(){return false},
            effect() { return [
                player.crys.maxLevel.pow(0.8).pow_base(1.25),
                player.crys.maxLevel.pow(0.6).pow_base(1.2),
            ]},
            upgs() {
                const thresholds = [new Decimal(120), new Decimal(150), new Decimal(250), new Decimal(400), Decimal.dInf]
                let reps = 0
                while (player.crys.maxLevel.gte(thresholds[reps])) { reps++; }
                return [thresholds[reps], reps]
            },
            style: { width: '340px', height: '140px', 'background-image': 'linear-gradient(45deg, var(--acomp), var(--level))', 'background-clip': 'padding-box', border: 'none', 'box-shadow': 'inset 0 0 0 4px rgba(0, 0, 0, 0.125)', padding: '9px', },
        },
        1: {
            requirementDescription() { return `Best Tier` },
            effectDescription() { return `
                Highest tier reached since last<br>
                ${obfuscate('indoctrination', !player.hop.done)} reset is Tier ${formatWhole(player.crys.maxTier)}<br><br>
                Effect: x${format(tmp[this.layer].milestones[this.id].effect[0])} perks, x${format(tmp[this.layer].milestones[this.id].effect[1])} EXP<br><br>
                ${tmp[this.layer].milestones[this.id].upgs[1]<4?`Unlocks another upgrade at Tier ${formatWhole(tmp[this.layer].milestones[this.id].upgs[0])}<br>`:''}
                Currently adding ${formatWhole(tmp[this.layer].milestones[this.id].upgs[1])} more platinum upgrades` },
            done(){return false},
            effect() { return [
                player.crys.maxTier.div(4).add(1),
                player.crys.maxTier.pow(1.6).pow_base(1.2),
            ]},
            upgs() {
                const thresholds = [new Decimal(7), new Decimal(10), new Decimal(12), new Decimal(15), Decimal.dInf]
                let reps = 0
                while (player.crys.maxTier.gte(thresholds[reps])) { reps++; }
                return [thresholds[reps], reps]
            },
            style: { width: '340px', height: '140px', 'background-image': 'linear-gradient(45deg, var(--acomp), var(--tier))', 'background-clip': 'padding-box', border: 'none', 'box-shadow': 'inset 0 0 0 4px rgba(0, 0, 0, 0.125)', padding: '9px', },
        },
        2: {
            requirementDescription() { return `Best Grass` },
            effectDescription() { return `
                Highest grass obtained since last<br>
                ${obfuscate('indoctrination', !player.hop.done)} reset is ${formatWhole(player.crys.maxGrass)} grass<br><br>
                Effect: x${format(tmp[this.layer].milestones[this.id].effect[0])} PP, x${format(tmp[this.layer].milestones[this.id].effect[1])} Platinum<br><br>
                ${tmp[this.layer].milestones[this.id].upgs[1]<4?`Unlocks another upgrade at ${formatWhole(tmp[this.layer].milestones[this.id].upgs[0])}<br>`:''}
                Currently adding ${formatWhole(tmp[this.layer].milestones[this.id].upgs[1])} more grass upgrades` },
            done(){return false},
            effect() { return [
                player.crys.maxGrass.max(1).log(3).add(1).pow(0.75),
                player.crys.maxGrass.max(1).log(1000).add(1).pow(0.65),
            ]},
            upgs() {
                const thresholds = [new Decimal(1e33), new Decimal(1e63), new Decimal(1e123), new Decimal(1e303), Decimal.dInf]
                let reps = 0
                while (player.crys.maxGrass.gte(thresholds[reps])) { reps++; }
                return [thresholds[reps], reps]
            },
            style: { width: '340px', height: '140px', 'background-image': 'linear-gradient(45deg, var(--acomp), var(--grass))', 'background-clip': 'padding-box', border: 'none', 'box-shadow': 'inset 0 0 0 4px rgba(0, 0, 0, 0.125)', padding: '9px', },
        },
        3: {
            requirementDescription() { return `Best Prestige` },
            effectDescription() { return `
                Highest prestige points obtained since last
                ${obfuscate('indoctrination', !player.hop.done)} reset is ${formatWhole(player.crys.maxPres)} PP<br><br>
                Effect: x${format(tmp[this.layer].milestones[this.id].effect[0])} Crystals, x${format(tmp[this.layer].milestones[this.id].effect[1])} Flowers<br><br>
                ${tmp[this.layer].milestones[this.id].upgs[1]<4?`Unlocks another upgrade at ${formatWhole(tmp[this.layer].milestones[this.id].upgs[0])}<br>`:''}
                Currently adding ${formatWhole(tmp[this.layer].milestones[this.id].upgs[1])} more prestige upgrades` },
            done(){return false},
            effect() { return [
                player.crys.maxPres.max(1).log(33).add(1).pow(0.5),
                player.crys.maxPres.max(1).log(10).add(1).pow(0.85),
            ]},
            upgs() {
                const thresholds = [new Decimal(1e18), new Decimal(1e33), new Decimal(1e63), new Decimal(1e100), Decimal.dInf]
                let reps = 0
                while (player.crys.maxPres.gte(thresholds[reps])) { reps++; }
                return [thresholds[reps], reps]
            },
            style: { width: '340px', height: '140px', 'background-image': 'linear-gradient(45deg, var(--acomp), var(--pres))', 'background-clip': 'padding-box', border: 'none', 'box-shadow': 'inset 0 0 0 4px rgba(0, 0, 0, 0.125)', padding: '9px', },
        },
        4: {
            requirementDescription() { return `Best Crystals` },
            effectDescription() { return `
                Highest crystals obtained since last<br>
                ${obfuscate('evolution', true)} reset is ${formatWhole(player.crys.maxCrys)} Crystals<br><br>
                Effect: x${format(tmp[this.layer].milestones[this.id].effect[0])} DMG, x${format(tmp[this.layer].milestones[this.id].effect[1])} Grasshoppers` },
            done(){return false},
            effect() { return [
                player.crys.maxCrys.max(1).log(1000).add(1).pow(0.5),
                player.crys.maxCrys.max(1).log(10).add(1).pow(0.25),
            ]},
            unlocked(){return hasMilestone('hop', 1)},
            style: { width: '340px', height: '140px', 'background-image': 'linear-gradient(45deg, var(--acomp), var(--crys))', 'background-clip': 'padding-box', border: 'none', 'box-shadow': 'inset 0 0 0 4px rgba(0, 0, 0, 0.125)', padding: '9px', },
        },

    },
    buyables: {

        // Crystal Upgrades
        11: {
            title: 'Crystal Flowers',
            cost(x) { return x.pow_base(1.15).mul(1).ceil(); },
            effect(x) { return x; },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
            buy() { if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
            buyMax() { let max = player[this.layer].points.floor().div(1).max(0.1).log(1.15).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
            display() {
                return `Increases base flower gain by +1/sec<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
            },
            purchaseLimit: new Decimal(1000),
        },
        12: {
            title: 'Crystal Cutting',
            cost(x) { return x.pow_base(1.2).mul(1).ceil(); },
            effect(x) { return x.div(20).add(1); },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
            buy() { if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
            buyMax() { let max = player[this.layer].points.floor().div(1).max(0.1).log(1.2).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
            display() {
                return `Increases autocut and multicut by +5% per level<br>First level causes autocut to always be at least 1<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
            },
            purchaseLimit: new Decimal(500),
        },
        13: {
            title: 'Crystal Platinum',
            cost(x) { return x.pow_base(1.12).mul(5).ceil(); },
            effect(x) { return x.pow_base(1.01); },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
            buy() { if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
            buyMax() { let max = player[this.layer].points.floor().div(5).max(0.1).log(1.12).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
            display() {
                return `Increases platinum gain by +1% compounding per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
            },
            purchaseLimit: new Decimal(1000),
        },
        14: {
            title: 'Crystal TEXPP',
            cost(x) { return x.pow_base(1.12).mul(50).ceil(); },
            effect(x) { return x.div(2).add(1); },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
            buy() { if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
            buyMax() { let max = player[this.layer].points.floor().div(50).max(0.1).log(1.12).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
            display() {
                return `Increases TP, EXP and PP gain by +50% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect, 1)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
            },
            purchaseLimit: new Decimal(250),
        },
        15: {
            title: 'Crystal Mitosis',
            cost(x) { return x.pow_base(1.4).mul(100).ceil(); },
            effect(x) { return x; },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit); },
            buy() { if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); },
            buyMax() { let max = player[this.layer].points.floor().div(100).max(0.1).log(1.4).add(1).max(0).floor().min(this.purchaseLimit); if (max.lte(getBuyableAmount(this.layer, this.id))) { return; } if(!player.crys.flautomation.includes('42')){player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1))).max(0);} setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(max).min(this.purchaseLimit)); },
            display() {
                return `Increases grass per grow by +1 per level<br><br>Currently: +${formatWhole(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`;
            },
            purchaseLimit: new Decimal(9),
        },

    },
    clickables: {

        // Flautomation 
        // (these should really just be upgrades but I'm stupid)
        11: {
            title: 'Neverending Grass',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(100),
            display() {
                return `Grass upgrades no longer spend grass<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
        },
        12: {
            title: 'Neverending PP',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(10000),
            display() {
                return `Prestige upgrades no longer spend PP<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
        },
        13: {
            title: 'Neverending Platinum',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(250000),
            display() {
                return `Platinum upgrades no longer spend platinum<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
        },

        21: {
            title: 'Flautomate Grass',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('11'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(2500),
            display() {
                return `Automatically buy grass upgrades<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [11],
        },
        22: {
            title: 'Flautomate PP',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('12'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(100000),
            display() {
                return `Automatically buy prestige upgrades<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [12],
        },
        23: {
            title: 'Flautomate Platinum',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('13'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(2.5e6),
            display() {
                return `Automatically buy platinum upgrades<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [13],
        },

        31: {
            title: 'Flautomate Perks',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('21') && player.crys.flautomation.includes('22'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(1e6),
            display() {
                return `Automatically buy perk upgrades<br>Total perks are no longer reset on Prestige/Crystallize<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [21, 22],
        },
        32: {
            title: 'Blooming Passive PP',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('22'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(150000),
            display() {
                return `Increases passive PP generation by +5%<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [22],
        },
        
        41: {
            title: 'Blooming Passive Crystals',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('32'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(1e7),
            display() {
                return `Increases passive Crystal generation by +1%<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [32],
        },
        42: {
            title: 'Neverending Crystals',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('32'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(5e6),
            display() {
                return `Crystal upgrades no longer spend crystals<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [32],
        },

        51: {
            title: 'Flautomate Crystals',
            canClick() { return player.crys.flowers.gte(this.cost) && !player.crys.flautomation.includes(this.id) && player.crys.flautomation.includes('41') && player.crys.flautomation.includes('42'); },
            onClick() { player.crys.flowers = player.crys.flowers.sub(this.cost); player.crys.flautomation.push(this.id); },
            cost: new Decimal(3.75e7),
            display() {
                return `Honestly, this should be obvious<br><br>Cost: ${formatWhole(this.cost)} Flowers`
            },
            bgCol: "var(--flow)",
            bought(){return player.crys.flautomation.includes(this.id)},
            style: {
                width: '160px',
                height: '160px',
            },
            branches: [41, 42],
        },

    },
    doReset(layer) {
        if (tmp[layer].row <= tmp[this.layer].row) { return; }
        if (tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return; }
        let keep = ['done'];
        if (tmp[layer].realm != 0) { keep.push('flowers', 'flautomation') }
        if (tmp[layer].row <= 3) { keep.push('maxCrys') }
        layerDataReset(this.layer, keep);
    },
    onPrestige(gain) {
        player.crys.done = true;
    },
    branches: ['pres'],
    flowersGain() {
        let gain = Decimal.dZero;
        gain = gain.add(tmp.crys.buyables[11].effect);
        gain = gain.mul(tmp.pres.buyables[29].effect);
        gain = gain.mul(tmp.pres.buyables[19].effect);
        gain = gain.mul(tmp.crys.milestones[3].effect[1]);
        gain = gain.mul(tmp.hop.clickables[22].effect);
        return gain;
    },
});
