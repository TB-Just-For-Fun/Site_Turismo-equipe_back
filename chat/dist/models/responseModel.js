// models/Response.ts
import mongoose, { Schema } from 'mongoose';
// Definindo o esquema de mongoose com base na interface
const ResponseSchema = new Schema({
    intent: { type: String, required: true },
    keywords: { type: [String], required: true },
    text: { type: String, required: true }
});
export const responses = {
    intent: "greetings",
    greetings: [
        "👋 Oi! Como posso te ajudar hoje?",
        "🌟 Olá! Bem-vindo ao Just for Fund, o que posso fazer por você?",
        "😊 Saudações! O que você gostaria de saber sobre turismo em Angola?",
        "🙌 Oi, viajante! Estou aqui para ajudar com qualquer dúvida.",
        "👋 Olá! Pronto para explorar as maravilhas de Angola?"
    ],
    aboutUs: [
        "🌍 O Just for Fund é uma plataforma dedicada ao turismo em Angola, trazendo as melhores experiências.",
        "💼 Somos especialistas em turismo em Angola, focados em criar experiências inesquecíveis.",
        "🌟 Nossa missão é garantir que você tenha as melhores memórias de viagem por Angola.",
        "🚀 Explore o melhor de Angola com o Just for Fund – seu guia de aventuras.",
        "🌄 Quer descobrir o que Angola tem de melhor? Estamos aqui para te ajudar!",
        "💡 Nós oferecemos pacotes turísticos exclusivos para os locais mais fascinantes de Angola."
    ],
    location: [
        "📍 Estamos localizados em Lubango, na província da Huíla, cercados pelas paisagens incríveis da Serra da Chela.",
        "🌄 Nossa base é em Lubango, no coração da Huíla, próximo a maravilhas como a Fenda da Tundavala e o Cristo Rei.",
        "🏞️ Se você estiver por Lubango, visite nossa sede e explore os pontos turísticos nas proximidades, como a Humpata e o Namibe.",
        "📍 Estamos localizados no Lubango, pronto para te guiar pelas maravilhas do sul de Angola.",
        "🚗 Nossa localização é estratégica para visitar os parques nacionais e praias do Namibe.",
        "🌿 Em Lubango, você encontrará acesso fácil a belezas naturais como a Cascata da Huíla."
    ],
    services: [
        "🛏️ Oferecemos pacotes turísticos, reservas de hotéis e passeios guiados em várias regiões de Angola.",
        "🚗 Nossos serviços incluem passeios guiados, reservas de hospedagem e aventuras personalizadas.",
        "📦 Você pode contar conosco para hospedagem, passeios e pacotes personalizados para a sua viagem.",
        "🌄 Planeje sua próxima aventura em Angola conosco! Reservas de hotéis, pacotes turísticos e muito mais.",
        "📅 Faça já sua reserva com a gente e explore o melhor de Angola!",
        "🔍 Oferecemos roteiros personalizados para explorar o melhor do Namibe e da Serra da Leba."
    ],
    tourism: [
        "🌍 Angola oferece destinos incríveis como a Fenda da Tundavala, o Deserto do Namibe e as Quedas de Kalandula.",
        "🏞️ Que tal conhecer o Parque Nacional da Quiçama ou as praias do Namibe? Posso te ajudar a planejar.",
        "🌊 Se você adora o mar, temos pacotes que exploram as praias intocadas de Moçâmedes e Baía dos Tigres.",
        "🌄 As maravilhas naturais de Angola, como o Monte Moco e o Planalto da Huíla, são destinos imperdíveis.",
        "🚶‍♂️ Vamos explorar o turismo em Angola? Oferecemos tours guiados para os melhores destinos.",
        "🦓 Descubra os animais selvagens nos parques do Namibe e Quiçama!"
    ],
    reservations: [
        `📝 Faça suas reservas diretamente no nosso site. Acesse nossa página de 
    <a href='https://justforfund.com/reservas' 
       style="display: inline-block; color: #ffffff; background-color: #0066cc; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;"
       target="_blank">Reservas</a>.`,
        "🛎️ Pronto para fazer uma reserva? É só acessar nosso site e garantir sua vaga nas melhores aventuras.",
        "📅 Precisa reservar um hotel ou um pacote turístico? Acesse nossa plataforma de reservas e escolha seu destino.",
        "📝 Quer garantir sua viagem? Nosso sistema de reservas online facilita o planejamento da sua viagem.",
        "📅 Agende sua próxima aventura com a gente. Acesse nossa página de reservas e escolha o melhor pacote."
    ],
    contact: [
        `📞 Precisa de mais informações? Visite nossa página de 
    <a href='https://justforfund.com/contato'
       style="display: inline-block; color: #ffffff; background-color: #00cc66; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;"
       target="_blank">Contato</a>.`,
        "📞 Se precisar de mais assistência, nossa página de contato está disponível para ajudar.",
        "📧 Quer falar diretamente com nossa equipe? Visite a página de contato e mande sua mensagem.",
        "☎️ Para suporte adicional, entre em contato conosco por meio do formulário disponível no site.",
        "📲 Pode nos chamar no chat ou visitar a nossa página de contato para assistência personalizada."
    ],
    calendar: [
        `📅 Para ver a disponibilidade de pacotes, consulte nosso 
    <a href='https://justforfund.com/calendario'
       style="display: inline-block; color: #ffffff; background-color: #ff9933; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;"
       target="_blank">Calendário</a>.`,
        "📅 Confira o calendário de eventos e pacotes disponíveis na nossa página e escolha a melhor data para sua viagem.",
        "📅 Agende seu próximo passeio conforme nosso calendário de disponibilidade. Escolha já a data ideal!",
        "📅 Explore o calendário de pacotes turísticos e veja as datas disponíveis para reservar seu próximo destino.",
        "📆 Quer saber as datas disponíveis para sua viagem? Consulte nosso calendário online e faça sua reserva."
    ],
    additionalInfo: [
        `🔍 Veja mais sobre nossos serviços e pacotes especiais em: 
      <a href='https://justforfund.com/servicos'
         style="display: inline-block; color: #ffffff; background-color: #ff66b2; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;"
         target="_blank">Serviços</a>.`,
        "💼 Temos mais detalhes sobre nossos pacotes e serviços na página de informações adicionais.",
        "📖 Saiba mais sobre os serviços e opções de pacotes disponíveis acessando nosso site.",
        "📝 Quer mais informações sobre nossos pacotes turísticos? Confira a página de serviços e escolha o melhor para você.",
        "🔍 Está buscando mais detalhes sobre nossos serviços? Visite a página de serviços e descubra tudo o que oferecemos."
    ],
    prices: [
        "💰 Nossos preços são competitivos e variam conforme o pacote. Consulte nosso site para detalhes.",
        "🤑 Oferecemos uma variedade de pacotes com preços acessíveis. Confira nossas ofertas especiais!",
        "💵 Para mais informações sobre preços, visite nossa página de pacotes turísticos e descubra opções que cabem no seu bolso.",
        "🤑 Temos pacotes que se ajustam a diferentes orçamentos. Entre em contato para uma proposta personalizada.",
        "💲 Acesse nosso site para ver a tabela de preços dos pacotes disponíveis."
    ],
    packages: [
        "📦 Temos pacotes incríveis para explorar as belezas de Angola. Confira nossas opções no site!",
        "🎒 Explore nossos pacotes que incluem hospedagem, transporte e atividades turísticas.",
        "📊 Veja nossas ofertas de pacotes turísticos, com opções para todos os gostos e orçamentos.",
        "🏖️ Descubra pacotes que combinam relaxamento e aventura, perfeitos para qualquer viajante.",
        "🗺️ Consulte nossos pacotes personalizados que se adaptam às suas necessidades e preferências."
    ],
    faq: [
        "❓ Pergunta: Como faço uma reserva? Resposta: Você pode fazer uma reserva diretamente em nosso site na seção de reservas.",
        "❓ Pergunta: Quais são os métodos de pagamento aceitos? Resposta: Aceitamos cartões de crédito, transferências e pagamentos em dinheiro.",
        "❓ Pergunta: Posso cancelar minha reserva? Resposta: Sim, é possível cancelar sua reserva. Consulte nossa política de cancelamento.",
        "❓ Pergunta: Existem pacotes para grupos? Resposta: Sim, oferecemos pacotes especiais para grupos. Entre em contato para mais informações.",
        "❓ Pergunta: Qual é a política de reembolso? Resposta: Nossos reembolsos seguem a política descrita em nosso site."
    ],
    feedback: [
        "📝 Adoraríamos saber sua opinião! Deixe seu feedback na nossa página de contato.",
        "📢 Sua experiência é importante para nós! Compartilhe seu feedback e ajude-nos a melhorar.",
        "✨ Estamos sempre buscando formas de melhorar! Envie seu feedback através do nosso formulário.",
        "🗣️ Gostou dos nossos serviços? Diga-nos o que você achou, suas opiniões são valiosas para nós.",
        "🤝 Seu feedback nos ajuda a crescer. Fique à vontade para nos contar sobre sua experiência!"
    ],
    hours: [
        "🕒 Estamos abertos de segunda a sexta, das 9h às 18h.",
        "📅 Nossos horários de funcionamento são de segunda a sexta, das 9h às 18h. Venha nos visitar!",
        "🕘 O horário de atendimento é de segunda a sexta, das 9h às 18h. . Esperamos por você!"
    ],
    help: [
        "Aqui estão algumas opções de como posso te ajudar: \n1. Conhecer sobre nós \n2. Ver pacotes turísticos \n3. Agendar uma reserva",
    ],
    randomResponses: [
        "🤔 Essa é uma pergunta interessante! Que tal explorar mais sobre os pontos turísticos?",
        "😊 Não tenho certeza sobre isso, mas posso ajudar com informações sobre turismo.",
        "🙃 Essa é nova! Enquanto isso, que tal conhecer a Fenda da Tundavala?",
        "🌟 Que pergunta única! Vamos falar sobre as maravilhas de Angola?",
        "🎯 Enquanto eu verifico sua dúvida, que tal conferir nossos pacotes especiais?"
    ]
};
export const faqQuestions = [
    // Pacotes turísticos (tourism)
    {
        question: "Quais são os pacotes turísticos disponíveis?",
        category: "tourism"
    },
    {
        question: "O que está incluído nos pacotes turísticos para o Namibe?",
        category: "tourism"
    },
    {
        question: "Existem descontos para grupos em pacotes turísticos?",
        category: "tourism"
    },
    {
        question: "Quais atividades estão disponíveis nos pacotes para a Humpata?",
        category: "tourism"
    },
    {
        question: "Os pacotes turísticos incluem guias?",
        category: "tourism"
    },
    {
        question: "Os pacotes turísticos incluem refeições?",
        category: "tourism"
    },
    {
        question: "Como faço para personalizar um pacote turístico?",
        category: "tourism"
    },
    {
        question: "Há pacotes turísticos para famílias?",
        category: "tourism"
    },
    {
        question: "Qual é o melhor pacote para explorar Lubango?",
        category: "tourism"
    },
    {
        question: "Quais os pacotes disponíveis para estudantes?",
        category: "tourism"
    },
    {
        question: "É possível modificar um pacote turístico após a compra?",
        category: "tourism"
    },
    {
        question: "Quais são os pacotes turísticos mais populares?",
        category: "tourism"
    },
    // Reservas (reservations)
    {
        question: "Como faço para fazer uma reserva?",
        category: "reservations"
    },
    {
        question: "É possível cancelar uma reserva?",
        category: "reservations"
    },
    {
        question: "Quais são as políticas de cancelamento de reserva?",
        category: "reservations"
    },
    {
        question: "Como confirmar uma reserva?",
        category: "reservations"
    },
    {
        question: "Quais formas de pagamento são aceitas para reservas?",
        category: "reservations"
    },
    {
        question: "É necessário pagar um sinal para reservar?",
        category: "reservations"
    },
    {
        question: "Posso transferir minha reserva para outra pessoa?",
        category: "reservations"
    },
    {
        question: "Existe algum custo adicional para reservas de última hora?",
        category: "reservations"
    },
    {
        question: "Posso reservar pacotes com antecedência?",
        category: "reservations"
    },
    {
        question: "Como modificar uma reserva já realizada?",
        category: "reservations"
    },
    // Hotéis (hotels)
    {
        question: "Quais são os melhores hotéis em Lubango?",
        category: "hotels"
    },
    {
        question: "Quais hotéis oferecem café da manhã incluído?",
        category: "hotels"
    },
    {
        question: "Existem hotéis com piscina na Humpata?",
        category: "hotels"
    },
    {
        question: "Os hotéis têm Wi-Fi gratuito?",
        category: "hotels"
    },
    {
        question: "Quais hotéis são pet-friendly?",
        category: "hotels"
    },
    {
        question: "Há hotéis próximos aos parques nacionais em Angola?",
        category: "hotels"
    },
    {
        question: "Quais hotéis são recomendados para famílias?",
        category: "hotels"
    },
    {
        question: "Posso fazer uma reserva diretamente com o hotel?",
        category: "hotels"
    },
    {
        question: "Quais hotéis possuem restaurantes de alta qualidade?",
        category: "hotels"
    },
    {
        question: "Existem hotéis que oferecem transporte gratuito para o aeroporto?",
        category: "hotels"
    },
    // Locais (location)
    {
        question: "Quais são os melhores locais para visitar em Angola?",
        category: "location"
    },
    {
        question: "Quais as principais atrações no Namibe?",
        category: "location"
    },
    {
        question: "Há cachoeiras próximas ao Lubango?",
        category: "location"
    },
    {
        question: "O que posso fazer no Parque Nacional da Quiçama?",
        category: "location"
    },
    {
        question: "Quais sítios turísticos são recomendados para um dia?",
        category: "location"
    },
    {
        question: "Há atividades para crianças nos sítios turísticos?",
        category: "location"
    },
    {
        question: "Existem trilhas para caminhada nas redondezas?",
        category: "location"
    },
    {
        question: "Onde posso ver vida selvagem em Angola?",
        category: "location"
    },
    {
        question: "Qual é a melhor época para visitar o Parque Nacional de Iona?",
        category: "location"
    },
    // Contato (contact)
    {
        question: "Como faço para entrar em contato com vocês?",
        category: "contact"
    },
    {
        question: "Qual é o número de telefone para suporte?",
        category: "contact"
    },
    {
        question: "Vocês têm um endereço de e-mail para atendimento?",
        category: "contact"
    },
    {
        question: "Onde posso encontrar o escritório de vocês?",
        category: "contact"
    },
    {
        question: "Quais são os horários de atendimento?",
        category: "contact"
    },
    {
        question: "Há suporte disponível em outros idiomas?",
        category: "contact"
    },
    // Serviços (services)
    {
        question: "Quais são as opções de transporte disponíveis?",
        category: "services"
    },
    {
        question: "Vocês oferecem serviços de transfer do aeroporto?",
        category: "services"
    },
    {
        question: "É possível alugar um carro com motorista?",
        category: "services"
    },
    {
        question: "Há opções de transporte para grandes grupos?",
        category: "services"
    },
    {
        question: "Vocês fornecem equipamentos para atividades ao ar livre?",
        category: "services"
    },
    {
        question: "Há opções de transporte para os parques naturais?",
        category: "services"
    },
    // Feedback
    {
        question: "Como posso enviar feedback sobre os serviços?",
        category: "feedback"
    },
    {
        question: "Posso sugerir melhorias para os pacotes turísticos?",
        category: "feedback"
    },
    {
        question: "Como minha opinião será utilizada por vocês?",
        category: "feedback"
    },
    {
        question: "Onde posso deixar uma avaliação pública?",
        category: "feedback"
    },
    {
        question: "Vocês têm algum sistema de recompensas para feedbacks?",
        category: "feedback"
    },
    // Outros
    {
        question: "Quais são os horários de funcionamento?",
        category: "hours"
    },
    {
        question: "Vocês oferecem promoções ou descontos sazonais?",
        category: "general"
    },
    {
        question: "Há guias turísticos que falam inglês?",
        category: "services"
    },
    {
        question: "Como posso fazer uma reclamação formal?",
        category: "general"
    },
    {
        question: "Quais são as condições para pacotes exclusivos?",
        category: "general"
    }
];
const Response = mongoose.model('Response', ResponseSchema);
export default Response;
