export const SETUSER = "SETUSER";
export const setuser = (name,uid,img) => {
return { type: SETUSER, name: name, uid: uid, img: img};
};

export const SETDECK = "SETDECK";
export const setdeck = (Deck) => {
return { type: SETDECK, deck: Deck };
};