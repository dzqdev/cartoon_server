$(function(){
    //图片上传
    if($('#uploadBanner').length > 0){
        initFileInput("uploadBanner", "/api/banner/uploadImg");
    }

    //点击按钮上传轮播图片
    $('#upload').click(function(){
        //说明文字
        var banner_title = $('#banner_title').val();
        var link = $('#link').val();
        var banner_url = $('#banner_url').val();
        var is_dispaly = $('#is_dispaly').val();

        $.ajax({
            url:'/api/banner/addBanner',
            type:'post',
            dataType:'json', 
            data:{banner_title,link,banner_url,is_dispaly},
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

    //点击删除按钮删除banner
    $('#delete').click(function(){
        var bannerId = $('#bannerId').val();
        console.log("bannerId",bannerId);
        $.DialogByZ.Confirm({Title: "", Content: "确定删除吗?",FunL:function(){
            $.ajax({
                url:'/api/banner/remove/' + bannerId,
                type:'get',
                dataType:'json', 
                data:{},
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

    //编辑Banner
    //点击删除图片显示确认
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


    //更新banner信息
    $('#updateBanner').click(function(){
        //banner_title
        var banner_title = $('#banner_title').val();
        //banner link
        var link = $('#link').val();
        //banner图片地址
        var banner_url = $('#banner_url').val();
        //banner id
        var bannerId = $('#bannerId').val();
        //是否显示
        var is_display = $('#is_display').val(); 

        console.log("is_dispaly",is_display);

        $.DialogByZ.Confirm({Title: "", Content: "确定修改吗?",FunL:function(){
            $.ajax({
                url:'/api/banner/editBanner',
                type:'post',
                dataType:'json', 
                data:{banner_title,link,bannerId,is_display,banner_url},
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
        console.log("上传后的路径",data);
        $('#banner_url').val(data.response.params.img_url);
    });
}