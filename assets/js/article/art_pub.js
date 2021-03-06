$(function () {
    var layer = layui.layer;

    // 获取文章状态
    var state = '';

    // 4. 获取类别
    initArtcateList();

    // 5. 获取文章类别
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
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl_cateList', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                layui.form.render()
            }
        });
    }

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
        // 初始化图片裁剪框的大小
        // autoCropArea: 1
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 6、选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 7、监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 设置文章状态
    $('#btnPublish').on('click', function () {
        state = '已发布';
    })

    $('#btnSave').on('click', function () {
        state = '草稿';
    })

    // 表单提交事件
    $("#form-pub").on('submit', function (e) {
        e.preventDefault();

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // FormData
                var fd = new FormData($('#form-pub')[0])
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // 设置文件状态
                fd.append('state', state);
                // 6. 发起 ajax 数据请求

                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    contentType: false,
                    processData: false,
                    data: fd,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message);
                        }
                        layer.msg(res.message);
                        console.log(res)
                        location.href = '/article/art_list.html';
                    }
                });
            })
    })

});