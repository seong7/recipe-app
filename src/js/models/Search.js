// export default 'I am an exported string.';  // default export 는 하나의 data 만 export 가능

import axios from 'axios';  // npm module 의 경우 경로 대신 package name 만 입력하면 됨 
import {key, proxy} from '../config';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){  // class 의 prototype 에 async method 선언할 때는
                                // async function ~~(){} 대신 async ~~(){} 로 선언한다. 

        // fetch 의 문제점 : 모든 브라우저에 작동하지 않을 수 있다.
        // axios 사용 : 모든 브라우저에서 작동함
                    //npm 에서 설치 (dependency 임 __ $ npm install axios --save)
            // axios 의 장점 ( fetch 와 비교 ) :
                    // 1. resolved result 를 한번에 json 으로 변환함 (fetch 는 .json() 사용해야함)
                    // 2. error handling 에 더 용이함 (error catching logic 에 차이 있음)

        // const proxy = '';
        // const key = '';  // config.js 에서 import 해서 씀

        try{
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
                    // axios 도 Promise return 하므로 await 사용 !
            // console.log(res);
            this.result = res.data.recipes; // Search 객체 내 property 저장
            // console.log(this.result);
        }catch(error){
            alert(error);
        }
    }
}

