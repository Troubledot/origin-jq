import { upEarth, enterSolar, toggleSolar, showSolar, showEarth, hideSolar } from './3d.js';
const controller = new ScrollMagic.Controller();
const hide = new TimelineMax().add([
    TweenMax.to('#start .bg', 1, {
        opacity: 0
    })
]);
new ScrollMagic.Scene({
    offset: -10
})
    .on('start', () => {
        showEarth();
    })
    .addTo(controller);

const startpin = new ScrollMagic.Scene({
    duration: 3000
})
    .setPin('section#start')
    .addTo(controller);

new ScrollMagic.Scene({
    offset: 50,
    duration: 1450
})
    .setTween(hide)
    .on('start', () => {
        showEarth();
    })
    .on('progress', e => {
        const { progress } = e;
        upEarth(-17.5 - 3.5 * progress, 5 * progress);
    })
    .on('end', e => {
        console.log('end');
        console.log(e);
        showSolar();
    })
    .addTo(controller);

new ScrollMagic.Scene({
    offset: 0,
    duration: 500
})
    .on('progress', e => {
        const { progress } = e;
        $('#start .title img').css({
            opacity: 1 - progress
        });
        $('#start .title img')[0].style.setProperty('filter', `blur(${progress * 6}px)`);
    })
    .addTo(controller);
new ScrollMagic.Scene({
    offset: 500,
    duration: 500
})
    .on('progress', e => {
        const { progress } = e;
        $('#start .title.build').css({
            opacity: progress
        });
    })
    .addTo(controller);
new ScrollMagic.Scene({
    offset: 500,
    duration: 1000
})
    .on('progress', e => {
        const { progress } = e;
        $('#start .ani-dot').css({
            opacity: 1 - progress
        });
    })
    .addTo(controller);

new ScrollMagic.Scene({
    offset: 1000,
    duration: 500
})
    .on('progress', e => {
        const { progress } = e;
        $('#start .title.build').css({
            opacity: 1 - progress
        });
    })
    .addTo(controller);

new ScrollMagic.Scene({
    offset: 1500,
    duration: 800
})
    .on('progress', e => {
        console.log(e.progress);
        const { progress } = e;
        toggleSolar(progress);
    })
    .addTo(controller);
new ScrollMagic.Scene({
    offset: 2300,
    duration: 700
})
    .on('progress', e => {
        const { progress } = e;
        toggleSolar(1 - progress);
        enterSolar(0.2 + 0.7 * progress, 1 + 10 * progress);
        $('#start .first').css('opacity', progress);
    })
    .addTo(controller);
