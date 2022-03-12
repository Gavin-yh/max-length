function maxLength(dom) {
  let max = 10
  let meta = {
    innerText: '',
    innerHTML: ''
  }

  let fragment

  // dom.addEventListener('input', (e) => {
  //   console.log(e)

  //   // e.preventdefault()
  //   e.data = ''
  //   e.returnValue = false
  // })

  dom.addEventListener('keydown',e=>{
    if(e.target.innerText.length >= 10 && e.keyCode !== 8){
        e.preventDefault();
    }
  })

  dom.addEventListener('compositionstart', e => {
    // console.log(e, 'start')
    meta.innerHTML = dom.innerHTML
    meta.innerText = dom.innerText.replace(/\r|\n|(\r\n)/g, '') // 去掉换行
  })

  dom.addEventListener('compositionupdate', e => {
    // console.log(e, 'update')

    e.preventDefault()
  })

  dom.addEventListener('compositionend', e => {
    const diff =  max - meta.innerText.length
    // console.log('diff:', diff, 'innerText:', meta.innerText.length)

    // 证明输入的多了，要截取然后插入
    if (diff < e.data.length) {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)

      const data = e.data.slice(0, diff)
      const result = meta.innerHTML + data

      fragment = document.createDocumentFragment()

      dom.innerHTML = ''

      fragment.append(result)

      range.insertNode(fragment)

      range.collapse()
    }
  })
}


let dom = document.getElementById('con')
maxLength(dom)