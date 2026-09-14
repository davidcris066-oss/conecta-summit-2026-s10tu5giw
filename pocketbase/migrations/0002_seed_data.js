migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Seed superuser / auth user if not exists
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'magnumcontabeis@gmail.com')
    } catch (_) {
      const adminUser = new Record(users)
      adminUser.setEmail('magnumcontabeis@gmail.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Magnum Nascimento')
      app.save(adminUser)
    }

    // Seed initial sample leads in inscricoes
    const inscricoes = app.findCollectionByNameOrId('inscricoes')

    const sampleLeads = [
      {
        nome: 'Carlos Andrade',
        email: 'carlos.andrade@email.com',
        telefone: '(93) 98123-4567',
      },
      {
        nome: 'Mariana Souza',
        email: 'mariana.souza@email.com',
        telefone: '(93) 98456-7890',
      },
      {
        nome: 'Rafael Mendes',
        email: 'rafael.mendes@email.com',
        telefone: '(93) 99122-3344',
      },
    ]

    for (const lead of sampleLeads) {
      try {
        app.findFirstRecordByData('inscricoes', 'email', lead.email)
      } catch (_) {
        const rec = new Record(inscricoes)
        rec.set('nome', lead.nome)
        rec.set('email', lead.email)
        rec.set('telefone', lead.telefone)
        app.save(rec)
      }
    }
  },
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'magnumcontabeis@gmail.com')
      app.delete(user)
    } catch (_) {}

    try {
      const inscricoes = app.findCollectionByNameOrId('inscricoes')
      const emails = [
        'carlos.andrade@email.com',
        'mariana.souza@email.com',
        'rafael.mendes@email.com',
      ]
      for (const email of emails) {
        try {
          const r = app.findFirstRecordByData('inscricoes', 'email', email)
          app.delete(r)
        } catch (_) {}
      }
    } catch (_) {}
  },
)
