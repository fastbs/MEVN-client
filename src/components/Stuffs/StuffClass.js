class Hat {
    constructor() {
        this.color = "white";
        this.size = 52;
        this.material = "felt";
    }

    sayAbout(){
        console.log ("I'm the Hat");
        //console.log ("My props is: color - ", this.color, " size - ", this.size, " material - ", this.material);
    }
}

class Boots {
    constructor() {
        this.color = "black";
        this.size = 44;
        this.material = "leather";
    }
}

class Pants {
    constructor() {
        this.color = "blue";
        this.size = 58;
        this.material = "cotton";
    }
}

const types = {
    Hat,
    Boots,
    Pants
};

class StuffFactory {
    static createStuff(type) {
        let stuff = new types[type];
        stuff.type = type;

        return stuff;
    }
}

export { StuffFactory };