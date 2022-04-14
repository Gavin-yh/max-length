var meta = {
    innerText: "",
    innerHTML: "", // 废弃
};
var fragment;
var UUID = "max-length-02a54070-d0f2-47d";
var maxLength = function (options) {
    var dom = options.dom, maxLength = options.maxLength;
    if (!dom || !maxLength) {
        return;
    }
    var createTemplateSpan = function () {
        var span = document.createElement("span");
        span.contentEditable = 'true';
        span.style.display = 'inline-block';
        span.style.minHeight = '1px';
        span.style.minWidth = '1px';
        span.classList.add(UUID);
        return span;
    };
    var onCompositionstart = function () {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var span = createTemplateSpan();
        range.insertNode(span);
        selection.removeAllRanges();
        selection.selectAllChildren(span);
        // 保存原始的html
        meta.innerHTML = dom.innerHTML;
        meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
    };
    var onCompositionend = function (e) {
        var diff = maxLength - meta.innerText.length;
        // 输入多了，要截取
        if (diff < e.data.length) {
            onInsertContent(e.data, diff);
        }
        else {
            clearTemplateSpan();
        }
    };
    var onPaste = function (e) {
        onCompositionstart();
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
        else {
            clearTemplateSpan();
        }
    };
    var onKeydown = function (e) {
        var target = e.target;
        if (target.innerText.length >= maxLength && e.keyCode !== 8) {
            e.preventDefault();
        }
    };
    var onInsertContent = function (text, diff) {
        var data = text.slice(0, diff);
        var range = clearTemplateSpan();
        fragment = document.createDocumentFragment();
        fragment.append(data);
        range.insertNode(fragment);
        range.collapse();
    };
    function clearTemplateSpan() {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var templateSpan = document.getElementsByClassName(UUID)[0];
        range.selectNode(templateSpan);
        range.deleteContents();
        return range;
    }
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
