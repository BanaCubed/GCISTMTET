var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: [
        ['misc'],
        ['city', 'blank', 'field', 'blank', 'indus']
    ]

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [
        ['layer-proxy', ['field', [
            ['bar', 'level'],
            ['bar', 'tier'],
        ]]],
        'blank',
        ["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]
    ],
    previousTab: "",
    leftTab: true,
})