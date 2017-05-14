
export default function (list) {
  return `
<!doctype html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"></meta>
    <title>NodeJS Server</title>
</head>

<body>
    <ul>
        ${list}
    </ul>
</body>
    `
}
