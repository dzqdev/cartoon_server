exports.getRandomNumber = function(length){
    let result = '';
    for(let i = 0; i < length; i++){
        let num = Math.random()*9;
        num = (parseInt(num)*10)/10;
        result += num;
    }
    return result;
}