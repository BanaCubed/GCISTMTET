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
    }},
    update(diff) {
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
        gain = gain.mul(tmp.hop.rank.pow_base(2.5))
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
                'blank',
                'colosseum',
                'colo-stats',
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
    rankEffect() { return tmp.hop.rank.pow_base(2.25) },
    branches: ['crys'],
    insects: ['Ant', 'Catterpillar', 'Aphid', 'Stag Beetle', 'Praying Mantis', 'Butterfly', 'Bumblebee', 'Wasp', 'Sparrow', 'Duck', 'Pigeon', 'Frog', 'Kitten', 'Dog', 'Horse', 'Eagle', 'Elephant', 'Rhinoceros', 'Stegosaurus', 'Brachiosaurus', 'T-Rex', 'Megalodon'],
    insectMods: ['Weak', 'Scrawny', 'Common', 'Strong', 'Powerful', 'Master', 'Gifted', 'Magical', 'Legendary', 'Ascendant', 'Demonic', 'Mythical', 'Heavenly', 'Transcendant', 'Godly', 'Omega', 'Aleph', 'Infinite', 'Universal', 'Omnicient', 'Multiversal', 'Omniversal'],
    opponentName() {
        const insect = this.insects[player.hop.coloTier.mod(this.insects.length).toNumber()]
        const prefix = this.insectMods[player.hop.coloTier.div(this.insects.length).mod(this.insectMods.length).floor().toNumber()]
        return prefix + ' ' + insect
    },
    oppStats() {
        return [
            player.hop.coloTier.pow(2).pow_base(1.6).mul(10).floor(),
            player.hop.coloTier.pow(2.4).pow_base(1.2).floor(),
            player.hop.coloTier.pow(1.6).pow_base(1.6).mul(0.05).floor(),
            player.hop.coloTier.pow(2).pow_base(1.6).div(10).floor(),
        ]
    },
    dmg() {
        let dmg = Decimal.dOne;
        dmg = dmg.mul(tmp.hop.rankEffect);
        return dmg.floor();
    },
    arm() {
        let dmg = Decimal.dZero;
        return dmg.floor();
    },
})
