import {  ref } from "vue";

const currentUser=ref('test')

export default function usePagination(){

  function setCurrentUser(val:string){
    currentUser.value=val;
 }

return {currentUser, setCurrentUser}
}
