import jwt from "jsonwebtoken"

const JWT_SECRET_KEY = "somerandomstring"

const users = [
  { email: 'jack.nguyen@weareday.one', password: '123123' },
  { email: 'ally@weareday.one', password: '123123' },
];

const getCookies = cookie => Object.fromEntries(new URLSearchParams(cookie.replace(/; /g, "&")))

export async function api(request) {
  switch (request.method) {
    case 'GET':
      try {
        const cookies = getCookies(request.headers.get("cookie"))
        const token = cookies["accessToken"]
        jwt.verify(token, JWT_SECRET_KEY);
        const userInfo = jwt.decode(token, JWT_SECRET_KEY);

        const user = users.find(item => item.email === userInfo.email)
        if (!user) throw new Error("Bad credential");

        return new Response(JSON.stringify({ email: userInfo.email }), { status: 200 });
      } catch (err) {
        console.error(err)
        return new Response(null, { status: 401 });
      }
  }
  
  return new Response(null, {status: 400});
}
