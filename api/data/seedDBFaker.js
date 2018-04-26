var faker = require('faker');
var fs = require('fs');

var data = "";

for(var i=0;i<500;i++){
    let DBseed = {
        ProfileCard : [faker.helpers.contextualCard()],
        Skills : faker.lorem.paragraph(),
        Finance : faker.finance.amount(),
        reviews : [{
            username : faker.name.firstName(),
            votes : [{
                endorsed_by :  Math.floor(Math.random() * 501),
                followed_by :  Math.floor(Math.random() * 501),
                follows :  Math.floor(Math.random() * 501)
            }],
            text : faker.lorem.paragraph(),
            stars : Math.floor(Math.random() * 6),
            date : faker.date.past()
        }]
    };

    data = data + "\r\n" + ","+ JSON.stringify(DBseed, null, 2);
}

fs.writeFileSync('/home/aristofanis/Desktop/Backend/api/data/newDB.json', data);
