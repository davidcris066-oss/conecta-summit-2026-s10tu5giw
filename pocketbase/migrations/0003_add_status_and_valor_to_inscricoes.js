migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('inscricoes')

    if (!col.fields.getByName('status')) {
      col.fields.add(
        new SelectField({
          name: 'status',
          required: false,
          values: ['pendente', 'confirmado', 'cancelado'],
          maxSelect: 1,
        }),
      )
    }

    if (!col.fields.getByName('valor')) {
      col.fields.add(
        new NumberField({
          name: 'valor',
          required: false,
          min: 0,
        }),
      )
    }

    app.save(col)

    // After collection schema is saved with new columns, set default value for existing records
    try {
      app
        .db()
        .newQuery(`
        UPDATE inscricoes 
        SET status = 'pendente' 
        WHERE status IS NULL OR status = ''
      `)
        .execute()
    } catch (_) {}
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('inscricoes')
      const statusField = col.fields.getByName('status')
      if (statusField) {
        col.fields.remove(statusField)
      }
      const valorField = col.fields.getByName('valor')
      if (valorField) {
        col.fields.remove(valorField)
      }
      app.save(col)
    } catch (_) {}
  },
)
