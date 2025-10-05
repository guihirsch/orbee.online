// Utilitários para testar a integração frontend-backend

export const testAuthIntegration = async () => {
   const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

   console.log("🧪 Testando integração de autenticação...");

   try {
      // Teste 1: Verificar se a API está rodando
      console.log("1. Verificando se a API está rodando...");
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      if (healthResponse.ok) {
         console.log("✅ API está rodando");
      } else {
         console.log("❌ API não está respondendo");
         return;
      }
   } catch (error) {
      console.log("❌ Erro ao conectar com a API:", error.message);
      console.log(
         "💡 Certifique-se de que o backend está rodando em http://localhost:8000"
      );
      return;
   }

   try {
      // Teste 2: Testar registro de usuário
      console.log("2. Testando registro de usuário...");
      const testUser = {
         email: `teste_${Date.now()}@example.com`,
         password: "teste123",
         full_name: "Usuário Teste",
         username: `teste_${Date.now()}`,
         location: "São Paulo, SP",
         bio: "Usuário de teste",
      };

      const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(testUser),
      });

      if (registerResponse.ok) {
         const registerData = await registerResponse.json();
         console.log("✅ Registro bem-sucedido");
         console.log(
            "Token:",
            registerData.access_token?.substring(0, 20) + "..."
         );

         // Teste 3: Testar login
         console.log("3. Testando login...");
         const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email: testUser.email,
               password: testUser.password,
            }),
         });

         if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log("✅ Login bem-sucedido");

            // Teste 4: Testar endpoint protegido
            console.log("4. Testando endpoint protegido...");
            const meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
               headers: {
                  Authorization: `Bearer ${loginData.access_token}`,
               },
            });

            if (meResponse.ok) {
               const userData = await meResponse.json();
               console.log("✅ Endpoint protegido funcionando");
               console.log("Usuário:", userData.full_name);
            } else {
               console.log("❌ Erro no endpoint protegido");
            }
         } else {
            console.log("❌ Erro no login");
         }
      } else {
         const errorData = await registerResponse.json();
         console.log("❌ Erro no registro:", errorData.detail);
      }
   } catch (error) {
      console.log("❌ Erro durante os testes:", error.message);
   }
};

export const testObservationsAPI = async (token) => {
   const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

   console.log("🧪 Testando API de observações...");

   try {
      // Teste 1: Listar observações
      console.log("1. Listando observações...");
      const listResponse = await fetch(`${API_BASE_URL}/observations/`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      if (listResponse.ok) {
         const observations = await listResponse.json();
         console.log("✅ Lista de observações:", observations.length, "itens");
      } else {
         console.log("❌ Erro ao listar observações");
      }

      // Teste 2: Criar observação
      console.log("2. Criando observação...");
      const testObservation = {
         title: "Teste de Observação",
         description: "Observação criada pelo teste",
         latitude: -23.5505,
         longitude: -46.6333,
         observation_type: "photo",
         ndvi_value: 0.7,
         confidence_level: 0.8,
      };

      const createResponse = await fetch(`${API_BASE_URL}/observations/`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(testObservation),
      });

      if (createResponse.ok) {
         const newObservation = await createResponse.json();
         console.log("✅ Observação criada:", newObservation.id);

         // Teste 3: Atualizar observação
         console.log("3. Atualizando observação...");
         const updateResponse = await fetch(
            `${API_BASE_URL}/observations/${newObservation.id}`,
            {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  ...testObservation,
                  title: "Observação Atualizada",
               }),
            }
         );

         if (updateResponse.ok) {
            console.log("✅ Observação atualizada");
         } else {
            console.log("❌ Erro ao atualizar observação");
         }

         // Teste 4: Deletar observação
         console.log("4. Deletando observação...");
         const deleteResponse = await fetch(
            `${API_BASE_URL}/observations/${newObservation.id}`,
            {
               method: "DELETE",
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (deleteResponse.ok) {
            console.log("✅ Observação deletada");
         } else {
            console.log("❌ Erro ao deletar observação");
         }
      } else {
         console.log("❌ Erro ao criar observação");
      }
   } catch (error) {
      console.log("❌ Erro durante os testes de observações:", error.message);
   }
};

// Função para executar todos os testes
export const runAllTests = async () => {
   console.log("🚀 Iniciando testes de integração...");
   await testAuthIntegration();
   console.log("✅ Testes de autenticação concluídos");
   console.log("💡 Para testar observações, use testObservationsAPI(token)");
};
