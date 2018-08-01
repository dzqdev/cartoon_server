exports.needField = function(fieldArray,jsonObject){
    let result = {};
    for(let i = 0; i < fieldArray.length; i++){
        console.log(fieldArray[i],jsonObject[fieldArray[i]]);
        if(jsonObject.hasOwnProperty('"' + fieldArray[i]) + '"'){
            result[fieldArray[i]] = jsonObject[fieldArray[i]];
        }
    }

    return result;
}