'use strict'
import {getData, getDataFromLocalStorage} from './services/services.js'
import {Component} from './module/Component.js'
import {count} from './module/counter.js' 

const URL ='http://www.boredapi.com/api/activity/'; //'https://cat-fact.herokuapp.com/facts/591f98803b90f7150a19c229'//

const btnSearch = document.querySelector('.btn-search');
const adviceContainer = document.querySelector('.advice-container');
const likedAdvicesContainer = document.querySelector('.liked-advices-container');
const alreadyLikedParagraph = document.querySelector('.already-liked');

const likedAdvicesStorage = {};

const adviceClassName = 'advice';
const likedAdviceClassName = 'liked-advice';


const MAX_ADVICE = 10;

let advice = null;

class Advice extends Component{
    
    static isDisplayed=false;

    constructor(options, className){
        super(options.data, options.id, className);
        
        this.buttonShare = document.createElement('button');
        this.buttonShare.textContent='Share via Twitter';
        this.buttonLike = document.createElement('button');
        this.buttonLike.textContent='Like';

        this.element.appendChild(this.text);
        this.element.appendChild(this.buttonShare);
        this.element.appendChild(this.buttonLike);
        
        this.buttonShare.onclick = this.share.bind(this);
        this.buttonLike.onclick = this.like.bind(this);
    }

    share(){
        alert(`'${this.data}' shared`)
    }

    like(){
        createLikedAdvices(this.data, this.id);
    }

    modify(data){
        this.data = data.data;
        this.text.innerText = this.data;
        this.id = data.id;
    }
}

class LikedAdvice extends Component{
    constructor(options, parent, className){
        super(options.data, options.id, className);
        this.parentElem = parent;
        this.buttonRemove = document.createElement('button');
        this.buttonRemove.textContent='Remove';

        this.element.appendChild(this.text);
        this.element.appendChild(this.buttonRemove);
        this.parentElem.appendChild(this.element);

        this.buttonRemove.onclick = this.remove.bind(this);
        
    }
    remove(){
        this.parentElem.removeChild(this.element);
        delete likedAdvicesStorage[this.id]
        localStorage.setItem('items',JSON.stringify(likedAdvicesStorage));
        count.decrement();
        
    }
}

function createLikedAdvices(data, id){
    
    if(!(id in likedAdvicesStorage)){

        if(count.get()>=MAX_ADVICE){
            showMessage(`Maximinum of liked elements equals ${count.get()}`)
            return;
        }

        new LikedAdvice({data:data, id:id}, likedAdvicesContainer, likedAdviceClassName);
        likedAdvicesStorage[id] = data;
        localStorage.setItem('items',JSON.stringify(likedAdvicesStorage));
        count.increment();
    } else {
        alreadyLikedParagraph.classList.remove('hide');
        alreadyLikedParagraph.classList.add('show');
        setTimeout(()=>{
            alreadyLikedParagraph.classList.remove('show');
            alreadyLikedParagraph.classList.add('hide');
        }, 1200)
    }
}

function createLikedAdvicesFromLS(data, id){
    new LikedAdvice({data:data, id:id}, likedAdvicesContainer, likedAdviceClassName);
    likedAdvicesStorage[id] = data;
    count.increment();
}

btnSearch.addEventListener('click', (e)=>{
    getData(URL).then(data => {
        if('error' in data){
            throw Error('Something went wrong on serser. Try again')
        }
        const res = {};
            res.data = data.activity;
            res.id = +data.key;
            if(!Advice.isDisplayed){
                advice = new Advice(res, adviceClassName );
                Advice.isDisplayed=true;
                adviceContainer.insertAdjacentElement('afterbegin', advice.element)
            }
            else{
                advice.modify(res);
            }        
    }).catch((err)=>{
        alert(err.message)
    });
})

function showMessage(msg){
    alert(msg);
}

const getAdvicesFromLocalStorage = new Promise(function(resolve, reject) {
    const itemsFromStorage = getDataFromLocalStorage() || null;
    if(itemsFromStorage){
        resolve(itemsFromStorage)
    } else{
        reject( Error('No liked advices.'))
    }
})

getAdvicesFromLocalStorage.then((advicesFromLS)=>{
    for(let key in advicesFromLS){
        if (advicesFromLS.hasOwnProperty(key)) {
            createLikedAdvicesFromLS(advicesFromLS[key], key);
        }
    }
}).catch((error)=>{
    console.log(error.message)
})
























