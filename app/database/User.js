import { database } from './db';

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

export { dataCheck, createUser };