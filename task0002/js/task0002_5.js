var ulOne = $("#listone");
var ulTwo = $("#listtwo");
var listOne = ulOne.children;
var listTwo = ulTwo.children;
each(listOne,function(item){
	$.on(item, "dragstart",drag);
});
each(listTwo,function(item){
	$.on(item, "dragstart",drag);
});

$.on(ulTwo,"dragover",allowDrop);
$.on(ulOne,"dragover",allowDrop);
$.on(ulOne,"drop",drop);
$.on(ulTwo,"drop",drop);
function drag(e){//开始拖拽,设置数据
	e = e || window.event;
	e.dataTransfer.setData("text",e.target.id);
}
function allowDrop(e){//防止默认事件，允许放置被拖拽的元素
	e.preventDefault();
}
function drop(e){//放置
	e = e || window.event;
	e.preventDefault();
	var target = e.srcElement ? e.srcElement : e.target;
	var data = e.dataTransfer.getData("text");
	var newElet = $("#"+data);
	if(target.tagName === "UL"){
		target.appendChild(newElet);
	}else if(target.tagName === "LI"){
		var ulElement = target.parentNode;
		ulElement.insertBefore(newElet,target);
	}
}