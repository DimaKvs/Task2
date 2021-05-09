
export class Component {
    constructor(data , id, className){
        this.data = data;
        this.id = id;
        this.element = document.createElement('div');
        this.text = document.createElement('p');
        this.text.innerText = this.data;
        this.element.classList.add(className);
    }
}

 