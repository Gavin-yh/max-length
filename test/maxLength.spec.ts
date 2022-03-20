// 测试三种情况：中文输入， 英文输入、粘贴事件
import maxlength from '../src/index'

const UUID =`max-length-02a54070-d0f2-47d`

describe('maxlength test', () => {
  let editor: HTMLElement
  let unsubscribe: () => void
  
  beforeEach(() => {
    editor = document.createElement('div')

    editor.style.width = '300px'
    editor.style.height = '200px'
    editor.contentEditable = 'true'

    unsubscribe = maxlength({
      dom: editor,
      maxLength: 10
    })!
  })

  test('可编辑区初始化', () => {
    expect(editor.contentEditable).toBeTruthy()
  })

  test('返回解绑函数', () => {
    expect(unsubscribe).not.toBeUndefined()
  })

  test('没有传递必填参数：dom和maxlength', () => {
    const unsubscribe = maxlength({} as {
      dom: HTMLElement;
      maxLength: number;
    })

    expect(unsubscribe).toBeFalsy()
  })

  test('触发输入法输入的开始事件', async () => {
    document.body.append(editor)

    const selection = window.getSelection()!

    selection.selectAllChildren(editor)

    editor.innerText = ''

    const event = new Event('compositionstart')

    editor.dispatchEvent(event);

    expect(editor.innerHTML).toEqual(`<span class="${UUID}"></span>`)
  })

  // test('测试粘贴文案，超出限定的长度', async () => {
  //   //@ts-ignore
  //   window.clipboardData = {
  //     getData() {
  //       return '测试粘贴文案，超出限定的长度' 
  //     }
  //   }

  //   document.body.append(editor)

  //   const selection = window.getSelection()!

  //   selection.selectAllChildren(editor)

  //   editor.focus()

  //   editor.innerText = ''

  //   const event = new Event('paste')

  //   editor.dispatchEvent(event);

  //   console.log(editor.innerHTML)

  //   // expect(unsubscribe).not.toBeUndefined()
  // })
})