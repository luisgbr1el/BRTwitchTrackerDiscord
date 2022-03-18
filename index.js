const express = require("express");
const app = express();
const port = 3000;

const DiscordJS = require("discord.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const token = process.env["token"];
const authorization = process.env["AuthorizationHeader"];
const clientId = process.env["ClientIdHeader"];
const request = require("request");

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.Intents.FLAGS.GUILDS,
    DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on("ready", () => {
  const guilds = client.guilds.cache.map((guild) => guild.id);
  console.log("O bot está online!");

  const activity = client.user.setActivity("lives BR/PT", {
    type: "WATCHING",
  });

  app.get("/", (req, res) =>
    res.send(`
<body style='font-family: Arial, sans-serif;'>
<h1>Painel</h1>
<p>Em <b>${guilds.length}</b> servidores e <b>${
      client.channels.cache.size
    }</b> canais.</p>
<b>.setActivity()</b><br>
<code>${JSON.stringify(activity)}</code><br><br>
Resultado: <code>${activity.activities[0].type} ${
      activity.activities[0].name
    }</code><br><br>
<b>.avatarURL()</b><br>
<img width="100px" src="${client.user.avatarURL()}">
</body>
`)
  );

  app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
  );

  // guild
  //const guildId = "777005017474793472";
  //const guild = client.guilds.cache.get(guildId);
  let commands;

  //if (guild) {
  //  commands = guild.commands;
  //} else {
  commands = client.application?.commands;
  //}

  commands?.create({
    name: "help",
    description:
      "「Utilitários」Ver o guia de ajuda e de informações sobre o bot.",
  });

  commands?.create({
    name: "ranking",
    description:
      "「API」Ver o top 10 canais PT/BR com mais espectadores da Twitch neste momento.",
  });

  commands?.create({
    name: "games",
    description:
      "「API」Ver os jogos com mais espectadores da Twitch neste momento.",
  });

  commands?.create({
    name: "canal",
    description: "「API」Ver informações sobre um canal da Twitch.",
    options: [
      {
        name: "name",
        description: "O nome do usuário/canal.",
        required: true,
        type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
      },
    ],
  });

  //global
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName, options } = interaction;

  if (commandName === "games") {
    const optionsTopGames = {
      method: "GET",
      url: "https://api.twitch.tv/helix/games/top",
      headers: {
        Authorization: authorization,
        "Client-Id": clientId,
      },
    };

    request(optionsTopGames, function (error, response) {
      if (error) throw new Error(error);
      const res = JSON.parse(response.body);
      const resTxt = JSON.stringify(res);

      const arr = [];
      for (i = 0; i < 20; i++) {
        arr.push(`**${i + 1}.** ${res.data[i].name}`);
      }

      const embed = new MessageEmbed()
        .setTitle("Jogos com mais espectadores neste momento")
        .setColor("#9146ff")
        .setDescription(
          `${arr[0]}
${arr[1]}
${arr[2]}
${arr[3]}
${arr[4]}
${arr[5]}
${arr[6]}
${arr[7]}
${arr[8]}
${arr[9]}
${arr[10]}
${arr[11]}
${arr[12]}
${arr[13]}
${arr[14]}
${arr[15]}
${arr[16]}
${arr[17]}
${arr[18]}
${arr[19]}`
        )
        .setFooter({ text: "BRTwitchTracker" })
        .setTimestamp();

      interaction.reply({ embeds: [embed], ephemeral: false });
    });
  }

  else if (commandName === "ranking") {
    const optionsToRanking = {
      method: "GET",
      url: "https://api.twitch.tv/helix/streams?first=10&language=pt",
      headers: {
        Authorization: authorization,
        "Client-Id": clientId,
      },
    };

    request(optionsToRanking, function (error, response) {
      if (error) throw new Error(error);

      const arr = [];
      for (i = 0; i < 10; i++) {
        arr.push(
          `**${i + 1}.** [${
            JSON.parse(response.body).data[i].user_name
          }](https://twitch.tv/${
            JSON.parse(response.body).data[i].user_login
          }/) (${new Intl.NumberFormat("pt-BR").format(
            JSON.parse(response.body).data[i].viewer_count
          )})`
        );
      }

      const embed = new MessageEmbed()
        .setTitle("Top 10 canais PT/BR com mais viewers neste momento")
        .setColor("#9146ff")
        .setDescription(
          `${arr[0]}
${arr[1]}
${arr[2]}
${arr[3]}
${arr[4]}
${arr[5]}
${arr[6]}
${arr[7]}
${arr[8]}
${arr[9]}`
        )
        .setFooter({ text: "BRTwitchTracker" })
        .setTimestamp();

      const row = new MessageActionRow()
        //      .addComponents(
        //        new MessageButton()
        //        .setCustomId('details')
        //        .setLabel('Detalhes')
        //        .setStyle('PRIMARY')
        //      )
        .addComponents(
          new MessageButton()
            .setURL("https://brtwitchtracker.vercel.app")
            .setLabel("Visitar site")
            .setStyle("LINK")
        );

      interaction.reply({
        embeds: [embed],
        ephemeral: false,
        components: [row],
      });
    });
  } else if (commandName === "canal") {
    const username = options.getString("name");
    const optionsToUser = {
      method: "GET",
      url: "https://api.twitch.tv/helix/users?login=" + username.toLowerCase(),
      headers: {
        Authorization: authorization,
        "Client-Id": clientId,
      },
    };

    request(optionsToUser, function (error, response) {
      if (error) throw new Error(error);
      const res = JSON.parse(response.body);
      const resTxt = JSON.stringify(res);

      //console.log(res.data[0]);
      if (resTxt.length < 13) {
        const embed = new MessageEmbed()
          .setTitle("❌ Usuário não encontrado!")
          .setColor("#ff6961")
          .setFooter({ text: "BRTwitchTracker" })
          .setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: false });
      } else {
        let tipo = null;
        if (res.data[0].broadcaster_type == "partner") {
          tipo = "Parceiro ✅";
        } else if (res.data[0].broadcaster_type == "affiliate") {
          tipo = "Afiliado 🤝";
        } else {
          tipo = "Usuário comum 👤";
        }
        data = new Date(res.data[0].created_at);

        const optionsToGetFollowers = {
          method: "GET",
          url:
            "https://api.twitch.tv/helix/users/follows?to_id=" + res.data[0].id,
          headers: {
            Authorization: authorization,
            "Client-Id": clientId,
          },
        };

        request(optionsToGetFollowers, function (error, response) {
          if (error) throw new Error(error);
          const resFollow = JSON.parse(response.body);
          const followers = resFollow.total;

          const embed = new MessageEmbed()
            .setTitle(res.data[0].display_name)
            //        .setDescription()
            .setColor("#9146ff")
            .addField("ID", res.data[0].id, true)
            .addField("Tipo", tipo, true)
            .addField(
              "Seguidores",
              Intl.NumberFormat("pt-BR").format(followers),
              true
            )
            .addField("Descrição", res.data[0].description, false)
            .addField(
              "Visualizações",
              Intl.NumberFormat("pt-BR").format(res.data[0].view_count),
              true
            )
            .addField(
              "Criado em",
              data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
              true
            )
            //    .addField("Foto de live offline", "📥")
            .setThumbnail(res.data[0].profile_image_url)
            .setImage(res.data[0].offline_image_url)
            .setFooter({ text: "BRTwitchTracker" })
            .setTimestamp();

          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setURL("https://twitch.tv/" + res.data[0].login + "/")
              .setLabel("Ver na Twitch")
              .setStyle("LINK")
          );

          interaction.reply({
            embeds: [embed],
            ephemeral: false,
            components: [row],
          });
        });
      }
    });
  } else if (commandName === "help") {
    const embed = new MessageEmbed()
      .setTitle("Guia de ajuda")
      .setDescription(
        "O **BRTwitchTracker** é um bot que tem como objetivo listar informações e *charts* sobre a Twitch BR/PT. <:casimiro:952603592601247834>\n\nAbaixo estão listados todos os comandos disponíveis e como utilizá-los."
      )
      .addField(
        "`/ranking`",
        "Ver os 10 streamers BR/PT com mais espectadores no momento.\n**Obs:** A lista é baseada nos streamers/canais que utilizam a tag `Portuguese` em suas livestreams."
      )
      .addField(
        "`/canal <nome>`",
        "Ver informações sobre algum canal da **Twitch**. As informações contém ID, número de seguidores, visualizações, etc.\nEx: `/canal alanzoka`"
      )
      .addField(
        "`/games`",
        "Ver os jogos com mais espectadores no momento.\n**Obs:** A lista é baseada em todos os canais da **Twitch**, sem exceções."
      )
      .setColor("#9146ff")
      .setThumbnail(client.user.avatarURL())
      .setFooter({ text: "BRTwitchTracker" })
      .setTimestamp();

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setURL("https://brtwitchtracker.vercel.app")
          .setLabel("Site")
          .setStyle("LINK")
      )
      .addComponents(
        new MessageButton()
          .setURL("https://luisgbr1el.gitbook.io/brtwitchtracker/")
          .setLabel("Guia")
          .setStyle("LINK")
      )
      .addComponents(
        new MessageButton()
          .setURL("https://discord.gg/2jxphJRtAC")
          .setLabel("Suporte")
          .setStyle("LINK")
      );

    interaction.reply({ embeds: [embed], ephemeral: false, components: [row] });
  }
});

client.on("messageCreate", (message) => {
  //  if (message.content == 'ping') {
  //    message.reply({
  //      content: 'pong',
  //    })
  //  }
});

client.login(token);