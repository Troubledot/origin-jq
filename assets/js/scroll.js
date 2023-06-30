import { upEarth, initSolar, toggleSolar } from './3d.js';
const controller = new ScrollMagic.Controller();
const hide = new TimelineMax().add([
    TweenMax.to('#start .bg', 1, {
        opacity: 0
    })
]);
const startpin = new ScrollMagic.Scene({
    duration: 3000
})
    .setPin('section#start')
    .addTo(controller);

new ScrollMagic.Scene({
    offset: 50,
    duration: 950
})
    .setTween(hide)
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
        upEarth(-17.5 - 3.5 * progress, 5 * progress);
    })
    .on('end', e => {
        console.log('end');
        console.log(e);
        initSolar();
    })
    .addTo(controller);
new ScrollMagic.Scene({
    offset: 1100,
    duration: 1200
})
    .on('progress', e => {
        console.log(e.progress);
        const { progress } = e;
        toggleSolar(progress);
    })
    .addTo(controller);
