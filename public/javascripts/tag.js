$(function(){
    $('#submit').click(function(){
        var tag_name = $('#tag_name').val();
        var is_discard = $('#is_discard').val();
        var color = $("input[name='color']:checked").val();
        is_discard=="true"?is_discard="false":is_discard="true";
        
        $.ajax({
            url:'/api/tag/addTag',
            type:'post',
            dataType:'json', 
            data:{tag_name,is_discard,color},
            success:function(response){
                popup({type:'success',msg:response.msg.text,delay:1000,callBack:function(){
                    window.location.reload();
                 }});
            }
        });
    });

    //修改
    $('#update').click(function(){
        var tag_id = $('#tag_id').val();
        var tag_name = $('#tag_name').val();
        var is_discard = $('#is_discard').val();
        var color = $("input[name='color']:checked").val();
        is_discard=="true"?is_discard="false":is_discard="true";
        
        $.ajax({
            url:'/api/tag/editTag',
            type:'post',
            dataType:'json', 
            data:{tag_id,tag_name,is_discard,color},
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
    });
});