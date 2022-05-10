import jwt from "jsonwebtoken"

const JWT_SECRET_KEY = "somerandomstring"
const JWT_LIFE = "14d"

const users = [
  { email: 'jack.nguyen@weareday.one', password: '123123' },
  { email: 'ally@weareday.one', password: '123123' },
];

export async function api(request) {
  switch (request.method) {
    case 'POST':
      try {
        // example login using email and password
        // will use Moralis in reality
        const data = await request.json();
        const {email, password} = data;

        const user = users.find(
          (item) => item.email === email && item.password === password,
        );
        if (!user) throw new Error('Bad credential');

        const accessToken = jwt.sign({ email }, JWT_SECRET_KEY, {
          expiresIn: JWT_LIFE,
        });

        return new Response(null, { status: 200, headers: { 'Set-Cookie': `accessToken=${accessToken}` } })
      } catch (err) {
        console.error(err.message);
        return new Response(null, {
          status: 401
        });
      }
  }

  return new Response(null, {status: 400});
}
