class Cell {
    constructor(x, y, element) {
        this.x = x;
        this.y = y;
        this.value = 0; // Initial value of the cell
        this.element = element; //DOM element to target
    }
    toString(){
        return this.getValue() + "   " + this.getPos();
    }

    getValue(){
        return this.value;
    }
    getPos(){
        return this.x + "," + this.y;
    }

    getPosX(){
        return this.x;
    }
    getPosY(){
        return this.y;
    }
    //Set value and adapt Cell in game
    setValue(value){ 
        this.element.classList.remove(`cell-${this.value}`);
        this.value=value;
        this.element.classList.add(`cell-${value}`);
    }
}