exports.StringConvertArray = function(souceString){
    let result = [];
    souceString = souceString.substring(1,souceString.length-1);
    let fieldArray = souceString.split(",");
    for(let i = 0 ; i < fieldArray.length; i++){
        let convertField = fieldArray[i].substring(1,fieldArray[i].length -1);
        result.push(convertField);
    }
    return result;
}