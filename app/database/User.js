import { database, firestore } from './db';

async function dataCheck(UID) {
    let agument = false;
    await database().ref(`/users`)
        .once('value', snapshot => {
            if (snapshot.child(UID).exists()){
                console.log(`UID ${UID} is exists!`);
                agument = true;
            } 
            else {
                console.log(`UID ${UID} is not exists!`);
                agument = false;
            }
        }) 
    return agument;
}

async function _receiveDeckData(UID){
    let decklist = [];
    await database().ref(`/users/${UID}/Deck`)
        .once('value')
        .then(snapshot => {
            if (snapshot.val() == null){
                decklist = []
            }
            else {
                decklist = snapshot.val(); 
            }
            console.log(decklist);
        });
    return decklist;
}

async function _receiveName(UID){
    let PlayerName = "";
    await database().ref(`/users/${UID}/Name`)
        .once('value')
        .then(snapshot =>{
            PlayerName = snapshot.val();
            console.log(PlayerName);
        })
    return PlayerName;
}


async function createUser(uid, name){
    let newUser = {}

    newUser = {
        Deck: [null],
        Name: name
    };
    console.log(newUser);
    try {
        await database().ref(`/users`).child(uid).set(newUser);
        console.log('Add User success!')
    } catch (err) {
        console.log('Add fail:  '+err);
    }
}

async function getCardLists(){
    const data = await firestore().collection('CardList').get();
    const cardList = data.docs.map((data, index) => {
        return { imgURL : data._data.imgURL, id: data.id};
    });
    return cardList;
}

async function getCardData(deck){
    let setDeck = [...new Set(deck)]
    let data = [];
    for (let i = 0; i < setDeck.length; i++) {
        const element = await firestore().collection('CardList').doc(setDeck[i]).get();
        const count = deck.filter(x => x == setDeck[i]).length;
        data.push({id: element.id, imgURL: element._data.imgURL, count: count})
    }
    console.log(data);
    return data;
}

async function _saveDataDeck(uid, deck){
    console.log(deck[0] == null);
    if (deck[0] != null){
        try {
            await database().ref(`/users/${uid}`).child("Deck").set(deck);
            console.log('Deck Saved!!')
        } catch (err) {
            console.log('Add fail:  '+err);
        }
    } 
}

async function _receiveGameData(roomID) {
    let room = [];
    await database().ref(`/PlayRoom/${roomID}`)
        .once('value')
        .then(snapshot =>{
            room = snapshot.val();
            console.log(room);
        })
    return room;
}

async function getCardInformation(ID) {
    const card = await firestore().collection('CardList').doc(ID).get()
    return card._data
}

async function _setFieldUnit(enemy, user, roomID, UIDEnemy, UIDUser) {
    for (let index = 1; index < 6; index++) {
        if (index < enemy.length){
            var enemyCard = new Object({
                atk: enemy[index].atk, 
                class: enemy[index].class, 
                hp: enemy[index].hp, 
                imgURL: enemy[index].imgURL
            });
        }
        else { var enemyCard = null }

        if (index < user.length){
            var userCard = new Object({
                atk: user[index].atk,
                canAttack: user[index].canAttack,
                class: user[index].class,
                hp: user[index].hp,
                imgURL: user[index].imgURL
            });
        }      
        else { var userCard = null; }
        await database().ref(`/PlayRoom/${roomID}/players/${UIDEnemy}/Field`).child(index+"").set(enemyCard);
        await database().ref(`/PlayRoom/${roomID}/players/${UIDUser}/Field`).child(index+"").set(userCard);
    }
}

export { dataCheck, createUser, _receiveDeckData, _receiveName, getCardLists, getCardData, _saveDataDeck, _receiveGameData, getCardInformation, _setFieldUnit };
