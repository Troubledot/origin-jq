import { upEarth } from './3d.js';
const controller = new ScrollMagic.Controller();

const startpin = new ScrollMagic.Scene({
    duration: 1800
})
    .setPin('section#start')
    .setTween(
        TweenMax.to('#start .bg', 1, {
            opacity: 0
        })
    )
    .on('progress', e => {
        console.log(e.progress);
        const { progress } = e;
        upEarth(-17.5 - 3.5 * progress, 5 * progress);
    })
    .addTo(controller);

new ScrollMagic.Scene({
    offset: 40,
    duration: 500
})
    .on('progress', e => {
        const { progress } = e;
        $('#start h1 span').css({
            opacity: 1 - progress
        });
        $('#start h1 span:nth-child(1)')[0].style.setProperty('filter', `blur(${progress * 6}px)`);
        $('#start h1 span:nth-child(2)')[0].style.setProperty('filter', `blur(${progress * 15}px)`);
        $('#start h1 span:nth-child(3)')[0].style.setProperty('filter', `blur(${progress * 6}px)`);
        $('#start h1 span:nth-child(4)')[0].style.setProperty('filter', `blur(${progress * 15}px)`);
        $('#start h1 span:nth-child(5)')[0].style.setProperty('filter', `blur(${progress * 6}px)`);
        $('#start h1 span:nth-child(6)')[0].style.setProperty('filter', `blur(${progress * 15}px)`);
    })
    .addTo(controller);
