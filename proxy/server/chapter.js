const models = require('../../models');
const Chapter = models.Chapter;

exports.insertChapter = function(chapterParams,callback){
    let chapter = new Chapter(chapterParams);
    chapter.save(callback);
}

//更新某个章节的内容
exports.updateContent = function(condition,update,callback){
    Chapter.update(condition,update,callback);
}

//根据章节id查询章节的所有信息
exports.findById = function(chapterId,callback){
    Chapter.findById(chapterId).populate('chapter_content').exec(callback);
}

//根据条件查询章节信息
exports.findByCondition = function(condition,callback){
    Chapter.find(condition).populate('chapter_content').exec(callback);
}