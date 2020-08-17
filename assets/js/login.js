$(function () {
    // 点击去注册
    $('#link_reg').on('click', function () {
        $('.login_box').hide().siblings('.reg_box').show();
    })

    // 点击去登录
    $('#link_login').on('click', function () {
        $('.reg_box').hide().siblings('.login_box').show();
    })
});