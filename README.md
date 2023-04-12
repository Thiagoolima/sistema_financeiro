# API - Sistema financeiro (NODE)
> <p>Esta é uma API, que permite a gestão das finanças pessoais de forma simples e segura e para isso ela conta com hash na senha e autenticação do usuário logado via token. Com ela, é possível cadastrar usuários, fazer login, detalhar e editar o perfil do usuário logado, listar categorias, transações e filtrar as transações por categoria. Além disso, é possível cadastrar, editar e remover transações, bem como obter um extrato de transações.</p><p>A API utiliza um banco de dados PostgreSQL chamado `sistema_financeiro`, que contém as tabelas de usuários, categorias e transações. Todas as informações são mantidas com segurança e privacidade, garantindo que cada usuário possa visualizar e manipular seus próprios dados e transações.</p><p>Para utilizar essa API, é necessário seguir as orientações de criação do banco de dados e das categorias.</p><p>Com a API do sistema financeiro, você pode ter um controle maior sobre suas finanças, permitindo que você organize suas receitas e despesas de forma mais eficiente. Experimente já e veja como é fácil gerenciar suas finanças pessoais!</p>

## Criando um banco de dados para a aplicação:

Para a criação do banco de dados siga os passos:

1. Crie seu banco de dados com o nome: sistema_financeiro. Nesse momento é interessante anotar seus parâmetros de conexão como: host, port, username, password.
</br>
- Código para criação do banco de dados:

```postgresql
create database sistema_financeiro;
```
2. Na raiz do projeto existe um arquivo com o nome: `dump.sql`, nele se encontra o código para criação das tabelas. Para executar o código pode usar um programa de gerenciamento de banco de dados de sua preferência como beekeeper ou dbeaver.

## Como executar:

1. Clone este repositório: `git clone https://github.com/Thiagoolima/sistema_financeiro`
2. Entre no diretório do projeto: `cd sistema_financeiro`
3. Instale as dependências do projeto: `npm install`
4. Crie um arquivo `.env` no diretório raiz do projeto, existe um arquivo de modelo com o nome `.env.exemplo`. (é importante que respeite os mesmos nomes de variáveis exatamente como no modelo!)
5. Execute o projeto: `npm run start`

## Como Usar

Para usar a API, basta enviar solicitações HTTP para os endpoints disponíveis.

## Não sabe ou não deseja criar as requisições HTTP no insomnia?
Deixei a coleção de requisições HTTP pronta para você usar com o insomnia logo abaixo tem um botão, é só clicar e importar.
<br>
<a href="https://insomnia.rest/run/?label=sistema_financeiro&uri=https%3A%2F%2Fgithub.com%2FThiagoolima%2Fsistema_financeiro%2Fblob%2Fmain%2Fcolecao_http%2Fcolecao_requisicoes_insomnia.json" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
<br>
Também é possível encontrar o arquivo na pasta: "colecao_http" do projeto.
## Endpoints

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email
    -   senha

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "Thiago Oliveira de Lima",
    "email": "thiago@email.com",
    "senha": "123456"
}
```
-   **Resposta**  
    Retorna um objeto json com as informações cadastradas no banco de dados, incluindo seu respectivo `id` e ocultando a senha criptografada com hash.


#### **Exemplos de resposta**

```javascript
{
    "id": 1,
    "nome": "Thiago Oliveira de Lima",
    "email": "thiago@email.com"
}
```
-   **Erro**  
    Se não for informado todos os campos necessários no body da requisição ou se for informado um e-mail já cadastrado no banco de dados ele retorna um objeto json com um mensagem específica para o erro apresentado.

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   email
    -   senha

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "thiago@email.com",
    "senha": "123456"
}
```

-   **Resposta**  
    Retorna um objeto json com a propriedade **usuario** com as informações do usuário autenticado, exceto a senha do usuário, e uma propriedade **token** que tem como valor o token de autenticação gerado para o usuário. 

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "usuario": {
        "id": 1,
        "nome": "Thiago Oliveira de Lima",
        "email": "thiago@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```
-   **Erro**  
    Esta requisição retorna um erro se não for informados todos os campos da requisição: email e senha, ou então se os campos informados forem diferentes dos já armazenados no banco de dados.

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigem usuário logado. Portanto é fundamental para o sucesso das próximas requisições que envie no header da requisição com o formato Bearer Token o token de validação gerado na rota de login do usuário. Por motivos de segurança todas as próximas funciionalidades a seguir irão obter os dados do usuário armazendados dentro do token, não sendo possível informar um usuário diferente do logado para uma transação nem sendo possivel consultar ou alterar transações que não pertençam ao usuário logado!

### **Validações do token**

-   Verifica se o token foi enviado no header da requisição (Bearer Token)
-   Verifica se o token é válido
-   Efetua as consultas no banco de dados apenas pelo id contido no token informado
---

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo da requisição.
    Deverá possuir o token de autenticação no header da requisição como (Bearer Token)

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

-   **Resposta**  
    Retorna um objeto json que representa o usuário encontrado, com todas as suas propriedades (exceto a senha).  
    
#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "Thiago Oliveira de Lima",
    "email": "thiago@email.com"
}
```
**Erro**  
    Esta requisição retorna um erro se não for informado um token no header da requisição, se for informado um token que o tempo de uso expirou ou se for informado um token inválido.

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Token inválido ou expirado!."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   email
    -   senha
    
    O header da requisição deverá possuir um token de autenticação (Bearer token)

-   **Resposta**  
    - Não retorna objeto no body da resposta, retorna apenas o status de sucesso (204 - no content), informando que a requisição foi concluída com sucesso
    - Se efetuar novamente a rota `GET` `/usuario` será possível verificar os dados atualizados

#### **Exemplos de resposta**

```javascript
// HTTP Status 204

{

}
```

-   **Erro**
Retorna erro se:
    - não for informado os campos obritórios no body da requisição:
        -   nome
        -   email
        -   senha
    - Caso o novo e-mail fornecido para esse usuário já exista no banco de dados pertencendo a outro usuário.
    

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "Vanessa Natália",
    "email": "ana@email.com",
    "senha": "j4321"
}
```
#### **Exemplos de resposta**

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar categorias**

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    Não deverá possuir conteúdo no corpo (body) da requisição.
    O header da requisição deverá possuir um token de autenticação (Bearer token)

#### **Exemplo de requisição**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

-   **Resposta**  
    Retorna um array de objetos (categorias) encontrados.  
    
#### **Exemplos de resposta**

```javascript
// HTTP Status 200
[
    {
        id: 1,
        descricao: "Roupas",
    },
    {
        id: 2,
        descricao: "Mercado",
    },
]
```

### **Listar transações do usuário logado**

Esta rota permite duas opções de requisição sendo os parâmetros do tipor query opcionais.


#### `GET` `/transacao`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.  

-   **Requisição**  
    Sem parâmetros de rota.
    Coma parâmetros do tipo query (opcional)
    Não deverá possuir conteúdo no corpo (body) da requisição.
    O header da requisição deverá possuir um token de autenticação (Bearer token)

#### **Exemplo de requisição (sem query params)**

```javascript
// GET /transacao
// Sem conteúdo no corpo (body) da requisição
```
#### **Exemplo de requisição (com query params)**

```javascript
// GET /transacao?filtro[]=roupas&filtro[]=salários
// Sem conteúdo no corpo (body) da requisição
```

-   **Resposta**  
    Retorna um array de objetos (transações) encontrados.  

#### **Exemplo de resposta (sem query params)**

```javascript
// HTTP Status 200
[
    {
        id: 1,
        tipo: "saida",
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T15:35:00.000Z",
        usuario_id: 5,
        categoria_id: 4,
        categoria_nome: "Roupas",
    },
    {
        id: 3,
        tipo: "entrada",
        descricao: "Salário",
        valor: 300000,
        data: "2022-03-24T15:30:00.000Z",
        usuario_id: 5,
        categoria_id: 6,
        categoria_nome: "Salários",
    },
]
```   
#### **Exemplo de resposta (com query params)**

```javascript
// HTTP Status 200 / 201 / 204
[
    {
        id: 1,
        tipo: "saida",
        descricao: "Sapato amarelo",
        valor: 15800,
        data: "2022-03-23T15:35:00.000Z",
        usuario_id: 5,
        categoria_id: 4,
        categoria_nome: "Roupas",
    },
    {
        id: 3,
        tipo: "entrada",
        descricao: "Salário",
        valor: 300000,
        data: "2022-03-24T15:30:00.000Z",
        usuario_id: 5,
        categoria_id: 6,
        categoria_nome: "Salários",
    },
]
``` 

-   **Observação**
    -   Se a rota responder com um array vazio não se trata de um erro, isto pode acontecer por que não foi encontrada nenhuma transação para o usuário.

```javascript
// HTTP Status 200
[]
```


### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.
    O header da requisição deverá possuir um token de autenticação (Bearer token)

#### **Exemplo de requisição**

```javascript
// GET /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

-   **Resposta**  
    Retorna um objeto json que representa a transação encontrada, com todas as suas propriedades.

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```    

-   **Erro**
    -   Se o id informado no parâmetro da rota não pertencer a nenhuma transação do usuário logado, a rota retorna uma mensagem de erro específica conforme exemplo abaixo.

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.  

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   descricao
    -   valor
    -   data
    -   categoria_id
    -   tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)
    O header da requisição deverá possuir um token de autenticação (Bearer token)
#### **Exemplo de requisição**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```

-   **Resposta**
    Retorna um objeto json com as informações da transação cadastrada, incluindo seu respectivo `id`.  
    
#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

-   **Erro**
Retorna erro se:
    -   Não forem informados todos os campos obrigatórios:
        -   descricao
        -   valor
        -   data
        -   categoria_id
        -   tipo
    -   Não existir categoria para o id enviado no corpo (body) da requisição.
    -   O tipo enviado no corpo (body) da requisição não corresponder a palavra `entrada` ou `saida`, exatamente como descrito.

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   descricao
    -   valor
    -   data
    -   categoria_id
    -   tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)
    O header da requisição deverá possuir um token de autenticação (Bearer token)
#### **Exemplo de requisição**

```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```

**Resposta**  
    - Não retorna objeto no body da resposta, retorna apenas o status de sucesso (204 - no content), informando que a requisição foi concluída com sucesso
    
#### **Exemplos de resposta**

```javascript
// HTTP Status 204

{

}
```
-   **Erro**
Retorna erro se: 
    -   Não existe transação para o id enviado como parâmetro na rota ou se esta transação pertence ao usuário logado.
    -   Não foram informados todos os campos obrigatórios:
        -   descricao
        -   valor
        -   data
        -   categoria_id
        -   tipo
    -   Não existe categoria para o id enviado no corpo (body) da requisição.
    -   O tipo enviado no corpo (body) da requisição não corresponde a palavra `entrada` ou `saida`, exatamente como descrito.
   
#### **Exemplo de erro**

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  

-   **Requisição**  
    Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.
    O header da requisição deverá possuir um token de autenticação (Bearer token)
#### **Exemplo de requisição**

```javascript
// DELETE /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

-   **Resposta**  
    - Não retorna objeto no body da resposta, retorna apenas o status de sucesso (204 - no content), informando que a requisição foi concluída com sucesso
   
#### **Exemplo de resposta**

```javascript
// HTTP Status 204

{
```



-   **Erro**:
    -   Se não existe transação para o id enviado como parâmetro na rota ou se esta transação não pertence ao usuário logado.

### **Exemplo de erro**
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.

-   **Requisição**  
    Sem parâmetros de rota ou de query.  
    O corpo (body) da requisição não deverá possuir nenhum conteúdo.
    O header da requisição deverá possuir um token de autenticação (Bearer token)

#### **Exemplo de requisição**

```javascript
// DELETE /transacao/extrato
// Sem conteúdo no corpo (body) da requisição
```

-   **Resposta**  
    Retorna um objeto contendo a soma de todas as transações do tipo `entrada` e a soma de todas as transações do tipo `saida`.  
    
#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"entrada": 300000,
	"saida": 15800
}
```
---

## Contribuindo

Aceito contribuições para este projeto! Para contribuir, siga estas etapas:

1. Fork este repositório
2. Crie uma branch com a sua feature: `git checkout -b minha-feature`
3. Faça commit das suas alterações: `git commit -m 'Minha nova feature'`
4. Faça push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

## Contato

Se você tiver alguma dúvida ou sugestão sobre este projeto, sinta-se à vontade para entrar em contato comigo através do meu perfil no GitHub: [@Thiagoolima](https://github.com/Thiagoolima) ou no linkedin [@thiagooliveiradelima](https://www.linkedin.com/in/thiagooliveiradelima/).
