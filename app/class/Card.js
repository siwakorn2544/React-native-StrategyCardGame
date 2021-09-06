class Card { 
    constructor(Name ,ATK, HP, _img) {
        this.Name = Name
        this._img = _img
        this.ATK = ATK
        this.HP = HP
    }

    setHp(n, interact){
    //interact แทนการกระทำ เก็บเป็นbool โดย
    //True -> takeDamage
    //False -> takeHealing
        if (interact) {
            if (this.HP - n <= 0){
                this.HP = 0
                console.info("this card is destroy!! player take a 1 damage.")
                // detroyed()
            }
            else {
                this.HP -= n
            }
        }
        else if (!interact) {
            this.HP += n
        }
    }

    setATK(n, interact){
        //interact แทนการกระทำ เก็บเป็นbool โดย
        //True -> reducePower
        //False -> raisePower
        if (interact) {
            if (this.ATK - n <= 0){
                this.ATK = 0
            }
            else {
                this.ATK -= n
            }
        }
        else if (!interact) {
            this.ATK += n
        }
    }
}