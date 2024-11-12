// models/Response.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IntentModel } from './Intent';
// Definindo a interface para o documento Response
export interface IResponse extends Document {
    intent: string;
    keywords: string[];
    text: string;
}

// Definindo o esquema de mongoose com base na interface
const ResponseSchema: Schema = new Schema({
    intent: { type: String, required: true },
    keywords: { type: [String], required: true },
    text: { type: String, required: true }
});

export interface ResponsesModel extends IntentModel {
    // Adicione qualquer outra propriedade específica de ResponsesModel aqui, se necessário
    additionalInfo?: string; // Exemplo de uma propriedade adicional
}


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
  };

  export const faqQuestions = [
    {
      question: "Quais são os pacotes turísticos disponíveis?",
      category: "tourism"
    },
    {
      question: "Como faço para fazer uma reserva?",
      category: "reservations"
    },
    {
      question: "Quais são os melhores hotéis em Lubango?",
      category: "hotels"
    },
    {
      question: "Quais são os melhores locais para visitar em Angola?",
      category: "location"
    },
    {
      question: "Como faço para entrar em contato com vocês?",
      category: "contact"
    },
    {
      question: "O que inclui o pacote turístico para a Humpata?",
      category: "tourism"
    },
    {
      question: "Como funciona o pagamento da reserva?",
      category: "reservations"
    },
    {
      question: "Quais são as opções de transporte disponíveis?",
      category: "services"
    }
  ];


const Response = mongoose.model<IResponse>('Response', ResponseSchema);

export default Response;
