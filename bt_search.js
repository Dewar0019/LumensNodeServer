const { spawn } = require('child_process')
var output;

const deploySh = spawn('sh', [ 'test.sh' ], {
  cwd: '/home/csfp/Desktop',
  env: Object.assign({}, process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
})

deploySh.stdout.on('data', (data) => {
  console.log(`${data}`);
});

