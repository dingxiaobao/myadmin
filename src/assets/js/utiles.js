export function debounce(fn,delay){
    let timer=null
    return function(){
        if(timer){
            clearTimeout(fn,delay)
        }else{
            timer=setTimeout(fn,delay)
        }
    }
}