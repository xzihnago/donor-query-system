const www: MiddlewareError<[redirect?: string | Record<number, string>]> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (redirect) => (error, _req, res, _next) => {
    let url: string | undefined;
    if (redirect && typeof redirect === "object") {
      url = redirect[res.statusCode];
    }
    url ??= "back";

    const message = error instanceof Error ? error.message : "Unknown error";

    res.send(`
      <script>
        alert("${message}");

        if ("${url}" === "back") {
          history.back();
        } else {
          window.location.replace("${url}");
        }
      </script>
    `);
  };

export default www;
