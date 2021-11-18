let prefixList = []

let id = 0

chrome.storage.sync.get("prefix", ({ prefix }) => {
  if(!prefix) return
  prefixList = JSON.parse(prefix).map((p, i) => ({...p, id: i + ''}))
  id = prefixList.length
  init()
});

const addButton = document.querySelector('#add-button')
const inputContainer = document.querySelector('.input-container')

addButton.addEventListener('click', addItem)

function newItem(id, prefix = '', type = 'newTab', name = '') {
  const div = document.createElement('div')
  div.classList.add('input-item')
  const delButton = document.createElement('button')
  delButton.innerText = '删除'
  delButton.addEventListener('click', () => {
    deleteItem(id)
  })

  const nameLabel = document.createElement('label')
  const nameInput = document.createElement('input')
  nameInput.value = name
  nameLabel.append('名称:', nameInput)
  nameInput.addEventListener('blur', () => {
    changeProp(id, 'name', nameInput.value)
  })

  const inputLabel = document.createElement('label')
  const input = document.createElement('input')
  input.value = prefix
  inputLabel.append('前缀:', input)
  input.addEventListener('blur', () => {
    changeProp(id, 'prefix', input.value)
  })

  const optionLabel = document.createElement('label')
  const select = document.createElement('select')

  select.addEventListener('change', event => {
    changeType(event, id)
  })

  const newTab = document.createElement('option')
  newTab.value = 'newTab'
  newTab.selected = type === 'newTab'
  newTab.innerText = '新标签'

  const board = document.createElement('option')
  board.value = 'board'
  board.selected = type === 'board'
  board.innerText = '剪切板'

  select.append(newTab, board)
  optionLabel.append('打开方式:', select)

  div.append(nameLabel, inputLabel, optionLabel, delButton)
  return div
}

function changeType(event, id) {

}

function changeProp(id, key, value) {
  const index = prefixList.findIndex(p => p.id === id)
  if (index === -1) return
  const target = prefixList[index]
  target[key] = value
  savePrefix()
}

function init() {
  const divs = prefixList.map(p => newItem(p.id + '', p.prefix, p.type, p.name))
  inputContainer.append(...divs)
}

function addItem() {
  const curr = id++
  prefixList.push({ prefix: '', type: "newTab", id: curr + '', name: '' })
  inputContainer.append(newItem(curr + '', '', 'newTab', ''))
  savePrefix()
}

function deleteItem(id) {
  const index = prefixList.findIndex(p => p.id === id)
  if(id === -1) return
  prefixList.splice(index, 1)
  inputContainer.children.item(index).remove()
  savePrefix()
}

async function savePrefix() {
  updateMenu()
  await chrome.storage.sync.set({ prefix: JSON.stringify(prefixList) })
}

function updateMenu() {
  chrome.contextMenus.removeAll()
  prefixList.forEach(p => {
    if(p.name) {
      chrome.contextMenus.create({
        id: p.id + '',
        title: p.name,
        contexts: ['selection']
      })
    }
  })
}
