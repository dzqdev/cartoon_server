//书架
const models = require('../../models');
const BookShelf = models.BookShelf;


//添加一条收藏记录
exports.saveBookShelfRecord = function(bookRecord,callback){
    let bookShelf = new BookShelf(bookRecord);
    bookShelf.save(callback);
}

//删除一条收藏记录
exports.removeBookShelfRecord = function(condition,callback){
    BookShelf.remove(condition,callback);
}

//更新收藏记录
exports.updateBookShelfRecord = function(condition,update,options,callback){
    BookShelf.update(condition,update,options,callback);
}

//查找收藏记录
exports.findByCondition = function(condition,callback){
    BookShelf.find(condition).populate({
        path:'last_watch',
        select:['_id','chapter_title','chapter_agree','chapter_number'],
        model:'Chapter'
    }).exec(callback);
}

//查询全部
exports.findAll = function(condition,callback){
  BookShelf.find(condition).populate('cartoon_id').populate({
    path:'last_watch',
    select:['_id','chapter_title','chapter_agree','chapter_number'],
    model:'Chapter'
    }).exec(callback);
}