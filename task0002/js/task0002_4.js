var input = $("#input");
$.on(input,"input",hint);
$.on(input,"keydown",enterSelect);
var index = 0;
function hint(){
	var inputValue = input.value;
	var url = "task0002_4_hint.php";
	options = {
		type: "post",
		data: {
			query: inputValue
		},
		onsuccess:function(res,xhr){
			var wrap = $(".wrap");
			if(!res){
				return;
			}
			var resArr = res.split(",");
			if($("#hint")){
				wrap.removeChild($("#hint"));
			}
			var hintElement = document.createElement("ul");
			hintElement.className = "hint";	
			hintElement.id = "hint";
			var queryLi = document.createElement("li");//用来存储查询字符
			queryLi.appendChild(document.createTextNode(inputValue));
			queryLi.id = "querytext";
			queryLi.style.display = "none";
			hintElement.appendChild(queryLi);
			each(resArr,function(item){
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(item));
				hintElement.appendChild(li);
			});
			wrap.appendChild(hintElement);
			$.click(hintElement,select);
		},
		onfail:function(){
			alert("error");
		}
	}
	ajax(url,options);
}

function select(e){
	e = e || window.event;
	var target = e.srcElement ? e.srcElement : e.target;
	var targetValue = target.textContent;
	input.value = targetValue;
	this.style.display = "none";
}

function enterSelect(e){
	e = e || window.event;
	var hintElement = $("#hint");
	var len = hintElement.children.length;
	if(e.keyCode == 40){
		index++;
		if($(".selected")){
			$(".selected").className = "";
		}
		if(index >= len){
			input.focus();
			index = 0;
		}
		hintElement.children[index].className = "selected";
		input.value = hintElement.children[index].textContent;
	}else if(e.keyCode == 38){
		
		if(index <= 0){
			index = len;
		}
		if($(".selected")){
			$(".selected").className = "";
		}
		index--;
		if(index >= len){
			input.focus();
			index = 0;
		}
		hintElement.children[index].className = "selected";
		input.value = hintElement.children[index].textContent;
	}else if(e.keyCode == 13){
		input.value = hintElement.children[index].textContent;
		hintElement.style.display = "none";
	}
}