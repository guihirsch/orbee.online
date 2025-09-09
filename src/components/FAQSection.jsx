import React, { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "O que é NDVI e por que é importante?",
      answer: "NDVI (Normalized Difference Vegetation Index) é um índice que mede a saúde da vegetação usando dados satelitais. Valores mais altos indicam vegetação mais saudável e densa. É crucial para monitorar desmatamento, crescimento de culturas e mudanças ambientais."
    },
    {
      question: "Com que frequência os dados são atualizados?",
      answer: "Os dados NDVI são atualizados semanalmente através dos satélites Sentinel-2 da ESA. Em algumas regiões, conseguimos atualizações a cada 3-5 dias, dependendo da cobertura de nuvens e disponibilidade dos satélites."
    },
    {
      question: "Como posso contribuir com validações comunitárias?",
      answer: "Você pode validar dados enviando fotos, observações e relatos sobre a vegetação da sua região. Basta acessar o mapa, clicar na área de interesse e adicionar suas observações. Cada contribuição ajuda a melhorar a precisão dos dados."
    },
    {
      question: "A plataforma é gratuita?",
      answer: "Sim! A OrBee é uma plataforma gratuita e aberta para comunidades, pesquisadores e organizações ambientais. Nosso objetivo é democratizar o acesso a dados ambientais de qualidade."
    },
    {
      question: "Quais regiões são cobertas pela plataforma?",
      answer: "Atualmente cobrimos todo o território brasileiro, com foco especial em áreas de mata ciliar e regiões agrícolas. Estamos expandindo para outros países da América Latina gradualmente."
    },
    {
      question: "Como recebo alertas sobre mudanças na vegetação?",
      answer: "Você pode configurar alertas por email ou WhatsApp para áreas específicas de seu interesse. Os alertas são enviados quando detectamos mudanças significativas no NDVI da região monitorada."
    },
    {
      question: "Os dados são confiáveis para pesquisa científica?",
      answer: "Sim! Utilizamos dados oficiais dos satélites Sentinel-2 da Agência Espacial Europeia, processados com algoritmos validados cientificamente. Muitos pesquisadores já utilizam nossa plataforma para estudos ambientais."
    },
    {
      question: "Como posso usar os dados para ações de conservação?",
      answer: "A plataforma fornece recomendações específicas baseadas nos dados NDVI e características locais. Você pode identificar áreas que precisam de atenção, monitorar o sucesso de ações de reflorestamento e planejar intervenções ambientais."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-gray-600">
            Tire suas dúvidas sobre a plataforma OrBee e o monitoramento NDVI.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-4">
              Nossa equipe está pronta para ajudar você a aproveitar ao máximo a plataforma OrBee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contato@orbee.online"
                className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                Enviar Email
              </a>
              <a
                href="https://wa.me/5551999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-full font-medium hover:bg-green-600 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;