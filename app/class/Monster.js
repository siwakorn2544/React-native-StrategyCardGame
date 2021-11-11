class Monster {
    constructor(name, nClass, atk, maxHealth, cost, imgURL) {
        this.name = name; //name of card
        this.classes = nClass; //Array of possible classes
        this.maxHealths = maxHealth; //Array of possible max health (base on index of classes)
        this.atks = atk; //Array of possible attack (base on index of classes)
        this.cost = cost;
        this.imgURL = imgURL;
    }

}