$(function () {

    var form = layui.form;
    // 自定义昵称验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1-6位之间'
            }
        }
    });

    // 获取用户信息
    initUserInfo();



    // 获取用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    // 获取用户信息失败
                    return layui.layer.msg(res.message);
                }
                // console.log(res.data);
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 点击重置按钮
    $('#resetBtn').on('click', function (e) {
        // 阻止重置事件
        e.preventDefault();
        // 重置
        initUserInfo();
    });

    // 提交修改用户信息 -更新用户的基本信息
    $('#user_info').on('submit', function (e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 更新成功 调用父页面的getuserinfo方法渲染页面
                window.parent.getUserInfo();
            }
        });
    });
});
