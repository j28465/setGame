//海底的牌
var cards = [];
//桌面上的牌
var tableCards = [];
//已選擇的牌
var clickAry = [];
//這次提示的牌
var hint = [];
$(function () {
    var target, jdg, time = 0;
    //計時器
    var timeBox = document.getElementById("time");
    var Timer = window.setInterval(function () {
        ++time;
        var h = Math.floor(time / 3600);
        var m = Math.floor((time % 3600) / 60);
        var s = Math.floor((time % 3600) % 60);
        timeBox.innerText = h + "時" + m + "分" + s + "秒";
    }, 1000);
    //產生所有牌
    for (var a = 1; a <= 3; ++a) {
        for (var b = 1; b <= 3; ++b) {
            for (var c = 1; c <= 3; ++c) {
                for (var d = 1; d <= 3; ++d) {
                    cards.push([a, b, c, d]);
                }
            }
        }
    }
    shuffle(cards);
    //發牌
    distributeNew(12);
    $("#box:not(.lock)").on("click", "#hint", function () {
        $("#box").addClass("lock");
        //提示or無解答
        if (hint.length > 0) {
            //選擇第二或三張牌
            var card = hint.pop();
            clickAry.push(card);
            $("#tableBoard").find("div[data-ary='" + card + "']").addClass("lock");
            //第三張牌的話，清空、(發牌)、解除反灰
            if (hint.length == 0)
                distribute();
        }
        else {
            //產生一組解答
            var len = tableCards.length;
            for (var t1 = 0; t1 < len; ++t1) {
                for (var t2 = t1 + 1; t2 < len; ++t2) {
                    for (var t3 = t2 + 1; t3 < len; ++t3) {
                        hint = [tableCards[t1], tableCards[t2], tableCards[t3]];
                        jdg = verify(hint);
                        if (jdg)
                            break;
                    }
                    if (jdg)
                        break;
                }
                if (jdg)
                    break;
            }
            //有無解答
            if (jdg) {
                //清空所選
                clickAry = [];
                //解除反灰
                $("#tableBoard").find("div.lock").removeClass("lock");
                //選擇第一張牌
                var card = hint.pop();
                clickAry.push(card);
                $("#tableBoard").find("div[data-ary='" + card + "']").addClass("lock");
            }
            else {
                hint = [];
                //沒答案發牌
                if (cards.length > 0)
                    distributeNew(3);
                else {
                    clearInterval(Timer);
                    alert("遊戲結束");
                }
            }
        }
        //解除頁面鎖定
        setTimeout(function () { $("#box").removeClass("lock"); }, 800);
    }).on("click", "#tableBoard > div", function () {
        $("#box").addClass("lock");
        target = this;
        if (target.className == "lock") {
            removeArray(clickAry, target.getAttribute("data-ary"));
            $(target).removeClass("lock");
        }
        else {
            clickAry.push(target.getAttribute("data-ary"));
            $(target).addClass("lock");
            if (clickAry.length == 3) {
                //檢查所選牌組是否符合
                jdg = verify(clickAry);
                //清空、(發牌)、解除反灰
                distribute(jdg);
            }
        }
        //解除頁面鎖定
        setTimeout(function () { $("#box").removeClass("lock"); }, 800);
    });
});
//發牌
function distributeNew(j) {
    for (var i = 0; i < j; ++i) {
        //圖案+邊框
        var target = document.createElement("div");
        produce(target);
        //牌
        var card = document.createElement("div");
        card.className = "col-3 p-0 fs-1";
        card.appendChild(target);
        $("#tableBoard").append(card);
    }
}
//補牌
function distribute(jdg) {
    if (jdg === void 0) { jdg = true; }
    //清空
    clickAry = [];
    //答對
    if (jdg) {
        setTimeout(function () {
            $("#tableBoard").addClass("ans").find("div.lock").each(function (i, e) {
                if (tableCards.length > 12) {
                    //清除現在檯面上被選走的牌
                    removeArray(tableCards, e.getAttribute("data-ary"));
                    e.remove();
                }
                else {
                    //清除現在檯面上被選走的牌
                    removeArray(tableCards, e.getAttribute("data-ary"));
                    //清除被選走的牌
                    e.innerHTML = "";
                    e.setAttribute("data-ary", "");
                    //放上新的牌
                    if (cards.length > 0)
                        produce(e);
                    else if (tableCards.length == 0)
                        alert("遊戲結束");
                }
            });
            //解除反灰
            $("#tableBoard").removeClass("ans").find("div.lock").removeClass("lock");
        }, 500);
    }
    else {
        //解除反灰   
        setTimeout(function () { $("#tableBoard").find("div.lock").removeClass("lock"); }, 300);
        alert("答錯ㄌ");
    }
}
//隨機排序
function shuffle(ary) {
    var len = ary.length;
    var index;
    var tmp;
    while (len > 0) {
        index = Math.floor(Math.random() * len);
        len--;
        tmp = ary[len];
        ary[len] = ary[index];
        ary[index] = tmp;
    }
}
//取消選擇
function removeArray(array, _target) {
    var index = array.indexOf(_target);
    array.splice(index, 1);
}
//產生icon font並放入
function produce(target) {
    //這次要產生的牌的資料
    var p = cards.pop();
    //紀錄現在檯面上的牌
    tableCards.push(p.join(','));
    //產生
    //形狀, 填充
    var htm = document.createElement("i");
    switch (p[0]) {
        //circle
        case 1:
            htm.innerHTML = "&#xa00" + p[2];
            break;
        //square
        case 2:
            htm.innerHTML = "&#xb00" + p[2];
            break;
        //star
        case 3:
            htm.innerHTML = "&#xc00" + p[2];
            break;
    }
    //顏色
    switch (p[1]) {
        case 1:
            htm.className = "red";
            break;
        case 2:
            htm.className = "green";
            break;
        case 3:
            htm.className = "blue";
            break;
    }
    //數量
    for (var i = 0; i < p[3]; ++i) {
        target.appendChild(htm.cloneNode(true));
    }
    target.setAttribute("data-ary", p);
}
//檢查所選牌組是否符合
function verify(ary) {
    var jdg = true;
    for (var i = 0; i <= 3; ++i) {
        var tmp = 0;
        //三張牌
        for (var j = 0; j <= 2; ++j) {
            tmp += parseInt(ary[j].split(',')[i]);
        }
        //有誤
        if (tmp % 3 > 0) {
            jdg = false;
            break;
        }
    }
    return jdg;
}
