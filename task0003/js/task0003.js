$.click($(".add-class i"), function() {
    show($("#popup"));
});
$.click($(".head i"), function() {
    hide($("#popup"));
});
$.click($("#cancle"), function() {
    hide($("#popup"));
});
$.click($("#ok"), newClass);
$.click($(".add-task li"), function(e) {
    if ($(".choosen")) {
        $(".choosen").className = "";
    }
    showEditingArea(e);
});
$.click($("#tab-trigger"), toggleFinishStats);

load();
function load() {
    var root = $("#category-list");
    var parentClass = $("#parent-class");
    var taskList = $("#tab-content-all");
    var fatherIdArr = [];
    if (localStorage["parentCls"]) { //加载父类列表
        var pArr = getParentModel();
        for (var i = 0; i < pArr.length; i++) {
            fatherIdArr.push(pArr[i].pid);
            if (pArr[i].pid !== 0) {
                var pname = pArr[i].pname;
                var li = yieldPElement(pname);
                li.firstElementChild.href = "#p" + pArr[i].pid; //为父类添加一个href为pid的属性
                root.appendChild(li);
                setOptionsValue(pname, pArr[i].pid); //设置下拉框里的父类值
            }
        }
    }
    // 加载子分类列表
    if (localStorage["subCls"]) {
        var sArr = getSubModel();
        for (var i = 0; i < sArr.length; i++) {
            var sid = sArr[i].sid;
            var sname = sArr[i].sname;
            var num = sArr[i].childs.length;
            var fatherId = sArr[i].fatherId;

            var li = yieldSElement(sname);
            li.firstElementChild.dataset.pid = fatherId;
            var subListUl = document.createElement("ul");
            subListUl.className = "item-list";
            subListUl.appendChild(li);

            $.click(subListUl, switchSelectedStyle);

            var targetElement = $("[href='#p" + fatherId + "']").parentNode;
            if (targetElement.nextElementSibling != null && targetElement.nextElementSibling.tagName === "UL") {
                targetElement.nextElementSibling.appendChild(li);
            } else {
                insertAfter(root, targetElement, subListUl);
            }
            li.firstElementChild.href = "#s" + sid;
            $("[href='#s" + sid + "']" + " .snum").textContent = "(" + num + ")";
        }
    }
    // 加载任务列表
    if (localStorage["task"]) {
        var tArr = getTaskModel();
        for (var i = 0; i < tArr.length; i++) {
            var subClsId = tArr[i].subClsId;

            var title = tArr[i].title;
            var tid = tArr[i].tid;
            var setupDate = tArr[i].setupDate;
            var taskDivId = "s" + subClsId + "-" + setupDate;

            if (tArr[i].done === "true") {
                var aElementHTML = "<a id='done' href='#t" + tid + "'><span><i class='fa fa-check-square'></i></span>" +
                    title + "<span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></sapn></a>";
            } else {
                var aElementHTML = "<a href='#t" + tid + "'>" + title +
                    "<span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></sapn></a>";
            }
            if (!$("#" + taskDivId)) {
                var taskDiv = document.createElement("div");
                taskDiv.id = taskDivId;
                taskDiv.dataset.sid = subClsId; //为每个任务所属的父元素添加一个dataset属性
                $.click(taskDiv, switchChoosenStyle);
                hide(taskDiv); //隐藏所有的任务

                taskDiv.innerHTML = "<p>" + setupDate + "</p><ul><li>" + aElementHTML + "</li></ul>";
                taskList.appendChild(taskDiv);
            } else {
                var taskLi = document.createElement("li");
                taskLi.innerHTML = aElementHTML;
                $("#" + taskDivId + " ul").appendChild(taskLi);
            }
        }
    }
    setClsDefaultChoose(); //默认选择一个子分类和任务，及显示该任务的详情
    setTaskNum(fatherIdArr);
}
//为父类绑定处理函数
each($("#category-list").children, function(item) {
    if (item.tagName == "LI") {
        $.click(item, switchParentStyle);
    }
});

function initModel() {
    if (!localStorage["parentCls"]) {
        var pModel = new parentClsModel(0, "默认分类", []);
        localStorage["parentCls"] = JSON.stringify([pModel]);
    }
}
initModel()

// 新增分类
function newClass() {
    var parentClass = $("#parent-class");
    var root = $("#category-list");
    var parent = parentClass.value; //被选中项的value的值
    var newCls = $("#new-class").value;

    if (parent === "nothing") { //增加父类
        var li = yieldPElement(newCls);
        root.appendChild(li);
        // 保存父类的数据
        var pid = getParentModelId();
        li.firstElementChild.href = "#p" + pid; //为父类添加一个href为pid的属性

        setOptionsValue(newCls, pid);

        var pModel = new parentClsModel(pid, newCls, []);
        var pArr = getParentModel();
        pArr.push(pModel);
        savePModel(pArr);
    } else { //像父类中添加子类
        var li = yieldSElement(newCls);
        li.firstElementChild.dataset.pid = parent; //为子类添加一个dataset属性
        var subListUl = document.createElement("ul");
        subListUl.className = "item-list";
        subListUl.appendChild(li);

        $.click(subListUl, switchSelectedStyle); //为其绑定一个改变选中其子元素的样式的事件处理函数
        var targetElement = $("[href='#p" + parent + "']").parentNode;
        if (targetElement.nextElementSibling != null && targetElement.nextElementSibling.tagName === "UL") {
            targetElement.nextElementSibling.appendChild(li);
        } else {
            insertAfter(root, targetElement, subListUl);
        }

        // 保存子类的数据
        var sid = getSubModelId();
        li.firstElementChild.href = "#s" + sid;
        var sArr = getSubModel();
        var sModel = new subClsModel(sid, newCls, [], parent);
        sArr.push(sModel);
        saveSModel(sArr);
        setPModelChilds(parent, sid);
    }
    hide($("#popup"));
    $("#new-class").value = "";
}
// 产生父类列表的元素
function yieldPElement(value) {
    var li = document.createElement("li");
    var parentHmtl = "<a><span class='font-icon'><i class='fa fa-fw fa-folder'></i></span>" +
        value + "<span class='pnum'>(0)</span><span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></span></a>";
    li.innerHTML = parentHmtl;
    li.className = "category-item parent";
    return li;
}
// 产生子类列表元素
function yieldSElement(value) {
    var li = document.createElement("li");
    var subHtml = "<a><span class='font-icon'><i class='fa fa-fw fa-file-o'></i></span>" +
        value + "<span class='snum'>(0)</span><span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></span></a>";
    li.innerHTML = subHtml;
    li.className = "sub";
    return li;
}
// 设置可选分类下拉框的数据
function setOptionsValue(value, pid) {
    var option = document.createElement("option");
    option.innerHTML = value;
    option.value = pid;
    $("#parent-class").options.add(option);
}
// 设置页面加载默认的选中样式（选中子分类）
function setClsDefaultChoose() {
    var taskList = $("#tab-content-all");
    if ($("#moren").nextElementSibling != null && $("#moren").nextElementSibling.tagName === "UL") {
        var ulElement = $("#moren").nextElementSibling;
        var liElement = ulElement.firstElementChild;
        var aElement = liElement.firstElementChild;
        aElement.className = "selected";
        var sign = aElement.href.split("#")[1];
        //显示跟href匹配的任务
        var arr = [];
        each(taskList.children, function(item) {
            if (item.id.indexOf(sign) != -1) {
                show(item);
                arr.push(item);
            }
        })
        setTaskDefaultChoose(arr);
    }
}
// 设置选择子分类时并选中一个任务的样式
function setTaskDefaultChoose(arr) {
    if (arr.length > 0) {
        var taskOne = arr[0];
        var taskId = taskOne.id;
        var aElement = $("#" + taskId + " a");
        aElement.className = "choosen";
        var idSign = aElement.href.split("#")[1];
        showSpecification(idSign);
    }
}
// 设置选中默认的任务
function anothersetTaskDefaultChoose(arr) {
    if (arr.length > 0) {
        var taskOne = arr[0];
        taskOne.className = "choosen";
        var idSign = taskOne.href.split("#")[1];
        showSpecification(idSign);
    }
}
// 添加任务(将创建的任务添加到任务列表并在右边显示任务详情)
function addTask() { //bug
    var selected = $(".selected");
    var taskList = $("#tab-content-all");

    // 更新选中的任务
    if ($(".choosen")) {
        // $(".choosen").className = "";
        var href = $(".choosen").href;
        updateTask(href);
        clearEditingArea();
        return;
    }
    var href = selected.href.split("#")[1];
    each(taskList.children, function(item) { //添加任务后切换到"所有"状态
        if (item.id.indexOf(href) != -1) {
            var acollection = item.getElementsByTagName("a");
            each(acollection, function(elet) {
                show(elet);
            })
            show(item);
        }
    });
    if ($(".trigger-now")) {
        $(".trigger-now").className = "trigger-item";
        $("[href='#tab-content-all']").className = "trigger-item trigger-now";
    }
    var newTaskElement = taskCollectiton(); //生成任务列表元素
    var taskId = newTaskElement.id;

    var sid = newTaskElement.dataset.sid;
    var setupDate = newTaskElement.firstElementChild.innerHTML;
    var pid = $("[href='#s" + sid + "']").dataset.pid;

    if (!$("#" + taskId)) {
        taskList.appendChild(newTaskElement);
        var idSign = $("#" + taskId + " a").href.split("#")[1];

    } else { //若dom中存在id为taskId的元素，就对生成的元素进行截取
        var tempHtml = newTaskElement.innerHTML;
        var pn = /<a.+<\/a>/;
        var pn1 = /#([^\"]+)/;
        var aStr = tempHtml.match(pn)[0]; //匹配a标签
        var idSign = aStr.match(pn1)[1]; //匹配a标签的href
        var liElement = document.createElement("li");
        liElement.innerHTML = aStr;

        var id = "p" + pid + "-" + setupDate;
        if ($("#" + id)) { //在父类显示所有任务列表中插入刚添加的任务
            var ulElementHTML = $("#" + id + " ul").innerHTML;
            $("#" + id + " ul").innerHTML = ulElementHTML + liElement.outerHTML;
            // $("#p"+pid+"-"+setupDate+" ul").insertBefore(liElement,this.firstElementChild);
            // document.querySelector("#p"+pid+"-"+setupDate+" ul").appendChild(liElement);
        }
        $("#" + taskId + " ul").appendChild(liElement);
    }
    //创建任务后，同时把任务详情显示出来
    var specElement = yieldSpecElement(); //创建任务详情元素
    specElement.id = idSign;
    $(".right").appendChild(specElement);

    //添加任务后改变相应的数量关系
    var sNum = $("[href='#" + href + "'] .snum");
    var nowsNum = sNum.textContent.match(/\d+/)[0];
    sNum.textContent = "(" + (parseInt(nowsNum) + 1) + ")";

    var pid = selected.dataset.pid;
    var pNum = $("[href='#p" + pid + "'] .pnum");
    var nowpNum = pNum.textContent.match(/\d+/)[0];
    pNum.textContent = "(" + (parseInt(nowpNum) + 1) + ")";

    var sumElet = $(".total-sum");
    sumElet.textContent = parseInt(sumElet.textContent) + 1;

    hide($(".editing-area"));
    clearEditingArea();
}

function switchParentStyle(e) { //bug
    e = e || window.event;
    var target = e.srcElement ? e.srcElement : e.target;
    var selected = $(".selected");
    var picked = $(".picked");
    var taskList = $("#tab-content-all");
    var rightArea = $(".right");

    if ($(".trigger-now")) {
        $(".trigger-now").className = "trigger-item";
        $("[href='#tab-content-all']").className = "trigger-item trigger-now";
    }
    each(taskList.children, function(item) { //隐藏不为none的元素
        if (item.style.display != "none") {
            hide(item);
        }
    });
    each(rightArea.children, function(item) { //隐藏任务详情区域的元素
        if (item.className.indexOf("show-wrap") != -1) {
            hide(item);
        }
    });
    if ($(".editing-area")) {
        hide($(".editing-area"));
    }
    if (selected) {
        selected.className = "";
    }
    if ($(".choosen")) {
        $(".choosen").className = "";
    }
    if (picked) { //如果有父类被选中了就隐藏
        picked.className = "";
        var idSign = picked.href.split("#").slice(1);
        hide($("#" + idSign));
    }
    if (target.tagName == "A") { //显示目标父类的任务列表及改变样式
        target.className = "picked";
        var pid = target.href.split("#")[1];
        var pAllWrap = $("#" + pid);
        if (pAllWrap) {
            show(pAllWrap);
            each(pAllWrap.children, function(item) {
                if (item.style.display == "none") {
                    show(item);
                }
                var acollection = item.getElementsByTagName("a");
                each(acollection, function(elet) {
                    if (elet.style.display == "none") {
                        show(elet);
                    }
                });
            });
            setTaskDefaultChoose(pAllWrap.children);
        } else {
            showAllTask(pid);
        }
    }
        // e.stopPropagation();
}

function showAllTask(pid) {
    var taskList = $("#tab-content-all");
    var allTaskId = [];
    var allTaskArr = [];
    var sArr = getSubModel();

    each(sArr, function(item) {
        if (item.fatherId == pid[1]) {
            allTaskId = allTaskId.concat(item.childs)
        }
    })
    var tArr = getTaskModel();
    each(allTaskId, function(value) {
        each(tArr, function(item) {
            if (item.tid == value) {
                allTaskArr.push(item);
            }
        })
    })
    var allTaskDiv = document.createElement("div");
    allTaskDiv.id = pid;
    allTaskDiv.style.display = "block";
    taskList.appendChild(allTaskDiv);
    var arr = [];
    each(allTaskArr, function(item) {
        var subDivId = pid + "-" + item.setupDate;
        if (item.done === "true") {
            var aElementHTML = "<a id='done' href='#t" + item.tid + "'><span><i class='fa fa-check-square'></i></span>" +
                item.title + "<span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></sapn></a>";
        } else {
            var aElementHTML = "<a href='#t" + item.tid + "'>" + item.title +
                "<span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></sapn></a>";
        }
        if (!$("#" + subDivId)) {
            var subDiv = document.createElement("div");
            $.click(subDiv, switchChoosenStyle);
            allTaskDiv.appendChild(subDiv);
            subDiv.innerHTML = "<p>" + item.setupDate + "</p><ul><li>" + aElementHTML + "</li></ul>";
            subDiv.id = subDivId;
            arr.push(subDiv);
        } else {
            var taskLi = document.createElement("li");
            taskLi.innerHTML = aElementHTML;
            $("#" + subDivId + " ul").appendChild(taskLi);
        }
    })
    setTaskDefaultChoose(arr);
}
// 切换选中子类的样式
function switchSelectedStyle(e) {
    e.stopPropagation();
    var selected = $(".selected");
    var picked = $(".picked");
    var taskList = $("#tab-content-all");
    if (picked) {
        picked.className = "";
    }
    if ($(".trigger-now")) {
        $(".trigger-now").className = "trigger-item";
        $("[href='#tab-content-all']").className = "trigger-item trigger-now";
    }

    each($(".right").children, function(item) { // 在展示之前隐藏存在的某任务详情
        if (item.className === "show-wrap") {
            hide(item);
        }
        if ($(".editing-area")) {
            hide($(".editing-area"));
        }
    });
    each(taskList.children, function(item) { //隐藏任务列表中显示的元素
        if (item.style.display == "block") {
            hide(item);
        }
        if ($(".choosen")) { //清除被选中的样式
            $(".choosen").className = "";
        }
    })

    if (selected) { //如果在列表中有元素存在此样式则清除
        selected.className = "";
        var href = selected.href.split("#")[1];
        each(taskList.children, function(item) { //隐藏任务列表
            if (item.id.indexOf(href) != -1) {
                hide(item);
            }
        });
    }
    e = e || window.event;
    var target = e.srcElement ? e.srcElement : e.target;
    if (target.tagName == "A") {
        target.className = "selected";

        var href = target.href.split("#")[1];
        var arr = [];

        each(taskList.children, function(item) { //显示跟href匹配的任务
            if (item.id.indexOf(href) != -1) {
                show(item);
                var acollection = item.getElementsByTagName("a");
                each(acollection, function(elet) {
                    show(elet);
                })
                arr.push(item);
            }
        });
        //显示一个默认的任务详情
        setTaskDefaultChoose(arr);
    }
}
// 改变选中任务的样式
function switchChoosenStyle(e) {
    e = e || window.event;
    // e.preventDefault();
    var choosen = $(".choosen");
    if ($(".editing-area")) {
        hide($(".editing-area"));
    }
    if (choosen) {
        choosen.className = "";
        each($(".right").children, function(item) {
            if (item.className === "show-wrap") {
                hide(item);
            }

        });
        e.stopPropagation();
    }
    var target = e.srcElement ? e.srcElement : e.target;
    if (target.tagName == "A") {
        target.className = "choosen";
        var idSign = target.href.split("#")[1];
        if ($("#" + idSign)) {
            show($("#" + idSign));
        } else {
            showSpecification(idSign);
        }
    }
}
//切换'所有','已完成','未完成'的状态
function toggleFinishStats(e) {
    e = e || window.event;
    var target = e.srcElement ? e.srcElement : e.target;
    if (target.tagName == "A") { //切换按钮的样式
        if (target.className.indexOf("trigger-now") == -1) {
            $(".trigger-now").className = "trigger-item";
            target.className = "trigger-item trigger-now";
        }
    }
    var selected = $(".selected");
    var picked = $(".picked");
    if (selected) {
        var idSign = selected.href.split("#")[1];
        var taskList = $("#tab-content-all");
        toggleFinishReveal(idSign, taskList)
    } else if (picked) {
        var idSign = picked.href.split("#")[1];
        var parentElement = $("#" + idSign);
        toggleFinishReveal(idSign, parentElement)
    }
}

function toggleFinishReveal(sign, rootElement) {
    each($(".right").children, function(item) {
        hide(item);
    });
    var arr = [];
    each(rootElement.children, function(item) { //显示符合sign的所有元素
        if (item.id.indexOf(sign) != -1) {
            var acollection = item.getElementsByTagName("a");
            each(acollection, function(elet) {
                show(elet);
                arr.push(elet);
            })
            show(item);
        }
    });

    if ($(".trigger-now").href.split("#")[1] == "tab-content-false") { //隐藏已完成的，显示未完成的
        if ($(".choosen")) {
            $(".choosen").className = "";
        }
        var arr = [];
        each(rootElement.children, function(item) {
            if (item.id.indexOf(sign) != -1) {
                var flag = true;
                var acollection = item.getElementsByTagName("a");
                each(acollection, function(elet) {
                    if (elet.id == "done") {
                        hide(elet);
                    } else {
                        arr.push(elet);
                        flag = false;
                    }
                });
                if (flag) {
                    hide(item);
                }
            }
        })
        each($(".right").children, function(item) {
            hide(item);
        });
        anothersetTaskDefaultChoose(arr);
        return;
    } else if ($(".trigger-now").href.split("#")[1] == "tab-content-true") { //隐藏未完成的，显示已完成的
        if ($(".choosen")) {
            $(".choosen").className = "";
        }
        var arr = [];
        each(rootElement.children, function(item) {

            if (item.id.indexOf(sign) != -1) {
                var flag = true;
                var acollection = item.getElementsByTagName("a");
                each(acollection, function(elet) {
                    if (elet.id !== "done") {
                        hide(elet)
                    } else {
                        arr.push(elet);
                        flag = false;
                    }
                });
                if (flag) {
                    hide(item);
                }
            }
        });
        each($(".right").children, function(item) {
            hide(item);
        });
        anothersetTaskDefaultChoose(arr);
        return;
    }

    if ($(".choosen")) {
        $(".choosen").className = "";
    }
    anothersetTaskDefaultChoose(arr);
}

// 展示编辑区域
function showEditingArea(e) {
    e = e || window.event;
    var target = e.srcElement ? e.srcElement : e.target;
    if (!$(".selected") && target.className.indexOf("fa-plus") != -1) {
        alert("请选择在一个子分类下新增任务列表");
        return;
    }
    each($(".right").children, function(item) {
        if (item.className === "show-wrap") {
            hide(item);
        }
    });

    if ($(".editing-area")) {
        show($(".editing-area"));
        return;
    }
    var editDiv = document.createElement("div");
    editDiv.className = "editing-area";
    editDiv.innerHTML = " <div><label for='title-input'>任务标题：</label><input type='text' id='title-input'></div>" +
        "<div><label for='date-input'>任务日期：</label><input type='text' id='date-input'></div>" +
        "<div><label for='content-input'>任务内容：</label><textarea id='content-input' cols='80' rows='7'></textarea></div>" +
        "<div><a class='sure'>确定</a><a class='abolish'>取消</a></div>"
    $(".right").appendChild(editDiv);
    $.click($(".sure"), addTask);
    $.click($(".abolish"), function() {
        hide($(".editing-area"));
        clearEditingArea();
    });
}

// 展示任务具体内容
function showSpecification(idSign) {
    var id = idSign.slice(1);
    var rightArea = $(".right");
    if ($("#" + idSign)) { //若存在id为idSign的元素就显示
        show($("#" + idSign));
        return;
    }
    var tArr = getTaskModel();
    each(tArr, function(item) { //开始加载时要从本地存储取再显示
        if (item.tid == id) {
            var title = item.title;
            var finishDate = item.finishDate;
            var content = item.content;
            var specElement = yieldSpecElement(title, finishDate, content);
            specElement.id = idSign;
            rightArea.appendChild(specElement);
        }
    });
}
function clearEditingArea(){
    $("#title-input").value = "";
    $("#date-input").value = "";
    $("#content-input").value = "";
}
function yieldSpecElement(title, finishDate, content) {
    //如果不传值的就获取编辑区域的值
    if (!title && !finishDate && !content) {
        title = $("#title-input").value;
        finishDate = $("#date-input").value;
        content = $("#content-input").value;
    }
    var wrapDiv = document.createElement("div");
    var html = "<div class='title'><h1>" + title + "</h1>" +
        "<span class='confirm' onclick='toggleDone();'><i class='fa fa-fw fa-2x fa-check-circle-o'></i></span>" +
        "<span class='edit' onclick='editing();'><i class='fa fa-fw fa-2x fa-pencil-square-o'></i></span></div>" +
        "<div class='date'>任务日期：<span>" + finishDate + "</span></div>" + "<div class='content'><p>" +
        content + "</p></div>"
    wrapDiv.innerHTML = html;
    wrapDiv.className = "show-wrap";
    return wrapDiv;
}
//编辑任务
function editing() {
    var e = window.event;
    var target = e.srcElement ? e.srcElement : e.target;
    var taskElement = target.parentNode.parentNode.parentNode;
    var idSign = taskElement.id;
    var title = $("#" + idSign + " h1").textContent;
    var date = $("#" + idSign + " .date span").textContent;
    var content = $("#" + idSign + " p").textContent;
    showEditingArea(e);
    $("#title-input").value = title;
    $("#date-input").value = date;
    $("#content-input").value = content;
}

function toggleDone() {
    var choosenElement = $(".choosen");
    var selected = $(".selected");
    var picked = $(".picked");
    var taskList = $("#tab-content-all");
    if (choosenElement.id) {
        return;
    }
    var href = choosenElement.href;
    var idSign = href.split("#")[1].slice(1);
    //改变完成的任务的样式
    var span = document.createElement("span");
    span.innerHTML = "<i class='fa fa-check-square'></i>";
    var tempArr = document.querySelectorAll("[href='#t" + idSign + "']");
    each(tempArr, function(item) {
        var itemHTMl = item.innerHTML;
        item.innerHTML = span.outerHTML + itemHTMl;
        item.id = "done";
    });

    //切换回"所有"状态
    if ($(".trigger-now")) {
        $(".trigger-now").className = "trigger-item";
        $("[href='#tab-content-all']").className = "trigger-item trigger-now";
    }
    if (selected) {
        var sign = selected.href.split("#")[1];
    } else if (picked) {
        var sign = picked.href.split("#")[1];
    }
    each(taskList.children, function(item) { //显示符合sign的所有元素
        if (item.id.indexOf(sign) != -1) {
            var acollection = item.getElementsByTagName("a");
            each(acollection, function(elet) {
                show(elet);
            })
            show(item);
        }
    });

    //更新done属性的数据
    var tArr = getTaskModel();
    each(tArr, function(item) {
        if (item.tid == idSign) {
            item.done = "true";
        }
    });
    saveTask(tArr);
}
//更新编辑后的任务
function updateTask(sign) {
    var idSign = sign.split("#")[1];
    var title = $("#title-input").value;
    var finishDate = $("#date-input").value;
    var content = $("#content-input").value;

    var tArr = getTaskModel();
    each(tArr, function(item) {
        if (item.tid == idSign.slice(1)) {
            item.title = title;
            item.finishDate = finishDate;
            item.content = content;
        }
    });
    saveTask(tArr);

    $("#" + idSign + " h1").textContent = title;
    $("#" + idSign + " .date span").textContent = finishDate;
    $("#" + idSign + " p").textContent = content;
    var acollection = document.querySelectorAll("[href='#" + idSign + "']");
    each(acollection, function(item) {
        var srcText = item.textContent;
        var srcHtml = item.innerHTML;
        item.innerHTML = srcHtml.replace(srcText, title);
    });
    hide($(".editing-area"));
    show($("#" + idSign));
}
// 一个任务记录
function taskCollectiton() {
    var title = $("#title-input").value;
    var finishDate = $("#date-input").value;
    var content = $("#content-input").value;

    var idSign = $(".selected").href.split("#")[1];
    var subClsId = idSign.slice(1);
    var setupDate = getTodayDate();

    // 保存任务的数据
    var done = "false";
    var tid = getTaskId();
    var tArr = getTaskModel();
    var tModel = new taskModel(tid, title, setupDate, finishDate, content, subClsId, done);
    tArr.push(tModel);
    saveTask(tArr);
    setSModelChilds(subClsId, tid);

    var taskDiv = document.createElement("div");
    taskDiv.id = idSign + "-" + setupDate;
    taskDiv.dataset.sid = subClsId; //为每个任务所属的父元素添加一个dataset属性
    $.click(taskDiv, switchChoosenStyle);
    taskDiv.innerHTML = "<p>" + setupDate + "</p><ul><li><a href='#t" + tid + "' class='choosen'>" + title +
        "<span class='destroy' onclick='destroy();'><i class='fa fa-times fa-fw'></i></sapn></a></li></ul>";
    return taskDiv;
}

// 父类的数据模型
function parentClsModel(pid, pname, children) {
    this.pid = pid;
    this.pname = pname;
    this.children = children;
}
// 设置父类的children属性
function setPModelChilds(pid, sid) {
    var pArr = getParentModel();
    each(pArr, function(item) {
        if (item.pid == pid) {
            var arr = item.children;
            arr.push(sid);
        }
    });
    savePModel(pArr);
}
//在删除某个子类时,更新父类的children属性
function delPModelChilds(pid, sid) {
    var pArr = getParentModel();
    each(pArr, function(item) {
        if (item.pid == pid) {
            for (var i = 0; i < item.children.length; i++) {
                if (item.children[i] == sid) {
                    item.children.splice(i, 1);
                }
            }
        }
    });
    savePModel(pArr);
}

// 子类的数据模型
function subClsModel(sid, sname, childs, fatherId) {
    this.sid = sid;
    this.sname = sname;
    this.childs = childs;
    this.fatherId = fatherId;
}
// 设置子类的childs属性(bug)
function setSModelChilds(sid, tid) {
    var sArr = getSubModel();
    each(sArr, function(item) {
        if (item.sid == sid) {
            var arr = item.childs;
            arr.push(tid);
        }
    });
    saveSModel(sArr);
}

//在删除某个任务时,更新子类的childs属性
function delSModelChilds(sid, tid) {
    var sArr = getSubModel();
    each(sArr, function(item) {
        if (item.sid == sid) {
            for (var i = 0; i < item.childs.length; i++) {
                if (item.childs[i] == tid) {
                    item.childs.splice(i, 1);
                }
            }
        }
    });
    saveSModel(sArr);
}
function taskModel(tid, title, setupDate, finishDate, content, subClsId, done) {
    this.tid = tid;
    this.title = title;
    this.setupDate = setupDate;
    this.finishDate = finishDate;
    this.content = content;
    this.subClsId = subClsId;
    this.done = done;
}
function savePModel(pArr) {
    if (pArr.length != 0) {
        localStorage["parentCls"] = JSON.stringify(pArr);
    }
}
function saveSModel(sArr) {
    if (sArr.length != 0) {
        localStorage["subCls"] = JSON.stringify(sArr);
    } else {
        localStorage.removeItem("subCls");
    }
}
function saveTask(tArr) {
    if (tArr.length != 0) {
        localStorage["task"] = JSON.stringify(tArr);
    } else {
        localStorage.removeItem("task");
    }
}
function getParentModel() {
    if (localStorage["parentCls"]) {
        var pArr = JSON.parse(localStorage["parentCls"]);
        return pArr;
    }
    return [];
}
function getSubModel() {
    if (localStorage["subCls"]) {
        var sArr = JSON.parse(localStorage["subCls"]);
        return sArr;
    }
    return [];
}
function getTaskModel() {
    if (localStorage["task"]) {
        var tArr = JSON.parse(localStorage["task"]);
        return tArr;
    }
    return [];
}
function getParentModelId() {
    if (localStorage["parentCls"]) {
        var pArr = JSON.parse(localStorage["parentCls"]);
        var id = pArr[pArr.length - 1].pid + 1;
        return id;
    }
    return 0;
}
function getSubModelId() {
    if (localStorage["subCls"]) {
        var sArr = JSON.parse(localStorage["subCls"]);
        var id = sArr[sArr.length - 1].sid + 1;
        return id;
    }
    return 0;
}
function getTaskId() {
    if (localStorage["task"]) {
        var tArr = JSON.parse(localStorage["task"]);
        var id = tArr[tArr.length - 1].tid + 1;
        return id;
    }
    return 0;
}
//删除分类的操作(有bug)
function destroy(e) {
    e = e || window.event;
    var root = $("#category-list");
    var itemList = $(".item-list");
    var taskList = $("#tab-content-all");
    var rightArea = $(".right");
    if (!confirm("删除后不可回复，请三思！！！")) {
        e.stopPropagation();
        return;
    }
    var target = e.srcElement ? e.srcElement : e.target;
    var a = target.parentNode.parentNode;
    if (a.href) {
        var href = a.href.split("#")[1];
    }
    var li = a.parentNode;
    var ulElement = li.parentNode;
    var liClsName = li.className;

    var idSign = href.slice(1)
    var pArr = getParentModel();
    var sArr = getSubModel();
    var tArr = getTaskModel();
    var sumElet = $(".total-sum");

    if (href.indexOf("p") != -1) {
        var pNum = $("[href='#" + href + "'] .pnum");
        var nowpNum = pNum.textContent.match(/\d+/)[0];
        sumElet.textContent = parseInt(sumElet.textContent) - parseInt(nowpNum);

        if(li.nextElementSibling){
            ulElement.removeChild(li.nextElementSibling); //删除父类下子类的dom
        }
        ulElement.removeChild(li); //删除父类的dom
        if ($("#" + href)) { //删除以父类href为id的存放所有任务的元素
            taskList.removeChild($("#" + href));
        }
        //删除含子类href的存放任务列表的元素以及所有相关任务的详情元素
        each(pArr, function(item, i) {
            if (item.pid == idSign) {
                each(item.children, function(value) {
                    each(taskList.children, function(elet) {
                        if (elet.id.indexOf("s" + value) != -1) {
                            if ($("#" + elet.id)) {
                                taskList.removeChild(elet);
                            }
                        }
                    });
                    each(tArr, function(tItem, tKey) {
                        if (tItem.subClsId == value) {
                            var id = "t" + tItem.tid;
                            if ($("#" + id)) {
                                rightArea.removeChild($("#" + id));
                            }
                            tArr.splice(tKey, 1, "");
                        }
                    });
                })
                pArr.splice(i, 1, ""); //删除localStorage里相应的父类对象
            }
        });
        each(sArr, function(item, i) {
            if (item.fatherId == idSign) {
                sArr.splice(i, 1, "");
            }
        });
        savePModel(uniqArray(pArr));
        saveSModel(uniqArray(sArr));
        saveTask(uniqArray(tArr));

        //删除父类后，要清除下拉框里对应的值
        each($("#parent-class").options,function(item){
            if(item.value == idSign){
                $("#parent-class").removeChild(item);
            }
        })

    } else if (href.indexOf("s") != -1) {
        var sNum = $("[href='#" + href + "'] .snum");
        var nowsNum = sNum.textContent.match(/\d+/)[0];

        ulElement.removeChild(li); //删除子类的dom
        each(taskList.children, function(elet) {
            if (elet.id.indexOf(href) != -1) {
                taskList.removeChild(elet); //删除含子类href的存放任务列表的元素
            }
        });
        each(tArr, function(item, tKey) {
            if (item.subClsId == idSign) {
                var id = "t" + item.tid;
                if ($("#" + id)) {
                    rightArea.removeChild($("#" + id));
                }
                tArr.splice(tKey, 1, "");
            }
        });
        each(sArr, function(item, i) {
            if (item.sid == idSign) {
                delPModelChilds(item.fatherId, item.sid);
                sArr.splice(i, 1, "");
            }
        });
        saveSModel(uniqArray(sArr));
        saveTask(uniqArray(tArr));

        var datapid = a.dataset.pid;
        var pNum = $("[href='#p" + datapid + "'] .pnum");
        var nowpNum = pNum.textContent.match(/\d+/)[0];

        pNum.textContent = "(" + (parseInt(nowpNum) - parseInt(nowsNum)) + ")";
        sumElet.textContent = parseInt(sumElet.textContent) - parseInt(nowsNum);

    } else if (href.indexOf("t") != -1) {
        ulElement.removeChild(li); //删除任务项dom
        if ($("#t" + idSign)) {
            rightArea.removeChild($("#t" + idSign));
        }
        each(tArr, function(item, i) {
            if (item.tid == idSign) {
                delSModelChilds(item.subClsId, item.tid);
                tArr.splice(i, 1, "");
            }
        });
        saveTask(uniqArray(tArr));

        var datasid = ulElement.parentNode.dataset.sid;
        var sNum = $("[href='#s" + datasid + "'] .snum");
        var nowsNum = sNum.textContent.match(/\d+/)[0];
        sNum.textContent = "(" + (parseInt(nowsNum) - 1) + ")";

        var datapid = $("[href='#s" + datasid + "']").dataset.pid;
        var pNum = $("[href='#p" + datapid + "'] .pnum");
        var nowpNum = pNum.textContent.match(/\d+/)[0];
        pNum.textContent = "(" + (parseInt(nowpNum) - 1) + ")";

        sumElet.textContent = parseInt(sumElet.textContent) - 1;
    }
}
//显示任务的数量
function setTaskNum(fatherIdArr) {
    var sArr = getSubModel();
    var totalNum = 0;
    each(fatherIdArr, function(value) {
        var sum = 0;
        each(sArr, function(item) {
            if (item.fatherId == value) {
                sum += item.childs.length;
                totalNum += item.childs.length;
            }
        });
        $("[href='#p" + value + "'] .pnum").textContent = "(" + sum + ")";
    });
    $(".total-sum").textContent = totalNum;
}
// 向某个元素后插入元素
function insertAfter(root, targetElement, newElement) {
    if (root.lastElementChild == targetElement) {
        root.appendChild(newElement);
    } else {
        root.insertBefore(newElement, targetElement.nextElementSibling);
    }
}
// 获取今日日期
function getTodayDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    var day = date.getDate();
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
}
// 显示弹出层
function show(element) {
    element.style.display = "block";
}
// 隐藏弹出层
function hide(element) {
    element.style.display = "none";
}
