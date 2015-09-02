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
    if (isFunction(src) || src instanceof RegExp) {
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
    if (typeof src === "string" || typeof src === "number" || typeof src === "boolean") {
        return src;
    }

    //处理日期
    if (src instanceof Date) {
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
function uniqArray(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] !== "" && result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
    }
    return result;
}



// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符,假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，
// 并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    for (var i = 0, len = str.length; i < len; i++) {
        if (str[i] != " " && str[i] != "\t") {
            str = str.slice(i);
            break;
        }
    }
    for (var i = str.length - 1; i > 0; i--) {
        if (str[i] != "\t" && str[i] != " ") {
            str = str.slice(0, i + 1);
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
function trim(str) {
    return str.replace(/^\s+/, "").replace(/(\s+)$/, "");
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

function each(arr, fn) {
    for (var i = 0, len = arr.length; i < len; i++) {
        fn(arr[i], i);
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
function getObjectLength(obj) {
    var count = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            console.log(obj.hasOwnProperty(prop));
            count++;
        }
    }
    return count;
}



// 判断是否为邮箱地址
function isEmail(emailStr) {
    var pattern = /^([a-z0-9]+(\w|\.|\-)*){6,32}@([a-z0-9]+-?[a-z0-9]+){1,3}\.([a-z]{2,4}$)/i;
    return pattern.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var pattern = /^1(3|4|5|7|8)[0-9]{9}$/;
    return pattern.test(phone);
}





// 3.1 任务描述
// 先来一些简单的，在你的util.js中完成以下任务：

function hasClass(element, classname) {
    var classStr = trim(element.className);
    var classArr = uniqArray(classStr.split(" "));
    for (var i = 0, len = classArr.length; i < len; i++) {
        if (classArr.indexOf(classname) != -1) {
            return true;
        }
    }
    return false;
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if (!hasClass(element, newClassName)) {
        element.className += " " + newClassName;
    }
}


// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if (hasClass(element, oldClassName)) {
        element.className = element.className.replace(oldClassName, "");
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    if (element.parentNode === siblingNode.parentNode) {
        return true;
    }
    return false;
}


// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var x = 0,
        y = 0;
    var box = element.getBoundingClientRect();
    return {
        x: box.left,
        y: box.top
    };
}




// 接下来挑战一个mini $，它和之前的$是不兼容的，它应该是document.querySelector的功能子集，
// 在不直接使用document.querySelector的情况下，在你的util.js中完成以下任务：

// 实现一个简单的Query

// 可以通过id获取DOM对象，通过#标示，例如
$("#adom"); // 返回id为adom的DOM对象

// 可以通过tagName获取DOM对象，例如
$("a"); // 返回第一个<a>对象

// 可以通过样式名称获取DOM对象，例如
$(".classa"); // 返回第一个样式定义包含classa的对象

// 可以通过attribute匹配获取DOM对象，例如
$("[data-log]"); // 返回第一个包含属性data-log的对象

$("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象

// 可以通过简单的组合提高查询便利性，例如
$("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象

function $(selector) {
    if (!selector) {
        return;
    }
    var getChilds = function(element) {
        return element.getElementsByTagName("*");
    }
    var arr = trim(selector).split(" ");
    var elet = document.getElementsByTagName("html")[0];
    for (var i = 0, len = arr.length; i < len; i++) {
        var signal = arr[i][0];
        var childs = getChilds(elet);
        switch (signal) {
            case "#":
                var content = arr[i].slice(1);
                for (var j = 0, childsLen = childs.length; j < childsLen; j++) {
                    if (childs[j].id === content) {
                        elet = childs[j];
                        break;
                    }
                }
                break;
            case ".":
                var content = arr[i].slice(1);
                for (var j = 0, childsLen = childs.length; j < childsLen; j++) {
                    if (childs[j].className.indexOf(content) != -1) {
                        elet = childs[j];
                        break;
                    }
                }
                break;
            case "[":
                var content = trim(arr[i].slice(1, -1));
                if (content.indexOf("=") != -1) {
                    var key = trim(content.split("=")[0]);
                    var value = trim(content.split("=")[1].slice(1, -1));
                    for (var j = 0, childsLen = childs.length; j < childsLen; j++) {
                        if (childs[j].getAttribute(key) == value) {
                            elet = childs[j];
                            break;
                        }
                    }
                } else {
                    for (var j = 0, childsLen = childs.length; j < childsLen; j++) {
                        if (childs[j].attributes[content]) {
                            elet = childs[j];
                            break;
                        }
                    }
                }
                break;
            default:
                var content = arr[i];
                for (var j = 0, childsLen = childs.length; j < childsLen; j++) {
                    if (childs[j].tagName.toLowerCase() === content) {
                        elet = childs[j];
                        break;
                    }
                }
                break;
        }

    }
    return elet;
}



// 4.1 任务描述

// 我们来继续用封装自己的小jQuery库来实现我们对于JavaScript事件的学习，还是在你的util.js，实现以下函数

// 给一个element绑定一个针对event事件的响应，响应函数为listener
// 例如：
/*function clicklistener(event) {
    ...
}
addEvent($("#doma"), "click", clicklistener);*/

function addEvent(element, eventType, listener) {
    if (element.addEventListener) {
        element.addEventListener(eventType, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventType, listener);
    }
}

function clicklistener(event) {
    console.log("hello");
}


// 移除element对象对于event事件发生时执行listener的响应
function removeEvent(element, eventType, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(eventType, listener, true);
    } else if (element.detachEvent) {
        element.detachEvent("on" + eventType, listener);
    }
}



// 接下来我们实现一些方便的事件方法

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}


// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keydown", listener);
}

function enterListener(e) {
    e = e || window;
    if (e.keyCode == 13 || e.keyCode == 108) {
        alert("hello");
    }
}


// 接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法
// addEvent(element, event, listener) -> $.on(element, event, listener);
// removeEvent(element, event, listener) -> $.un(element, event, listener);
// addClickEvent(element, listener) -> $.click(element, listener);
// addEnterEvent(element, listener) -> $.enter(element, listener);

$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;



// 接下来考虑这样一个场景，我们需要对一个列表里所有的<li>增加点击事件的监听
/*<ul id="list">
    <li>Simon</li>
    <li>Kenner</li>
    <li>Erik</li>
</ul>*/

/*function clickListener(event) {
    console.log(event);
}

each($("#list").getElementsByTagName('li'), function(li) {
    addClickEvent(li, clickListener);
});*/

// 我们通过自己写的函数，取到id为list这个ul里面的所有li，然后通过遍历给他们绑定事件。
// 这样我们就不需要一个一个去绑定了。但是看看以下代码：

/*<ul id="list">
    <li id="item1">Simon</li>
    <li id="item2">Kenner</li>
    <li id="item3">Erik</li>
</ul>
<button id="btn">Change</button>*/

/*function clickListener(event) {
    console.log(event);
}

function renderList() {
    $("#list").innerHTML = '<li>new item</li>';
}

function init() {
    each($("#list").getElementsByTagName('li'), function(item) {
        $.click(item, clickListener);
    });

    $.click($("#btn"), renderList);
}
init();*/

//我们增加了一个按钮，当点击按钮时，改变list里面的项目，这个时候你再点击一下li，绑定事件不再生效了。
// 那是不是我们每次改变了DOM结构或者内容后，都需要重新绑定事件呢？当然不会这么笨，接下来学习一下事件代理，
// 然后实现下面新的方法：

// 使用示例
// 还是上面那段HTML，实现对list这个ul里面所有li的click事件进行响应
// $.delegate($("#list"), "li", "click", clickHandle);
function delegateEvent(element, tag, eventName, listener) {
    element["on" + eventName] = function(e) {
        e = e || window;
        var target = e.srcElement ? e.srcElement : e.target;
        if (target.tagName === tag) {
            target["on" + eventName] = listener;
        }
    }
}
$.delegate = delegateEvent;





// 5.1 任务描述

// 判断是否为IE浏览器，返回-1或者版本号
function isIE() {
    var ua = navigator.userAgent;
    var pattern1 = /msie([^;]+)/i;
    var pattern2 = /rv:([^\)]+)/i;
    if (pattern1.test(ua)) {
        var version = "IE " + RegExp["$1"];
        return version;
    } else if (pattern2.test(ua)) {
        var version = "IE " + RegExp["$1"];
        return version;
    }
    return -1;
}


// 设置cookie
function setCookie(cookieName, cookieValue, expiredays) {
    if (!expiredays) {
        document.cookie = cookieName + "=" + cookieValue;
    } else {
        var date = new Date();
        date.setTime(date.getTime() + expiredays * 24 * 60 * 60 * 1000)
        document.cookie = cookieName + "=" + cookieValue + ";expires=" + date.toGMTString();
    }
}

// 获取cookie值
function getCookie(cookieName) {
    var cookies = document.cookie;
    var cookieArr = cookies.split(";");
    for (var i = 0, len = cookieArr.length; i < len; i++) {
        var key = trim(cookieArr[i].split("=")[0]);
        console.log(key);
        var value = cookieArr[i].split("=")[1];
        if (key == cookieName) {
            console.log(key);
            return value;
        }
    }
    return "";
}




// 6.1 任务描述
// 学习Ajax，并尝试自己封装一个Ajax方法。实现如下方法：
// 使用示例：
/*ajax(
    'http://localhost:8080/server/ajaxtest', 
    {
        data: {
            name: 'simon',
            password: '123456'
        },
        onsuccess: function (responseText, xhr) {
            console.log(responseText);
        }
    }
);*/
/*options是一个对象，里面可以包括的参数为：
type: post或者get，可以有一个默认值
data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
onsuccess: 成功时的调用函数
onfail: 失败时的调用函数*/

function ajax(url, options) {

    // 转换data数据格式
    var transdata = function(obj) {
        var rt = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                rt.push(prop.concat("=", encodeURI(obj[prop])));
            }
        }
        return rt.join("&");
    }
    var data = transdata(options.data);


    // 创建对象
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // 判断type的类型
    var type = options.type.toUpperCase();
    if (!type) {
        type = "GET";
    }

    // 发送请求
    if (type === "GET") {
        if (options.data) {
            var getUrl = url;
        } else {
            var getUrl = url + "?" + data;
        }
        xhr.open(type, getUrl, true);
        xhr.send();
    } else if (type === "POST") {
        xhr.open(type, url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }

    // 处理回调
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                if (options.onsuccess) {
                    options.onsuccess();
                }
            } else {
                if (options.onfail) {
                    options.onfail();
                }
            }
        }
    }

}
