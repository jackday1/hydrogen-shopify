import Moralis from 'moralis/node';

const appId = 'mKu4P0mSPKHy23MV7IzqCdRxZIMbEvcKlbQE56d7';
const serverUrl = 'https://6zitu24v62ou.usemoralis.com:2053/server';

Moralis.start({serverUrl, appId});
Moralis.User.enableUnsafeCurrentUser();

export async function api(request, {session}) {
  switch (request.method) {
    case 'POST':
      try {
        const data = await request.json();
        const {sessionToken, account, balance} = data;

        const user = await Moralis.User.become(sessionToken);
        if (!user) throw new Error('Bad credential');

        if (!user.attributes.solAccounts.includes(account))
          throw new Error('Bad credential account');

        const prevSession = await session.get();
        const {sessionToken: prevSessionToken, account: prevSessionAccount} =
          prevSession;

        const reload =
          sessionToken !== prevSessionToken || account !== prevSessionAccount;

        await Promise.all([
          session.set('sessionToken', sessionToken),
          session.set('account', account),
          session.set('balance', balance),
        ]);

        return new Response(JSON.stringify({reload}), {
          status: 200,
        });
      } catch (err) {
        console.error(err.message);
        return new Response(err.message, {
          status: 401,
        });
      }
    case 'DELETE':
      try {
        await session.destroy();
        return new Response(null, {status: 200});
      } catch (err) {
        console.error(err.message);
        return new Response(null, {
          status: 400,
        });
      }
  }

  return new Response(null, {status: 400});
}
