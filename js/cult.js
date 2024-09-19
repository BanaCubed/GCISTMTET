addLayer('hop', {
    row: 3,
    realm: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        done: false,
        bestReset: new Decimal(0),
        coloTier: new Decimal(0),
        opp: new Decimal(10),
        active: new Decimal(0),
        enlistPortion: 100,
        coloTimer: 15,
    }},
    update(diff) {
        player.hop.coloTimer -= diff;
        if(player.hop.coloTimer < 0) { // Colosseum Tick
            player.hop.coloTimer = Math.max(0, player.hop.coloTimer+tmp.hop.tickLength);
            player.hop.opp = player.hop.opp.sub(player.hop.active.max(0).mul(tmp.hop.dmg.max(0))).ceil().min(tmp.hop.oppStats[0]);
            if(player.hop.opp.lte(0)) { // Colosseum Tierup
                player.hop.coloTier = player.hop.coloTier.add(1);
                player.hop.opp = layers.hop.oppStats()[0];
            } else {
                player.hop.active = player.hop.active.sub(tmp.hop.oppStats[1].div(tmp.hop.arm.add(1).max(1)).max(0)).ceil().max(0);
            }
        }
    },
    tickLength() {
        let length = 15;
        if(hasMilestone('hop', 2)) { length -= 7; }
        return length
    },
    color: 'var(--ghop)',
    layerShown() { return player.crys.done },
    image: 'resources/cult-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
        'background-color': 'hsl(0, 0%, 27.5%)',
        'border-color': 'var(--ghop)',
    },
    type: 'normal',
    resource: 'Grasshoppers',
    gainMult() {
        let gain = tmp.field.level.sub(199).max(1).pow(0.25).pow_base(1.25);
        gain = gain.mul(player.field.points.max(1).log(10).pow(0.5).add(1));
        gain = gain.mul(tmp.hop.rank.pow_base(2.5));
        if(hasMilestone('hop', 4)) { gain = gain.mul(tmp.hop.milestones[4].effect); }
        if(hasMilestone('hop', 1)) { gain = gain.mul(tmp.crys.milestones[4].effect[1]); }
        return gain.max(5).floor();
    },
    baseResource: 'Levels',
    baseAmount() { return tmp.field.level },
    exponent() { return new Decimal(0) },
    requires: new Decimal(200),
    passiveGeneration() {
        let gain = Decimal.dZero;
        return gain;
    },
    prestigeButtonText() {
        return tmp.field.level.lt(200)?`Reach Level 200 to Indoctrinate`:`Indoctrinate ${formatWhole(getResetGain('hop'))} Grasshoppers<br><br>Indoctrinated Grasshoppers is boosted by Grass, Level and Rank`
    },
    tabFormat: {
        'Indoctrination': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--ghop); text-shadow: var(--ghop) 0px 0px 10px;">${formatWhole(player.hop.points.max(0))}</h2> Grasshoppers`}],
                'blank',
                'prestige-button',
                ['raw-html', function(){return tmp.hop.passiveGeneration.gt(0)?`(${format(tmp.hop.passiveGeneration.mul(getResetGain('hop')))}/sec)`:''}],
                'blank',
                ['bar', 'level'],
                ['raw-html', function(){return player.hop.done?`x${format(tmp.hop.rankEffect)} Grasshoppers, Damage`:'First Indoctrination unlocks Rank and Combat'}],
                'blank',
            ],
            color: 'var(--ghop)',
        },
        'The Colosseum': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--ghop); text-shadow: var(--ghop) 0px 0px 10px;">${formatWhole(player.hop.points.max(0))}</h2> Grasshoppers`}],
                ['raw-html', function(){return `You are Rank <h2  class="overlayThing" id="points" style="color: var(--rank); text-shadow: var(--rank) 0px 0px 10px;">${formatWhole(tmp.hop.rank.max(0))}</h2>`}],
                ['raw-html', function(){return `You are at Stage <h2  class="overlayThing" id="points" style="color: var(--rank); text-shadow: var(--rank) 0px 0px 10px;">${formatWhole(player.hop.coloTier.add(1).max(0))}</h2>`}],
                'blank',
                ['clickable', 11],
                'blank',
                ['raw-html', function(){return `Enlisting Percentage: ${formatWhole(player.hop.enlistPortion)}`}],
                ['slider', ['enlistPortion', 0, 100]],
                'blank',
                ['raw-html', function(){return `<div style="margin-bottom: 5px;">Combat Tick in ${formatTime(player.hop.coloTimer)}</div>`}],
                'colosseum',
                'colo-stats',
                'blank',
            ],
            unlocked(){return player.hop.done},
            buttonStyle: {
                'background-color': 'var(--rank)',
                'border-color': 'var(--rank)',
            },
            color: 'var(--rank)',
        },
        'Stage Rewards': {
            content: [
                ['raw-html', function(){return `You are at Stage <h2  class="overlayThing" id="points" style="color: var(--rank); text-shadow: var(--rank) 0px 0px 10px;">${formatWhole(player.hop.coloTier.add(1).max(0))}</h2>`}],
                'blank',
                'milestones',
                'blank',
            ],
            unlocked(){return player.hop.done},
            buttonStyle: {
                'background-color': 'var(--rank)',
                'border-color': 'var(--rank)',
            },
            color: 'var(--rank)',
        },
    },
    bars: {
        level: {
            direction: RIGHT,
            width: 550,
            height: 70,
            progress() { return player.hop.bestReset.div(tmp.hop.forRank) },
            display() {
                return `Rank <h2 class="overlayThing" id="points" style="color: var(--rank); text-shadow: var(--rank) 0px 0px 10px, black 0px 0px 5px, black 0px 0px 5px, black 0px 0px 5px;">${formatWhole(tmp.hop.rank.max(0))}</h2><br>
                ${formatWhole(player.hop.bestReset)}/${formatWhole(tmp.hop.forRank)} Best GH Gained`
            },
            fillStyle: { 'background-color': 'var(--rank)', },
            unlocked(){return player.hop.done},
        },
    },
    clickables: {
        11: {
            title: 'Enlist Grasshoppers',
            display() {
                return `Enlists ${formatWhole(player.hop.enlistPortion)}%, ${formatWhole(player.hop.points.mul(player.hop.enlistPortion/100).floor())} Grasshoppers`
            },
            canClick() { return player.hop.points.gte(1) },
            onClick() {
                player.hop.active = player.hop.active.add(player.hop.points.mul(player.hop.enlistPortion/100)).floor();
                player.hop.points = player.hop.points.mul(Decimal.sub(1, player.hop.enlistPortion/100)).ceil();
            },
            style: {
                width: '250px',
                height: '50px',
                'min-height': '50px',
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: 'Stage 4',
            effectDescription() { return `Every stage increases crystals gain by +100%<br>Currently: x${formatWhole(tmp[this.layer].milestones[this.id].effect)}` },
            effect() { return player.hop.coloTier.add(2) },
            done() { return player.hop.coloTier.gte(3) },
            style: { 'width': '500px', 'border-width': '0', 'box-shadow': 'inset 0 0 0 4px rgba(0,0,0,0.125)', 'background-image': 'linear-gradient(45deg, var(--rank), transparent)' },
        },
        1: {
            requirementDescription: 'Stage 10',
            effectDescription() { return `Every stage increases TP gain by +100%<br>Also unlocks an accomplishment | Currently: x${formatWhole(tmp[this.layer].milestones[this.id].effect)}` },
            effect() { return player.hop.coloTier.add(2) },
            done() { return player.hop.coloTier.gte(9) },
            style: { 'width': '500px', 'border-width': '0', 'box-shadow': 'inset 0 0 0 4px rgba(0,0,0,0.125)', 'background-image': 'linear-gradient(45deg, var(--rank), transparent)' },
        },
        2: {
            requirementDescription: 'Stage 20',
            effectDescription() { return `Every stage increases grass gain by +25% compounding<br>Also reduces Combat Tick time to 8s | Currently: x${format(tmp[this.layer].milestones[this.id].effect)}` },
            effect() { return player.hop.coloTier.add(1).pow_base(1.25) },
            done() { return player.hop.coloTier.gte(19) },
            unlocked() { return hasMilestone(this.layer, this.id-2) },
            style: { 'width': '500px', 'border-width': '0', 'box-shadow': 'inset 0 0 0 4px rgba(0,0,0,0.125)', 'background-image': 'linear-gradient(45deg, var(--rank), transparent)' },
        },
        3: {
            requirementDescription: 'Stage 27',
            effectDescription() { return `Every stage increases experience gain by +25% compounding<br>Currently: x${format(tmp[this.layer].milestones[this.id].effect)}` },
            effect() { return player.hop.coloTier.add(1).pow_base(1.25) },
            done() { return player.hop.coloTier.gte(26) },
            unlocked() { return hasMilestone(this.layer, this.id-2) },
            style: { 'width': '500px', 'border-width': '0', 'box-shadow': 'inset 0 0 0 4px rgba(0,0,0,0.125)', 'background-image': 'linear-gradient(45deg, var(--rank), transparent)' },
        },
        4: {
            requirementDescription: 'Stage 32',
            effectDescription() { return `Every stage increases grasshoppers' END by +1<br>Currently: +${formatWhole(tmp[this.layer].milestones[this.id].effect)}` },
            effect() { return player.hop.coloTier.add(1) },
            done() { return player.hop.coloTier.gte(31) },
            unlocked() { return hasMilestone(this.layer, this.id-2) },
            style: { 'width': '500px', 'border-width': '0', 'box-shadow': 'inset 0 0 0 4px rgba(0,0,0,0.125)', 'background-image': 'linear-gradient(45deg, var(--rank), transparent)' },
        },
    },
    tooltip() { return `<h2>THE CULT</h2><br>${formatWhole(player.hop.points)} GH<br>Rank ${formatWhole(tmp.hop.rank)}` },
    doReset(layer) {
        if(tmp[layer].row <= tmp[this.layer].row) { return }
        if(tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return }
        layerDataReset(this.layer, ['done'])
    },
    onPrestige(gain) {
        player.hop.done = true
        player.hop.bestReset = player.hop.bestReset.max(gain)
    },
    rank() { return player.hop.bestReset.floor().div(10).max(0).add(1).log(1.5).pow(0.5).floor() },
    forRank(x = tmp.hop.rank) { return x.add(1).pow(2).pow_base(1.5).sub(1).mul(10).ceil() },
    rankEffect() { return tmp.hop.rank.pow(0.66).pow_base(2) },
    branches: ['crys'],
    insects: ['Ant', 'Catterpillar', 'Aphid', 'Beetle', 'Mantis', 'Butterfly', 'Bumblebee', 'Wasp', 'Sparrow', 'Duck', 'Pigeon', 'Frog', 'Kitten', 'Dog', 'Horse', 'Eagle', 'Elephant', 'Hippo', 'Rhino', 'Human', 'Tank', 'Shark', 'T-Rex', 'Megalodon'],
    insectMods: ['Weak', 'Common', 'Average', 'Adept', 'Strong', 'Buff', 'Veteran', 'Powered', 'Master', 'Gifted', 'Magic', 'Legend', 'Ultra', 'Demonic', 'Hyper', 'Heavenly', 'Giga', 'Godly', 'Omega', 'Aleph', 'Omni', 'God of'],
    insectModsPlusPlusPlus: ['+', '++', '+++'],
    opponentName() {
        const insect = this.insects[player.hop.coloTier.mod(this.insects.length).toNumber()]
        let prefix = this.insectMods[player.hop.coloTier.div(this.insects.length).mod(this.insectMods.length).floor().toNumber()]
        if(player.hop.coloTier.gte(Decimal.mul(this.insects.length, this.insectMods.length).mul(4))) {
            insect = insect + '+' + formatWhole(player.hop.coloTier.div(this.insects.length).div(this.insectMods.length).floor())
        } else if(player.hop.coloTier.gte(Decimal.mul(this.insects.length, this.insectMods.length))) {
            insect = insect + this.insectModsPlusPlusPlus[player.hop.coloTier.div(this.insects.length).div(this.insectMods.length).sub(1).floor().toNumber()]
        }
        return prefix + ' ' + insect
    },
    oppStats() {
        return [
            player.hop.coloTier.pow_base(1.2).mul(10).floor(),
            player.hop.coloTier.pow_base(1.1).mul(player.hop.coloTier.pow(0.5)).floor(),
        ]
    },
    dmg() {
        let dmg = Decimal.dOne;
        dmg = dmg.mul(tmp.hop.rankEffect);
        if(hasMilestone('hop', 1)) { dmg = dmg.mul(tmp.crys.milestones[4].effect[0]); }
        return dmg.floor();
    },
    arm() {
        let dmg = Decimal.dZero;
        if(hasMilestone('hop', 4)) { dmg = dmg.add(milestoneEffect('hop', 4)); }
        return dmg.floor();
    },
})
