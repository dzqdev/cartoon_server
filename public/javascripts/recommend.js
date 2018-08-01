$(function(){
    $("[data-toggle='popover']").popover();

    //隐藏输入框
    $('#recommendText').hide();

    $('#submitRecommend').click(function(){
        //推荐漫画id
        var recommendReason =  $('#recommendReason').val();
        //推荐理由
        var cartoonId = $('#selectCartoonId').val();
        $.DialogByZ.Confirm({Title: "", Content: "确定提交推荐吗?",FunL:function(){
            $.ajax({
                url:'/api/recommend/addRecommend',
                type:'post',
                dataType:'json', 
                data:{recommendReason,cartoonId},
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
    })

});

function setInput(cartoon_id,cartoon_name){
    $('#recommendText').show();
    $('#selectCartoonId').val(cartoon_id);
    $("#recommendReason").attr('placeholder',"输入推荐" + cartoon_name + "的原因");
    $("#recommendReason").focus();  
}

function cancelRecommend(recommend_Id){
    $.DialogByZ.Confirm({Title: "", Content: "确定取消推荐吗?",FunL:function(){
        $.ajax({
            url:'/api/recommend/removeRecommend',
            type:'post',
            dataType:'json', 
            data:{recommend_Id},
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
}