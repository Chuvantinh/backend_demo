import { GlobalSettingsCreateInput, Prisma, BotSettingsCreateInput, WebPushSettingsCreateInput } from '../generated/prisma-client';
import { ValidationError } from 'apollo-server';
import { log } from '../logger';


export const getGlobalSettings = async (prisma: Prisma) => {
  const s = prisma.globalSettingses();
  if ((await s).length !== 1) {
    log.fatal('Global Config invalid or not exiting', Error);
    throw new ValidationError('Global Config invalid or not found -> exiting');
  }
  return (await s).pop();
}

export const getGlobalSettingsId = async (prisma: Prisma) => {
  const s = (await prisma.globalSettingses());
  if (s.length !== 1) {
    log.fatal('Global Config invalid or not exiting', Error);
    throw new ValidationError('Global Config invalid or not found -> Exiting');
  }

  // check sub settings
  const webPushSettings = (await prisma.webPushSettingses());
  if(webPushSettings.length !== 1) {
    log.fatal('Web Push Settings invalid or not exiting', Error);
  }

  const botSettings = (await prisma.botSettingses());
  if(botSettings.length !== 1) {
    log.fatal('Bot Settings invalid or not exiting', Error);
  }

  return s.pop().id;
}


// TODO init config on First Start
// needs to be set after first initialization of server
export const GlobalConfigDev: GlobalSettingsCreateInput = {
  matchingPercentageCap: 70,
  matchingTimeout: {
    create: {
      hours: 0,
      days: 0,
      minutes: 2,
      seconds: 0,
    }
  },
  defaultActivityTimeMinutesPerWeek: 150,
  minimumActivityTimeMinutes: 10,
  maximumActivityTimeMinutes: 240,
  ipaqGroupLowMax: 360,
  ipaqGroupModerateMax: 3600,
  ipaqGroupHighMax: 3600,
  phqGroupLowMin: 10,
  phqGroupLowMax: 18,

}

export const BotSettingsConfigDev: BotSettingsCreateInput = {
  botFirstGreetingText: "Hey, ich bin euer RobBot und versuche euch am Anfang ein wenig zu Unterstützern. Schön das ihr euch hier gefunden habt. Stellt euch kurz vor wer ihr seid und was eure Ziele sind. Ob ihr gerade Lust auf viele Aktivitäten habt und vielleicht auf welche.",

  botActivityLessThanPlannedWeekday: 4,


  botAskCreateActivitiesTime: {
    create: {
      hours: 0,
      days: 0,
      minutes: 2,
      seconds: 0,
    }
  },
  botAskCreateActivitiesMessage: "Tragt doch bitte Aktivitäten in euren Kalender in",

  botAskStartChatIntervall: {
    create: {
      hours: 0,
      days: 0,
      minutes: 5,
      seconds: 0,
    }
  },
  botAskStartChatMessage: "Hey ihr hab euch seit mehr als einer Woche nicht mehr geschrieben. Wie geht’s euch und euren Plänen?",

  botActivityLessThanPlannedMessage: "Falls ihr eure Aktiven Minuten noch nicht erreicht habt sprecht doch darüber was ihr noch im Kalender hinzufügen könnt",
}

export const WebPushSettingsConfigDev: WebPushSettingsCreateInput = {

  webPushIpaqReminderIntervall: {
    create: {
      days: 14,
      hours: 0,
      minutes: 5,
      seconds: 0,
    }
  },
  webPushIpaqReminderIntervallFollowUp: {
    create: {
      days: 0,
      hours: 23,
      minutes: 5,
      seconds: 0,
    }
  },
  webPushIpaqReminderMessage: "Bitte IPAQ Fragebogen ausfüllen",

  webPushPhqReminderIntervall: {
    create: {
      days: 14,
      hours: 0,
      minutes: 5,
      seconds: 0,
    }
  },
  webPushPhqReminderIntervallFollowUp: {
    create: {
      days: 0,
      hours: 23,
      minutes: 5,
      seconds: 0,
    }
  },
  webPushPhqReminderMessage: "Bitte PHQ-9 Fragebogen ausfüllen",
}