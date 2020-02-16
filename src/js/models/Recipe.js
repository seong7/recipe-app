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
            // console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            // alert(error);
            alert('Something went wrong :(');  
        }
    }

    calcTime(){
        // Assuming that we need 15 min for each 3 ingredients
        const numIngredient = this.ingredients.length;
        const periods = Math.ceil(numIngredient / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.serving = 4;
    }
}