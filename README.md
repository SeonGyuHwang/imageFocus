# imageFocus

imgFocus( args /* {} */, callback);

Ex1)

imgFocus.setImg({
    'img': '.focusImg'
    ,'imgWidth': 1024
    ,'target': '.targets'
    ,'targetInfo': '.targetInfo'
    ,'container': '.focusImgDiv'
});


Ex2)

imgFocus.setImg({
    'img': '.focusImg'
    ,'imgWidth': 1024
    ,'target': '.targets'
    ,'targetInfo': '.targetInfo'
    ,'container': '.focusImgDiv'
}, function(){
    try { console.info('zoom complete function'); } catch (e) {}
});