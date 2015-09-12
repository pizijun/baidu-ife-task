function MyCarousel(ban_id, pos_id) {
    this.banners = $(ban_id);
    this.focus = $(pos_id);
    this.bannersList = null;//三个banner的集合
    this.focusList = null;//三个焦点的集合
    this.bsLength = null;//banners集合的长度
    this.nowIndex = 0;//默认显示的当前元素的索引
    this.marginleft = -960;
    this.speed = 40;//速度
    this.end = this.marginleft * 3;//终点
    this.init();
    this.interval = 15;//时间间隔
}

MyCarousel.prototype = {
    init: function() {//初始化
        var me = this;
        this.bannersList = this.banners.children;
        this.focusList = this.focus.children;
        this.bsLength = this.bannersList.length;
        this.AutoPlay();
        $.click(this.focus, function(e) {//为焦点绑定事件处理程序
            e = e || window.event;
            var target = e.srcElement ? e.srcElement : e.target;
            var targetIndex = target.dataset.index;
            me.Play(targetIndex);
        });
    },
    Play: function(targetIndex) {//原理：通过改变当前元素的marginLeft来显示targetIndex元素
        var me = this;

        //取得对nowIndex元素和targetIndex元素的引用
        var nowIndex = $(".selected").dataset.index;
        this.nowIndex = nowIndex;
        if(nowIndex == targetIndex){
            return;
        }
        var nowElement = this.bannersList[nowIndex];
        var targetElement = this.bannersList[targetIndex];

        this.SetElementStyle(targetIndex);//改变除当前元素外的其他元素的叠加顺序

        //改变焦点的样式
        $(".selected").className = "";
        this.focusList[targetIndex].children[0].className = "selected";


        nowElement.style.marginLeft = this.marginleft + "px";
        var nMarginLeft;

        function run() {
            nMarginLeft = parseInt(nowElement.style.marginLeft);
            if (nMarginLeft <= me.marginleft && nMarginLeft > me.end) {//改变marginLeft的值
                nowElement.style.marginLeft = nMarginLeft - me.speed + "px";
                setTimeout(run,me.interval);
            } else if (nMarginLeft <= me.end) {//改变当前元素消失后元素的状态
                targetElement.style.zIndex = "4";
                nowElement.style.zIndex = "1";
                nowElement.style.marginLeft = me.marginleft + "px";
                me.nowIndex = targetIndex;//当目标元素达到效果后，实际上当前元素的索引与目标元素相同
            }

        }
        run();
    },
    AutoPlay:function(){
        var me = this;
        setInterval(function(){
            var targetIndex = me.FindNextIndex();
            me.Play(targetIndex);
        },3000)
    },
    FindNextIndex:function(){
        return this.nowIndex < this.bsLength -1 ? parseInt(this.nowIndex) + 1 : 0;
    },
    SetElementStyle:function(targetIndex){
        var targetElement = this.bannersList[targetIndex];
        var anotherIndex = this.bsLength - targetIndex - this.nowIndex;
        var anohterElement = this.bannersList[anotherIndex];
        targetElement.style.zIndex = "2";
        anohterElement.style.zIndex = "1";

    }
}
var mycarousel = new MyCarousel("#banners", "#pos");
