$.click($("#submit"), countDown);
$.click($("#reset"),reset);
function countDown() {
    var inputDate = trim($("#date").value);
    var dateArr = inputDate.split("-");
    var perDay = 24 * 60 * 60 * 1000;
    var perHour = 60 * 60 * 1000;
    var perMinute = 60 * 1000;
    if (dateArr.length === 3) {
    	$("#error").innerHTML = "";
    	if($(".result")){
    		$(".wrap").removeChild($(".result"));
    	}
        var start = new Date();
        var YEAR = dateArr[0];
        var MONTH = dateArr[1];
        var DAY = dateArr[2];
        var stop = new Date(parseInt(YEAR), parseInt(MONTH) - 1, parseInt(DAY), 0, 0, 0);
        var duration = stop - start;
        if(duration <= 0){
        	$("请输入一个将来的时间");
        	return;
        }
        var remainingDay = Math.floor(duration / perDay);
        var remainingHour = Math.floor((duration - remainingDay * perDay) / perHour);
        var remainingMinute = Math.floor((duration - remainingDay * perDay - remainingHour * perHour) / perMinute);
        var remainingSecond = Math.floor((duration - remainingDay * perDay -
            remainingHour * perHour - remainingMinute * perMinute)/1000);
        var result = document.createElement("div");
        result.className = "result";
        result.innerHTML = "倒计时：距离" + YEAR + "年" + MONTH + "月" + DAY + "日还有" + remainingDay + "天" 
        + remainingHour + "小时" + remainingMinute + "分" + remainingSecond + "秒";
        $(".wrap").appendChild(result);
        t = setTimeout(countDown,1000);
    } else {
        $("#error").innerHTML = "请输入正确格式的日期";
        return;
    }
}
function reset(e){
	clearTimeout(t);
	if($(".result")){
		$(".wrap").removeChild($(".result"));
	}
	$("#error").innerHTML = "";
	$("#date").value = "";
}