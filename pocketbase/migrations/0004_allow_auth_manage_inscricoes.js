migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('inscricoes')

    // Allow authenticated users to list, view, and update registrations
    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    col.updateRule = "@request.auth.id != ''"
    // Keep createRule public so landing page visitors can register
    col.createRule = ''
    // Allow authenticated users to delete registrations if needed
    col.deleteRule = "@request.auth.id != ''"

    app.save(col)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('inscricoes')
      col.listRule = null
      col.viewRule = null
      col.updateRule = null
      col.deleteRule = null
      app.save(col)
    } catch (_) {}
  },
)
