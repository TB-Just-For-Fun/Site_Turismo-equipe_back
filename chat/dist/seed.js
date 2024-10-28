// seed.ts
import mongoose from 'mongoose';
import Response from './models/chatModel'; // Importe o modelo Response
import connectDatabase from './database/db.js'; // Importe sua conexão com o banco de dados
// Respostas automáticas e variações
export const responses = {
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
        "🌄 Quer descobrir o que Angola tem de melhor? Estamos aqui para te ajudar!"
    ],
    location: [
        "📍 Estamos localizados em Lubango, na província da Huíla, cercados pelas paisagens incríveis da Serra da Chela.",
        "🌄 Nossa base é em Lubango, no coração da Huíla, próximo a maravilhas como a Fenda da Tundavala e o Cristo Rei.",
        "🏞️ Se você estiver por Lubango, visite nossa sede e explore os pontos turísticos nas proximidades, como a Humpata e o Namibe.",
        "📍 Estamos localizados no Lubango, pronto para te guiar pelas maravilhas do sul de Angola.",
        "🚗 A nossa localização é estratégica para visitar os parques nacionais e praias do Namibe."
    ],
    services: [
        "🛏️ Oferecemos pacotes turísticos, reservas de hotéis e passeios guiados em várias regiões de Angola.",
        "🚗 Nossos serviços incluem passeios guiados, reservas de hospedagem e aventuras personalizadas.",
        "📦 Você pode contar conosco para hospedagem, passeios e pacotes personalizados para a sua viagem.",
        "🌄 Planeje sua próxima aventura em Angola conosco! Reservas de hotéis, pacotes turísticos e muito mais.",
        "📅 Faça já sua reserva com a gente e explore o melhor de Angola!"
    ],
    tourism: [
        "🌍 Angola oferece destinos incríveis como a Fenda da Tundavala, o Deserto do Namibe e as Quedas de Kalandula.",
        "🏞️ Que tal conhecer o Parque Nacional da Quiçama ou as praias do Namibe? Posso te ajudar a planejar.",
        "🌊 Se você adora o mar, temos pacotes que exploram as praias intocadas de Moçâmedes e Baía dos Tigres.",
        "🌄 As maravilhas naturais de Angola, como o Monte Moco e o Planalto da Huíla, são destinos imperdíveis.",
        "🚶‍♂️ Vamos explorar o turismo em Angola? Oferecemos tours guiados para os melhores destinos."
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
    ]
};
// Função para popular o banco de dados com respostas
async function seedDatabase() {
    try {
        await connectDatabase(); // Conectar ao banco de dados
        // Limpe a coleção antes de inserir novos dados
        await Response.deleteMany({});
        console.log("Coleção 'responses' limpa!");
        for (const [category, messages] of Object.entries(responses)) {
            const response = new Response({
                category,
                messages
            });
            await response.save();
            console.log(`Respostas para a categoria "${category}" salvas com sucesso.`);
        }
        console.log("Todas as respostas foram salvas no banco de dados!");
    }
    catch (error) {
        console.error("Erro ao salvar as respostas:", error);
    }
    finally {
        mongoose.connection.close(); // Feche a conexão após a inserção
    }
}
// Chame a função de seed
seedDatabase();
