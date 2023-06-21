import { SETUSER, SETDECK } from "./userAction";

const initialState = { 
    name: "",
    uid: "",
    deck: [],
    imgURL: ""
 };

 const userReducer = (state = initialState, action) => {
     switch(action.type){
         case SETUSER:
             return {
                ...state,
                name: action.name,
                uid: action.uid,
                imgURL: action.img
             }
        case SETDECK:
                return {
                    ...state,
                    deck: action.deck
                }
         default:
             return state;
     }
 };

 export default userReducer;