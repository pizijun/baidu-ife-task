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
/*var srcObj = {
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
console.log(tarObj.b.b1[0]); // "hello"*/
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


// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
// 使用示例
/*var a = [1, 3, 5, 7, 5, 3];
var b = uniqArray(a);
console.log(b); // [1, 3, 5, 7]*/
function uniqArray(arr){
    var result = [];
    for(var i=0,len=arr.length;i<len;i++){
        if(arr[i] !== "" && result.indexOf(arr[i]) === -1){
            result.push(arr[i]);
        }
    }
    return result;
}



// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符,假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，
// 并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str){
    for(var i=0,len=str.length;i<len;i++){
        if(str[i] != " " && str[i] != "\t"){
            str = str.slice(i);
            break;
        }
    }
    for(var i=str.length - 1;i>0;i--){
        if(str[i] != "\t" && str[i] != " "){
            str = str.slice(0,i+1);
            break;
        }
    }
    return str;
}



// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目

// 使用示例
/*var str = '   hi!  ';
str = trim(str);
console.log(str); // 'hi!'*/
function trim(str){
    return str.replace(/^\s+/,"").replace(/(\s+)$/,"");
}


// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
// 其中fn函数可以接受两个参数：item和index
// 使用示例
/*var arr = ['java', 'c', 'php', 'html'];
function output(item) {
    console.log(item)
}
each(arr, output);  // java, c, php, html

// 使用示例
var arr = ['java', 'c', 'php', 'html'];
function output(item, index) {
    console.log(index + ': ' + item)
}
each(arr, output);  // 0:java, 1:c, 2:php, 3:html*/

function each(arr,fn){
    for(var i=0,len=arr.length;i<len;i++){
        fn(arr[i],i);
    }
}



// 获取一个对象里面第一层元素的数量，返回一个整数
// 使用示例
/*var obj = {
    a: 1,
    b: 2,
    c: {
        c1: 3,
        c2: 4
    }
};
console.log(getObjectLength(obj)); // 3*/
function getObjectLength(obj){
    var count = 0;
    for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
            console.log(obj.hasOwnProperty(prop));
            count++;
        }
    }
    return count;
}



// 判断是否为邮箱地址
function isEmail(emailStr){
    var pattern = /^([a-z0-9]+(\w|\.|\-)*){6,32}@([a-z0-9]+-?[a-z0-9]+){1,3}\.([a-z]{2,4}$)/i;
    return pattern.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone){
    var pattern = /^1(3|4|5|7|8)[0-9]{9}$/;
    return pattern.test(phone);
}





// 3.1 任务描述
// 先来一些简单的，在你的util.js中完成以下任务：

function hasClass(element,classname){
    var classStr = trim(element.className);
    var classArr = uniqArray(classStr.split(" "));
    for(var i=0,len=classArr.length;i<len;i++){
        if(classArr.indexOf(classname) != -1){
            return true;
        }
    }
    return false;
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element,newClassName){
    if(!hasClass(element,newClassName)){
        element.className += " " + newClassName;
    }
}


// 移除element中的样式oldClassName
function removeClass(element,oldClassName){
    if(hasClass(element,oldClassName)){
        element.className = element.className.replace(oldClassName,"");
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element,siblingNode){
    if(element.parentNode === siblingNode.parentNode){
        return true;
    }
    return false;
}


// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element){
    var x=0,y=0;
    var box = element.getBoundingClientRect();
    return {x:box.left,y:box.top};
}