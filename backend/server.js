import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Pampa & Poeira API',
        version: '1.0.0',
        description: 'Documentação da API do e-commerce Pampa & Poeira',
    },
    servers: [
        {
            url: VITE_API_URL,
            description: 'Servidor teste be',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./server.js'], // Caminho para os comentários JSDoc das rotas
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Operações relacionadas aos produtos
 *   - name: Pedidos
 *     description: Operações relacionadas aos pedidos
 *
 * /api/produtos:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *   post:
 *     tags: [Produtos]
 *     summary: Cria um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Produto criado
 *
 * /api/produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Busca um produto pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *   put:
 *     tags: [Produtos]
 *     summary: Atualiza um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Produto atualizado
 *   delete:
 *     tags: [Produtos]
 *     summary: Deleta um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto deletado
 *
 * /api/orders:
 *   get:
 *     tags: [Pedidos]
 *     summary: Lista todos os pedidos
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por status do pedido
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filtrar por usuário
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *
 * /api/orders/{id}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Busca um pedido pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *   put:
 *     tags: [Pedidos]
 *     summary: Atualiza um pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pedido atualizado
 *   delete:
 *     tags: [Pedidos]
 *     summary: Deleta um pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pedido deletado
 *
 * /api/carrinho/{user_id}:
 *   get:
 *     tags: [Carrinho]
 *     summary: Lista os itens do carrinho de um usuário
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de itens do carrinho
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *
 * @swagger
 * /api/cart:
 *   post:
 *     tags: [Carrinho]
 *     summary: Adiciona um item ao carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item adicionado ao carrinho
 *
 * /api/cart/{item_id}:
 *   delete:
 *     tags: [Carrinho]
 *     summary: Remove um item do carrinho
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removido do carrinho
 *   put:
 *     tags: [Carrinho]
 *     summary: Atualiza a quantidade de um item do carrinho
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantidade atualizada
 *
 * /api/cart/user/{user_id}:
 *   delete:
 *     tags: [Carrinho]
 *     summary: Limpa o carrinho do usuário
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Carrinho limpo
 */

// Produtos
app.get('/api/produtos', async (req, res) => {
    const { data, error } = await supabase.from('produtos').select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.get('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/api/produtos', async (req, res) => {
    const { data, error } = await supabase.from('produtos').insert([req.body]).single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

app.put('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('produtos').update(req.body).eq('id', id).single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.delete('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
});

// Ordens
app.get('/api/orders', async (req, res) => {
    const { status, user_id } = req.query;
    let query = supabase.from('orders').select('*');
    if (status) query = query.eq('status', status);
    if (user_id) query = query.eq('user_id', user_id);
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.get('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('orders').update(req.body).eq('id', id).single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
});

// Carrinho
app.get('/api/cart/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:produtos(*)') // ou product:produtos(*)
        .eq('user_id', user_id);

    if (error) {
        console.error('Erro ao buscar carrinho:', error);
        return res.status(400).json({ error: error.message });
    }
    res.json(data);
});

// Adicionar item ao carrinho
app.post('/api/cart', async (req, res) => {
    try {
        const { user_id, product_id, quantity, size, color } = req.body;

        if (!user_id || !product_id || !quantity || !size || !color) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const { data, error } = await supabase
            .from('cart_items')
            .insert([{ user_id, product_id, quantity, size, color }])
            .select()
            .single();

        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Remover item do carrinho
app.delete('/api/cart/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item_id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
});

// Atualizar quantidade do item
app.put('/api/cart/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const { quantity } = req.body;
    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', item_id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).send();
});

// Limpar carrinho do usuário
app.delete('/api/cart/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user_id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
});

// Nova Coleção 
app.get('/api/nova-colecao', async (req, res) => {
    const { data, error } = await supabase.from('produtos').select('*').eq('nova_colecao', true);
    console.log('Nova coleção:', data, error);
    if (error) return res.status(400).json({ error: error.message });
    console.log('Nova coleção:', data);
    res.json(data);
});

// Lançamentos
app.get('/api/featured', async (req, res) => {
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('lancamento', true)
        .order('created_at', { ascending: false })
        .limit(4);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));