let qs = require('querystring')

exports.sendHtml = (res, html) => {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

exports.parseReceivedData = (req, callback) => {
  let body = ''
  req.setEncoding('utf8')
  req.on('data', chunk => {
    body += chunk
  })
  req.on('end', () => {
    let data = qs.parse(body)
    callback(data)
  })
}

exports.actionForm = (id, path, label) => {
  let html = `
  <form method="post" action="${path}">
    <input type="hidden" name="id" value="${id}" />
    <input type="submit" value="${label}" />
  </form>
  `
  return html
}

exports.add = (db, req, res) => {
  exports.parseReceivedData(req, work => {
    db.query(
    'INSERT INTO work (hours, date, description) VALUES (?, ?, ?)',
    [work.hours, work.date, work.description],
    err => {
      if(err){
        throw err
      }
      exports.show(db, res)
    })
  })
}

exports.delete = (db, req, res) => {
  exports.parseReceivedData(req, work => {
    db.query(
      'DELETE FROM work WHERE id=?',
      [work.id],
      err => {
        if(err){
          throw err
        }
        exports.show(db, res)
      }
    )
  })
}

exports.archive = (db, req, res) => {
  exports.parseReceivedData(req, work => {
    db.query(
      'UPDATE work SET archived=1 WHERE id=?',
      [work.id],
      err => {
        if(err){
          throw err
        }
        exports.show(db, res)
      }
    )
  })
}

exports.show = (db, res, showArchived) => {
  let query = 'SELECT FROM work WHERE archived=? ORDER BY date DESC'
  let archiveValue = showArchived ? 1 : 0
  db.query(
    query,
    [archiveValue],
    (err, rows) => {
      if(err){
        throw err
      }
      let html = showArchived ?
      '' : 
      `
      <a href="/archived">Archived Work</a>
      <br/>
      `
      html += exports.workHitlistHtml(rows)
      html += exports.workFormHtml()
      exports.sendHtml(res, html)
    }
  )
}

exports.showArchived = (db, res) => {
  exports.show(db, res, true)
}

exports.workHitlistHtml = rows => {
  let html = `
  <table>
    ${rows.map(item => {
      if(!item.archived){
        return `
        <tr>
          <td>${item.date}</td>
          <td>${item.hours}</td>
          <td>${item.description}</td>
          <td>${exports.workArchiveForm(rows[i].id)}</td> 
        </tr>
        `
      }
      else{
        return `
        <tr>
        <td>${item.date}</td>
        <td>${item.hours}</td>
        <td>${item.description}</td>
        <td>${exports.workDeleteForm(rows[i].id)}</td> 
      </tr>
        `
      }
    })}
  </table>
  `
  return html
}

exports.workFormHtml = () => {
  const html = `
  <form>
    <p>
      Date (YYYY-MM-DD): <br/>
      <input name="date" type="text" />
    </p>
    <p>
      Hours worked: <br/>
      <input name="hours" type="text" />
    </p>
    <p>
      Description: <br/>
      <textarea name="description">
      </textarea>
    </p>
    <input type="submit" value="Add" /> 
  </form>
  `
  return html
} 

exports.workArchiveForm = id => exports.actionForm(id, '/archive', 'Archive')

exports.workDeleteForm = id => exports.actionForm(id, '/delete', 'Delete')