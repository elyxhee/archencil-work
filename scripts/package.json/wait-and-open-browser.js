const http = require('http');
const { exec } = require('child_process');

const host = 'localhost';
const port = 4200;

function checkServerStatus() {
  http.get(`http://${host}:${port}`, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        exec('cmd.exe /C start "" "C:\\Program Files\\Firefox Developer Edition\\firefox.exe" http://' + host + ':' + port);
      } else {
        checkServerStatus();
      }
    });
  }).on('error', () => {
    checkServerStatus();
  });
}

checkServerStatus();