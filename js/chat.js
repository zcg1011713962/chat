// 接口地址 鉴权
var api_address;
var token;
// 支持模式
const CHAT = Object.freeze({
    txt: '问题咨询模式',
    image: '图像生成模式'
})
const INPUT = Object.freeze({
    txt: '在此处输入要咨询的问题，点击发送按钮',
    image: '在此输入图像关键字，点击发送按钮'
})
// 模型
const MODEL = Object.freeze({
    default: 'gpt-3.5-turbo'
})
// 图片大小
const IMAGE = Object.freeze({
    small: '256x256',
    middle: '512x512',
    big: '1024x1024'
})

// 按钮发送
$("#chatBtn").click(function () {
    send();
});
// 回车发送
$(document).keypress(function(event) {
    if (event.which === 13) {
        event.preventDefault();
        send();
    }
});
// 按钮清理
$('#clearBtn').click(function () {
    $('#content-ul').empty();
});
// 更改模式
$('#changeBtn').click(function () {
    var value = $(this).text()
    if (value === CHAT.image) {
        $(this).css('background-color', '#f0ad4e').text(CHAT.txt);
        $('#btn-input').attr('placeholder', INPUT.txt);
    } else {
        $(this).css('background-color', 'red').text(CHAT.image);
        $('#btn-input').attr('placeholder', INPUT.image);
    }
});

// 显示图片模态框
function showimageModal(src) {
    var imageModal = $('#imageModal');
    imageModal.find('.modal-body img').attr('src', src);
    imageModal.modal('show');
}

// 显示告警模态框, title为模态框标题，message为模态框内容
function showAlertModal(title, message) {
    var alertModal = $('#alertModal');
    alertModal.find('.modal-title').text(title);
    alertModal.find('.modal-body p').text(message);
    alertModal.modal('show');
}


function isEmpty(value) {
    return value == null || value === '' || value === 0;
}
function isNotEmpty(value) {
    return value == null && value === '' && value === 0;
}
// 图片点击
function imageClick(img) {
    //获取图片的src
    var src = $(img).attr('src');
    showimageModal(src);
}
//下载图片
$('#imagedownload').click(function () {
    var src = $('#create-image').attr('src');
    console.log("下载图片"+ src);
});


function send(){
    if(isEmpty(token)){
        showAlertModal('输入框校验', '未加载token功能不可用');
        return;
    }
    var question = $('#btn-input').val().trim();
    if (question) {
        var q_li = '<li style="display: flex;">' +
            '<img class="img-responsive" src="images/git50.jpg" alt="Avatar" style="width: 50px; height: 50px;">' +
            '<p class="text-left" style="margin-left: 10px; font-size: 16px;">' + question + '</p></li>';
        $('#content-ul').append(q_li);
        var value = $('#changeBtn').text();
        if(value === CHAT.image){
            imagesRequest(question);
        }else{
            textRequest(question);
        }
        $('#btn-input').val(''); // 清空输入框
    } else {
        showAlertModal('输入框校验', '请检查输入是否正确');
    }
}

function imagesRequest(question) {
    $.ajax({
        url: api_address + "/v1/images/generations",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify({
            "prompt": question,
            "n": 1,
            "size": IMAGE.big
        }),
        success: function(response) {
            console.log(response);
            appendImage(response);
            scrollHeight();
        },
        error: function(error) {
            console.log(error);
            var er = '<li style="display: flex;">' +
                '<img class="img-responsive" src="images/ai.png" alt="Avatar" style="width: 50px; height: 50px;">' +
                '<p class="text-left py-5" style="margin-left: 10px; font-size: 16px;">' + error + '</p></li>';
            $('#content-ul').append(er);        }
    });
}


function textRequest(question) {
    $.ajax({
        url: api_address + "/v1/chat/completions",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify({
            "model": MODEL.default,
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ]
        }),
        success: function(response) {
            console.log(response);
            appendText(response);
            scrollHeight();
        },
        error: function(error) {
            console.log(error);
            var er = '<li style="display: flex;">' +
                '<img class="img-responsive" src="images/ai50.png" alt="Avatar" style="width: 50px; height: 50px;">' +
                '<p class="text-left py-5" style="margin-left: 10px; font-size: 16px;">' + error + '</p></li>';
            $('#content-ul').append(er);
        }
    });
}

function appendImage(response){
    var imageSrc = response.data.data[0].url;
    var a_li = '<li style="display: flex;">' +
        '<img class="img-responsive" src="images/ai50.png" alt="Avatar" style="width: 50px; height: 50px;">' +
        '<img class="img-responsive thumbnail" onclick="imageClick(this)" src="'+ imageSrc +'"alt="Avatar" style="width: 255px; height: 255px;"></li>';
    $('#content-ul').append(a_li);
}

function appendText(response){
    var content = response.data.choices[0].message.content;
    var answers = marked.parse(content);
    var a_li = '<li style="display: flex;">' +
        '<img class="img-responsive" src="images/ai50.png" alt="Avatar" style="width: 50px; height: 50px;">' +
        '<code id="markdown">' + answers + '</code></li>';
    $('#content-ul').append(a_li);
}

function scrollHeight(){
    var $ul = $('#content-ul'); // 通过id获取ul
    $ul.scrollTop($ul[0].scrollHeight); // 让滚动条自动下拉到最底部
}







