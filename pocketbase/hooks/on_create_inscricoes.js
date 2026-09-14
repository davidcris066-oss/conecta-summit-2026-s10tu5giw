// Hook onRecordCreateRequest for inscricoes collection to validate duplicate email with friendly message
onRecordCreateRequest((e) => {
  const body = e.requestInfo().body
  if (body && body.email) {
    const email = String(body.email).trim().toLowerCase()
    try {
      const existing = $app.findFirstRecordByData('inscricoes', 'email', email)
      if (existing) {
        throw new BadRequestError('Este e-mail já está inscrito no Conecta Summit 2026.')
      }
    } catch (err) {
      // If error is BadRequestError rethrow it
      if (err && err.name === 'BadRequestError') {
        throw err
      }
      // "sql: no rows in result set" means not found, which is what we want
    }
  }
  e.next()
}, 'inscricoes')
