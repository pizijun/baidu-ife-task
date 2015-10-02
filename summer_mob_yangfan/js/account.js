(function($) {
    var iconToggle = $("#toggleIcon");
    var navList = $("#nav-list");
    var item = $(".item");
    var showNumber = $("#number");
    var listWrap = $(".list-wrap");
    var chartWrap = $(".chart-wrap");
    var staticWrap = $(".statis-wrap");
    var addPencil = $("#addAccount");
    var ua = navigator.userAgent;
    var CLICK = "click";
    if (/iPhone|iPad/.test(ua)) {
        CLICK = "tap";
    }
    iconToggle.on(CLICK, function() { //toggle导航
        navList.slideToggle(200);
        iconToggle.toggleClass("fa-bars fa-times");
    });
    navList.find('a').on(CLICK, function() {
        if ($(".on")) {
            $(".on").removeClass();
        }
        $(this).addClass('on');
        listWrap.hide();
        chartWrap.hide();
        staticWrap.hide();
        if ($(this).text() == "账目列表") {
            listWrap.show();
            addPencil.css('visibility', 'visible');
        } else if ($(this).text() == "账目统计") {
            staticWrap.show();
            addPencil.css('visibility', 'hidden');
        } else if ($(this).text() == "账目图表") {
            chartWrap.show();
            chartWrap.css('visibility', 'visible');
            addPencil.css('visibility', 'hidden');
        }
    });
    load();
    // localStorage.removeItem("myaccount");

    var addBtn = $("#addbtn");
    processSwipe(); //左右滑动
    deleteItem(); //删除操作
    modifyItem(); //修改操作

    addPencil.on(CLICK, function() { //开始记账
        addBtn.data('id', "none");
        addBtn.text("发布");
        showComputer();
    });

    var cancelBtn = $("#cancel");
    cancelBtn.on(CLICK, function() { //取消
        hideComputer();
        showNumber.text("0");
        sum = 0;

    });
    var acList = $(".activity-list");
    acList.on(CLICK, function(e) { //切换不同的项目
        var e = e || window.event;
        e.stopPropagation();
        var target = e.srcElement ? e.srcElement : e.target;
        if (target.tagName == "I") {
            var targetNext = target.nextElementSibling;
            var text = targetNext.textContent
            var className = target.className;
            item.find('.fa')[0].className = className;
            item.find('span')[0].textContent = text;
            showNumber.text("0");
            characters = [];
            sum = 0;
        }
    });

    var countingArea = $(".counting-area");
    var characters = [];
    var operator = null; //操作符
    var sum = 0;
    var flag = false;
    countingArea.on(CLICK, function(e) { //计算操作
        var e = e || window.event;
        e.stopPropagation();
        var target = e.srcElement ? e.srcElement : e.target;
        var value = target.dataset.value;
        var nowValue = parseFloat(showNumber.text());
        switch (value) {
            case "clear":
                showNumber.text("0");
                characters = [];
                sum = 0;
                break;
            case "backspace":
                var nowText = showNumber.text();
                nowText = nowText.slice(0, -1);
                if (nowText == "") {
                    nowText = "0";
                }
                showNumber.text(nowText);
                characters = [];
                sum = 0;
                break;
            case "plus":
                operator = "plus";

                if (flag) {
                    return;
                }
                // alert(nowValue);
                sum = add(nowValue, sum);
                showNumber.text(sum);
                flag = true;
                characters = [];
                break;
            case "minus":
                operator = "minus";
                if (flag) {
                    return;
                }
                // alert(nowValue);
                // alert(sum);
                if (sum == 0) {
                    nowValue = -nowValue;
                }
                sum = substract(nowValue, sum);
                showNumber.text(sum);
                characters = [];
                flag = true;
                break;
            case "equal":
                if (operator == "plus") {
                    sum = add(nowValue, sum);
                } else if (operator == "minus") {
                    sum = substract(nowValue, sum);
                }
                showNumber.text(sum);
                characters = [];
                // nowValue = 0;
                flag = false;
                sum = 0;
                break;
            default:
                // flag = false;
                characters.push(value);
                if (value == ".") {
                    characters.unshift("0");
                }
                if (characters.indexOf(".") != characters.lastIndexOf(".")) {
                    characters.pop();
                }
                nowValue = parseFloat(characters.join(""));
                showNumber.text(nowValue);
                break;
        }
    });
    addBtn.on(CLICK, function(e) { //发布或修改
        e.stopPropagation();
        var itemName = item.find('span')[0].textContent;
        var itemIcon = item.find('.fa')[0].className;
        var itemCount = showNumber.text();
        var itemSign = "-";
        if (itemName == "收入") {
            itemSign = "+";
        }

        var id = $(this).data("id");
        if (id != "none") {
            var obj = {};
            obj.id = id;
            obj.name = itemName;
            obj.count = itemCount - getModelById(id).count;
            obj.sign = itemSign;
            obj.date = $("[data-id='" + id + "']").find('time').text();
            obj.iconName = itemIcon;
            $(".statis-list").append(statisTemplate(obj));
            updateLineChart(obj.date);
            var mItem = $("[data-id='" + id + "']");
            mItem.find('i')[0].className = itemIcon;
            mItem.find('.item-name').text(itemName);
            mItem.find('.money-num').text(itemSign + itemCount);
            updateModel(id, itemName, itemCount, itemIcon, itemSign);
            hideComputer();
            setTotalMoney();
            updatePieChart(itemName);
            return;
        }
        itemIns = new accountModel(itemName, itemCount, itemIcon, itemSign);
        var arr = getCollection();
        arr.push(itemIns)
        saveModel(arr);

        $("#accout-list").append(template(itemIns));
        $(".statis-list").append(statisTemplate(itemIns));
        processSwipe(); //左右滑动
        updateLineChart(itemIns.date);
        updatePieChart(itemName);

        deleteItem(); //删除操作
        setTotalMoney();
        modifyItem(); //修改操作
        hideComputer();
        showNumber.text("0");
        sum = 0;
    });
})(Zepto);

function load() { //加载
    var len = new Date().getMonth() + 1;
    for (var i = len; i >= 1; i--) {
        i = i < 10 ? "0" + i : i;
        var obj = {};
        obj.count = 0;
        obj.date = getDate();
        var para = obj.date.match(/\/(.+)\//)[1];
        obj.date = obj.date.replace(para, i);
        $(".statis-list").append(statisTemplate(obj));
    }
    var arr = getCollection();
    if (arr.length > 0) {
        $.each(arr, function(index, item) {
            $("#accout-list").append(template(item));
            $(".statis-list").append(statisTemplate(item));
        })
    }
    setTotalMoney();
}

function template(object) { //账目列表模板
    var li = $("<li></li>").wrapInner("<div data-id='" + object.id + "'class='item-content' id='item-content'><i class='" +
        object.iconName + "'></i><span class='item-name'>" + object.name + "</span><span class='money-num'>" +
        (object.sign + object.count) + "</span><time>" + object.date + "</time></div><div class='operation'>" +
        "<i class='fa fa-fw fa-pencil'></i><i class='fa fa-fw fa-trash-o'></i></div>");
    return li;
}

function statisTemplate(object) { //账目统计模板
    var statisList = $(".statis-list");
    var time = $(".statis-list").find('.time');
    var objYear = object.date.split("/")[0] + "年";
    var objMonth = object.date.split("/")[1] + "月";
    var spec = time.filter(function() {
        if ($(this).find(".year").text() == objYear && $(this).find(".month").text() == objMonth) {
            return true;
        }
    });
    var incomeNum = spec.next().find('.income-num');
    var expenseNum = spec.next().find('.expense-num');
    var iNumber, eNumber;
    if (object.sign == "+") {
        iNumber = object.count;
        eNumber = "0";
    } else {
        iNumber = "0";
        eNumber = object.count;
    }
    if (spec.length != 0) {
        incomeNum.text(add(parseFloat(incomeNum.text()), iNumber));
        expenseNum.text(add(parseFloat(expenseNum.text()), eNumber));
    } else {
        var li = $("<li class='flex-box'></li>").wrapInner("<div class='time flex-box direction-column align-items'>" +
            "<span class='year'>" + objYear + "</span><span class='month'>" + objMonth + "</span></div>" +
            "<div class='detail flex-box'><div class='flex-box direction-column  align-items'>" +
            "<span class='income'>收入</span><span class='income-num'>" + iNumber + "</span></div>" +
            "<div class='flex-box direction-column  align-items'><span class='expense'>支出</span>" +
            "<span class='expense-num'>" + eNumber + "</span></div></div>");
        return li;
    }
}

function processSwipe() {
    var liItem = $("#accout-list #item-content");

    liItem.on("swipeRight tap", function(e) { //右滑
        e.preventDefault();
        e.stopPropagation();
        $(this).animate({
            // "-webkit-transform": "translateX(0px)"
                "margin-left": "0"
        }, 200);
    });

    liItem.on("swipeLeft", function(e) { //左滑
        e.preventDefault();
        e.stopPropagation();
        $(this).animate({
            // "-webkit-transform": "translateX(-130px)"
                "margin-left": "-13rem"
        }, 200);
    })
}

function deleteItem() { //删除某个账目
    var deletebtn = $(".operation .fa-trash-o");
    deletebtn.on("tap", function(e) {
        e.preventDefault();
        e.stopPropagation();

        var id = $(this).parent().prev().data("id");
        if (confirm("确定要删除吗？")) {
            var obj = getModelById(id);
            obj.count = -obj.count;
            statisTemplate(obj);
            updateLineChart(obj.date);
            $(this).parents("li").remove();
            deleteModel(id);
            setTotalMoney();
            updatePieChart(obj.name);
        }
    });
}

function modifyItem() { //修改操作
    var addBtn = $("#addbtn");
    var item = $(".item");
    var showNumber = $("#number");
    var modifybtn = $(".operation .fa-pencil");
    modifybtn.on("click tap", function(e) {
        e.preventDefault();
        e.stopPropagation();

        var itemContent = $(this).parent().prev();
        var id = itemContent.data("id");
        var mIcon = itemContent.find('i');
        var mName = itemContent.find('.item-name');
        var mMoney = itemContent.find('.money-num');

        addBtn.data('id', id);
        addBtn.text("修改");

        item.find('span')[0].textContent = mName.text();
        item.find('.fa')[0].className = mIcon.attr("class");
        showNumber.text(mMoney.text().slice(1));
        showComputer();
    });
}

function setTotalMoney() {
    var arr = getCollection();
    var totalIncome = 0;
    var totalExpense = 0;
    $.each(arr, function(index, item) {
        if (item.sign == "+") {
            totalIncome += parseFloat(item.count);
        } else {
            totalExpense += parseFloat(item.count);
        }
    });
    $(".total-income").text(totalIncome);
    $(".total-expense").text(totalExpense);
    $(".total-remaining").text(substract(totalExpense,totalIncome));
}

function getPieValue() {
    var arr = getCollection();
    var clothValue = 0;
    var transportValue = 0;
    var accommodaValue = 0;
    var dietValue = 0;
    var shopValue = 0;
    var otherValue = 0;
    $.each(arr, function(index, item) {
        var name = item.name;
        switch (name) {
            case "衣服":
                clothValue = add(parseInt(item.count),clothValue);
                break;
            case "交通":
                transportValue = add(parseInt(item.count),transportValue);
                break;
            case "住宿":
                accommodaValue = add(parseInt(item.count),accommodaValue);
                break;
            case "饮食":
                dietValue = add(parseInt(item.count),dietValue);
                break;
            case "购物":
                shopValue = add(parseInt(item.count),shopValue);
                break;
            case "其它":
                otherValue = add(parseInt(item.count),otherValue);
                break;
        }
    });
    return {
        clothValue: clothValue,
        transportValue: transportValue,
        accommodaValue: accommodaValue,
        dietValue: dietValue,
        shopValue: shopValue,
        otherValue: otherValue
    }
}

function updatePieChart(name) {
    var pieValue = getPieValue();
    chatPie.segments[0].value = 0;
    switch (name) {
        case "衣服":
            chatPie.segments[0].value = pieValue.clothValue;
            break;
        case "交通":
            chatPie.segments[1].value = pieValue.transportValue;
            break;

        case "饮食":
            chatPie.segments[2].value = pieValue.dietValue;
            break;
        case "购物":
            chatPie.segments[3].value = pieValue.shopValue;
            break;
        case "其它":
            chatPie.segments[4].value = pieValue.otherValue;
            break;
        case "住宿":
            chatPie.segments[5].value = pieValue.accommodaValue;
            break;
    }
    chatPie.update();
}

function getLineData() {
    var monthData = ["一月", "二月", "三月", "四月", "五月", "六月",
        "七月", "八月", "九月", "十月", "十一月", "十二月"
    ];
    var nowMonthNum = new Date().getMonth() + 1;
    monthData = monthData.slice(0, nowMonthNum);
    var incomeData = [];
    $(".income-num").map(function(){
        incomeData.push(parseFloat($(this).text()));
    });
    var expenseData = [];
     $(".expense-num").map(function(){
        expenseData.push(parseFloat($(this).text()));
    });
     return {
        monthData : monthData,
        incomeData: incomeData.reverse(),
        expenseData: expenseData.reverse()
     }
}

function updateLineChart(date){
    var chooseIndex = parseInt(date.split("/")[1]);
    var ulList = $(".statis-list");
    var li = ulList.children().get(ulList.children().length - chooseIndex);
    var incomeValue = $(li).find(".income-num").text();
    var expenseValue = $(li).find(".expense-num").text();
    chartLine.datasets[0].points[chooseIndex -1].value = parseFloat(incomeValue);
    chartLine.datasets[1].points[chooseIndex -1].value = parseFloat(expenseValue);
    chartLine.update();
}
function accountModel(name, count, iconName, sign) { //数据模型
    this.id = this.setModelId();
    this.name = name;
    this.count = count;
    this.iconName = iconName;
    this.date = this.setDate();
    this.sign = sign;
}
accountModel.prototype.setModelId = function() { //设置每个模型的id
    if (localStorage["myaccount"]) {
        var arr = JSON.parse(localStorage["myaccount"]);
        var id = arr[arr.length - 1].id + 1;
        return id;
    }
    return 0;
}
accountModel.prototype.setDate = getDate;
function getCollection() {
    if (localStorage["myaccount"]) {
        var arr = JSON.parse(localStorage["myaccount"]);
        return arr;
    }
    return [];
}

function getModelById(id) {
    var arr = getCollection();
    var object = null;
    $.each(arr, function(index, item) {
        if (item.id == id) {
            object = item;
        }
    });
    return object;
}

function saveModel(arr) { //存储数据模型
    if (arr.length != 0) {
        localStorage["myaccount"] = JSON.stringify(arr);
    } else {
        localStorage.removeItem("myaccount");
    }
}

function deleteModel(id) { //删除数据模型
    var arr = getCollection();
    $.each(arr, function(index, item) {
        if (item.id == id) {
            arr.splice(index, 1);
        }
    });
    saveModel(arr);
}

function updateModel(id, name, count, iconName, sign) {
    var arr = getCollection();
    $.each(arr, function(index, item) {
        if (item.id == id) {
            item.name = name;
            item.count = count;
            item.iconName = iconName;
            item.sign = sign;
            // item.date = accountModel.prototype.setDate();
        }
    });
    saveModel(arr);
}

function showComputer() {
    var header = $("header");
    var listWrap = $(".list-wrap");
    var computeWrap = $(".compute-wrap");
    header.hide();
    listWrap.hide();
    computeWrap.show();
    setBoardHeight();
}

function hideComputer() {
    var header = $("header");
    var listWrap = $(".list-wrap");
    var computeWrap = $(".compute-wrap");
    computeWrap.hide();
    header.show();
    listWrap.show();
}

function setBoardHeight() { //动态调整计算器的高度
    var winHeight = $(window).height();
    var navHeight = $(".compute-nav").height();
    var aclistHeight = $(".activity-list").height();
    var rtbarHeight = $(".result-bar").height();
    $(".counting-area").height(winHeight - navHeight - aclistHeight - rtbarHeight);
}

function getDate() { //设置创建日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate();
    day = day < 10 ? "0" + day : day;
    return year + "/" + month + "/" + day;
}
function add(num1, num2) { //加法(对浮点数做处理)
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return Math.round(num1 * m + num2 * m) / m;
}

function substract(num1, num2) { //减法(对浮点数做处理)
    var r1, r2, m;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num2 * m - num1 * m) / m).toFixed(n);
}
