$.click($("#submit"), showHobby);
$.click($("#reset"),reset);

function showHobby() {
    var text = trim($("#hobby").value);
    var hobbyArr = uniqArray(text.split(/[\s，,；;、]/));
    if (!text) {
        $("#error").innerHTML = "请输入正确的兴趣爱好";
        return;
    } else {
    	$("#error").innerHTML = "";
    	if($(".result")){
    		$(".wrap").removeChild($(".result"));
    	}
        var len = hobbyArr.length;
        if (len > 10) {
            $("#error").innerHTML = "输入的兴趣爱好不能超过10个";
            return;
        }
        var result = document.createElement("div");
        result.className = "result";
        var p = document.createElement("p");
        p.appendChild(document.createTextNode("你的爱好："));
        result.appendChild(p);
        for (var i = 0; i < len; i++) {
            var input = document.createElement("input");
            input.type = "checkbox";
            result.appendChild(input);
            var label = document.createElement("label");
            label.appendChild(document.createTextNode(hobbyArr[i]));
            result.appendChild(label);
        }
        $(".wrap").appendChild(result);
    }
}

function reset(){
	$("#error").innerHTML = "";
	if($(".result")){
		$(".result").innerHTML = "";
	}
	$("#hobby").value = "";
}