$(function(){
    //设置左边高度
    var bodyHeight = $(document).height();
    var windowHeight = $(window).height();

    var height;

    if(bodyHeight < windowHeight){
        height = windowHeight;
    }else{
        height = bodyHeight;
    }

    $('#left').height(height);
    console.log("left",height);
    $('#left').css('overflow',"hidden");


    //设置左边菜单展开
    $('.collapse').removeClass('in');
    if(window.location.href.indexOf("cartoon") > -1){
        $('#collapseCartoon').addClass('in');
    }else if(window.location.href.indexOf("category") > -1){
        $('#collapseCategory').addClass('in');
    }else if(window.location.href.indexOf("tag") > -1){
        $('#collapseTag').addClass('in');
    }else if(window.location.href.indexOf("recommend") > -1){
        $('#collapseRecommend').addClass('in');
    }else if(window.location.href.indexOf("banner") > -1){
        $('#collapseBanner').addClass('in');
    }
});