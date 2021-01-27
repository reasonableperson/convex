const nav = sheetNames => {
  console.log('rendering nav from', sheetNames)
  const el = document.createElement('nav')
  sheetNames.forEach(sheetName => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.innerText = sheetName
    a.href = '#' + sheetName
    li.appendChild(a)
    el.appendChild(li)
  })
  return el
}

const replace = (selector, element) => {
  console.log('replacing', selector, 'with', element)
  document.querySelector(selector).replaceWith(element)
}

export default class UI {
  constructor(db) {
    console.log('initialising UI with', db)
  }
  updateNavigation(sheetNames) {
    replace('nav', nav(sheetNames))
  }
  renderTable(table) {
  }
}
