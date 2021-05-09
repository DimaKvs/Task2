const getData = async (url) =>{
    try{
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network error');
        }
        return await response.json();
        
    } 
    catch(e) {
        return new Error(e);
    }
};

const getDataFromLocalStorage=function(){
    if(localStorage.getItem('items')){
        let dataFromStorage =localStorage.getItem('items');
        dataFromStorage = JSON.parse(dataFromStorage);
        if(Object.keys(dataFromStorage).length !== 0 && dataFromStorage.constructor === Object)  //!={}
            return dataFromStorage;
    }
}

export {getData, getDataFromLocalStorage};