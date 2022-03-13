function maxLength(dom: HTMLElement) {
  let max = 10;
  let meta = {
    innerText: "",
    innerHTML: "",
  };

  let fragment: DocumentFragment;

  dom.addEventListener("keydown", (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (target.innerText.length >= 10 && e.keyCode !== 8) {
      e.preventDefault();
    }
  });

  dom.addEventListener("compositionstart", (e: CompositionEvent) => {
    meta.innerHTML = dom.innerHTML;
    meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, ""); // 去掉换行
  });

  dom.addEventListener("compositionend", (e: CompositionEvent) => {
    const diff = max - meta.innerText.length;

    // 证明输入的多了，要截取然后插入
    if (diff < e.data.length) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      const data = e.data.slice(0, diff);
      const result = meta.innerHTML + data;

      fragment = document.createDocumentFragment();

      dom.innerHTML = "";

      fragment.append(result);

      range.insertNode(fragment);

      range.collapse();
    }
  });
}

let dom = document.getElementById("con");

maxLength(dom);
