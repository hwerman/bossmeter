import { version } from '../../package.json'
import { toJSON } from '../lib/util'
import { Router } from 'express'
const crypto = require('crypto')
const secret = process.env.WEBHOOK_SECRET

export default ({ config, db }) => {
  let api = Router()
  const response = {
      "score": 0.50
  }

  api.get('/', (req, res) => {
    res.json({ version })
  })

  api.post('/message', (req, res) => {
    if (req.body.type && req.body.type == 'verification') {
      const body = {
        response: req.body.challenge
      }
      const hash = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex')
      res.set('X-OUTBOUND-TOKEN', hash)
      console.log(body)
      res.json(body)
    } else {
      res.send(500)
    }
  })

  api.get('/:space/:user', (req, res) => {
    if (req.params && req.params.space == 'usa') {
      // special case for Donald demo
    } else if (req.params && req.params.space && req.params.user) {
      res.json(Object.assign(response, {
        name: req.params.user,
        space: req.params.space
      }))
    } else {
      res.json(response)
    }
  })

  return api
}
