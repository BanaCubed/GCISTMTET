addLayer('evo', {
    row: 4,
    realm: 1,
    startData() { return {
        // Basic
        unlocked: true,          // DO NOT CHANGE
        done: false,             // DO NOT CHANGE
        points: Decimal.dZero,   // Grassmasters
    }},
    update(diff) {
    },
    color: 'var(--evo)',
    layerShown() { return player.evo.done || hasMilestone('leag', 6) },
    image: 'resources/lab-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
        'background-color': 'hsl(0, 0%, 27.5%)',
        'border-color': 'var(--ghop)',
    },
    type: 'normal',
    resource: 'Grasshoppers',
    gainMult() {
        let gain = player.hop.points.max(1).log(10).div(30).pow(0.4).pow_base(1.25).mul(100);
        return gain.max(100).floor();
    },
    baseResource: 'Levels',
    baseAmount() { return player.hop.coloTier },
    exponent() { return Decimal.dZero },
    requires: new Decimal(299),
    passiveGeneration() {
        let gain = Decimal.dZero;
        return gain;
    },
    prestigeButtonText() {
        return player.hop.coloTier.lt(299)?`Reach Stage 300 to Evolve`:`Evolve ${formatWhole(getResetGain('evo'))} Grassmasters<br><br>Grassmasters gain is based on Grasshoppers`
    },
    tabFormat: {
        'Evolution': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--evo); text-shadow: var(--evo) 0px 0px 10px;">${formatWhole(player.evo.points.max(0))}</h2> Grassmasters`}],
                'blank',
                'prestige-button',
                'blank',
                ['raw-html', `Evolution doesn't reset Equipment, and you keep the Forest unlocked`],
                'blank',
            ],
            color: 'var(--evo)',
        },
        'Basic Tree': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--evo); text-shadow: var(--evo) 0px 0px 10px;">${formatWhole(player.evo.points.max(0))}</h2> Grassmasters`}],
                ['raw-html', '<br>This tree will have upgrades similar to "+10% DMG per level", and has no scaling'],
            ],
            color: 'var(--evo)',
            unlocked(){return player.evo.done},
        },
        'Advanced Tree': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--evo); text-shadow: var(--evo) 0px 0px 10px;">${formatWhole(player.evo.points.max(0))}</h2> Grassmasters`}],
                ['raw-html', '<br>This tree will have upgrades similar to "HP boost DMG at a reduced rate", and has either scaling or one max purchase<br>Flowers III will be its own tree/Automation Tree'],
            ],
            color: 'var(--evo)',
            unlocked(){return player.evo.done},
        },
    },
    doReset(layer) {
        if(tmp[layer].row <= tmp[this.layer].row) { return }
        if(tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return }
        layerDataReset(this.layer, ['done'])
    },
    onPrestige(gain) {
        player.evo.done = true;
        activityParticle('resources/lab-icon.webp', true);
    },
})