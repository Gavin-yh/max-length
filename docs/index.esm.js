var meta = {
    innerText: "",
    innerHTML: ""
};
var fragment;
var maxLength = function (options) {
    var dom = options.dom, maxLength = options.maxLength;
    if (!dom || !maxLength) {
        return;
    }
    var onCompositionstart = function (e) {
        meta.innerHTML = dom.innerHTML;
        meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
    };
    var onCompositionend = function (e) {
        var diff = maxLength - meta.innerText.length;
        // 输入多了，要截取
        if (diff < e.data.length) {
            onInsertContent(e.data, diff);
        }
    };
    var onPaste = function (e) {
        if ("ActiveXObject" in window)
            return;
        meta.innerHTML = dom.innerHTML;
        meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
        var diff = maxLength - meta.innerText.length;
        var clipboardData = e.clipboardData;
        var pasteText = "";
        if (clipboardData == null) {
            pasteText =
                window.clipboardData &&
                    window.clipboardData.getData("text");
        }
        else {
            pasteText = clipboardData.getData("text/plain");
        }
        if (diff < pasteText.length) {
            // 阻止默认粘贴行为
            e.preventDefault();
            onInsertContent(pasteText, diff);
        }
    };
    var onKeydown = function (e) {
        var target = e.target;
        if (target.innerText.length >= maxLength && e.keyCode !== 8) {
            e.preventDefault();
        }
    };
    var onInsertContent = function (text, diff) {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var data = text.slice(0, diff);
        var result = meta.innerHTML.trim() + data;
        fragment = document.createDocumentFragment();
        dom.innerHTML = "";
        fragment.append(result);
        range.insertNode(fragment);
        range.collapse();
    };
    dom.addEventListener("keydown", onKeydown);
    dom.addEventListener("paste", onPaste);
    dom.addEventListener("compositionstart", onCompositionstart);
    dom.addEventListener("compositionend", onCompositionend);
    return function () {
        dom.removeEventListener("keydown", onKeydown);
        dom.removeEventListener("paste", onPaste);
        dom.removeEventListener("compositionstart", onCompositionstart);
        dom.removeEventListener("compositionend", onCompositionend);
    };
};

export { maxLength as default };
