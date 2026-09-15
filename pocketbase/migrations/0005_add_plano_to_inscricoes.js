migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('inscricoes')

    if (!col.fields.getByName('plano')) {
      col.fields.add(
        new SelectField({
          name: 'plano',
          required: false,
          values: ['vip', 'premium', 'start'],
          maxSelect: 1,
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('inscricoes')
      const planoField = col.fields.getByName('plano')
      if (planoField) {
        col.fields.remove(planoField)
      }
      app.save(col)
    } catch (_) {}
  },
)
