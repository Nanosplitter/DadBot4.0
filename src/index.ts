import { CommandInteraction, Message } from "discord.js";
import { ShewenyClient } from "sheweny";
import config from "./config.json";
// import { reminderEmitter } from "./emitters/reminder-emitter";
import runSchedulers from "./schedulers";

const client = new ShewenyClient({
  intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent", "GuildMessageReactions", "DirectMessages"],
  presence: {
    status: "online",
    activities: [
      {
        name: `with your mom`,
      },
    ],
  },
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      applicationPermissions: true,
      default: {
        userPermissions: ["UseApplicationCommands"],
      },
      prefix: "!",
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
    modals: {
      directory: "./interactions/modals",
    },
    inhibitors: {
      directory: "./inhibitors",
    },
  },
  mode: "development", // Change to production for production bot
});

client.managers
  .commands!.on("cooldownLimit", (ctx: CommandInteraction | Message): any => {
    return ctx.reply({
      content: "Woah there kiddo, slow down a bit",
      ephemeral: true,
    });
  })
  .on("userMissingPermissions", (interaction: CommandInteraction, missing: string) => {
    return interaction.reply({
      content: `You don't have ${missing} permissions`,
      ephemeral: true,
    });
  });

client.login(config.DISCORD_TOKEN);

runSchedulers();
// sendReminderCheckEvent();
