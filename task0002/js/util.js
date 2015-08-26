// 2.1 任务描述
// 创建一个JavaScript文件，比如util.js,实践判断各种数据类型的方法，并在util.js中实现以下方法

// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    if (Array.isArray) {
        return Array.isArray(arr);
    } else {
        return Object.prototype.toString.call(arr) === "[object Array]";
    }
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    // return Object.prototype.toString.call(fn) === "[object Function]";
    return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != Array && fn.constructor != RegExp && /function/i.test(fn + '');
    // fn + '' 会返回函数的字符串'function functionName(){...}'
}



// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(abObj.a);
console.log(abObj.b.b1[0]);

console.log(tarObj.a); // 1
console.log(tarObj.b.b1[0]); // "hello"

function cloneObject(src) {
    if (!src) {
        return;
    }
    if(isFunction(src) || src instanceof RegExp){
    	return;
    }
    // 处理数组
    if (isArray(src)) {
        console.log(src);
        var des = [];
        for (var i = 0, len = src.length; i < len; i++) {
            des.push(src[i]);
            return des;
        }
    }
    //处理基本类型
    if(typeof src === "string" || typeof src === "number" || typeof src === "boolean"){
    	return src;
    }

    //处理日期
    if(src instanceof Date){
    	var des = new Date(src);
    	return des;
    }

    //处理object对象
    if (typeof src === "object") {
        var des = {};
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                if (typeof src[prop] === 'object') {
                    if (isArray(src[prop])) {
                        des[prop] = cloneObject(src[prop])
                    }
                    des[prop] = cloneObject(src[prop]);
                }
                des[prop] = src[prop];
            }
        }
        return des;
    }
}
