import '../../assets/style/reset.css'
import '../../assets/iconfont/iconfont.css'
import './home.scss'

$(function () {
    $('.box1').css({
        'width': '100%',
        'height': '60px',
        'backgroundColor': 'yellow'
    })
    $('.box1').click(function () {
        $(this).css({
            'background': 'red'
        })
        $.get('/api/list/categoryList', {}, function (data) {
            console.log(data);
        })
    })
})
class Pison {
    static info = 'aa'
}
console.log(Pison.info);
function yb() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            let num = Math.floor(Math.random() * 10 + 1)
            if (num > 5) {
                resolve('大于五：' + num)
            } else {
                reject('小于五：' + num)
            }
        }, 1000);
    });
}
console.log('hone页');
yb().then((val) => {
        console.log(val);
    })
    .catch((val) => {
        console.log(val);
    })