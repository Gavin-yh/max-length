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

  const onCompositionstart = (e: CompositionEvent) => {
    meta.innerHTML = dom.innerHTML;
    meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
  };

  const onCompositionend = (e: CompositionEvent) => {
    const diff = maxLength - meta.innerText.length;

    // 输入多了，要截取
    if (diff < e.data.length) {
      onInsertContent(e.data, diff);
    }
  };

  const onPaste = (e: ClipboardEvent) => {
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
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (target.innerText.length >= 10 && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const onInsertContent = (text: string, diff: number) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const data = text.slice(0, diff);

    const result = meta.innerHTML.trim() + data;

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
};

export default maxLength;
