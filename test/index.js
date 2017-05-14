import test from 'ava'
import http from 'http'
import server from '../httpd'
import { join } from 'path'

test('should forbidden', async t => {
  const code = await new Promise(resolve => {
    http.get('http://127.0.0.1:7788/httpd.js', (res) => {
        resolve(res.statusCode)
    })
  })
  t.is(code, 403)
})

test('should response 200', async t => {
  const code = await new Promise(resolve => {
    http.get('http://127.0.0.1:7788/index.js', (res) => {
        resolve(res.statusCode)
    })
  })
  t.is(code, 200)
})

test.before('test', t => {
  server.run(7788)
})

