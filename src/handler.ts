import { sendEmail } from "./email";

type EmailRequest = {
  address: string;
  name: string;
  body: string;
  subject: string;
};

async function compareSafe(a: string, b: string): Promise<boolean> {
  const digestA = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(a));
  const digestB = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(b));

  return digestA === digestB;
}

function JSONResponse(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  const auth = request.headers.get("Authorization");
  if (!auth) {
    return JSONResponse(
      {
        success: false,
        error: "Missing Authorization header",
      },
      401,
    );
  }

  if (!compareSafe(auth, TOKEN)) {
    return JSONResponse(
      {
        success: false,
        error: "Invalid Authorization header",
      },
      401,
    );
  }

  if (pathname === "/send") {
    const json = (await request.json()) as EmailRequest;
    await sendEmail(json.address, json.name, json.body, json.subject);

    return JSONResponse(
      {
        success: true,
      },
      200,
    );
  }

  return JSONResponse(
    {
      success: false,
      error: "Unknown path",
    },
    404,
  );
}
