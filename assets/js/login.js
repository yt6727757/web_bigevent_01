$(function () {
    // 点击去注册
    $('#link_reg').on('click', function () {
        // 隐藏登录区并且显示注册区
        $('.login_box').hide().siblings('.reg_box').show();
        // 重置当前的form表单
        $('.login_form')[0].reset();
    })

    // 点击去登录
    $('#link_login').on('click', function () {
        // 隐藏注册区显示登录区
        $('.reg_box').hide().siblings('.login_box').show();
        // 重置当前的form表单
        $('.reg_form')[0].reset();

    })

    // 自定义表单验证规则
    const form = layui.form;
    form.verify({
        // 密码的输入规则
        pwd: [/\S{6,12}/, '密码必须为6-12位，并且不能出现空格'],
        // 确认密码的规则
        rep: function (value) {
            var pwd = $('.reg_box input[name=password]').val();
            if (value !== pwd) {
                return "两次输入密码不一致";
            }
        }
    });

    // 获取到  `layer` 内置模块
    var layer = layui.layer;
    // 监听注册提交事件
    $('#reg_form').on('submit', function (e) {
        // 1.阻止表单默认提交
        e.preventDefault();
        // var da = $(this).serialize();
        // console.log(da);
        // 2.发起ajax请求
        var data = {
            username: $('#reg_form [name=username]').val(),
            password: $('#reg_form [name=password]').val()
        }
        $.ajax({
            method: "POST",
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            data: data,
            success: function (res) {
                // console.log(res);
                if (res.status === 0) {
                    $('#link_login').click();
                    layer.msg(res.message + '请登录!');
                    // 给登录页面文本框赋值
                    $('.login_box [name=username]').val(data.username);
                    $('.login_box [name=password]').val(data.password);
                } else if (res.status === 1) {
                    layer.msg(res.message);
                    $('.reg_box [name=username]').focus();
                } else {
                    layer.msg(res.message);
                }
            }
        });
    });

    // 监听登录提交事件
    $('#login_form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();

        // 发送请求
        $.ajax({
            method: 'POST',
            url: 'http://ajax.frontend.itheima.net/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 将token保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到index页面（主页）
                location.href = '/index.html';
            }
        });
    })
});
