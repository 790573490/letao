//开启进度条
// NProgress.start();
//
// setTimeout(function () {
//
//     NProgress.done();
// },2000);


//实现在第一个ajax请求发送的时候，开启进度条
//在所有的ajax请求都完成的时候，关闭进度条

//1.ajaxComplete    每个ajax 请求完成的时候调用，（不管成功失败）
//2.ajaxError       ajax请求失败的时候，调用
//3.ajaxSend        在每个ajax请求之前发送请求，调用
//4.ajaxSuccess     ajax请求成功后，调用
//5.ajaxStart       在第一个 ajax 发送时。调用
//6.ajaxStop        在所有的ajax请求完成时，调用


$(document).ajaxStart(function () {
    NProgress.start();
});

$(document).ajaxStop(function () {
    NProgress.done();
});
