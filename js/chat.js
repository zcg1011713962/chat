var api_address;
var token;

// 显示告警模态框, title为模态框标题，message为模态框内容
var alertModal = $('#alertModal');
function showAlertModal(title, message) {
    alertModal.find('.modal-title').text(title);
    alertModal.find('.modal-body p').text(message);
    alertModal.modal('show');
}
// 回车发送
$(document).keypress(function(event) {
    if (event.which === 13) {
        event.preventDefault();
        send();
    }
});
// 按钮发送
$("#chatBtn").click(function () {
    send();
});
// 按钮清理
$('#clearBtn').click(function () {
    $('#content-ul').empty();
});
// 更改模式
$('#changeBtn').click(function () {
    var value = $(this).text()
    if (value === "问题咨询模式") {
        $(this).css('background-color', 'red').text('图像生成模式');
    } else {
        $(this).css('background-color', '#f0ad4e').text('问题咨询模式');
    }
});

function isEmpty(value) {
    return value == null || value === '' || value === 0;
}
function isNotEmpty(value) {
    return value == null && value === '' && value === 0;
}

function send(){
    if(isEmpty(token)){
        showAlertModal('输入框校验', '未加载token功能不可用');
        return;
    }
    var question = $('#btn-input').val().trim();
    if (question) {
        var q_li = '<li style="display: flex;">' +
            '<img class="img-responsive" src="images/git.jpg" alt="Avatar" style="width: 50px; height: 50px;">' +
            '<p class="text-left" style="margin-left: 10px; font-size: 16px;">' + question + '</p></li>';
        $('#content-ul').append(q_li);
        var value = $('#changeBtn').text();
        if(value === "图像生成模式"){
            imagesRequest(question);
        }else{
            textRequest(question);
        }
        $('#btn-input').val('');
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
            "size": "1024x1024"
        }),
        success: function(response) {
            var imageSrc = response.data[0].url;
            console.log(imageSrc);
            var a_li = '<li style="display: flex;">' +
                '<img class="img-responsive" src="images/ai.png" alt="Avatar" style="width: 50px; height: 50px;">' +
                '<img class="img-responsive" src="'+ imageSrc +'"alt="Avatar"></li>';
            $('#content-ul').append(a_li);
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
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ]
        }),
        success: function(response) {
            var content = response.choices[0].message.content;
            var answers = marked.parse(content);
            console.log(answers);
            var a_li = '<li style="display: flex;">' +
                '<img class="img-responsive" src="images/ai.png" alt="Avatar" style="width: 50px; height: 50px;">' +
                '<code id="markdown">' + answers + '</code></li>';
            $('#content-ul').append(a_li);
        },
        error: function(error) {
            console.log(error);
            var er = '<li style="display: flex;">' +
                '<img class="img-responsive" src="images/ai.png" alt="Avatar" style="width: 50px; height: 50px;">' +
                '<p class="text-left py-5" style="margin-left: 10px; font-size: 16px;">' + error + '</p></li>';
            $('#content-ul').append(er);
        }
    });
}



