// 2.1 任务描述
// 创建一个JavaScript文件，比如util.js,实践判断各种数据类型的方法，并在util.js中实现以下方法

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr){
	if(Array.isArray){
		return Array.isArray(arr);
	}else{
		return Object.prototype.toString.call(arr) === "[object Array]";
	}
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn){
	return Object.prototype.toString.call(fn) === "[object Function]";
}