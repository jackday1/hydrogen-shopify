export async function api(request, {session}) {
  switch (request.method) {
    case 'POST':
      try {
        const data = await request.json();
        const {publicKey, balance} = data;

        const prevSession = await session.get();
        const {publicKey: prevPublicKey, balance: prevBalance} = prevSession;

        const reload = publicKey !== prevPublicKey || balance !== prevBalance;

        await Promise.all([
          session.set('publicKey', publicKey),
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
