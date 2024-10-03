const responses = {
    greetings: [
        "Olá! Como posso ajudar hoje?",
        "Oi! Tudo bem com você? O que gostaria de saber?",
        "Bem-vindo! Estou aqui para te ajudar com nossos serviços."
    ],
    services: [
        "Nós oferecemos pacotes de turismo personalizados para várias regiões.",
        "Nossos serviços incluem reservas de hotéis, pacotes turísticos e guias locais.",
        "Quer saber mais sobre nossos pacotes? Temos ofertas exclusivas!"
    ],
    general: [
        "Posso te ajudar com mais alguma coisa?",
        "Fique à vontade para perguntar o que precisar!",
        "Se precisar de mais informações, estou aqui para ajudar."
    ]
};
const conversations = {};
export const createChat = (req, res) => {
    const { userMessage } = req.body;
    let botResponse = "Desculpa não entendi sua pergunta";
    const conversationId = Object.keys(conversations).length + 1;
    const botMessage = getRandomMessage("greetings");
    conversations[conversationId] = [
        { sender: 'User', text: userMessage },
        { sender: 'Bot', text: botMessage }
    ];
    res.status(201).send({ message: botMessage, conversationId });
    res.json({ botResponse });
};
export const replyChat = (req, res) => {
    const chatId = req.params.id;
    const { userMessage } = req.body;
    if (conversations[chatId]) {
        const botResponse = getRandomMessage("services");
        conversations[chatId].push({ sender: 'User', text: userMessage });
        conversations[chatId].push({ sender: 'Bot', text: botResponse });
        res.status(200).send({ message: botResponse });
    }
    else {
        res.status(404).send({ error: "Conversa não encontrada." });
    }
};
export const getChat = (req, res) => {
    const chatId = req.params.id;
    const conversation = conversations[chatId];
    if (conversation) {
        res.status(200).send({ id: chatId, messages: conversation });
    }
    else {
        res.status(404).send({ error: 'Conversa não encontrada.' });
    }
};
export const createTicket = (req, res) => {
    res.status(201).send({ message: "Ticket de suporte criado." });
};
export const getTicket = (req, res) => {
    const ticketId = req.params.id;
    res.status(200).send({ message: `Detalhes do ticket ${ticketId}.` });
};
const getRandomMessage = (category) => {
    const messages = responses[category];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
};
