import {equal} from 'assert'
import DSpace from '../src'

describe('Basic tests', () => {
  it('Empty login failure', async () => {
    // Init and login
    DSpace.init('https://demo.dspace.org/server')
    const message = await DSpace.login('', '')
    const failedMessage: string = 'login failure'
    equal(message, failedMessage)
  })
})
