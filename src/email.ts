export async function sendEmail(address: string, name: string, body: string, subject: string): Promise<void> {
  const request = new Request("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: address,
              name: name,
            },
          ],
        },
      ],
      from: {
        email: "noreply@hyperfox.uk",
        name: "Hyperfox",
      },
      subject: subject,
      content: [
        {
          type: "text/html",
          value: body,
        },
      ],
    }),
  });

  await fetch(request);

  return;
}
