$(function(){
    $('#login').click(function(){
        var username = $('#manager_name').val();
        var password = $('#manager_password').val();

        $.ajax({
            url:'/api/manager/login',
            type:'post',
            dataType:'json', 
            data:{username,password},
            success:function(response){
                if(response.msg['status'] == "ok"){
                    popup({type:'success',msg:response.msg.text,delay:1500,callBack:function(){
                        window.location.href = '/api/';
                     }});
                }else{
                    popup({type:'error',msg:response.msg.text,delay:1500,callBack:function(){
                        
                     }});
                }
            }
        });
    });
});