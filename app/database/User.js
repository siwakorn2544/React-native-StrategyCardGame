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
            decklist = snapshot.val();
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

export { dataCheck, createUser, _receiveDeckData, _receiveName, getCardLists };
