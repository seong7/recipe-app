import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
                        // return Promise
            console.log(res);
        }catch(error){
            alert(error);
        }
    }
}