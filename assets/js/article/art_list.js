$(function () {
    var layer = layui.layer;

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示10条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    };

    // 1.1 获取类别
    initArtcateList();

    // 1.2 获取文章类别
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
                var htmlStr = template('tpl-cate-name', res);
                $('#cateList').html(htmlStr);

                // 通过 layui 重新渲染表单区域的UI结构
                layui.form.render()

            }
        });
    }

    // 2.1 获取文章列表
    initArtList();

    // 2.2 获取文章列表
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                var htmlStr = template('tpl-tabList', res);
                $('tbody').html(htmlStr);

                // 加载分页
                page(res.total);

            }
        })
    }

    // 筛选
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();

        var cate_name = $('[name=cate_name]').val(); // 文章分类
        var state = $('[name=state]').val();  // 文章状态

        q.state = state;
        q.cate_id = cate_name;

        // 重新获取
        initArtList();
    })

    // 分页
    function page(total) {
        layui.laypage.render({
            // 指向存放分页的容器，
            elem: 'listPage'
            // 数据总数。一般通过服务端得到	
            , count: total
            , curr: q.pagenum
            , limit: q.pagesize
            // 每页条数的选择项
            , limits: [2, 5, 10]
            // 自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）	
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            , jump: function (obj, first) {
                if (!first) {  // 第一次不执行
                    var pagenum = obj.curr; // 第几页
                    var pagesize = obj.limit; // 每页显示几条数据；
                    q.pagenum = pagenum;
                    q.pagesize = pagesize;
                    initArtList();
                }
            }
        });
    }

    // 定义时间美化过滤器
    template.defaults.imports.dataFormat = function (dateStr) {
        var date = new Date(dateStr);
        var year = getTime(date.getFullYear());
        var month = getTime(date.getMonth() + 1);
        var day = getTime(date.getDate());
        var h = getTime(date.getHours());
        var m = getTime(date.getMinutes());
        var s = getTime(date.getSeconds());

        return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
    }

    function getTime(num) {
        return num < 10 ? '0' + num : num;
    }

    // 删除
    $('tbody').on('click', '.btnRemove', function () {

        // console.log($(this).parents('tr').siblings('tr'));
        var id = $(this).attr('data-id');

        layer.confirm('确定要删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res)
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 删除成功
                    layer.msg(res.message);
                    // 如果删除的是最后一页 ，并删除后没有数据了，需要把q.pagenum -1 ;
                    if ($('tbody tr').length == 1 && q.pagenum > 1) q.pagenum--;
                    // 渲染数据
                    initArtList();
                }
            });
            // 关闭弹出框
            layer.close(index);
        })
    })

    // 修改文章
    $('tbody').on('click', '.btnEdit', function () {
        var id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?id=' + id;
    })


});