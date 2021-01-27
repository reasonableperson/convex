import DB from './db.js'
import UI from './ui.js'

// Disable the browser's built-in functionality. When a user drags a PDF onto
// the window, it should be uploaded, not displayed.
// Reference: https://stackoverflow.com/a/6756680/1402935
const ignoreEvent = function (e) { e = e || event; e.preventDefault() }
window.addEventListener('dragover', ignoreEvent)
window.addEventListener('drop', ignoreEvent)

// Add a class to the body when dragging.
var dragCount = 0
window.addEventListener('dragenter', function () {
  // The cursor may drag into an element, then into one of its child elements.
  // Keep track of the 'depth' of the drag event.
  dragCount = dragCount + 1
  document.body.classList.add('drag')
})

window.addEventListener('dragleave', function () {
  dragCount = dragCount - 1
  // Only when the cursor has left the screen altogether ('clearing' all
  // previous dragenter events) should we disable the overlay.
  if (dragCount == 0) document.body.classList.remove('drag')
})

window.addEventListener('drop', function (event) {
  event.preventDefault()
  document.body.classList.remove('drag')
  const files = event.dataTransfer.files
  if (files.length != 1) {
    //alert('Please drag just one file.')
    console.error('bad FileList', files)
  }
  else loadExcel(files[0])
})

const findHeaderRow = sheet => {
  const rowLengths = XLSX.utils.sheet_to_json(sheet, {header: 1})
    .slice(0, 10).map(row => row.length)
  const skipRows = rowLengths.indexOf(Math.max(...rowLengths))
  return skipRows
}

const loadExcel = async function (file) {
  console.log('loading', file)
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })
  ui.updateNavigation(workbook.SheetNames)
  Object.entries(workbook.Sheets).forEach(([sheetName, sheet]) => {
    const json = XLSX.utils.sheet_to_json(sheet, {
      range: findHeaderRow(sheet)
    })
    const html = XLSX.utils.sheet_to_html(sheet, {
      range: findHeaderRow(sheet)
    })
    console.log(sheetName, json)
    document.querySelector('#main').innerHTML = html
  })
}

const db = new DB
const ui = new UI(db)
