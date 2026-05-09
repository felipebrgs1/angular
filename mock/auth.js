module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/login') {
    const { email, password } = req.body;
    const db = JSON.parse(require('fs').readFileSync('./mock/db.json', 'utf-8'));
    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const { password: _, ...safe } = user;
    return res.status(200).json({
      token: 'mock-jwt-' + user.id + '-' + Date.now(),
      user: safe,
    });
  }

  if (req.method === 'POST' && req.path === '/register') {
    const { name, email, password } = req.body;
    const db = JSON.parse(require('fs').readFileSync('./mock/db.json', 'utf-8'));

    if (db.users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const newUser = {
      id: String(db.users.length + 1),
      name,
      email,
      password,
      role: 'buyer',
    };

    db.users.push(newUser);
    require('fs').writeFileSync('./mock/db.json', JSON.stringify(db, null, 2));

    const { password: _, ...safe } = newUser;
    return res.status(201).json({
      token: 'mock-jwt-' + newUser.id + '-' + Date.now(),
      user: safe,
    });
  }

  if (req.method === 'GET' && req.path === '/auth/me') {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const db = JSON.parse(require('fs').readFileSync('./mock/db.json', 'utf-8'));
    const userId = auth.split('-')[1];
    const user = db.users.find(u => u.id === userId);

    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const { password: _, ...safe } = user;
    return res.status(200).json(safe);
  }

  next();
};
