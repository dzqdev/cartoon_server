$(function(){
    //图片上传
    if($('#upload').length > 0){
        initFileInput("upload", "/api/cartoon/addCover");
    }

    //海报
    if($("#cartoon_showImg").length > 0){
        $("#cartoon_showImg").fileinput({
            language: 'zh', //设置语言
            uploadUrl: '/api/cartoon/addBill', //上传的地址
            allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
            showUpload: false, //是否显示上传按钮
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式             
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
        }).on("fileuploaded", function(event, data) {
            console.log("上传后的路径",data);
            $('#cartoon_showImg_container').val(data.response.params.img_url);
        });
    }
 

    //提交添加一本漫画记录
    $('#submit').click(function(){
        var cartoon_name =  $('#cartoon_name').val();
        var author =  $('#cartoon_author').val();
        var cartoon_desc =  $('#cartoon_desc').val();
        var cartoon_category = $('#cartoon_category').val();
        var cartoon_tag = [];
        $.each($('input[type=checkbox][name="tag"]:checked'),function(){
            cartoon_tag.push($(this).val());
        });
        var cartoon_updateTime =  $('#update_time').val();
        var cartoon_cover =  $('#cartoon_cover').val();
        var cartoon_isEnd =  $('#is_end').val();
        var cartoon_showImg =  $('#cartoon_showImg_container').val();
        console.log("cartoon_tag",cartoon_tag);
        $.ajax({
            url:'/api/cartoon/addCartoon',
            type:'post',
            dataType:'json', 
            data:{cartoon_name,author,cartoon_desc,cartoon_cover,cartoon_showImg,cartoon_category,cartoon_updateTime,cartoon_isEnd,cartoon_tag:JSON.stringify(cartoon_tag)},
            success:function(response){
                if(response.msg['status'] == "ok"){
                    popup({type:'success',msg:response.msg['text'],delay:1000,callBack:function(){
                        window.location.reload();
                    }});
                }else{
                    popup({type:'error',msg:response.msg['text'],delay:1000,callBack:function(){
                        window.location.reload();
                    }});
                }
            }
        });
    });


    //修改漫画信息
    //点击删除按钮显示上传插件
    $("#uploadImageContainer").hide();
    $('#deleteImage').click(function(){
        $.DialogByZ.Confirm({Title: "提交表单后修改才会生效", Content: "确定删除吗?",FunL:function(){
            $.DialogByZ.Close();
            $("#uploadImageContainer").show();
            $("#displayImageContainer").hide();
        },FunR:function(){
            $.DialogByZ.Close();
        }})
    });

    //海报删除
    $("#uploadBillContainer").hide();
    $('#deleteBillImage').click(function(){
        $.DialogByZ.Confirm({Title: "提交表单后修改才会生效", Content: "确定删除吗?",FunL:function(){
            $.DialogByZ.Close();
            $("#uploadBillContainer").show();
            $("#displayBillContainer").hide();
        },FunR:function(){
            $.DialogByZ.Close();
        }})
    });

    //点击提交修改按钮提交漫画的修改
    $('#updateCartoon').click(function(){
        var cartoonId = $('#cartoonId').val();
        var cartoon_name =  $('#cartoon_name').val();
        var author =  $('#cartoon_author').val();
        var cartoon_desc =  $('#cartoon_desc').val();
        var cartoon_category = $('#cartoon_category').val();
        var cartoon_tag = [];
        $.each($('input[type=checkbox][name="tag"]:checked'),function(){
            cartoon_tag.push($(this).val());
        });
        var cartoon_updateTime =  $('#update_time').val();
        var cartoon_cover =  $('#cartoon_cover').val();
        var cartoon_isEnd =  $('#is_end').val();
        var cartoon_showImg =  $('#cartoon_showImg_container').val();

        //确定提交?
        $.DialogByZ.Confirm({Title: "", Content: "确定修改吗?",FunL:function(){
            $.ajax({
                url:'/api/cartoon/editCartoon',
                type:'post',
                dataType:'json', 
                data:{cartoonId,cartoon_name,author,cartoon_desc,cartoon_cover,cartoon_showImg,cartoon_category,cartoon_updateTime,cartoon_isEnd,cartoon_tag:JSON.stringify(cartoon_tag)},
                success:function(response){
                    $.DialogByZ.Close();
                    if(response.msg['status'] == "ok"){
                        popup({type:'success',msg:response.msg['text'],delay:1000,callBack:function(){
                            window.location.reload();
                         }});
                    }else{
                        popup({type:'error',msg:response.msg['text'],delay:1000,callBack:function(){
                            window.location.reload();
                         }});
                    }
                }
            });
        },FunR:function(){
            $.DialogByZ.Close();
        }})
    });


    //点击搜索搜索漫画
    $('#search').click(function(){
        //模糊查询关键字
        var cartoon_name = $('#cartoon_name').val();
        $.ajax({
            url:'/api/cartoon/allCartoon/1/' + cartoon_name,
            type:'get',
            dataType:'json',
            data:{}
        });
    });
});

//初始化fileinput控件（第一次初始化）
function initFileInput(ctrlName, uploadUrl) {    
    var control = $('#' + ctrlName); 
    control.fileinput({
        language: 'zh', //设置语言
        uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
        showUpload: false, //是否显示上传按钮
        showCaption: false,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式             
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
    }).on("fileuploaded", function(event, data) {
        console.log("上传后的路径",data.response.text);
        $('#cartoon_cover').val(data.response.params.img_url);
    });
}
