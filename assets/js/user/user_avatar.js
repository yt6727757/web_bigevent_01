$(function () {
  var layer = layui.layer;

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  // 给上传按钮注册点击事件  - 选择文件
  $('#chooseFile').on('click', function () {
    $('#file').click();
  })

  // 修改裁剪图片
  $('#file').on('change', function (e) {

    // 1. 拿到用户选择的文件
    var file = e.target.files[0];

    // 判断是否选择了文件
    if (!file) {
      layer.msg('未选择图片');
    }

    // 2. 将文件转换为路径
    var imageURL = URL.createObjectURL(file);

    // 3. 重新初始化裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imageURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 点击上传 图片
  $('#btnUpload').on('click', function () {

    // 获取base64格式的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png');

    // 发送 上传 请求
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: { avatar: dataURL },
      success: function (res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 上传更换成功、
        layer.msg(res.message);
        // 调用父窗口的方法，重新渲染用户信息显示
        window.parent.getUserInfo();
      }
    });
  })


});

