import webInject from 'web-inject'
import axios from 'libs/axios';

webInject
.css(
`
#canvas{
  /* visibility: hidden; */
  display:none;
}
`
)
.css('https://cdn.bootcss.com/bootstrap/4.1.0/css/bootstrap.min.css', ()=>{
  console.log('bootstrap样式注入成功')
})

document.getElementById('canvasTest').addEventListener('click',function(){
  const canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d')
  let originImage = new Image()
  originImage.src = '/images/horse.png'
  originImage.setAttribute("crossOrigin",'anonymous')
  originImage.onload = ()=>{
    canvas.width = originImage.width
    canvas.height = originImage.height
    ctx.drawImage(originImage, 0, 0,originImage.width,originImage.height,0,0,canvas.width,canvas.height)
    let base64 = canvas.toDataURL('image/jpeg', 0.7)
    axios({
      method: 'post',
      url: '/api/saveBase64',
      data: {
        base64: base64
      },
      loading: true
    }).then((res)=>{
      alert(res.message + '，已上传至public/upload')
      console.log(res)
    })
  }
});

document.getElementById('formTest').addEventListener('click',function(){
  let formdata = new FormData();
  formdata.append('files',document.getElementById('file').files[0]);
  formdata.append('text',document.getElementById('text').value);
  formdata.append('check',document.getElementById('check').value);
  axios({
    url:'/api/saveFormData',
    method:'post',
    data:formdata,
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    headers: {'Content-Type': 'multipart/form-data'},
    loading: true
  }).then((res)=>{
    alert(res.message + '，已上传至public/upload')
    console.log(res)
  })
})