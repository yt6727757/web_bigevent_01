$(function () {
    var layer = layui.layer;

    // 获取类别
    initArtcateList();


    // 获取文章类别
    function initArtcateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // 获取成功
                // layui.layer.msg(res.message);
                var htmlStr = template('tpl-table', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);

            }
        });
    }

    // 点击添加类别
    var indexAdd = null;
    $('#addArtcate').on('click', function () {
        // 弹出添加框
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
        // 默认分类名称获取焦点
        $('#form-add [name=name]').focus()
    })

    // 点击保存类别 - 因为保存按钮是动态创建的 需要用到事件代理
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 添加成功
                layer.msg(res.message);
                // 重新渲染分类列表
                initArtcateList();
                // 关闭添加的弹出框
                layer.close(indexAdd)
            }
        });
    });

    // 点击删除
    $('tbody').on('click', '#btn-del', function () {
        var id = $(this).parents('tr').attr('data-id');
        // console.log(id);
        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.close(index);
                        return layer.msg(res.message);
                    }
                    // 删除成功
                    layer.msg(res.message);
                    // 重新渲染
                    initArtcateList();
                    // 关闭弹出框
                    layer.close(index);
                }
            });

        });
    });

    var indexEdit = null;
    // 点击编辑
    $('tbody').on('click', '#btn-edit', function () {
        var id = $(this).parents('tr').attr('data-id');

        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 获取成功
                indexEdit = layer.open({
                    type: 1,
                    title: '修改文章分类',
                    area: ['500px', '250px'],
                    content: $('#dialog-edit').html()
                });
                layui.form.val('form-edit', res.data);
                // 默认分类名称获取焦点并选中文字
                $('#form-edit [name=name]').select();
            }
        });
    })

    // 修改分类信息
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 更新成功
                layer.msg(res.message)
                // 重新渲染数据
                initArtcateList();
                // 关闭弹出框
                layer.close(indexEdit)
            }
        });
    })
});