class Player {
    constructor(name, deck, field, hand, lifePoint, maxMana, mana) {
        this.name = name
        this.MaxMana = deck
        this.mana = 1
        this.lifePoint = 20
        this.field = []
        this.hand = []
        this.deck = suffleDeck(deck) 
    }

    suffleDeck(deck){
        let shuffled = deck;
        for (let i = shuffled.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
        return shuffled;
    }

}

export default Player; 