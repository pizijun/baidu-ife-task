function MyCarousel(ban_id, pos_id) {
    this.banners = $(ban_id);
    this.focus = $(pos_id);
    this.bsLength = this.banners.length;
    this.marginleft = -960;
    this.speed = 40;
    this.end = this.marginleft * 3;
    this.init();
    this.interval = 20;
}

MyCarousel.prototype = {
    init: function() {
        var me = this;
        $.click(this.focus, function(e) {
            e = e || window.event;
            var target = e.srcElement ? e.srcElement : e.target;
            var previousIndex = $(".selected").dataset.index;

            if ($(".selected")) { //切换焦点样式
                $(".selected").className = "";
            }
            if (target.tagName === "A") {
                target.className = "selected";
            }
            var targetIndex = target.dataset.index;
            me.Play(targetIndex, previousIndex);

        });
    },
    Play: function(targetIndex, previousIndex) {
        var previousElement = this.banners.children[previousIndex];
        var targetElement = this.banners.children[targetIndex];
        var pcomputedStyle = window.getComputedStyle(previousElement);
        var pmarginLeft = pcomputedStyle.marginLeft;
        previousElement.style.marginLeft = pmarginLeft;
        var tempMarginLeft = parseInt(previousElement.style.marginLeft);

        var me = this;
        function run() {
            setTimeout(function() {
                if(tempMarginLeft > me.end) {
                	previousElement.style.marginLeft = tempMarginLeft - me.speed + "px";
                }else if(tempMarginLeft < me.end){
                	previousElement.style.zIndex = "-1";
                	previousElement.style.marginLeft = me.marginleft + "px";
                }

            }, this.interval);
        }
        run();

    }
}
var mycarousel = new MyCarousel("#banners", "#pos");
