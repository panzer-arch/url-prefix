let prefixList = []
chrome.storage.sync.get("prefix", ({ prefix }) => {
  if(!prefix) return
  prefixList = JSON.parse(prefix).map((p, i) => ({...p, id: i + ''}))
  updateMenu()
});
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
chrome.contextMenus.onClicked.addListener(async info => {
  const text = info.selectionText
  const { prefix } = await chrome.storage.sync.get('prefix')
  if(!prefix) return
  const list = JSON.parse(prefix)
  const target = list.find(p => p.id === info.menuItemId)
  if(!target) return
  await chrome.tabs.create({ url: target.prefix + text, active: true })
})
