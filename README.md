# image-compress-tool

A package for compressing a large image to a small size image

# install

npm install -g image-compress-tool

# usage

## 引入index.js文件：
<script type="text/javascript" src="./index.js"></script>

## 模拟tesh.html中的样例，上传文件调用方法

### compress(img, 1, 600, 1, file.type, imageDataType, function (data, size) {
}

#### params description:
/**
     * @description: 图片压缩函数
     * @param {*} img(Image)： Image 格式的image源文件
     * @param {*} orientation(Number)：需要旋转的参数，一般不需要，除非遇到图片旋转问题才需要
     * @param {*} compressType(Number)：压缩图片的类型：按照size压缩或者按照分辨率（宽度）压缩, 如果值为0: 按size压缩，如果是按分辨率压缩，则传需要压缩的目标宽度，如500
     * @param {*} quality(Number)：压缩图片质量：数值越小，代表压缩后的图片质量越低，大小越小
     * @param {*} imageFomate(String)：图片格式，如：image/png
     * @param {*} returnType((String)): 压缩后返回图片的类型，可选项为：base64  /blob
     * @param {*} cb(fuction(param1, param2)): 回调方法：返回压缩后的文件数据和文件大小
     * @return {*}
**/
