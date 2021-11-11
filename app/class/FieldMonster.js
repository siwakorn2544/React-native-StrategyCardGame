class FieldMonster {
    constructor(health,attack, name, nClass, imgURL){
        this.name = name;
        this.hp = health;
        this.atk = attack;
        this.canAttack = 1;
        this.nClass = nClass;
        this.imgURL = imgURL;
    }

    setHp(n, interact){
        //True -> takeDamage
        //False -> takeHealing
        if (interact) {
            if (this.hp - n <= 0){
                this.hp = 0
                console.info("this card is destroy!! player take a 1 damage.")
            }
            else {
                this.hp -= n
            }
            }
            else if (!interact) {
                this.hp += n
            }
    }
}