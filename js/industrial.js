addLayer('indus', {
    name: "grasshop", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#888888",
    resource: "grasshops {UNIMPLEMENTED}", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 11, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasMilestone('misc', 2)?true:'ghost'},
    nodeStyle: {
        'background-image': 'url(resources/industrial-icon.webp)',
        'background-size': 'contain',
        'background-color': '#444444'
    },
    branches: ['field'],
    tooltip() {
        return `<h2>INDUSTRIAL</h2><br>
        ${formatWhole(player.indus.points)} grasshops`
    },
    tabFormat: {
        "Grasshop": {
            content: [
                'main-display'
            ],
            buttonStyle: {
                'background-color': '#222222'
            },
        },
        "Control Panel": {
            content: [
                'master-button',
                ['clickable-tree', [
                    [11],
                    [21, 22, 23, 24],
                    [31]
                ]]
            ],
            buttonStyle: {
                'background-color': '#222222'
            },
            unlocked(){return hasMilestone('misc', 5)}
        },
    },
    clickables: {
        11: {
            display() { return `<h2>Toggle Autocut</h2><br>Currently: <b>${getClickableState('indus', this.id)===1?"OFF":"ON"}`},
            canClick(){return true},
            onClick(){if(getClickableState('indus', this.id)===1){setClickableState('indus', this.id, 2)} else setClickableState('indus', this.id, 1)},
            branches: [21, 22, 23, 24]
        },
        21: {
            display() { return `<h2>Toggle Grass Autobuy</h2><br>Currently: <b>${getClickableState('indus', this.id)===1?"OFF":"ON"}`},
            canClick(){return true},
            onClick(){if(getClickableState('indus', this.id)===1){setClickableState('indus', this.id, 2)} else setClickableState('indus', this.id, 1)},
        },
        22: {
            display() { return `<h2>Toggle Prestige Autobuy</h2><br>Currently: <b>${getClickableState('indus', this.id)===1?"OFF":"ON"}`},
            canClick(){return false},
            onClick(){if(getClickableState('indus', this.id)===1){setClickableState('indus', this.id, 2)} else setClickableState('indus', this.id, 1)},
        },
        23: {
            display() { return `<h2>Toggle Crystal Autobuy</h2><br>Currently: <b>${getClickableState('indus', this.id)===1?"OFF":"ON"}`},
            canClick(){return false},
            onClick(){if(getClickableState('indus', this.id)===1){setClickableState('indus', this.id, 2)} else setClickableState('indus', this.id, 1)},
        },
        24: {
            display() { return `<h2>Toggle Perks Autobuy</h2><br>Currently: <b>${getClickableState('indus', this.id)===1?"OFF":"ON"}`},
            canClick(){return false},
            onClick(){if(getClickableState('indus', this.id)===1){setClickableState('indus', this.id, 2)} else setClickableState('indus', this.id, 1)},
        },
        masterButtonPress() {
            setClickableState('indus', 11, 2)
            setClickableState('indus', 21, 2)
            setClickableState('indus', 22, 2)
            setClickableState('indus', 23, 2)
            setClickableState('indus', 24, 2)
        },
        masterButtonText: "Enable All"
    }
})