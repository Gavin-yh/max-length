function maxLength(dom) {
    var max = 10;
    var meta = {
        innerText: "",
        innerHTML: ""
    };
    var fragment;
    dom.addEventListener("keydown", function (e) {
        var target = e.target;
        if (target.innerText.length >= 10 && e.keyCode !== 8) {
            e.preventDefault();
        }
    });
    dom.addEventListener("compositionstart", function (e) {
        meta.innerHTML = dom.innerHTML;
        meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
    });
    dom.addEventListener("compositionend", function (e) {
        var diff = max - meta.innerText.length;
        // 证明输入的多了，要截取然后插入
        if (diff < e.data.length) {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            var data = e.data.slice(0, diff);
            var result = meta.innerHTML + data;
            fragment = document.createDocumentFragment();
            dom.innerHTML = "";
            fragment.append(result);
            range.insertNode(fragment);
            range.collapse();
        }
    });
}
var dom = document.getElementById("con");
maxLength(dom);
