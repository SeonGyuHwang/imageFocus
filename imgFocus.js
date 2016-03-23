(function($){
    'use strict';

    var pulipZoom = {
        _ : {}
        ,options : {}
        ,isShow: false
        ,callback : false
        ,callbackRun : false
        ,setImg : function(options, callback) {
            this.options = options || this.options;
            
            if( $.isFunction(callback) )
                this.callback = callback;
                
            this._.img = document.createElement('img');
            $(this._.img)
                .addClass('targetImg')
                .prop('src', $(this.options.img).prop('src'))
                .css({
                    top: 0
                    , left: 0
                    , opacity: 0
                    , border: 'none'
                    , maxWidth: 'none'
                    , maxHeight: 'none'
                    , position: 'absolute'
                });

            $(this.options.img).css({
                '-webkit-transform' : 'scale(1)'
                ,'-moz-transform'    : 'scale(1)'
                ,'-ms-transform'     : 'scale(1)'
                ,'-o-transform'      : 'scale(1)'
                ,'transform'         : 'scale(1)'
            }).after(this._.img);

            $( this.options.img ).css({
                'width': this.options.imgWidth+'px'
                ,'height': 'auto'
            }).load(function() {
                $(pulipZoom.options.container).css({
                    'width': $(pulipZoom.options.img).width() + 'px'
                    ,'height': $(pulipZoom.options.img).height() + 'px'
                });
            });

            this._.targetWidth = parseInt(this._.img.clientWidth);
            this._.targetHeight = parseInt(this._.img.clientHeight);

            $(this._.img).css({
                'width': this._.targetWidth
                , 'height': this._.targetHeight
                , 'opacity': 1
                , 'display': 'none'
            });

            if( this.options.target ) {
                $(this.options.target).each(function () {
                    if (!$(this).data('pos')) {
                        $(this).data('pos',
                            {
                                'top': parseInt($(this).css('top')),
                                'left': parseInt($(this).css('left')),
                                'width': parseInt($(this).width()),
                                'height': parseInt($(this).height())
                            }
                        );
                    }
                });
            }
            
        },
        setFocus : function () {
            
            this._.sourceWidth = $(this.options.img).outerWidth();
            this._.sourceHeight = $(this.options.img).outerHeight();

            this._.xRatio = (this._.targetWidth - this._.sourceWidth) / this._.sourceWidth;
            this._.yRatio = (this._.targetHeight - this._.sourceHeight) / this._.sourceHeight;

            this._.offset = $(this.options.img).offset();

            this._.mtop = (($(this._.e.currentTarget).data('pos').top+($(this._.e.currentTarget).data('pos').height)) - this._.offset.top);
            this._.mleft = ($(this._.e.currentTarget).data('pos').left - this._.offset.left);

            this._.mtop = Math.max(Math.min(this._.mtop, this._.sourceHeight), 0);
            this._.mleft = Math.max(Math.min(this._.mleft, this._.sourceWidth), 0);

            this._.targetTop = (this._.mtop * -parseFloat(this._.yRatio)) + 'px';
            this._.targetLeft = (this._.mleft * -parseFloat(this._.xRatio)) + 'px';

            $(this.options.img).css({
                'opacity': 1
                ,'-webkit-transform' : 'scale(1)'
                ,'-moz-transform'    : 'scale(1)'
                ,'-ms-transform'     : 'scale(1)'
                ,'-o-transform'      : 'scale(1)'
                ,'transform'         : 'scale(1)'
                ,"-webkit-transform-origin": "0px 0px"
                ,"-moz-transform-origin": "0px 0px"
                ,"-ms-transform-origin": "0px 0px"
                ,"-o-transform-origin": "0px 0px"
                ,"transform-origin": "0px 0px"
            }).animate({ transform: 1.5 }, {
                step: function(now) {
                    now += 1*1;

                    if( pulipZoom.isShow ) {
                        if (now >= 1.6) {
                            $(pulipZoom._.img).css({
                                'top': pulipZoom._.targetTop
                                , 'left': pulipZoom._.targetLeft
                            }).show();

                            if( !pulipZoom.callbackRun && $.isFunction(pulipZoom.callback) ) {
                                pulipZoom.callbackRun = true;
                                pulipZoom.callback.call(pulipZoom);
                            }

                            return false;
                        } else {
                            var cY = $(pulipZoom._.e.currentTarget).data('pos').top;
                            var cX = $(pulipZoom._.e.currentTarget).data('pos').left;

                            $(this).css({
                                '-webkit-transform': 'scale(' + now + ')'
                                , '-moz-transform': 'scale(' + now + ')'
                                , '-ms-transform': 'scale(' + now + ')'
                                , '-o-transform': 'scale(' + now + ')'
                                , 'transform': 'scale(' + now + ')'
                                , "-webkit-transform-origin": cX + "px " + cY + "px"
                                , "-moz-transform-origin": cX + "px " + cY + "px"
                                , "-ms-transform-origin": cX + "px " + cY + "px"
                                , "-o-transform-origin": cX + "px " + cY + "px"
                                , "transform-origin": cX + "px " + cY + "px"
                            });
                        }
                    } else {
                        pulipZoom.hide();
                    }
                },
                complete: function(){
                    
                    if( !pulipZoom.isShow ) 
                        pulipZoom.hide();

                },
                duration: 850
            }, 'linear');

        },
        setTargetInfo : function () {
            var focusWidth = parseInt($(this.options.container).width());
            var focusHeight = parseInt($(this.options.container).height());
            var info = $(this._.e.currentTarget).show().find(this.options.targetInfo);

            this._.infoTop = -75;
            this._.infoLeft = 40;

            if (($(this._.e.currentTarget).data('pos').top + parseInt(info.height())) >= focusHeight) {
                this._.infoTop -= (($(this._.e.currentTarget).data('pos').top + parseInt(info.height())) - focusHeight) / 2;
            } else if (($(this._.e.currentTarget).data('pos').top - parseInt(info.height())) <= 0) {
                this._.infoTop -= ($(this._.e.currentTarget).data('pos').top - parseInt(info.height())) / 2;
            }

            if (($(this._.e.currentTarget).data('pos').left + parseInt(info.width())) >= focusWidth)
                this._.infoLeft = -145;

            info.css({
                'top': this._.infoTop + 'px'
                , 'left': this._.infoLeft + 'px'
            }).show();
            
        },
        show: function(e){
            this._.e = e;
            this.isShow = true;
            $(this.options.target).hide();
            
            this.setFocus();
            this.setTargetInfo();
        },
        hide: function(){
            this.isShow = false;
            this.callbackRun = false;
            $(this.options.img).css({
                '-webkit-transform': 'scale(1)'
                , '-moz-transform': 'scale(1)'
                , '-ms-transform': 'scale(1)'
                , '-o-transform': 'scale(1)'
                , 'transform': 'scale(1)'
                ,"-webkit-transform-origin": "0px 0px"
                ,"-moz-transform-origin": "0px 0px"
                ,"-ms-transform-origin": "0px 0px"
                ,"-o-transform-origin": "0px 0px"
                ,"transform-origin": "0px 0px"
            });
            $(this.options.target).show();
            $(this.options.targetInfo).hide();
            $(this._.img).hide();
        }
    };

    
    $(function(){

        // pulipZoom( args /* {} */, callback);
        
        pulipZoom.setImg({
            'img': '.focusImg'
            ,'imgWidth': 1024
            ,'target': '.targets'
            ,'targetInfo': '.targetInfo'
            ,'container': '.focusImgDiv'
        }, function(){
            /**
             * 줌 완료 후 실행되는 함수
             * 해당 매게변수는 아래 함수 처럼 비어있어도 됨.
             */
            try { console.info('zoom complete function'); } catch (e) {}
        });

        /*pulipZoom.setImg({
            'img': '.focusImg'
            ,'imgWidth': 1024
            ,'target': '.targets'
            ,'targetInfo': '.targetInfo'
            ,'container': '.focusImgDiv'
        });*/
        
        $(this).on('click', '.targets', function(e){

            if( !pulipZoom.isShow ) 
                pulipZoom.show(e);
            else 
                pulipZoom.hide();
            

        });

    });
})( jQuery );