/*
 * @LastEditTime: 2021-05-31 17:36:37
 * @LastEditors: Please set LastEditors
 * @Description: 图片处理相关方法
 * @FilePath: \light_monitor_web\src\utils\imageCompress.js
 */
/**
     * @description: 图片压缩函数
     * @param {*} img： Image 格式的image源文件
     * @param {*} orientation：需要旋转的参数，一般不需要，除非遇到图片旋转问题才需要
     * @param {*} compressType：压缩图片的类型：按照size压缩或者按照分辨率（宽度）压缩, 如果0: 按size压缩，如果是按分辨率压缩，则传需要压缩的目标宽度，如500
     * @param {*} quality：压缩图片质量：数值越小，代表压缩后的图片质量越低，大小越小
     * @param {*} imageFomate：图片格式，如：image/png
     * @param {*} returnType: 压缩后返回图片的类型，可选项为：base64  /blob
     * @param {*} cb: 回调
     * @return {*}
**/
function compress(img, orientation, compressType, quality, imageFomate, returnType, cb) {
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext('2d')
    //瓦片canvas
    let tCanvas = document.createElement("canvas")
    let tctx = tCanvas.getContext("2d")
    let width = compressType ? compressType : img.width
    let height = compressType ? compressType * (img.height / img.width).toFixed(3) : img.height
    // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio
    if ((ratio = width * height / 4000000) > 1) {
      console.log("大于400W像素")
      ratio = Math.sqrt(ratio)
      width /= ratio
      height /= ratio
    } else {
      ratio = 1
    }
    canvas.width = width
    canvas.height = height
    //        铺底色
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)
    // 如果图片像素大于100万则使用瓦片绘制
    let count
    if ((count = width * height / 1000000) > 1) {
      console.log("超过100W像素")
      count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
      //            计算每块瓦片的宽和高
      let nw = ~~(width / count)
      let nh = ~~(height / count)
      tCanvas.width = nw
      tCanvas.height = nh
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height)
    }
    //修复有的时候上传图片的时候 被旋转的问题
    if(orientation !== '' && orientation !== 1){
      switch(orientation){
        case 6:// 需要顺时针（向左）90度旋转
          this.rotateImg(img,'left',canvas)
          break
        case 8: // 需要逆时针（向右）90度旋转
          this.rotateImg(img,'right',canvas)
          break
        case 3:// 需要180度旋转
          this.rotateImg(img,'right',canvas) //转两次
          this.rotateImg(img,'right',canvas)
          break
      }
    }
    // 进行压缩
    if (returnType === 'base64Url') {
      let ndata = canvas.toDataURL(imageFomate, quality) // 第一个参数是图片格式，如：image/png; 第二个参数代表压缩后的图片质量，数值越小，代表压缩后的图片质量越低，大小越小
      console.log('压缩前：' + img.src.length)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (img.src.length - ndata.length) / img.src.length) + "%")
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      cb(ndata, ndata.length)
    } else if (returnType === 'blob') {
      canvas.toBlob((blob) => {
        console.log('压缩前：' + img.raw.size) // 这个时候的压缩率不太准确，因为initSize算得是原图的base64的长度
        console.log('压缩后：' + blob.size)
        console.log('压缩率：' + ~~(100 * (img.raw.size - blob.size) / img.raw.size) + "%")
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
        cb(blob, blob.size)
      }, imageFomate, quality)
    }
}

// base64字符串转blob
function base642Blob (code) {
    let parts = code.split(';base64,')
    if (parts.length < 2) {
      return null
    }
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length
    let uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
}
  // blob转base64字符串
function blob2Base64 (blob, cb) {
    let reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function(e) {
      const base64data = e.target.result
      cb(base64data)
    }
}
  
module.exports = {
  compress,
  base642Blob,
  blob2Base64
}