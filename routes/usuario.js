const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// GET - Listar todos
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ dataCadastro: -1 });
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// GET - Buscar por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// POST - Criar novo
router.post('/', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (erro) {
    if (erro.code === 11000) {
      res.status(400).json({ erro: 'Email já cadastrado' });
    } else {
      res.status(400).json({ erro: erro.message });
    }
  }
});

// PUT - Atualizar
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});

// DELETE - Excluir
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;