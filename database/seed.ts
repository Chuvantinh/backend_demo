import { Prisma } from '../src/generated/prisma-client'
import { GlobalConfigDev } from '../src/global.config';


// main seed helper function - run only after first deploy - not working because of Prisma error.
async function main() {

  const db: Prisma = new Prisma({
    secret: process.env.PRISMA_MANAGEMENT_API_SECRET,
    endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  });
  
  const alice = await db.user({ username: 'Alice' });
  if (!alice) {
    await db.createUser({
      username: 'Alice',
      verificationCode: 'BuddyUser',
      verified: true,
      password: '123456',
      profile: {
        create: {}
      },
      quests: {
        create: {}
      },
      activities: {
        create: {}
      },

    })
  }

  const bob = await db.user({ username: 'Bob' });
  if (!bob) {
    await db.createUser({
      username: 'Bob',
      verificationCode: 'BuddyUser',
      verified: true,
      password: '123456',
      profile: {
        create: {}
      },
      quests: {
        create: {}
      },
      activities: {
        create: {}
      },
      // calendarEntries: {
      //   create: {}
      // }
    })

    const settings = (await db.globalSettingses()).pop();
    if (!settings) {
      await db.createGlobalSettings(GlobalConfigDev)
    }
  }
}

main().catch(e => console.error(e))