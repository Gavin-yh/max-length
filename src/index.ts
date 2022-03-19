export type options = {
  dom: HTMLElement;
  maxLength: number;
};

const meta = {
  innerText: "",
  innerHTML: "",
};

let fragment: DocumentFragment;

const maxLength = (options: options) => {
  const { dom, maxLength } = options;

  if (!dom || !maxLength) {
    return;
  }

  const onCompositionstart = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");

    span.classList.add("template_span");

    range.insertNode(span);

    // 保存原始的html
    meta.innerHTML = dom.innerHTML;
    meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
  };

  const onCompositionend = (e: CompositionEvent) => {
    const diff = maxLength - meta.innerText.length;

    // 输入多了，要截取
    if (diff < e.data.length) {
      onInsertContent(e.data, diff);
    } else {
      clearTemplateSpan();
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    onCompositionstart();

    if ("ActiveXObject" in window) return;
    meta.innerHTML = dom.innerHTML;
    meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行

    const diff = maxLength - meta.innerText.length;

    const clipboardData = e.clipboardData;
    let pasteText = "";

    if (clipboardData == null) {
      pasteText =
        (window as any).clipboardData &&
        (window as any).clipboardData.getData("text");
    } else {
      pasteText = clipboardData.getData("text/plain");
    }

    if (diff < pasteText.length) {
      // 阻止默认粘贴行为
      e.preventDefault();
      onInsertContent(pasteText, diff);
    } else {
      clearTemplateSpan();
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (target.innerText.length >= maxLength && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const onInsertContent = (text: string, diff: number) => {
    dom.innerHTML = meta.innerHTML;
    const data = text.slice(0, diff);

    const range = clearTemplateSpan();

    fragment = document.createDocumentFragment();

    fragment.append(data);

    range.insertNode(fragment);

    range.collapse();
  };

  function clearTemplateSpan() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const templateSpan = document.getElementsByClassName("template_span")[0];

    range.selectNode(templateSpan);

    range.deleteContents();

    return range;
  }

  dom.addEventListener("keydown", onKeydown);

  dom.addEventListener("paste", onPaste);

  dom.addEventListener("compositionstart", onCompositionstart);

  dom.addEventListener("compositionend", onCompositionend);

  return () => {
    dom.removeEventListener("keydown", onKeydown);

    dom.removeEventListener("paste", onPaste);

    dom.removeEventListener("compositionstart", onCompositionstart);

    dom.removeEventListener("compositionend", onCompositionend);
  };
};

export default maxLength;
