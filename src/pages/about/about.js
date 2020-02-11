import '../../assets/style/reset.css'
import '../../assets/iconfont/iconfont.css'
import './about.scss'
// import {nav} from '../../config/data'

$(function () {
    $('.box2').css({
        'width': '100%',
        'height': '60px',
        'backgroundColor': 'pink'
    })
    $('.box2').click(function () {
        $(this).css({
            'background': 'skyblue'
        })
    })
})