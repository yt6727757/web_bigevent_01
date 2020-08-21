$(function () {

    // 自定义 密码效验规则
    var form = layui.form;
    form.verify({
        pwd: [/[\S]{6,12}/, '密码长度6-12位，并且不能有空格'],
        repwd: function (value) {
            // 获取新密码
            var newPwd = $('form [name="newPwd"]').val();
            if (value !== newPwd) {
                return '两次新密码输入不一致';
            }
        },
        samePwd: function (value) {
            // 获取旧密码
            var oldPwd = $('form [name="oldPwd"]').val();

            if (value == oldPwd) {
                return '新密码与旧密码不能相同';
            }
        }
    });

    // 监听表单提交方法
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    $('form [name="oldPwd"]').focus().select();
                   return layui.layer.msg(res.message);
                } 
                // 修改成功
                layui.layer.msg(res.message);
                // 重置表单
                $('.layui-form')[0].reset();
            }
        });
    })
});