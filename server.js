var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL Schema
var schema = buildSchema(`
    type Query {
        chainsaw(id: Int!): Chainsaw
        chainsaws(designation: String): [Chainsaw]
    }
    type Mutation{
        updateChainsawDesignation(id: Int!, designation: String!): Chainsaw
    }
    type Chainsaw {
        id: Int
        brand: String
        model: String
        displacement: String
        designation: String
        url: String
    }
`);

var chainsawsData = [
    {
        id: 1,
        brand: 'Stihl',
        model: 'MS 261',
        displacement: '49 cc',
        designation: 'Professional use',
        url: 'https://www.agrotehnika.bg/motoren-trion-shtil-stihl-ms-361.html'
    },
    {
        id: 2,
        brand: 'Stihl',
        model: 'MS 660',
        displacement: '91 cc',
        designation: 'Professional use',
        url: 'https://rezachki.com/rezachka-za-darva-motoren-trion-stihl-ms-660'
    },
    {
        id: 3,
        brand: 'Stihl',
        model: 'MS 181',
        displacement: '35 cc',
        designation: 'Non-professional use',
        url: 'https://motorni-trioni.com/motoren-trion-stihl-ms-181'
    },
    {
        id: 4,
        brand: 'Husqvarna',
        model: '3120 XP',
        displacement: '121 cc',
        designation: 'Professional use',
        url: 'https://www.onlinemashini.bg/motoren-trion-husqvarna-3120-xp-36--62-kw-9000-ob-min-/32413'
    },
    {
        id: 5,
        brand: 'Husqvarna',
        model: '236',
        displacement: '36 cc',
        designation: 'Non-professional use',
        url: 'https://www.agrotehnika.bg/motoren-trion-husqvarna-236.html'
    },
    {
        id: 6,
        brand: 'Husqvarna',
        model: '372 XP',
        displacement: '71 cc',
        designation: 'Professional use',
        url: 'https://www.agrotehnika.bg/motoren-trion-husqvarna-372-xp-x-torq.html'
    }
]

var getChainsaw = function(args) {
    var id = args.id;
    return chainsawsData.filter(chainsaw => {
        return chainsaw.id == id;
    })[0];
}

var getChainsaws = function(args) {
    if(args.designation){
        var designation = args.designation;
        return chainsawsData.filter(chainsaw => chainsaw.designation === designation);

    } else{
        return chainsawsData
    }
}

var updateChainsawDesignation = function({id, designation}){
    chainsawsData.map(chainsaw => {
        if (chainsaw.id === id) {
            chainsaw.designation = designation;
            return chainsaw;
        }
    });
    return chainsawsData.filter(chainsaw => chainsaw.id === id)[0];
}

var root = { 
    chainsaw: getChainsaw,
    chainsaws: getChainsaws,
    updateChainsawDesignation: updateChainsawDesignation
};

var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));