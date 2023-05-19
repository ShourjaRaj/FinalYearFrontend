import axios from 'axios';
import {toastError} from './toaster'

export default async function predict(json,url){
    try{
        const data= await axios({
            method: "POST",
            data: json,
            url: url,
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log("Api data:",data);
        return data
    }
    catch(e){
        try{
            toastError(e.response.message);
        }
        catch(e){
            alert("Something went wrong")
        }
        console.log(e);
        return false;
    }
}