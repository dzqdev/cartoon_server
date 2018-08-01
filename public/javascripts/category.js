$(function(){
    $('#submit').click(function(){
        var category_name = $('#category_name').val();
        var category_desc = $('#category_desc').val();
        
        $.ajax({
            url:'/api/category/addCategory',
            type:'post',
            dataType:'json', 
            data:{category_name,category_desc},
            success:function(response){
                // alert(response.msg.text);
                popup({type:'success',msg:response.msg.text,delay:1000,callBack:function(){
                    window.location.reload();
                 }});
            }
        });
    });

    
    $('#update').click(function(){
        var category_id = $('#category_id').val();
        var category_name = $('#category_name').val();
        var category_desc = $('#category_desc').val();
        
        $.ajax({
            url:'/api/category/editCategory',
            type:'post',
            dataType:'json', 
            data:{category_id,category_name,category_desc},
            success:function(response){
                alert(response.msg.text);
                window.location.reload();
            }
        });
    });
});