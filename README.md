# BRTwitchTrackerDiscord
Bot do BRTwitchTracker para Discord. O bot utiliza a API oficial da Twitch.

## Recursos
- Node.js
- JavaScript
- Repl.it
- NPM (Discord.js v13)
- Twitch Official API 

## Comandos
  - /games

  Listar os jogos com mais espectadores na **Twitch** naquele momento (máximo: 20)
  - /canal <username>

Ver informações sobre um canal da **Twitch**. (Número de seguidores, visualizações, criação da conta, etc.)

**Ex:** `/canal alanzoka`
  - /ranking

Ver o top 10 canais PT/BR com mais espectadores no momento.

**Obs:** Essa lista é limitada apenas para canais que utilizam a tag `Portuguese` em suas livestreams.
  - /help

Ver o guia de ajuda com informações e de como utilizar os comandos.
  
 ## Compilar
 
Você pode compilar e runnar o bot no seu PC. Para isso, siga os passos:

### 1. Clonando repositório
Primeiramente, você precisa clonar este repositório. Se você estiver usando o **Git**, vá no seu terminal e digite:
```git
git clone https://github.com/luisgbr1el/BRTwitchTrackerDiscord.git
```

### 2. Instalando packages
Para que o bot seja executado, você precisa instalar os pacotes necessários.

Então assim que a clonagem do repositório finalizar, abra um terminal na pasta `/BRTwitchTrackerDiscord` e digite:
```node
npm install
```
### 3. Token
Para que o bot seja autenticado, você precisa solicitar um token para o seu bot no site do [Discord Developers](https://discord.com/developers/applications).
  
Crie um bot, copie o token e insira na última linha do arquivo [index.js](https://github.com/luisgbr1el/BRTwitchTrackerDiscord/blob/main/index.js), nessa parte do código:
```js
client.login(token);
```

### 4. Iniciando o bot
Para iniciar a execução do bot, você precisa abrir um terminal na pasta do projeto e então...

#### Com o Node.js
```node
node index.js
```

### 5. Pronto!
É isso! Agora o bot está online!

## Contribua
Você pode contribuir com o projeto solicitando um [Pull Request](https://github.com/luisgbr1el/BRTwitchTrackerDiscord/pulls). Caso não saiba como solicitar um, siga os passos abaixo:

### 1. Criando um fork
Um *fork* é basicamente a cópia de um repositório, só que sua.

Para criar um clique no botão **Fork**, na parte superior deste repositório:

![image](https://user-images.githubusercontent.com/62726888/155862651-8be8c9c2-437a-4551-a956-ee726c683272.png)

### 2. Clonando o seu fork
Agora, você pode clonar o seu fork para a sua máquina para fazer as mudanças.

Faça isso da forma que achar melhor.

### 3. Faça as suas mudanças
Modifique o código da forma que traga **melhorias** para o projeto. Qualquer *Pull Request* que de alguma forma "avacalhe" com o projeto, será recusado.

### 4. Crie um Pull Request
1. Para realizar um Pull Request, vá na aba de [pulls](https://github.com/luisgbr1el/BRTwitchTrackerDiscord/pulls) deste repositório e clique em *New Pull Request*.
2. Selecione **este** repositório como `base` e o seu fork como `compare`.
3. Faça um resumo do que você adicionou ou melhorou no código e clique em *Create Pull Request*.

Sua contribuição será verificada por mim e se estiver tudo certo, você fará parte desse projeto também!
  
 ## Autor
  - [luisgbr1el](https://github.com/luisgbr1el)
