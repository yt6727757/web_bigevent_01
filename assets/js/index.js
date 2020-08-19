$(function () {
    // 获取用户信息
    getUserInfo();


    // 点击退出
    $('#exitLog').on('click', function () {
        layui.layer.confirm('确认登录？', { icon: 3, title: '提示' }, function (index) {
            console.log(index);

            // 清空 localStroage 
            localStorage.removeItem('token');

            // 跳转到登录页面
            location.href = '/login.html';

            // 关闭 确认框
            layui.layer.close(index);
        });
    });


   

});


// 因为其他页面需要 获取 用户信息
// 所以定义在入口函数外(为全局函数)
// 获取用户信息
function getUserInfo() {

    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status != 0) {
                return;
            }
            // 调用渲染用户头像
            renderAvatar(res.data);
        }
    })
}

// 渲染用户头像
function renderAvatar(data) {
    // 获取用户名称
    var name = data.nickname || data.username;
    // 渲染用户名称
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);

    // 渲染头像 (判断是否有头像)
    if (data.user_pic) {
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.text-avatar').hide();
    } else {
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show().css('visibility','visible');
        $('.layui-nav-img').hide();
    }
    $('.layui-side-scroll .userinfo').css('visibility','visible');
}